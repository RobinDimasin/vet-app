import Account from "@db/entity/Account/AccountEntity";
import EntityList from "@db/entity/EntityList";
import STATUS from "@db/status";
import withAccount from "lib/middleware/withAccount";

export default withAccount(
  async (req, res) => {
    if (req.method !== "POST") {
      res
        .status(405)
        .json({ status: STATUS.NOT_OK, message: "Method not allowed" });
    }

    const { type: _types = [] } = req.query;
    const types = typeof _types === "string" ? [_types] : _types;

    const response = await Promise.all(
      types
        .filter((type) =>
          Array.from(Account.children).find(
            (child) => child.entityType === type
          )
        )
        .map(async (type) => {
          return await EntityList.account.find({ account_type: type });
        })
    );

    const okay = response.every((r) => r.status === STATUS.OK);

    if (okay) {
      return res.status(200).json({
        status: STATUS.OK,
        data: response
          .map((r) => {
            return r.data;
          })
          .flat(Infinity)
          .map((data) => {
            delete data.hashed_password;
            delete data.salt;
            delete data.token_id;

            return data;
          }),
      });
    } else {
      return res.status(500).json({
        status: STATUS.NOT_OK,
        message: "Internal Error",
      });
    }
  },
  ["admin"]
);
