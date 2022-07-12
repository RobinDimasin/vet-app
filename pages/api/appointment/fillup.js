import EntityList from "@db/entity/EntityList";
import STATUS from "@db/status";
import withAccount from "lib/middleware/withAccount";
import groupBy from "lodash/groupBy";
import { newAppointment } from "./new";

export default withAccount(
  async (req, res, token) => {
    if (req.method === "POST") {
      const { id, pets } = req.body;

      const responseFetchForm = await EntityList.form.get({ id });

      if (
        !(responseFetchForm.status === STATUS.OK && responseFetchForm.data[0])
      ) {
        return res.status(500).json(responseFetchForm);
      }

      const form = responseFetchForm.data[0];

      const { account_type } = token;

      if (
        !(
          account_type === "admin" ||
          account_type === "veterinarian" ||
          form.owner_id === token.id
        )
      ) {
        return res
          .status(403)
          .json({ status: STATUS.NOT_OK, message: "Invalid credentials" });
      }

      const responseAppointmentsInForm = await EntityList.appointment.find({
        form_id: form.id,
      });

      if (!(responseAppointmentsInForm.status === STATUS.OK)) {
        return res.status(500).json({
          status: STATUS.NOT_OK,
          message: "Internal Error",
        });
      }

      await Promise.all(
        responseAppointmentsInForm.data.map(async (appointment) => {
          const pet = pets.find((pet) => pet.pet_id === appointment.pet_id);

          if (pet) {
            return await EntityList.appointment.update(
              {
                form_id: form.id,
                pet_id: pet.pet_id,
              },
              {
                ...pet,
              }
            );
          } else {
            return await EntityList.appointment.delete({
              form_id: form.id,
              pet_id: appointment.pet_id,
            });
          }
        })
      );

      const petsWithNextAppt = pets.filter((pet) => {
        return (
          pet.next_appt_date &&
          pet.next_appt_reason &&
          pet.next_appt_description
        );
      });

      const petsWithSameDateAppt = Object.values(
        groupBy(petsWithNextAppt, (pet) => pet.next_appt_date)
      );

      const responseNewForms = await Promise.all(
        petsWithSameDateAppt.map(async (pets) => {
          return await newAppointment({
            date: pets[0].next_appt_date,
            pets: pets.map((pet) => {
              return {
                pet_id: pet.pet_id,
                reason_id: pet.next_appt_reason,
                reason_desc: pet.next_appt_description,
              };
            }),
            owner_id: form.owner_id,
          });
        })
      );

      const response = await EntityList.appointment.find({ form_id: form.id });

      if (response.status === STATUS.OK) {
        return res.status(200).json({
          status: STATUS.OK,
          data: {
            updatedFormAppointments: response.data.map((d) => {
              return {
                ...d,
                owner_id: form.owner_id,
              };
            }),
            newAppointments: responseNewForms.map((r) => r.data),
          },
        });
      } else {
        return res.status(500).json(response);
      }
    } else {
      res
        .status(405)
        .json({ status: STATUS.NOT_OK, message: "Method not allowed" });
    }
  },
  ["owner", "admin", "veterinarian"]
);
