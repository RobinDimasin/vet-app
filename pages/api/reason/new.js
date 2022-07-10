import EntityList from "@db/entity/EntityList";
import STATUS from "@db/status";
import withAccount from "lib/middleware/withAccount";

export default withAccount(
  async (req, res) => {
    if (req.method === "POST") {
      const { id, reason } = req.body;

      if (id) {
        res.status(200).json(
          await EntityList.reason.new({
            id,
            reason,
          })
        );
      } else {
        res
          .status(400)
          .json({ status: STATUS.NOT_OK, message: "Invalid Reason ID" });
      }
    } else {
      res
        .status(405)
        .json({ status: STATUS.NOT_OK, message: "Method not allowed" });
    }
  },
  ["admin"]
);
