import EntityList from "@db/entity/EntityList";
import STATUS from "@db/status";
import withAccount from "lib/middleware/withAccount";

export const newAppointment = async ({ date, pets, owner_id }) => {
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
    return {
      statusCode: 200,
      status: STATUS.OK,
      data: response.map((r) => {
        return r.data.map((d) => {
          return {
            ...d,
            owner_id,
          };
        });
      }),
    };
  } else {
    return {
      statusCode: 500,
      status: STATUS.NOT_OK,
      message: "Internal Error",
    };
  }
};

export default withAccount(
  async (req, res, token) => {
    if (req.method === "POST") {
      const { date, pets } = req.body;

      const { id: owner_id } = token;

      const response = await newAppointment({ date, pets, owner_id });

      return res.status(response.statusCode).json(response);
    } else {
      res
        .status(405)
        .json({ status: STATUS.NOT_OK, message: "Method not allowed" });
    }
  },
  ["owner", "veterinarian"]
);
