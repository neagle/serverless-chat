import { useEffect, useRef } from "react";
import { Message } from "../../types";
import dayjs from "dayjs";

type ChatBoxProps = {
  messages: Message[];
};

// accept an array of Message
const ChatBox = ({
  messages,
  ...rest
}: ChatBoxProps & React.HTMLProps<HTMLUListElement>) => {
  // create a ref to the messages container
  const messagesContainer = useRef<HTMLUListElement>(null);

  // Keep the chat scrolled to the bottom
  useEffect(() => {
    const messagesContainerRef = messagesContainer.current as HTMLUListElement;
    if (messagesContainerRef) {
      messagesContainerRef.scrollTop = messagesContainerRef.scrollHeight;
    }
  }, [messages]);

  return (
    <ul ref={messagesContainer} {...rest}>
      {messages.map(({ username, date, text, type }, i) => (
        <li className={`chat__message chat__message--type-${type}`} key={i}>
          <span className="chat__message__date text-gray-500 mr-1">
            {dayjs(date).format("HH:mm:ss")}
          </span>
          <span className="chat__message__username text-gray-500 mr-1">
            {username}:
          </span>
          <span
            className={`chat__message__text ${
              type === "notification" ? "text-gray-500" : ""
            }`}
          >
            {text}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default ChatBox;
