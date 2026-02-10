document.getElementById("submitLink").addEventListener("click", async () => {
  const name = document.getElementById("newName").value;
  const url = document.getElementById("newURL").value;
  const category = document.getElementById("newCategory").value;

  if (!name || !url) {
    document.getElementById("formMessage").textContent = "Name and URL are required!";
    return;
  }

  try {
    const response = await fetch("/api/add-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, url, category })
    });

    const result = await response.json();

    if (response.ok) {
      document.getElementById("formMessage").textContent = result.message;
      document.getElementById("newName").value = "";
      document.getElementById("newURL").value = "";
      document.getElementById("newCategory").value = "";

      fetchLinks(); // Refresh the list
    } else {
      document.getElementById("formMessage").textContent = result.error;
    }
  } catch (err) {
    console.error(err);
    document.getElementById("formMessage").textContent = "Error adding link.";
  }
});
