import { executeQuery } from "@db/index";

export default async function handler(req, res) {
  console.log(
    await executeQuery({
      query: "SHOW DATABASES;",
    })
  );
  res.status(200).json({ name: "John Doe" });
}
