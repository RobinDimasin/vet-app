export default function handler(req, res) {
  if (req.method === "POST") {
  } else {
    res
      .send(405)
      .json({ status: STATUS.NOT_OK, message: "Method not allowed" });
  }
}
