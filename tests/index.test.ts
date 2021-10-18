const { createServer } = require("http");
const { Server } = require("socket.io");
const Client = require("socket.io-client");

describe("my awesome project", () => {
  let clientSocket;

  // beforeAll((done) => {
    // done();
  // });

  afterAll(() => {
    clientSocket.close();
  });

  it("test connection", (done) => {
    clientSocket = new Client('https://au-chat-server.herokuapp.com');
    clientSocket.emit("newMessage", "t1", "t2", "t3" );

    clientSocket.on("messageCreated", (arg) => {
      console.log("data",arg);
      expect(arg).toMatchObject({messageBody: "t1",userId: "t2",channelId: "t3"});
      done();
    });
  }, 10000);

});