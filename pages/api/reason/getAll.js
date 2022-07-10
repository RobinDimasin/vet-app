import EntityList from "@db/entity/EntityList";
import STATUS from "@db/status";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res
      .status(405)
      .json({ status: STATUS.NOT_OK, message: "Method not allowed" });
  }

  return res.status(200).json(await EntityList.reason.find({}));
}
