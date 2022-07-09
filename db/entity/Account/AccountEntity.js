import Entity from "@entity/Entity";
import Token from "@entity/Account/Token/TokenEntity";
import CryptoJS from "crypto-js";
import STATUS from "@db/status";
import jwt from "jsonwebtoken";

class AccountEntity extends Entity {
  constructor() {
    super("Accounts", {
      primaryKey: "id",
      columns: {
        id: Entity.Column.UUID,
        email: {
          type: "VarChar(64)",
          attributes: "NOT NULL UNIQUE",
        },
        username: {
          type: "VarChar(64)",
          attributes: "NOT NULL",
        },
        salt: {
          type: "VarChar(32)",
          attributes: "NOT NULL",
          default: () => CryptoJS.lib.WordArray.random(128 / 8).toString(),
        },
        hashed_password: {
          type: "VarChar(256)",
          attributes: "NOT NULL",
        },
        created_at: {
          type: "DateTime",
          attributes: "NOT NULL",
          default: () => new Date(),
        },
        account_type: {
          type: "VarChar(64)",
          attributes: "NULL",
        },
      },
      relationships: [
        {
          type: Entity.Relationship.ONE_TO_MANY,
          entity: Token,
          onDelete: Entity.ReferenceOption.SET_NULL,
        },
      ],
    });

    this.addFunction("new", async (account) => await this.new(account));
    this.addFunction(
      "getSalt",
      async (username) => await this.getSalt(username)
    );

    this.addFunction("login", async (login) => await this.login(login));
    this.addFunction("verify", async (token) => await this.verify(token));
  }

  async new({ email, username, hashed_password }) {
    const salt = CryptoJS.lib.WordArray.random(128 / 8).toString();
    hashed_password = CryptoJS.SHA512(hashed_password + salt).toString();

    return await super.new({
      email,
      username,
      salt,
      hashed_password,
    });
  }

  async login({ email, hashed_password }) {
    const response = await this.findOne({
      email,
    });

    if (response.status === STATUS.OK) {
      if (response.data[0]) {
        const account = response.data[0];
        const salt = account.salt;
        const hashed_password_check = CryptoJS.SHA512(
          hashed_password + salt
        ).toString();

        const asForeignKey = [this.getColumn("id").asForeignKey];

        if (account.hashed_password === hashed_password_check) {
          const token = jwt.sign(
            {
              [asForeignKey]: account.id,
              email: account.email,
              account_type: account.account_type,
            },
            process.env.JWT_SECRET
          );

          await this.addRelationshipValue(
            Token.entityType,
            { id: account.id },
            { token_id: (await Token.new({ token })).data[0].id }
          );

          let subtypeDetails = {};

          try {
            const child = Array.from(this.children).find(
              (child) => child.entityType === account.account_type
            );

            if (child) {
              const res = await child.findOne({
                [asForeignKey]: account.id,
              });
              if (res.status === STATUS.OK && res.data[0]) {
                subtypeDetails = res.data[0];
              }
            }
          } catch (e) {}

          return {
            status: STATUS.OK,
            data: {
              token,
              account: {
                id: account.id,
                email: account.email,
                account_type: account.account_type,
                ...subtypeDetails,
              },
            },
          };
        } else {
          return {
            status: STATUS.NOT_OK,
            message: "Wrong Email/Password",
          };
        }
      } else {
        return {
          status: STATUS.NOT_OK,
          message: "Wrong Email/Password",
        };
      }
    } else {
      return {
        status: STATUS.NOT_OK,
        message: "Something went wrong",
      };
    }
  }

  async getAccountDetails(id) {
    const response = await this.findOne({
      id,
    });

    if (response.status === STATUS.OK && response.data[0]) {
      const account = response.data[0];
      let subtypeDetails = {};

      try {
        const child = Array.from(this.children).find(
          (child) => child.entityType === account.account_type
        );

        if (child) {
          const asForeignKey = [this.getColumn("id").asForeignKey];
          const res = await child.findOne({
            [asForeignKey]: account.id,
          });
          if (res.status === STATUS.OK && res.data[0]) {
            subtypeDetails = res.data[0];
          }
        }
      } catch (e) {}

      return {
        id: account.id,
        email: account.email,
        account_type: account.account_type,
        ...subtypeDetails,
      };
    } else {
      return null;
    }
  }

  async verify(token) {
    const exists = await Token.exists(token);

    if (!exists) {
      return false;
    }

    try {
      const { username, account_type } = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      const valid = !!(await this.findOne({
        username,
        account_type,
      }));

      if (!valid) {
        await Token.invalidate(token);
      }

      return valid;
    } catch (e) {
      return false;
    }
  }

  async getSalt(email) {
    const account = await this.findOne({
      email,
    });

    if (account) {
      return {
        email,
        salt: account.salt,
      };
    } else {
      return null;
    }
  }
}

const Account = new AccountEntity();

export default Account;
