import EntityList from "@db/entity/EntityList";
import STATUS from "@db/status";
import withAccount from "lib/middleware/withAccount";

export default withAccount(
  async (req, res) => {
    if (req.method === "POST") {
      const { id: owner_id } = req.body;

      if (owner_id) {
        const responseForm = await EntityList.form.find({
          owner_id,
        });

        if (!(responseForm.status === STATUS.OK)) {
          return res.status(500).json({
            status: STATUS.NOT_OK,
            message: "Internal Error",
          });
        }

        const response = await Promise.all(
          responseForm.data.map(async (form) => {
            return await EntityList.appointment.find({ form_id: form.id });
          })
        );

        const okay = response.every((r) => r.status === STATUS.OK);

        if (okay) {
          return res.status(200).json({
            status: STATUS.OK,
            data: response.map((r) => r.data),
          });
        } else {
          return res.status(500).json({
            status: STATUS.NOT_OK,
            message: "Internal Error",
          });
        }
      } else {
        res.status(400).json({ status: STATUS.NOT_OK, message: "Invalid ID" });
      }
    } else {
      res
        .status(405)
        .json({ status: STATUS.NOT_OK, message: "Method not allowed" });
    }
  },
  ["owner", "admin"]
);
