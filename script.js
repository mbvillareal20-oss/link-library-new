import { createClient } from "@supabase/supabase-js";

// Use environment variables
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function fetchLinks() {
  try {
    const { data, error } = await supabase.from("links").select("*");
    if (error) throw error;

    const linkList = document.getElementById("linkList");
    linkList.innerHTML = "";
    data.forEach(link => {
      const div = document.createElement("div");
      div.className = "link-card";
      div.innerHTML = `<a href="${link.url}" target="_blank">${link.name}</a>
                       <span>${link.category}</span>`;
      linkList.appendChild(div);
    });
  } catch (err) {
    console.error("Error fetching links:", err.message);
  }
}

fetchLinks();
