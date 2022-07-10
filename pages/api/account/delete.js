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

    const { id } = req.body;

    const responseAccount = await EntityList.account.get({ id });

    if (!(responseAccount.status === STATUS.OK && responseAccount.data[0])) {
      return res.status(500).json(responseAccount);
    }

    const account = responseAccount.data[0];

    if (account.account_type === "admin") {
      return res
        .status(200)
        .json({
          status: STATUS.NOT_OK,
          message: "Admin account cannot be deleted",
        });
    }

    if (!id) {
      return res
        .status(400)
        .json({ status: STATUS.NOT_OK, message: "Invalid Account ID" });
    }

    return res.status(200).json(await EntityList.account.delete({ id }));
  },
  ["admin"]
);
