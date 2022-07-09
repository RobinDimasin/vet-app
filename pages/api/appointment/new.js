import EntityList from "@db/entity/EntityList";
import STATUS from "@db/status";
import withAccount from "lib/middleware/withAccount";

export default withAccount(
  async (req, res, token) => {
    if (req.method === "POST") {
      const { date, pets } = req.body;

      const { id: owner_id } = token;

      const responseForm = await EntityList.form.new({ owner_id });

      if (!(responseForm.status === STATUS.OK && responseForm.data[0])) {
        return res.status(500).json({
          status: STATUS.NOT_OK,
          message: "Internal Error",
        });
      }

      const response = await Promise.all(
        pets.map(async (pet) => {
          return await EntityList.appointment.new({
            ...pet,
            form_id: responseForm.data[0].id,
            appt_date: date,
          });
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
      res
        .status(405)
        .json({ status: STATUS.NOT_OK, message: "Method not allowed" });
    }
  },
  ["owner"]
);
