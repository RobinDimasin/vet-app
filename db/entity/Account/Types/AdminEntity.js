import Entity from "@db/entity/Entity";
import Account from "@entity/Account/AccountEntity";

class AdminEntity extends Entity {
  constructor() {
    super("Admins", {
      parent: Account,
      primaryKey: "id",
      columns: {
        id: Entity.Column.UUID,
      },
    });

    this.addFunction("getAdmin", async (id) => await this.getAdmin(id));
  }

  async new({ account_id }) {
    return await super.new({
      account_id,
    });
  }

  async getAdmin(id) {
    return await this.findOne({
      id,
    });
  }
}

const Admin = new AdminEntity();

export default Admin;
