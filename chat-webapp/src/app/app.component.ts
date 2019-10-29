import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Input,
  NgZone
} from '@angular/core';

import { ApiService, ChatMessage } from './api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'chat-webapp';

  @Input()
  messages: ChatMessage[] = [];

  constructor(
    private api: ApiService // private cdRef: ChangeDetectorRef,
  ) {}
  // private zone: NgZone

  ngOnInit(): void {
    this.api.receiveMessages().subscribe((m: ChatMessage) => {
      // this.zone.run(() => {
      // });
      console.log('Received chat message via stream', m.toObject());
      // this.messages = this.messages.concat(m);
      this.messages = [m, ...this.messages];
      // this.cdRef.detectChanges();
    });
  }

  sendMessage(messageString: string, user: string) {
    // console.log('message: {}, user {}', messageString, user);
    const message = new ChatMessage();
    message.setMessage(messageString);
    message.setUser(user);
    this.api.sendMessage(message);
  }

  ping(): void {
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
