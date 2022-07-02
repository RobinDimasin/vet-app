import Entity from "@entity/Entity";

class ReasonEntity extends Entity {
  constructor() {
    super("Reasons", {
      primaryKey: "id",
      columns: {
        id: {
          type: "VarChar(8)",
          attributes: "NOT NULL",
        },
        reason: {
          type: "VarChar(64)",
          attributes: "NOT NULL",
        },
      },
    });

    this.addFunction("getAll", async () => await this.find({}));
  }
}

const Reason = new ReasonEntity();

export default Reason;
