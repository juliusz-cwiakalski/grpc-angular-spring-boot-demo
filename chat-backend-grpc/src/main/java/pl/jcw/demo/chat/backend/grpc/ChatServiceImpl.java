package pl.jcw.demo.chat.backend.grpc;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.function.Predicate;

import org.lognet.springboot.grpc.GRpcService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.protobuf.Empty;
import com.google.protobuf.util.Timestamps;

import io.grpc.stub.StreamObserver;
import pl.jcw.demo.chat.ChatMessage;
import pl.jcw.demo.chat.ChatServiceGrpc.ChatServiceImplBase;
import pl.jcw.demo.chat.ReceiveMessagesRequests;

@GRpcService
public class ChatServiceImpl extends ChatServiceImplBase {

	private Logger logger = LoggerFactory.getLogger(ChatServiceImpl.class);

	private List<ChatMessage> messages = new CopyOnWriteArrayList<>();
	private List<StreamObserver<ChatMessage>> listeners = new CopyOnWriteArrayList<>();

	@Override
	public void sendMessage(ChatMessage message, StreamObserver<Empty> responseObserver) {
		message = ChatMessage.newBuilder(message) //
				.setTimestamp(Timestamps.fromMillis(System.currentTimeMillis()))//
				.build();
		this.messages.add(message);
		dispatchMessageToListeners(message);
		responseObserver.onNext(Empty.getDefaultInstance());
		responseObserver.onCompleted();
	}

	private void dispatchMessageToListeners(ChatMessage message) {
		logger.info("{} listeners will receive message {}", this.listeners.size(), message);
		listeners.stream().forEach(listener -> sendMessageToListener(message, listener));
	}

	@Override
	public void receiveMessages(ReceiveMessagesRequests request, StreamObserver<ChatMessage> responseObserver) {
		try {
			this.listeners.add(responseObserver);
			messages.stream().filter(messagesFilter(request))//
					.forEach(message -> sendMessageToListener(message, responseObserver));
			waitForNextMessages(responseObserver);
		} finally {
			logger.debug("Listener {} closed connection, removing", responseObserver);
			this.listeners.remove(responseObserver);
			responseObserver.onCompleted();
		}
	}

	private void sendMessageToListener(ChatMessage message, StreamObserver<ChatMessage> listener) {
		synchronized (listener) {
			try {
				listener.onNext(message);
			} catch (Exception e) {
				logger.error("Error occured while dispatching message {} to {}, removing listener", message, listener);
				listeners.remove(listener);
				listener.notifyAll();
			}
		}
	}

	private void waitForNextMessages(StreamObserver<ChatMessage> responseObserver) {
		try {
			synchronized (responseObserver) {
				responseObserver.wait(10000);
			}
		} catch (InterruptedException e) {
			logger.error("Error occured while waiting for messages", e);
		}
	}

	private Predicate<? super ChatMessage> messagesFilter(ReceiveMessagesRequests filterRequest) {
		return message -> {
			if (filterRequest.hasAfterTimestamp()
					&& Timestamps.compare(filterRequest.getAfterTimestamp(), message.getTimestamp()) >= 0) {
				return false;
			}
			return true;
		};
	}

	@Override
	public void ping(ChatMessage request, StreamObserver<ChatMessage> responseObserver) {
		ChatMessage response = ChatMessage.newBuilder(request)
				.setMessage("Hello " + request.getUser() + ", your message was: " + request.getMessage())
				.setUser("gRPC server: " + serverDetails()).build();
		logger.info("Got {} sending {}", request, response);
		responseObserver.onNext(response);
		responseObserver.onCompleted();
	}

	private String serverDetails() {
		try {
			return InetAddress.getLocalHost().toString();
		} catch (UnknownHostException e) {
			return "unknown";
		}
	}

}
