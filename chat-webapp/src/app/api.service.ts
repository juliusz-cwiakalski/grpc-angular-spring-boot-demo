import { Injectable } from '@angular/core';

import { ChatServiceClient, Status } from './proto/chat_pb_service';
import { ChatMessage, ReceiveMessagesRequests } from './proto/chat_pb';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  client: ChatServiceClient;

  constructor() {
    this.client = new ChatServiceClient('http://10.0.0.100:18080');
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
