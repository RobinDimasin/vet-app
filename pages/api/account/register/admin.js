import STATUS from "@db/status";
import { register } from "./[type]";
import dotenv from "dotenv";
dotenv.config();

export default async function handler(req, res) {
  const { rootPassword } = req.body;

  if (rootPassword !== process.env.ROOT_PASSWORD && process.env.ROOT_PASSWORD) {
    return res.status(403).json({
      status: STATUS.NOT_OK,

      message: "Invalid Credentials",
    });
  }

  return await register("admin")(req, res);
}
