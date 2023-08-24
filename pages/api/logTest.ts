import { NextApiRequest, NextApiResponse } from "next";

export default (req: NextApiRequest, res: NextApiResponse) => {
  console.log("This console log should be accessible in the logs!");
  console.log("How do you handle multiple logs?");
  console.log(`Oh, I love loggin', yes I do...`);
  res.status(200).json({
    status: "I just logged a few things to the console!",
  });
};
