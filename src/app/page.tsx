"use client";

import { useEffect, useState, useCallback } from "react";
import { Message } from "../../types";
import Username from "./Username";
import ChatBox from "./ChatBox";
import ChatInput from "./ChatInput";

export default function Home() {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([] as Message[]);
  const [username, setUsername] = useState("");
  const addMessage = (message: Message) => {
    setMessages((prevMessages) =>
      [...prevMessages, message]
        // only keep the most recent 20 messages
        .splice(-20)
    );
  };

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
        console.log("Message sent");
      } else {
        console.error("Failed to send message");
      }
    },
    [username]
  );

  // Connect to the messages stream
  useEffect(() => {
    if (!username) {
      return;
    }

    console.log("Connecting to messages stream");
    const eventSource = new EventSource("/api/messages");

    setConnected(true);

    eventSource.onmessage = (event: MessageEvent) => {
      console.log("Received:", event.data);
      const newMessage = JSON.parse(event.data) as Message;
      addMessage(newMessage);
    };

    return () => {
      console.log("closing messages stream");
      eventSource.close();
      setConnected(false);
    };
  }, [username]);

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-2xl flex-grow-0 mb-4">
        Chat with Server-Sent Events (SSE)
      </h1>
      {!username && <Username setUsername={setUsername} />}
      {connected && (
        <>
          <ChatBox
            messages={messages}
            className="chat max-h-[300px] max-w-[400px] border-2 p-5 mb-5 overflow-y-scroll"
          />
          <ChatInput submit={sendMessage} />
        </>
      )}
    </main>
  );
}
