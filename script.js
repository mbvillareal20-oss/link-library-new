const linkList = document.getElementById("linkList");
const submitBtn = document.getElementById("submitLink");
const formMessage = document.getElementById("formMessage");

async function fetchLinks() {
  try {
    const res = await fetch("/api/links");
    const data = await res.json();
    linkList.innerHTML = "";
    data.forEach(link => {
      const div = document.createElement("div");
      div.className = "link-card";
      div.innerHTML = `
        <a href="${link.url}" target="_blank">${link.name}</a>
        <span>${link.category || ""}</span>
      `;
      linkList.appendChild(div);
    });
  } catch (err) {
    console.error("Error fetching links:", err);
    formMessage.textContent = "Error fetching links";
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
    if (data.error) {
      formMessage.textContent = `Error adding link: ${data.error}`;
      return;
    }

    formMessage.textContent = "Link added successfully!";
    document.getElementById("newName").value = "";
    document.getElementById("newURL").value = "";
    document.getElementById("newCategory").value = "";
    fetchLinks();
  } catch (err) {
    console.error(err);
    formMessage.textContent = "Error adding link.";
  }
});

// Load links on page load
fetchLinks();
