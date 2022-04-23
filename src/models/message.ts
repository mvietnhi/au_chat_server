export default class Message {
  messageBody: string;
  userId: string;
  channelId: string;

  constructor(messageBody: string, userId: string, channelId: string) {
    this.messageBody = messageBody;
    this.userId = userId;
    this.channelId = channelId;
  }
}
