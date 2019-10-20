package pl.jcw.demo.chat.backend.grpc;

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
		messages.forEach(message -> responseObserver.onNext(message));
		responseObserver.onCompleted();
	}

	@Override
	public void sendMessage(ChatMessage request, StreamObserver<Empty> responseObserver) {
		this.messages.add(request);
		responseObserver.onCompleted();
	}
}
