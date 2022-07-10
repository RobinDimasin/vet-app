import { serialize } from "cookie";
import STATUS from "@db/status";
import EntityList from "@db/entity/EntityList";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { jwt: token } = req.cookies;

    if (token) {
      await EntityList.token.invalidate(token);
    }

    const cookie = serialize("jwt", "", {
      maxAge: -1,
      path: "/",
    });

    res.setHeader("Set-Cookie", [cookie]);

    res.status(200).json({ status: STATUS.OK });
  } else {
    res
      .status(405)
      .json({ status: STATUS.NOT_OK, message: "Method not allowed" });
  }
}
