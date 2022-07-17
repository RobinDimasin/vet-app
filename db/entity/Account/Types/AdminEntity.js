import Entity from "@db/entity/Entity";
import STATUS from "@db/status";
import Account from "@entity/Account/AccountEntity";
import dotenv from "dotenv";
dotenv.config();

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

  async new({
    email,
    profile_picture_url,
    username,
    salt,
    hashed_password,
    rootPassword,
  }) {
    if (
      rootPassword !== process.env.ROOT_PASSWORD &&
      process.env.ROOT_PASSWORD
    ) {
      return {
        status: STATUS.NOT_OK,
        message: "Invalid Credentials",
      };
    }

    const account = await this.parent.new({
      email,
      username,
      profile_picture_url,
      salt,
      hashed_password,
    });

    if (account.status === STATUS.OK) {
      try {
        const { id: account_id } = account.data[0];

        return await super.new({
          account_id,
        });
      } catch (e) {
        return {
          status: STATUS.NOT_OK,
          message: e,
        };
      }
    } else {
      return account;
    }
  }

  async getAdmin(id) {
    return await this.findOne({
      id,
    });
  }
}

const Admin = new AdminEntity();

export default Admin;
