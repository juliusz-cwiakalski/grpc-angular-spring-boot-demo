import { Component, OnInit } from '@angular/core';

import { ChatMessage } from './proto/chat_pb';
import { ApiService } from './api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'chat-webapp';

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    const message = new ChatMessage();
    message.setMessage('From NG app');
    message.setUser('NG Hero');
    this.api
      .ping(message)
      .then((response: ChatMessage) => {
        console.log('Got ping respnse', response.toObject());
      })
      .catch((reason: any) => {
        console.log('Ping rejected', reason);
      });
  }
}
