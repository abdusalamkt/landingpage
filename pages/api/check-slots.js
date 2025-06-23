// pages/api/check-slots.js
import axios from 'axios';

const allSlots = [
  '10:00 AM', '11:00 AM', '12:00 PM',
  '2:00 PM', '3:00 PM', '4:00 PM',
];

export default async function handler(req, res) {
  const { date } = req.query;

  if (!date) return res.status(400).json({ error: 'Missing date' });

  try {
    const wpRes = await axios.get(
      `${process.env.WP_SITE_URL}/wp-json/wp/v2/appointment`,
      {
        params: {
          per_page: 100,
          meta_key: 'date',
          meta_value: date,
        },
      }
    );

    const bookedSlots = wpRes.data.map(post => post.acf?.time_slot).filter(Boolean);

    const available = allSlots.filter(slot => !bookedSlots.includes(slot));

    res.status(200).json({ available });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to check slots' });
  }
}
