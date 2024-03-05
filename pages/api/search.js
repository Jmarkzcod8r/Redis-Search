import { searchCars } from "../../lib/redis";

export default async function handler(req, res) {
  console.log('req query',req.query.q)
  const q = req.query.q;
  const cars = await searchCars(q);
  // res.status(200).json({ cars });
  res.send({ cars });
}
