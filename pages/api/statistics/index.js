import EntityList from "@db/entity/EntityList";

export default async function handler(req, res) {
  const { account, appointment, pet } = EntityList;
  const accounts = await account.execute({
    query: `SELECT account_type, COUNT(*) AS "count" FROM ${account.name} GROUP BY account_type`,
  });
  const appointments = await appointment.execute({
    query: `SELECT COUNT(*) AS "completed" FROM ${appointment.name} WHERE veterinarian_license_no IS NOT NULL`,
  });
  const pets = await pet.execute({
    query: `SELECT COUNT(*) as "count" FROM ${pet.name}`,
  });

  const results = {};

  for (const account of accounts.data) {
    results[account.account_type] = account.count;
  }

  results.completedAppointments = appointments.data[0].completed;
  results.pet = pets.data[0].count;

  res.status(200).json(results);
}
