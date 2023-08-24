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

      addMessage({
        username: "Server",
        text: "Connected to chat! ⚡️",
        type: "notification",
        date: new Date(),
      });

      channel = ablyClient.channels.get("chat");

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
    <main
      className={[
        "flex",
        "min-h-screen",
        "flex-col",
        "items-flex-start",
        "max-w-[800px]",
        "md:p-24",
        "md:mx-auto",
      ].join(" ")}
    >
      <h1 className="text-2xl flex-grow-0 p-5">Serverless Chat</h1>
      {!username && <Username setUsername={setUsername} className="p-5" />}
      {username && (
        <>
          <ChatBox
            messages={messages}
            className={[
              "chat",
              "max-h-[300px]",
              "w-full",
              "border-t-2",
              "border-b-2",
              "md:border-2", // full border on desktop only
              "p-5",
              "overflow-y-scroll",
            ].join(" ")}
          />
          <ChatInput submit={sendMessage} className={["p-5"].join(" ")} />
        </>
      )}
      <div className="p-5">
        Chat using websockets on a serverless app in Vercel by using{" "}
        <a href="https://ably.com/">Ably</a>.
      </div>
      <footer className="text-gray-500 p-5">
        <ul className="inline-bullets">
          <li>
            Created by <a href="https://nateeagle.com">Nate Eagle</a>
          </li>
          <li className="ml-1">
            <a href="https://github.com/neagle/serverless-chat">
              View on Github
            </a>
          </li>
        </ul>
      </footer>
    </main>
  );
}
