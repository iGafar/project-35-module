import { Response } from "express";

export const throwError = (res: Response, e: Error): void => {
  console.debug(e.message);
  res.status(500).send("Something went wrong");
};
