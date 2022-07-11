import EntityList from "@db/entity/EntityList";
import STATUS from "@db/status";
import withAccount from "lib/middleware/withAccount";

export default withAccount(
  async (req, res) => {
    if (req.method === "POST") {
      const { id } = req.body;

      if (id) {
        res.status(200).json(
          await EntityList.pet.find({
            owner_id: id,
          })
        );
      } else {
        res.status(400).json({ status: STATUS.NOT_OK, message: "Invalid ID" });
      }
    } else {
      res
        .status(405)
        .json({ status: STATUS.NOT_OK, message: "Method not allowed" });
    }
  },
  ["owner", "admin", "veterinarian"]
);
