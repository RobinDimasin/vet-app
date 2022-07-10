import EntityList from "@db/entity/EntityList";
import STATUS from "@db/status";
import withAccount from "lib/middleware/withAccount";

export default withAccount(
  async (req, res) => {
    if (req.method !== "POST") {
      res
        .status(405)
        .json({ status: STATUS.NOT_OK, message: "Method not allowed" });
    }

    const responseForm = await EntityList.form.find({});

    if (!(responseForm.status === STATUS.OK)) {
      return res.status(500).json({
        status: STATUS.NOT_OK,
        message: "Internal Error",
      });
    }

    const response = await Promise.all(
      responseForm.data.map(async (form) => {
        return {
          ...(await EntityList.appointment.find({ form_id: form.id })),
          owner_id: form.owner_id,
        };
      })
    );

    const okay = response.every((r) => r.status === STATUS.OK);

    if (okay) {
      return res.status(200).json({
        status: STATUS.OK,
        data: response.map((r) => {
          return r.data.map((d) => {
            return {
              ...d,
              owner_id: r.owner_id,
            };
          });
        }),
      });
    } else {
      return res.status(500).json({
        status: STATUS.NOT_OK,
        message: "Internal Error",
      });
    }
  },
  ["admin", "veterinarian"]
);
