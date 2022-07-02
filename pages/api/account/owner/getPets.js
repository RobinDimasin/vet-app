import EntityList from "@db/entity/EntityList";
import STATUS from "@db/status";

export default async function handler(req, res) {
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
      .send(405)
      .json({ status: STATUS.NOT_OK, message: "Method not allowed" });
  }
}
