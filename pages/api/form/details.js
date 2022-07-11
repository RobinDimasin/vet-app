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

    const { id } = req.body;

    if (!id) {
      res
        .status(400)
        .json({ status: STATUS.NOT_OK, message: "Invalid Form ID" });
    }

    const responseForm = await EntityList.form.find({ id });

    if (!(responseForm.status === STATUS.OK)) {
      return res.status(500).json({
        status: STATUS.NOT_OK,
        message: "Internal Error",
      });
    }

    if (!responseForm.data[0]) {
      res
        .status(400)
        .json({ status: STATUS.NOT_OK, message: "Invalid Form ID" });
    }

    const responseAppointments = await EntityList.appointment.find({
      form_id: id,
    });

    if (!(responseAppointments.status === STATUS.OK)) {
      return res.status(500).json({
        status: STATUS.NOT_OK,
        message: "Internal Error",
      });
    }

    const appointments = responseAppointments.data.map((appointment) => {
      return {
        ...appointment,
        owner_id: responseForm.data[0].owner_id,
      };
    });

    return res.status(200).json({
      status: STATUS.OK,
      data: appointments,
    });
  },
  ["admin", "veterinarian"]
);
