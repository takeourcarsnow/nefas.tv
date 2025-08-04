import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Fetch latest 50 messages, newest last
    const { data, error } = await supabase
      .from('shoutbox')
      .select('id, name, message, time')
      .order('id', { ascending: true })
      .limit(50);
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.status(200).json(data);
  } else if (req.method === 'POST') {
    const { name, message } = req.body;
    if (!name || !message) {
      res.status(400).json({ error: 'Name and message are required.' });
      return;
    }
    const { data, error } = await supabase
      .from('shoutbox')
      .insert([
        {
          name: name.substring(0, 32),
          message: message.substring(0, 256),
          time: new Date().toISOString(),
        },
      ])
      .select();
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.status(201).json(data[0]);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
