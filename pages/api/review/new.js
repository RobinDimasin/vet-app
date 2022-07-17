import EntityList from "@db/entity/EntityList";
import STATUS from "@db/status";
import withAccount from "lib/middleware/withAccount";

export default withAccount(
  async (req, res) => {
    if (req.method === "POST") {
      const { owner_id, rating, comment } = req.body;

      if (owner_id) {
        res.status(200).json(
          await EntityList.review.new({
            owner_id,
            rating,
            comment,
          })
        );
      } else {
        res
          .status(400)
          .json({ status: STATUS.NOT_OK, message: "Invalid Owner ID" });
      }
    } else {
      res
        .status(405)
        .json({ status: STATUS.NOT_OK, message: "Method not allowed" });
    }
  },
  ["owner"]
);
