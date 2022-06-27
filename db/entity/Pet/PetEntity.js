import Entity from "@entity/Entity";
import Owner from "@db/entity/Account/Types/OwnerEntity";

class PetEntity extends Entity {
  constructor() {
    super("Pets", {
      primaryKey: "id",
      columns: {
        id: Entity.Column.UUID,
        name: {
          type: "VarChar(64)",
          attributes: "NOT NULL",
        },
        sex: {
          type: "Char(1)",
          attributes: "NOT NULL CHECK (sex IN ('M','F'))",
        },
        breed: {
          type: "Char(64)",
          attributes: "NOT NULL",
        },
        species: {
          type: "VarChar(64)",
          attributes: "NOT NULL",
        },
        description: {
          type: "VarChar(64)",
          attributes: "NOT NULL",
        },
      },
      relationships: [
        {
          type: Entity.Relationship.MANY_TO_ONE,
          entity: Owner,
        },
      ],
    });
  }

  async new({ name, sex, breed, species, description }) {
    return await super.new({
      name,
      sex,
      breed,
      species,
      description,
    });
  }
}

const Pet = new PetEntity();

export default Pet;
