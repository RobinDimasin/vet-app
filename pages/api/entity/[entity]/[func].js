import STATUS from "@db/status";
import EntityList from "@entity/EntityList";

export default async function handler(req, res) {
  const { entity, func } = req.query;

  if (req.method !== "POST") {
    res.status(405).send({ message: "Only POST requests are allowed" });
    return;
  }

  if (entity && entity in EntityList) {
    if (func && func in EntityList[entity].functions) {
      const { args } = req.body;

      if (args) {
        const fun = EntityList[entity].functions[func];
        res.status(200).json(await fun(...args));
      } else {
        res.status(400).json({
          status: STATUS.NOT_OK,
          message: `"args" not found in query`,
        });
      }
    } else {
      res.status(400).json({
        status: STATUS.NOT_OK,
        message: `Function "${func}" does not exist on Entity "${entity}"`,
      });
    }
  } else {
    res.status(404).json({
      status: STATUS.NOT_OK,
      message: `Entity "${entity}" does not exist`,
    });
  }
}
