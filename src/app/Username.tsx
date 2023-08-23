import { Dispatch, SetStateAction, useState } from "react";

const Username = ({
  setUsername,
  ...rest
}: {
  setUsername: Dispatch<SetStateAction<string>>;
} & React.HTMLProps<HTMLDivElement>) => {
  const [text, setText] = useState("");
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && text.length > 0) {
      setUsername(text);
    }
  };
  return (
    <div {...rest}>
      <label className="p-2">
        Username:
        <input
          autoFocus={true}
          type="text"
          name="name"
          className="p-2 m-2 text-black"
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="username"
        />
        <input
          type="submit"
          value="Connect ⚡️"
          className="p-2 cursor-pointer disabled:opacity-50 transition-opacity duration-300 ease-in-out"
          disabled={!text}
          onClick={() => setUsername(text)}
        />
      </label>
    </div>
  );
};

export default Username;
