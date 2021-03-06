import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiURL } from '../url';
import { AuthenticationService } from '../user/authentication.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { ComposeMessageDialogComponent } from './compose-message-dialog/compose-message-dialog.component';

export interface Message {
  sender: string;
  subject: string;
  read: boolean;
  messageID: number;
  content: string;
  timeSent: Date;
}

@Injectable()
export class MessageService {

  private messages: Message[] = [];
  private loaded = false;

  constructor(
    private auth: AuthenticationService,
    private http: HttpClient,
    private dialog: MatDialog
  ) {
    auth.onAuth((username) => {
      if (username) this.loadMessages();
      else this.messages.length = 0;
    });
  }

  public openMessageDialog(receiverID: number) {
    let dialogRef = this.dialog.open(ComposeMessageDialogComponent);
    dialogRef.afterClosed().toPromise().then(res => {
      this.sendMessage(receiverID, res.subject, res.content);
    });
  }

  public sendMessage(receiverID: number, subject: string, content: string) {
    this.http.post(`${apiURL}/api/messages/send`, {
      receiverID: receiverID,
      subject: subject,
      content: content
    }, { headers: this.auth.getAuthHeader() })
      .toPromise()
      .catch(console.error);
  }

  public getMessages() {
    if (this.loaded)
      return Promise.resolve(this.messages);
    return this.loadMessages();
  }

  public getUnreadCount() {
    return this.messages.filter(msg => !msg.read).length;
  }

  private markRead(message: Message) {
    message.read = true;
    return this.http.post(`${apiURL}/api/messages/markRead`,
      { messageID: message.messageID },
      { headers: this.auth.getAuthHeader() })
      .toPromise();
  }

  private loadMessages(): Promise<Message[]> {
    return this.http.get(`${apiURL}/api/messages/list`, { headers: this.auth.getAuthHeader() })
      .toPromise()
      .then((messageData: any[]) =>
        messageData.map(msg => {
          return {
            sender: msg.sender,
            subject: msg.subject,
            content: msg.content,
            read: msg.read,
            messageID: msg.messageid,
            timeSent: new Date(msg.timesent)
          } as Message;
        })
      ).then(messages => {
        this.messages = messages;
        this.loaded = true;
        return messages;
      });
  }

}
