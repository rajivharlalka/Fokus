import type { NextApiRequest, NextApiResponse } from 'next';
import { searchFlight } from '@/lib/flightApi';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Flight number required' });
  }

  try {
    const flight = await searchFlight(id);
    // Avoid burning the limited AviationStack quota on repeated page loads/autocomplete.
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=900');
    return res.status(200).json(flight);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch flight' });
  }
}
