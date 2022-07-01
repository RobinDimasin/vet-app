import EntityList from "@db/entity/EntityList";
import STATUS from "@db/status";
import { serialize } from "cookie";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { jwt: token } = req.cookies;

    if (token) {
      const tokenDecoded = await EntityList.token.decode(token);

      res.status(200).json({
        status: STATUS.OK,
        data: await EntityList.account.getAccountDetails(
          tokenDecoded.account_id
        ),
      });
    } else {
      const cookie = serialize("jwt", "", {
        maxAge: -1,
        path: "/",
      });

      res.setHeader("Set-Cookie", [cookie]);
      res.status(401).json({ status: STATUS.NOT_OK, message: "Invalid Token" });
    }
  } else {
    res
      .send(405)
      .json({ status: STATUS.NOT_OK, message: "Method not allowed" });
  }
}
