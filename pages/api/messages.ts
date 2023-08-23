// pages/api/messages.ts
import { NextApiRequest, NextApiResponse } from "next";
import { Message } from "../../types";

console.log("Creating new clients array...");
const clients: NextApiResponse[] = [];

let messages: Message[] = [];

type BroadcastOptions = {
  username: string;
  text: string;
  date?: Date;
  client?: NextApiResponse;
  save?: boolean;
  type?: "message" | "notification";
};

export default (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  console.log("New client connected!");

  // Add this client to the clients array
  clients.push(res);

  broadcastMessage({
    username: "System",
    text: "Connected! ⚡",
    type: "notification",
    client: res,
    save: false,
  });

  // Send the message history
  messages.forEach(({ username, text, date }) => {
    broadcastMessage({
      username,
      text,
      date,
      client: res,
      save: false,
    });
  });

  req.on("close", () => {
    // Remove this client from the clients array
    clients.splice(clients.indexOf(res), 1);
    res.end();
  });
};

// Function to broadcast a message to all connected clients
export const broadcastMessage = (
  { username, text, date = new Date(), client, save = true, type = "message" }:
    BroadcastOptions,
) => {
  const messageObject: Message = {
    username,
    date,
    text,
    type,
  };

  console.log("broadcast", messageObject);

  if (save) {
    messages = [...messages, messageObject].sort((a, b) =>
      Number(a.date) - Number(b.date)
    )
      .splice(-20);
  }

  if (client) {
    console.log("Sending to one client...");
    // Send to just one client
    client.write(`data: ${JSON.stringify(messageObject)}\n\n`);
  } else {
    console.log(
      `Sending to everybody (${clients.length} clients connected)...`,
    );
    // Send to everybody
    clients.forEach((client) =>
      client.write(`data: ${JSON.stringify(messageObject)}\n\n`)
    );
  }
};
