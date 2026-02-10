import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY; // from Vercel env
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { data, error } = await supabase.from("links").select("*");
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === "POST") {
    const { name, url, category } = req.body;
    if (!name || !url) return res.status(400).json({ error: "Name and URL required" });

    const { data, error } = await supabase.from("links").insert([{ name, url, category }]);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ success: true, data });
  }

  res.status(405).json({ error: "Method not allowed" });
}
