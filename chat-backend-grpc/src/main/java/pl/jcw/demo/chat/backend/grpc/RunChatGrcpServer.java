package pl.jcw.demo.chat.backend.grpc;

import java.io.IOException;

import io.grpc.Server;
import io.grpc.ServerBuilder;

public class RunChatGrcpServer {

	public static void main(String[] args) throws IOException, InterruptedException {
		Server server = ServerBuilder.forPort(28080).addService(new ChatServiceImpl()).build();
		server.start();
		server.awaitTermination();
	}

}
