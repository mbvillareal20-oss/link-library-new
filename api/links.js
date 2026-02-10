import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
    if (req.method === "GET") {
        try {
            const { data, error } = await supabase.from("links").select("*").order("id", { ascending: false });
            if (error) throw error;
            res.status(200).json(data);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    } else if (req.method === "POST") {
        const { name, url, category } = req.body;
        if (!name || !url) {
            return res.status(400).json({ error: "Name and URL are required" });
        }
        try {
            const { data, error } = await supabase.from("links").insert([{ name, url, category }]);
            if (error) throw error;
            res.status(200).json({ message: "Link added successfully", data });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    } else {
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
