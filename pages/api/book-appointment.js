// pages/api/book-appointment.js
import axios from 'axios';

export default async function handler(req, res) {
  const {
    name, email, mobile,
    product, message, date, time_slot,
  } = req.body;

  if (!name || !email || !date || !time_slot) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const auth = Buffer.from(
      `${process.env.WP_USER}:${process.env.WP_APP_PASSWORD}`
    ).toString('base64');

    const wpRes = await axios.post(
      `${process.env.WP_SITE_URL}/wp-json/wp/v2/appointment`,
      {
        title: `${name} on ${date} @ ${time_slot}`,
        status: 'publish',
        fields: {
          name,
          email,
          mobile,
          product,
          message,
          date,
          time_slot,
        },
      },
      {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error submitting appointment:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to book appointment' });
  }
}
