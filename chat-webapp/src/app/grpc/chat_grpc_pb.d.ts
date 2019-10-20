// package: pl.jcw.demo.chat
// file: chat.proto

/* tslint:disable */

import * as grpc from "grpc";
import * as chat_pb from "./chat_pb";
import * as google_protobuf_timestamp_pb from "google-protobuf/google/protobuf/timestamp_pb";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";

interface IChatServiceService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    receiveMessages: IChatServiceService_IReceiveMessages;
    sendMessage: IChatServiceService_ISendMessage;
}

interface IChatServiceService_IReceiveMessages extends grpc.MethodDefinition<chat_pb.ReceiveMessagesRequests, chat_pb.ChatMessage> {
    path: string; // "/pl.jcw.demo.chat.ChatService/ReceiveMessages"
    requestStream: boolean; // false
    responseStream: boolean; // true
    requestSerialize: grpc.serialize<chat_pb.ReceiveMessagesRequests>;
    requestDeserialize: grpc.deserialize<chat_pb.ReceiveMessagesRequests>;
    responseSerialize: grpc.serialize<chat_pb.ChatMessage>;
    responseDeserialize: grpc.deserialize<chat_pb.ChatMessage>;
}
interface IChatServiceService_ISendMessage extends grpc.MethodDefinition<chat_pb.ChatMessage, google_protobuf_empty_pb.Empty> {
    path: string; // "/pl.jcw.demo.chat.ChatService/SendMessage"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<chat_pb.ChatMessage>;
    requestDeserialize: grpc.deserialize<chat_pb.ChatMessage>;
    responseSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    responseDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
}

export const ChatServiceService: IChatServiceService;

export interface IChatServiceServer {
    receiveMessages: grpc.handleServerStreamingCall<chat_pb.ReceiveMessagesRequests, chat_pb.ChatMessage>;
    sendMessage: grpc.handleUnaryCall<chat_pb.ChatMessage, google_protobuf_empty_pb.Empty>;
}

export interface IChatServiceClient {
    receiveMessages(request: chat_pb.ReceiveMessagesRequests, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<chat_pb.ChatMessage>;
    receiveMessages(request: chat_pb.ReceiveMessagesRequests, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<chat_pb.ChatMessage>;
    sendMessage(request: chat_pb.ChatMessage, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    sendMessage(request: chat_pb.ChatMessage, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    sendMessage(request: chat_pb.ChatMessage, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
}

export class ChatServiceClient extends grpc.Client implements IChatServiceClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public receiveMessages(request: chat_pb.ReceiveMessagesRequests, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<chat_pb.ChatMessage>;
    public receiveMessages(request: chat_pb.ReceiveMessagesRequests, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<chat_pb.ChatMessage>;
    public sendMessage(request: chat_pb.ChatMessage, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public sendMessage(request: chat_pb.ChatMessage, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public sendMessage(request: chat_pb.ChatMessage, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
}
