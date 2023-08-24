"use client";

import { useEffect, useState, useCallback } from "react";
import { Message } from "../../types";
import Username from "./Username";
import ChatBox from "./ChatBox";
import ChatInput from "./ChatInput";
import Ably from "ably";

export default function Home() {
  const [messages, setMessages] = useState([] as Message[]);
  const [username, setUsername] = useState("");

  const addMessage = (message: Message) => {
    setMessages((prevMessages) =>
      [...prevMessages, message]
        // only keep the most recent 20 messages
        .splice(-20)
    );
  };

  // Initialize Ably client and subscribe to messages
  useEffect(() => {
    let ablyClient: Ably.Types.RealtimePromise;
    let channel: Ably.Types.RealtimeChannelPromise;

    const init = async () => {
      ablyClient = new Ably.Realtime.Promise({
        authUrl: "/api/ably/auth",
      });

      await ablyClient.connection.once("connected");

      console.log("Ably client connected");

      addMessage({
        username: "Server",
        text: "Connected to chat! ⚡️",
        type: "notification",
        date: new Date(),
      });

      channel = ablyClient.channels.get("chat");
      console.log("Channel", channel);

      await channel.subscribe("message", (message: Ably.Types.Message) => {
        console.log("Message received", message);
        addMessage(message.data as Message);
      });
    };

    init();

    // Cleanup function
    return () => {
      if (channel) {
        channel.unsubscribe();
      }
      if (ablyClient) {
        ablyClient.close();
      }
    };
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      const response = await fetch("/api/sendMessage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, message: text }),
      });

      if (response.ok) {
        console.log(`Message sent: ${text}`);
      } else {
        console.error("Failed to send message");
      }
    },
    [username]
  );

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-2xl flex-grow-0 mb-4">
        Chat with Server-Sent Events (SSE)
      </h1>
      {!username && <Username setUsername={setUsername} />}
      {username && (
        <>
          <ChatBox
            messages={messages}
            className="chat max-h-[300px] w-[400px] border-2 p-5 mb-5 overflow-y-scroll"
          />
          <ChatInput submit={sendMessage} />
        </>
      )}
    </main>
  );
}
