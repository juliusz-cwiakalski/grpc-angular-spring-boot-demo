import { Injectable } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import {
  ChatServiceClient,
  Status,
  ResponseStream
} from './proto/chat_pb_service';
import { ChatMessage, ReceiveMessagesRequests } from './proto/chat_pb';
import * as google_protobuf_timestamp_pb from 'google-protobuf/google/protobuf/timestamp_pb';

export { ChatMessage, ReceiveMessagesRequests };

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  lastReceivedMessageTimestamp: google_protobuf_timestamp_pb.Timestamp;

  client: ChatServiceClient;

  lastTimestamp: google_protobuf_timestamp_pb.Timestamp;

  constructor() {
    this.client = new ChatServiceClient('http://10.0.0.100:18080');
  }

  receiveMessages(): Observable<ChatMessage> {
    return new Observable(obs => {
      this.initStream(obs);
    });
  }

  private initStream(obs: Subscriber<ChatMessage>): void {
    // console.log('ApiService.receiveMessages');
    const req = new ReceiveMessagesRequests();
    if (this.lastReceivedMessageTimestamp !== undefined) {
      req.setAftertimestamp(this.lastReceivedMessageTimestamp);
    }
    const stream = this.client.receiveMessages(req);

    stream.on('status', (status: Status) => {
      // console.log('ApiService.getStream.status', status);
    });
    stream.on('data', (message: ChatMessage) => {
      // console.log('ApiService.getStream.data', message.toObject());
      this.lastReceivedMessageTimestamp = message.getTimestamp();
      obs.next(message);
    });
    stream.on('end', () => {
      // console.log('ApiService.getStream.end');
      // obs.complete();
      this.initStream(obs);
    });
  }

  sendMessage(request: ChatMessage): Promise<ChatMessage> {
    return new Promise((resolve, reject) => {
      // console.log('ApiService.sendMessage', request);

      this.client.sendMessage(request, null, (err, response: any) => {
        // console.log('ApiService.sendMessage.response', response);
        if (err) {
          return reject(err);
        }
        resolve(response);
      });
    });
  }

  ping(request: ChatMessage): Promise<ChatMessage> {
    return new Promise((resolve, reject) => {
      console.log('ApiService.get', request);

      this.client.ping(request, null, (err, response: ChatMessage) => {
        console.log('ApiService.get.response', response);
        if (err) {
          return reject(err);
        }
        resolve(response);
      });
    });
  }
}
