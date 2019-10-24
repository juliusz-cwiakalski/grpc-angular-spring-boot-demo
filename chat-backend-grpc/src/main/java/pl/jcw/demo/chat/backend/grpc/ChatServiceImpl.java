package pl.jcw.demo.chat.backend.grpc;

import java.util.Date;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

import com.google.protobuf.Empty;

import io.grpc.stub.StreamObserver;
import pl.jcw.demo.chat.ChatMessage;
import pl.jcw.demo.chat.ChatServiceGrpc.ChatServiceImplBase;
import pl.jcw.demo.chat.ReceiveMessagesRequests;

public class ChatServiceImpl extends ChatServiceImplBase {

	private List<ChatMessage> messages = new CopyOnWriteArrayList<>();

	@Override
	public void receiveMessages(ReceiveMessagesRequests request, StreamObserver<ChatMessage> responseObserver) {
		System.out.println("Sending: " + new Date() + "\n" + messages);
		messages.forEach(message -> {
			responseObserver.onNext(message);
		});
		responseObserver.onCompleted();
	}

	@Override
	public void sendMessage(ChatMessage request, StreamObserver<Empty> responseObserver) {
		this.messages.add(request);
		responseObserver.onNext(Empty.getDefaultInstance());
		responseObserver.onCompleted();
	}

	@Override
	public void ping(ChatMessage request, StreamObserver<ChatMessage> responseObserver) {
		ChatMessage response = ChatMessage.newBuilder(request)
				.setMessage("Hello " + request.getUser() + ", your message was: " + request.getMessage())
				.setUser("gRPC server").build();
		System.out.println("Got: " + request + ", sending back: " + response);
		responseObserver.onNext(response);
		responseObserver.onCompleted();
	}

}
