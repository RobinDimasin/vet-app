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
      return res
        .status(400)
        .json({ status: STATUS.NOT_OK, message: "Invalid Review ID" });
    }

    const response = await EntityList.review.get({ id });

    if (response.status !== STATUS.OK) {
      return res.status(500).json(response);
    }

    if (!response.data[0]) {
      return res
        .status(400)
        .json({ status: STATUS.NOT_OK, message: "Invalid Review ID" });
    }

    return res.status(200).json(await EntityList.review.delete({ id }));
  },
  ["admin"]
);
