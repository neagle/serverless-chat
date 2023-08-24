// pages/api/messages.ts
import { Message } from "../../types";
import Ably from "ably";

const {
  ABLY_API_KEY = "",
} = process.env;

type BroadcastOptions = {
  username: string;
  text: string;
  date?: Date;
  save?: boolean;
  type?: "message" | "notification";
};

// Function to broadcast a message to all connected clients
export const broadcastMessage = async (
  { username, text, date = new Date(), save = true, type = "message" }:
    BroadcastOptions,
) => {
  const messageObject: Message = {
    username,
    date,
    text,
    type,
  };

  const ably = new Ably.Realtime.Promise(
    ABLY_API_KEY,
  );

  await ably.connection.once("connected");

  const channel = ably.channels.get("chat");

  channel.publish("message", messageObject);
};
