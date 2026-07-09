import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchWeather } from '@/lib/flightApi';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { lat, lon } = req.query;
  const latitude = Number(lat);
  const longitude = Number(lon);

  if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
    return res.status(400).json({ error: 'lat and lon required' });
  }

  try {
    const weather = await fetchWeather(latitude, longitude);
    return res.status(200).json(weather);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch weather' });
  }
}
