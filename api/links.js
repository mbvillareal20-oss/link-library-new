import { createClient } from "@supabase/supabase-js";

// Supabase keys from environment variables
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, url, category } = req.body;

  if (!name || !url) {
    return res.status(400).json({ error: "Name and URL are required" });
  }

  try {
    const { data, error } = await supabase.from("links").insert([
      { name, url, category }
    ]);

    if (error) throw error;

    return res.status(200).json({ message: "Link added successfully", data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
