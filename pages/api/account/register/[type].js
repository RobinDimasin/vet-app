import EntityList from "@db/entity/EntityList";
import STATUS from "@db/status";
import Account from "@db/entity/Account/AccountEntity";
import withAccount from "lib/middleware/withAccount";

export const register = (type) => {
  return async (req, res) => {
    if (req.method === "POST") {
      type ??= req.query.type;

      const account_details = req.body;

      if (
        !Array.from(Account.children)
          .map((children) => children.entityType)
          .includes(type)
      ) {
        return res.status(400).json({
          status: STATUS.NOT_OK,
          message: `Invalid Account type "${type}"`,
        });
      }

      const response = await EntityList[type].new(account_details);

      res.status(response.status === STATUS.OK ? 200 : 400).json(response);
    } else {
      res
        .status(405)
        .json({ status: STATUS.NOT_OK, message: "Method not allowed" });
    }
  };
};

export default withAccount(register(), ["admin"]);
