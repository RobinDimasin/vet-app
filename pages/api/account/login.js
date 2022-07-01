import { serialize, parse } from "cookie";
import EntityList from "@db/entity/EntityList";
import STATUS from "@db/status";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, hashed_password } = req.body;
    if (!email || !hashed_password) {
      return res.status(400).json({
        status: STATUS.NOT_OK,
        message: "Missing email or password",
      });
    }

    const result = await EntityList.account.login({ email, hashed_password });

    if (result.status === STATUS.OK && result.data.token) {
      const MAX_AGE = 60 * 60 * 24;
      const cookie = serialize("jwt", result.data.token, {
        maxAge: MAX_AGE,
        expires: new Date(Date.now() + MAX_AGE * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",
      });
      res.setHeader("Set-Cookie", [cookie]);
    }

    res.status(200).json(result);
  } else {
    res
      .send(405)
      .json({ status: STATUS.NOT_OK, message: "Method not allowed" });
  }
}
