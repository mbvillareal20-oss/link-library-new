import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// Use environment variables for production (Vercel)
const SUPABASE_URL = "https://cqxuxfnhjmtxnmwkwzpj.supabase.co";
const SUPABASE_KEY = "sbp_d4331e29666c651a23d5add1938c39edd092bdb4";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const linkList = document.getElementById('linkList');
const submitButton = document.getElementById('submitLink');
const formMessage = document.getElementById('formMessage');

async function fetchLinks() {
    const { data, error } = await supabase
        .from('links')
        .select('*')
        .order('created_at', { ascending: false });
    
    if (error) {
        linkList.innerHTML = `<p>Error fetching links: ${error.message}</p>`;
        return;
    }

    linkList.innerHTML = data.map(link => `
        <div class="link-card">
            <a href="${link.url}" target="_blank">${link.name}</a>
            <span>${link.category}</span>
        </div>
    `).join('');
}

submitButton.addEventListener('click', async () => {
    const name = document.getElementById('newName').value.trim();
    const url = document.getElementById('newURL').value.trim();
    const category = document.getElementById('newCategory').value.trim();

    if (!name || !url) {
        formMessage.textContent = "Name and URL are required!";
        return;
    }

    const { data, error } = await supabase
        .from('links')
        .insert([{ name, url, category }]);

    if (error) {
        formMessage.textContent = `Error: ${error.message}`;
        return;
    }

    document.getElementById('newName').value = '';
    document.getElementById('newURL').value = '';
    document.getElementById('newCategory').value = '';
    formMessage.textContent = "Link added successfully!";
    fetchLinks();
});

// Load links on page load
fetchLinks();
