import EntityList from "@db/entity/EntityList";
import STATUS from "@db/status";
import withAccount from "lib/middleware/withAccount";

export default withAccount(
  async (req, res) => {
    if (req.method === "POST") {
      const { owner_id, name, sex, breed, birthdate, species, description } =
        req.body;

      if (owner_id) {
        res.status(200).json(
          await EntityList.pet.new({
            owner_id,
            name,
            sex,
            breed,
            birthdate,
            species,
            description,
          })
        );
      } else {
        res
          .status(400)
          .json({ status: STATUS.NOT_OK, message: "Invalid Owner ID" });
      }
    } else {
      res
        .send(405)
        .json({ status: STATUS.NOT_OK, message: "Method not allowed" });
    }
  },
  ["owner", "admin"]
);
