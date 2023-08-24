import { NextApiRequest, NextApiResponse } from "next";
import Ably from "ably/promises";

const { ABLY_API_KEY = "" } = process.env;
const rest = new Ably.Rest(ABLY_API_KEY);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const tokenParams = {
    clientId: "chat-client",
  };
  try {
    const tokenRequest = await rest.auth.createTokenRequest(tokenParams);
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(tokenRequest));
  } catch (err) {
    res.status(500).send("Error requesting token: " + JSON.stringify(err));
  }
};
