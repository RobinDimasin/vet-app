import EntityList from "@db/entity/EntityList";
import STATUS from "@db/status";
import withAccount from "lib/middleware/withAccount";

export default withAccount(
  async (req, res, token) => {
    if (req.method === "POST") {
      res.status(200).json({
        status: STATUS.OK,
        data: await EntityList.account.getAccountDetails(token.account_id),
      });
    } else {
      res
        .send(405)
        .json({ status: STATUS.NOT_OK, message: "Method not allowed" });
    }
  },
  ["owner", "admin", "veterinarian"]
);
