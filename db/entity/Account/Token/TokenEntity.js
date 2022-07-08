import Entity from "@entity/Entity";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

class TokenEntity extends Entity {
  constructor() {
    super("Tokens", {
      primaryKey: "id",
      columns: {
        id: Entity.Column.UUID,
        token: {
          type: "VarChar(512)",
          attributes: "NOT NULL UNIQUE",
        },
      },
    });

    this.addFunction("exists", async (token) => await this.exists(token));
    this.addFunction(
      "invalidate",
      async (token) => await this.invalidate(token)
    );

    this.addFunction("decode", async (token) => await this.decode(token));
  }

  async new({ token }) {
    return await super.new({
      token,
    });
  }

  async exists(token) {
    return !!(await this.findOne({ token }));
  }

  async invalidate(token) {
    const exists = await this.exists(token);

    if (exists) {
      await this.delete({
        token,
      });
    }

    return exists;
  }

  async decode(token) {
    if (await this.exists(token)) {
      try {
        return jwt.verify(token, process.env.JWT_SECRET);
      } catch (e) {
        return null;
      }
    } else {
      return null;
    }
  }
}

const Token = new TokenEntity();

export default Token;
