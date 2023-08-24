import { NextApiRequest, NextApiResponse } from "next";

export default (req: NextApiRequest, res: NextApiResponse) => {
  console.log("This console log should be accessible in the logs!");
  res.status(200).json({ status: "I just logged something to the console!" });
};
