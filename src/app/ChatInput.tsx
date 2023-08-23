import { ReactHTMLElement, useCallback, useState } from "react";

type ChatInputProps = {
  submit: (text: string) => void;
};

const ChatInput = ({
  submit,
  ...rest
}: ChatInputProps & React.HTMLProps<HTMLDivElement>) => {
  const [text, setText] = useState("");
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && text.length > 0) {
      sendMessage(text);
    }
  };

  const sendMessage = useCallback(
    (text: string) => {
      submit(text);
      setText("");
    },
    [submit]
  );

  return (
    <div {...rest}>
      <input
        autoFocus={true}
        className="text-black p-2 border-2 border-black"
        type="text"
        value={text}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Your message"
      />
      <input
        type="button"
        value="Send"
        className="cursor-pointer ml-5 disabled:opacity-50 transition-opacity duration-300 ease-in-out"
        onClick={() => sendMessage(text)}
        disabled={!text}
      />
    </div>
  );
};

export default ChatInput;
