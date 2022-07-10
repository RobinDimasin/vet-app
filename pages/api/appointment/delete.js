import EntityList from "@db/entity/EntityList";
import STATUS from "@db/status";
import withAccount from "lib/middleware/withAccount";

export default withAccount(
  async (req, res, token) => {
    if (req.method !== "POST") {
      res
        .status(405)
        .json({ status: STATUS.NOT_OK, message: "Method not allowed" });
    }

    const { id } = req.body;

    if (!id) {
      res
        .status(400)
        .json({ status: STATUS.NOT_OK, message: "Invalid Form ID" });
    }

    const response = await EntityList.form.get({ id });

    if (!(response.status === STATUS.OK && response.data[0])) {
      return res.status(500).json(response);
    }

    const form = response.data[0];

    const { account_type } = token;

    if (!(account_type === "admin" || form.owner_id === token.id)) {
      return res
        .status(403)
        .json({ status: STATUS.NOT_OK, message: "Invalid credentials" });
    }

    const x = await EntityList.form.delete({ id });

    return res.status(200).json(response);
  },
  ["owner", "admin"]
);
