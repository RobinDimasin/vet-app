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
        .json({ status: STATUS.NOT_OK, message: "Invalid Pet ID" });
    }

    const response = await EntityList.pet.get({ id });

    if (!(response.status === STATUS.OK && response.data[0])) {
      return res.status(500).json(response);
    }

    const pet = response.data[0];

    const { account_type } = token;

    if (
      !(
        ["admin", "veterinarian"].includes(account_type) ||
        pet.owner_id === token.id
      )
    ) {
      return res
        .status(403)
        .json({ status: STATUS.NOT_OK, message: "Invalid credentials" });
    }

    return res.status(200).json(response);
  },
  ["owner", "admin", "veterinarian"]
);
