import mysql from "mysql2";
import util from "util";
import dotenv from "dotenv";
import STATUS from "./status";
dotenv.config();

const conn = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,

  database: process.env.MYSQL_DATABASE,

  multipleStatements: true,
});

const queryAsync = util.promisify(conn.query).bind(conn);

export const executeQuery = async ({ query, values = [] }) => {
  try {
    let q = "";

    query.split("?").forEach((part, idx) => {
      q += part;

      if (idx < values.length) {
        const v = values[idx];
        if (typeof v === "string") {
          q += `'${v}'`;
        } else {
          q += v;
        }
      }
    });

    // if (q.includes("CHECK") || true) {
    //   console.log(q);
    //   console.log();
    // }

    const data = await queryAsync(query, values);
    return {
      status: STATUS.OK,
      data,
    };
  } catch (error) {
    return {
      status: STATUS.NOT_OK,
      message: error.message,
    };
  }
};
