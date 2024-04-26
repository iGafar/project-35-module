import { NextFunction, Router, Request, Response } from "express";
import { throwError } from "./helper";
import { IAuthRequisits } from "@Shared/types";
import { verifyRequisits } from "../models/auth.model";

export const authRouter = Router();

export const validateSession = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.path.includes("/login") || req.path.includes("/authenticate")) {
    next();
    return;
  }

  if (req.session?.username) {
    next();
  } else {
    res.redirect(`/${process.env.ADMIN_PATH}/auth/login`);
  }
};

authRouter.get("/login", async (req: Request, res: Response) => {
  try {
    res.render("login");
  } catch (e) {
    throwError(res, e);
  }
});

authRouter.post(
  "/authenticate",
  async (req: Request<{}, {}, IAuthRequisits>, res: Response) => {
    try {
      const verified = await verifyRequisits(req.body);

      if (verified) {
        req.session.username = req.body.username;
        req.session.save();
        res.redirect(`/${process.env.ADMIN_PATH}`);
      } else {
        res.redirect(`/${process.env.ADMIN_PATH}/auth/login`);
      }
    } catch (e) {
      throwError(res, e);
    }
  }
);

authRouter.get("/logout", async (req: Request, res: Response) => {
  try {
    req.session.destroy((e) => {
      if (e) {
        console.log("Something went wrong with session destroying", e);
      }

      res.redirect(`/${process.env.ADMIN_PATH}/auth/login`);
    });
  } catch (e) {
    throwError(res, e);
  }
});
