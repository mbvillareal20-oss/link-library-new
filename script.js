// Supabase client
const SUPABASE_URL = "https://cqxuxfnhjmtxnmwkwzpj.supabase.co";
const SUPABASE_KEY = "sbp_d4331e29666c651a23d5add1938c39edd092bdb4";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// DOM Elements
const linkList = document.getElementById("linkList");
const submitLink = document.getElementById("submitLink");
const newName = document.getElementById("newName");
const newURL = document.getElementById("newURL");
const newCategory = document.getElementById("newCategory");
const formMessage = document.getElementById("formMessage");

// Load links on page load
async function loadLinks() {
  const { data, error } = await supabase
    .from("links")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    formMessage.textContent = "Error loading links.";
    console.error(error);
    return;
  }

  linkList.innerHTML = "";
  data.forEach((link) => {
    const div = document.createElement("div");
    div.className = "link-card";
    div.innerHTML = `
      <a href="${link.url}" target="_blank">${link.name}</a>
      <span>${link.category}</span>
    `;
    linkList.appendChild(div);
  });
}

// Add a new link
submitLink.addEventListener("click", async () => {
  const name = newName.value.trim();
  const url = newURL.value.trim();
  const category = newCategory.value.trim();

  if (!name || !url) {
    formMessage.textContent = "Name and URL are required!";
    return;
  }

  const { data, error } = await supabase.from("links").insert([
    { name, url, category }
  ]);

  if (error) {
    formMessage.textContent = "Error adding link!";
    console.error(error);
    return;
  }

  newName.value = "";
  newURL.value = "";
  newCategory.value = "";
  formMessage.textContent = "Link added!";
  loadLinks();
});

// Initial load
loadLinks();
