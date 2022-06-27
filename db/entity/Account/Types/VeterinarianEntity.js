import Entity from "@entity/Entity";
import Account from "@entity/Account/AccountEntity";

class VeterinarianEntity extends Entity {
  constructor() {
    super("Veterinarians", {
      parent: Account,
      primaryKey: "license_no",
      columns: {
        license_no: {
          type: "VarChar(64)",
          attributes: "NOT NULL",
        },
        vet_name: {
          type: "VarChar(64)",
          attributes: "NOT NULL",
        },
      },
    });
  }

  async new({ license_no, vet_name }) {
    return await super.new({
      license_no,
      vet_name,
    });
  }
}

const Veterinarian = new VeterinarianEntity();

export default Veterinarian;
