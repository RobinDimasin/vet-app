import Entity from "@entity/Entity";
import Account from "@entity/Account/AccountEntity";
import STATUS from "@db/status";
class OwnerEntity extends Entity {
  constructor() {
    super("Owners", {
      parent: Account,
      primaryKey: "id",
      columns: {
        id: Entity.Column.UUID,
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
        contact_number: {
          type: "Char(11)",
          attributes: "NOT NULL",
        },
        address: {
          type: "VarChar(64)",
          attributes: "NOT NULL",
        },
      },
    });
  }

  async new({
    email,
    username,
    salt,
    hashed_password,

    last_name,
    first_name,
    middle_name,
    contact_number,
    address,
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
          last_name,
          first_name,
          middle_name,
          contact_number,
          address,
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

  async get(params) {
    // if (!this.checkPrimaryKeyInParams(params)) {
    //   return {
    //     status: STATUS.NOT_OK,
    //     message: "Invalid Primary Key",
    //   };
    // }
    // const keysOnly = {};
    // for (const pk of this.primaryKey) {
    //   keysOnly[pk] = params[pk];
    // }
    // const responseOwner = await this.findOne(keysOnly);
    // const responsePets = await this.getRelationshipRecord(Pet, {
    //   owner_id: params.owner_id,
    // });
    // if (
    //   responseOwner.status === STATUS.OK &&
    //   responsePets.status === STATUS.OK
    // ) {
    //   return {
    //     ...responseOwner.data,
    //     pets: responsePets.data,
    //   };
    // } else {
    //   return {
    //     status: responseOwner.status,
    //     message: [responseOwner.message ?? "", responsePets.message ?? ""].join(
    //       ", "
    //     ),
    //   };
    // }
  }

  async getPetsOf(owner_id) {
    // return await Pet.find({
    //   owner_id,
    // });
  }
}

const Owner = new OwnerEntity();

export default Owner;
