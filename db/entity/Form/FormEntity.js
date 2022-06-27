import Entity from "@entity/Entity";
import Owner from "@db/entity/Account/Types/OwnerEntity";
class FormEntity extends Entity {
  constructor() {
    super("Forms", {
      primaryKey: "id",
      columns: {
        id: Entity.Column.UUID,
      },
      relationships: [
        {
          type: Entity.Relationship.ONE_TO_MANY,
          entity: Owner,
        },
      ],
    });
  }

  async new({ owner_id }) {
    return await super.new({
      owner_id,
    });
  }
}

const Form = new FormEntity();

export default Form;
