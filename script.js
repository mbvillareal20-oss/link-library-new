// Supabase setup
const SUPABASE_URL = "https://cqxuxfnhjmtxnmwkwzpj.supabase.co"; // your project URL
const SUPABASE_KEY = "sbp_d4331e29666c651a23d5add1938c39edd092bdb4"; // your secret key

// Supabase client
const supabase = supabaseJsClient(SUPABASE_URL, SUPABASE_KEY);

// DOM elements
const newName = document.getElementById("newName");
const newURL = document.getElementById("newURL");
const newCategory = document.getElementById("newCategory");
const submitButton = document.getElementById("submitLink");
const formMessage = document.getElementById("formMessage");
const linkList = document.getElementById("linkList");

// Add link
submitButton.addEventListener("click", async () => {
  const Name = newName.value.trim();
  const URL = newURL.value.trim();
  const Category = newCategory.value.trim();

  if (!Name || !URL || !Category) {
    formMessage.textContent = "⚠️ All fields are required!";
    formMessage.style.color = "red";
    return;
  }

  const { data, error } = await supabase
    .from("links") // replace with your table name
    .insert([{ Name, URL, Category }]);

  if (error) {
    formMessage.textContent = "❌ Error adding link: " + error.message;
    formMessage.style.color = "red";
    console.error(error);
  } else {
    formMessage.textContent = "✅ Link added successfully!";
    formMessage.style.color = "green";
    newName.value = "";
    newURL.value = "";
    newCategory.value = "";
    fetchLinks(); // refresh
  }
});

// Fetch and display all links
async function fetchLinks() {
  const { data, error } = await supabase
    .from("links")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("Error fetching links:", error);
    return;
  }

  linkList.innerHTML = "";
  data.forEach(item => {
    const card = document.createElement("div");
    card.classList.add("link-card");
    card.innerHTML = `<a href="${item.URL}" target="_blank">${item.Name}</a>
                      <span>${item.Category}</span>`;
    linkList.appendChild(card);
  });
}

// Initial load
fetchLinks();

/**
 * Minimal Supabase JS client
 */
function supabaseJsClient(url, key) {
  return {
    from: (table) => ({
      select: async () => {
        const res = await fetch(`${url}/rest/v1/${table}?select=*`, {
          headers: {
            "apikey": key,
            "Authorization": "Bearer " + key
          }
        });
        const data = await res.json();
        return { data, error: null };
      },
      insert: async (rows) => {
        const res = await fetch(`${url}/rest/v1/${table}`, {
          method: "POST",
          headers: {
            "apikey": key,
            "Authorization": "Bearer " + key,
            "Content-Type": "application/json",
            "Prefer": "return=representation"
          },
          body: JSON.stringify(rows)
        });
        const data = await res.json();
        return { data, error: null };
      },
      order: function(){ return this; } // dummy for chaining
    })
  };
}
