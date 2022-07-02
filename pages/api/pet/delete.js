import withAccount from "lib/middleware/withAccount";

export default withAccount(
  (req, res) => {
    res.status(200).json({ name: "John Doe" });
  },
  ["owner", "admin"]
);
