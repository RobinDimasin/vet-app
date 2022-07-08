import EntityList from "@db/entity/EntityList";
import STATUS from "@db/status";
import { serialize } from "cookie";

const withAccount = (handler, allowedTypes = []) => {
  return async (req, res) => {
    const { jwt: token } = req.cookies;

    if (token) {
      const tokenDecoded = await EntityList.token.decode(token);

      if (tokenDecoded) {
        const { account_type } = tokenDecoded;

        if (account_type && allowedTypes.includes(account_type)) {
          await handler(
            req,
            res,
            await EntityList.account.getAccountDetails(tokenDecoded.account_id)
          );
        } else {
          res
            .status(401)
            .json({ status: STATUS.NOT_OK, message: "Not authorized" });
        }
      } else {
        const resetCookie = serialize("jwt", "", {
          maxAge: -1,
          path: "/",
        });

        res.setHeader("Set-Cookie", [resetCookie]);
        res
          .status(401)
          .json({ status: STATUS.NOT_OK, message: "Invalid Token" });
      }
    } else {
      res.status(401).json({ status: STATUS.NOT_OK, message: "Token is null" });
    }
  };
};

export default withAccount;
