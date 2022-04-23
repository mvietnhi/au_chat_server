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
    clientSocket = new Client("http://localhost:3000");
    clientSocket.emit("sendMessage", {
      message: "hiiiiii222222222222",
      userId: "6197ad0f561079889c705990",
      toUserId: "6170269e7417e20b9732dd28",
    });

    clientSocket.on("messageCreated", (arg) => {
      console.log("data", arg);
      expect(arg).toMatchObject({
        messageBody: "hiiiiii222222222222",
        userId: "6197ad0f561079889c705990",
      });
      done();
    });
  }, 10000);
});
