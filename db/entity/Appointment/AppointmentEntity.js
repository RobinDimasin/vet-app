import AssociativeEntity from "@entity/AssociativeEntity";
import Form from "@entity/Form/FormEntity";
import Pet from "@entity/Pet/PetEntity";
import Veterinarian from "@entity/Account/Types/VeterinarianEntity";
import Reason from "@entity/Reason/ReasonEntity";

class AppointmentEntity extends AssociativeEntity {
  constructor() {
    super("Appointments", Form, Pet, {
      columns: {
        reason_desc: {
          type: "VarChar(64)",
          attributes: "NOT NULL",
        },
        appt_date: {
          type: "DATE",
          attributes: "NOT NULL",
        },
        weight: {
          type: "DECIMAL(13, 2)",
        },
        temperature: {
          type: "DECIMAL(13, 2)",
        },
        prescription: {
          type: "VarChar(64)",
        },
        next_appt_date: {
          type: "DATE",
        },
        next_appt_details: {
          type: "VarChar(64)",
        },
      },
      relationships: [
        {
          type: AssociativeEntity.Relationship.MANY_TO_ONE,
          entity: Reason,
        },
        {
          type: AssociativeEntity.Relationship.MANY_TO_ONE,
          entity: Veterinarian,
        },
      ],
    });
  }

  async new({
    form_id,
    pet_id,
    reason_id,
    reason_desc,
    appt_date,
    weight,
    temperature,
    prescription,
    next_appt_date,
    next_appt_details,
    license_no,
  }) {
    return await super.new({
      form_id,
      pet_id,
      reason_id,
      reason_desc,
      appt_date,
      weight,
      temperature,
      prescription,
      next_appt_date,
      next_appt_details,
      license_no,
    });
  }
}

const Appointment = new AppointmentEntity();

export default Appointment;
