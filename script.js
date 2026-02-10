const linkList = document.getElementById("linkList");
const submitBtn = document.getElementById("submitLink");

async function fetchLinks() {
  try {
    const res = await fetch("/api/links");
    const data = await res.json();
    linkList.innerHTML = "";
    data.forEach(link => {
      const div = document.createElement("div");
      div.className = "link-card";
      div.innerHTML = `<a href="${link.url}" target="_blank">${link.name}</a> <span>${link.category || ""}</span>`;
      linkList.appendChild(div);
    });
  } catch (err) {
    console.error("Error fetching links:", err);
  }
}

submitBtn.addEventListener("click", async () => {
  const name = document.getElementById("newName").value;
  const url = document.getElementById("newURL").value;
  const category = document.getElementById("newCategory").value;

  try {
    const res = await fetch("/api/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, url, category })
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    fetchLinks(); // refresh list
    alert("Link added successfully!");
  } catch (err) {
    console.error("Error adding link:", err);
    alert("Error adding link.");
  }
});

fetchLinks(); // load on page load
