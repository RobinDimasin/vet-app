import Account from "@db/entity/Account/AccountEntity";
import EntityList from "@db/entity/EntityList";
import STATUS from "@db/status";
import withAccount from "lib/middleware/withAccount";

export default withAccount(
  async (req, res) => {
    if (req.method === "POST") {
      const { id, type } = req.body;

      if (!id) {
        return {
          status: STATUS.NOT_OK,
          message: "Invalid Account ID",
        };
      }

      if (
        type &&
        !Array.from(Account.children)
          .map((children) => children.entityType)
          .includes(type)
      ) {
        return res.status(400).json({
          status: STATUS.NOT_OK,
          message: `Invalid Account type "${type}"`,
        });
      }

      let account_id = id;

      if (type) {
        const response = await EntityList[type].find({ id });

        if (response.data && response.data[0]) {
          account_id = response.data[0].account_id;
        }
      }

      res.status(200).json({
        status: STATUS.OK,
        data: await EntityList.account.getAccountDetails(account_id),
      });
    } else {
      res
        .status(405)
        .json({ status: STATUS.NOT_OK, message: "Method not allowed" });
    }
  },
  ["admin", "veterinarian"]
);
