import Entity from "@entity/Entity";

class ReasonEntity extends Entity {
  constructor() {
    super("Reasons", {
      primaryKey: "id",
      columns: {
        id: Entity.Column.UUID,
        reason_of_appt: {
          type: "VarChar(64)",
          attributes: "NOT NULL",
        },
      },
    });
  }
}

const Reason = new ReasonEntity();

export default Reason;
