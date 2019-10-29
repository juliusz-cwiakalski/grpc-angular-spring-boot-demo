package pl.jcw.demo.chat.backend.grpc;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.stream.Stream;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.protobuf.Empty;
import com.google.protobuf.util.Timestamps;

import io.grpc.stub.StreamObserver;
import pl.jcw.demo.chat.ChatMessage;
import pl.jcw.demo.chat.ChatServiceGrpc.ChatServiceImplBase;
import pl.jcw.demo.chat.ReceiveMessagesRequests;

public class ChatServiceImpl extends ChatServiceImplBase {

	Logger logger = LoggerFactory.getLogger(ChatServiceImpl.class);

	private List<ChatMessage> messages = new CopyOnWriteArrayList<>();
	private List<StreamObserver<ChatMessage>> listeners = new CopyOnWriteArrayList<>();

	private void dispatchMessageToListeners(ChatMessage message) {
		logger.info("{} listeners will receive message {}", this.listeners.size(), message);
		for (StreamObserver<ChatMessage> listener : listeners) {
			synchronized (listener) {
				try {
					listener.onNext(message);
				} catch (Exception e) {
					logger.error("Error occured while dispatching message {} to {}, removing listener", message,
							listener);
					listeners.remove(listener);
					listener.notifyAll();
				}
			}
		}
	}

	@Override
	public void receiveMessages(ReceiveMessagesRequests request, StreamObserver<ChatMessage> responseObserver) {
		try {
			this.listeners.add(responseObserver);
			Stream<ChatMessage> messagesStream = messages.stream();
			messagesStream.filter(m -> {
				if (request.hasAfterTimestamp()
						&& Timestamps.compare(request.getAfterTimestamp(), m.getTimestamp()) >= 0) {
					return false;
				}
				return true;
			}).forEach(message -> {
				logger.debug("listener {} will receive {}", responseObserver, message);
				responseObserver.onNext(message);
			});

			try {
				synchronized (responseObserver) {
					responseObserver.wait(10000);
				}
			} catch (InterruptedException e) {
				logger.error("Error occured while waiting for messages", e);
			}
		} finally {
			logger.debug("Listener {} closed connection, removing", responseObserver);
			this.listeners.remove(responseObserver);
			responseObserver.onCompleted();
		}
	}

	@Override
	public void sendMessage(ChatMessage request, StreamObserver<Empty> responseObserver) {
		request = ChatMessage.newBuilder(request).setTimestamp(Timestamps.fromMillis(System.currentTimeMillis()))
				.build();
		this.messages.add(request);
		dispatchMessageToListeners(request);
		responseObserver.onNext(Empty.getDefaultInstance());
		responseObserver.onCompleted();
	}

	@Override
	public void ping(ChatMessage request, StreamObserver<ChatMessage> responseObserver) {
		ChatMessage response = ChatMessage.newBuilder(request)
				.setMessage("Hello " + request.getUser() + ", your message was: " + request.getMessage())
				.setUser("gRPC server").build();
		logger.info("Got {} sending {}",request,response);
		responseObserver.onNext(response);
		responseObserver.onCompleted();
	}

}
