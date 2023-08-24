import { NextApiRequest, NextApiResponse } from "next";
import { Message } from "../../types";
import Ably from "ably";

export default (req: NextApiRequest, res: NextApiResponse) => {
  const { username, message } = req.body;
  if (req.method === "POST" && typeof username && typeof message === "string") {
    try {
      broadcastMessage({ username: username, text: message });
      res.status(200).json({ status: `Message sent: ${username}: ${message}` });
    } catch (error) {
      res.status(500).json({ error });
    }
  } else {
    res.status(400).json({ error: "Bad request" });
  }
};

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
  console.log("Connected to Ably");

  const channel = ably.channels.get("chat");

  console.log("Publish", messageObject);
  channel.publish("message", messageObject);
};
