import EntityList from "@db/entity/EntityList";

export default async function handler(req, res) {
  const account = EntityList.account;
  const appointment = EntityList.appointment;
  const accounts = await account.execute({
    query: `SELECT account_type, COUNT(*) AS "count" FROM ${account.name} GROUP BY account_type`,
  });
  const appointments = await appointment.execute({
    query: `SELECT COUNT(*) AS "completed" FROM ${appointment.name} WHERE veterinarian_license_no IS NOT NULL`,
  });

  const results = {};

  for (const account of accounts.data) {
    results[account.account_type] = account.count;
  }

  results.completedAppointments = appointments.data[0].completed;

  res.status(200).json(results);
}
