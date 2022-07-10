import Entity from "@entity/Entity";
import Account from "@entity/Account/AccountEntity";
import STATUS from "@db/status";

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
        last_name: {
          type: "VarChar(64)",
          attributes: "NOT NULL",
        },
        first_name: {
          type: "VarChar(64)",
          attributes: "NOT NULL",
        },
        middle_name: {
          type: "VarChar(64)",
        },
      },
    });
  }

  async new({
    email,
    username,
    salt,
    hashed_password,

    license_no,
    last_name,
    first_name,
    middle_name,
  }) {
    const account = await this.parent.new({
      email,
      username,
      salt,
      hashed_password,
    });

    if (account.status === STATUS.OK) {
      try {
        const { id: account_id } = account.data[0];

        return await super.new({
          license_no,
          last_name,
          first_name,
          middle_name,
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
}

const Veterinarian = new VeterinarianEntity();

export default Veterinarian;
