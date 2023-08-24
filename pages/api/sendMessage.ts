import { NextApiRequest, NextApiResponse } from "next";
import { broadcastMessage } from "./messages";

export default (req: NextApiRequest, res: NextApiResponse) => {
  const { username, message } = req.body;
  if (req.method === "POST" && typeof username && typeof message === "string") {
    try {
      broadcastMessage({ username: username, text: message });
      res.status(200).json({ status: "Message sent" });
    } catch (error) {
      res.status(500).json({ error });
    }
  } else {
    res.status(400).json({ error: "Bad request" });
  }
};
