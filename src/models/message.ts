export default class Message {
    messageBody: String;
    userId: String;
    channelId: String;

    constructor(messageBody: string, userId: string, channelId: string) {
        this.messageBody = messageBody;
        this.userId = userId;
        this.channelId = channelId;
    }
}