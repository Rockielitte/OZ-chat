import PusherServer from "pusher";
import PusherClient from "pusher-js";

export const pusherServer = new PusherServer({
  appId: "1626591",
  key: "5979530e88ca7cc2f5ba",
  secret: "4dcc951c26e901d8f27a",
  cluster: "ap1",
  useTLS: true,
});
export const pusherClient = new PusherClient("5979530e88ca7cc2f5ba", {
  cluster: "ap1",
});
