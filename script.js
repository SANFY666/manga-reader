// ===== script.js (робота з JSON-файлом + багатомовність) =====
let allMangas = [];
let currentPage = 1;
const ITEMS_PER_PAGE = 12;

const catalog = document.getElementById("catalog");
const pagination = document.getElementById("pagination");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const mangaCount = document.getElementById("mangaCount");

// ===== ЗАВАНТАЖЕННЯ ДАНИХ =====
async function loadMangas() {
  try {
    const res = await fetch("mangas.json");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    allMangas = data.mangas || [];
    mangaCount.textContent = allMangas.length;
    renderPage(1);
  } catch (err) {
    console.error("Помилка завантаження:", err);
    catalog.innerHTML = `
            <div style="text-align:center; padding:50px; color:#ff6b6b;">
                <h2>${t("loading_error")}</h2>
                <p>${err.message}</p>
                <p style="font-size:14px; color:#888; margin-top:10px;">
                    ${t("no_results_hint")}
                </p>
                <button onclick="loadMangas()" style="padding:10px 25px; background:#ff6b6b; border:none; border-radius:8px; color:#fff; cursor:pointer; margin-top:15px;">
                    ${t("retry_button")}
                </button>
            </div>
        `;
  }
}

// ===== ФІЛЬТРАЦІЯ ТА ПАГІНАЦІЯ =====
function getFilteredMangas() {
  const query = searchInput.value.trim().toLowerCase();
  if (!query) return allMangas;

  return allMangas.filter(
    (m) =>
      m.title.toLowerCase().includes(query) ||
      (m.title_ua && m.title_ua.toLowerCase().includes(query)) ||
      m.genres.some((g) => g.toLowerCase().includes(query)),
  );
}

function renderPage(page) {
  const filtered = getFilteredMangas();
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  if (page > totalPages) page = totalPages;
  if (page < 1) page = 1;
  currentPage = page;

  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const pageItems = filtered.slice(start, end);

  renderCatalog(pageItems);
  renderPagination(totalPages, page);
}

// ===== ВІДОБРАЖЕННЯ КАРТОК =====
function renderCatalog(mangas) {
  if (!mangas || mangas.length === 0) {
    catalog.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📚</div>
        <h2>${t("no_results")}</h2>
        <p>${t("no_results_hint")}</p>
      </div>
    `;
    return;
  }

  catalog.innerHTML = mangas
    .map((manga) => {
      // Отримуємо назву в поточній мові
      const displayTitle = getMangaTitle(manga);
      const altTitles = getAlternativeTitles(manga);

      const statusClass =
        manga.status === "Онґоїнг" || manga.status === "Ongoing"
          ? "status-ongoing"
          : manga.status === "Завершено" || manga.status === "Completed"
            ? "status-completed"
            : "status-frozen";

      const statusText = translateStatus(manga.status);

      const genres = manga.genres.slice(0, 3);
      const extraGenres = manga.genres.length > 3 ? manga.genres.length - 3 : 0;

      // Формуємо HTML для альтернативних назв
      const altTitlesHtml =
        altTitles.length > 0
          ? `<div class="alt-titles" title="${altTitles.join(" • ")}">
             ${altTitles
               .slice(0, 2)
               .map((t) => `<span>${t}</span>`)
               .join("")}
             ${altTitles.length > 2 ? `<span class="extra">+${altTitles.length - 2}</span>` : ""}
           </div>`
          : "";

      return `
        <div class="manga-card" onclick="openManga(${manga.id})">
          <div class="image-wrapper">
            <img 
              src="${manga.cover}" 
              alt="${displayTitle}" 
              loading="lazy"
              onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22280%22%3E%3Crect width=%22200%22 height=%22280%22 fill=%22%23181825%22/%3E%3Ctext x=%2250%%22 y=%2250%%22 text-anchor=%22middle%22 dy=%22.3em%22 font-family=%22Inter,sans-serif%22 font-size=%2218%22 fill=%22%236a6a85%22%3E📖%3C/text%3E%3C/svg%3E'"
            />
          </div>
          <div class="info">
            <h3>${displayTitle}</h3>
            ${altTitlesHtml}
            <div class="genres">
              ${genres.map((g) => `<span>${g}</span>`).join("")}
              ${extraGenres > 0 ? `<span class="extra">+${extraGenres}</span>` : ""}
            </div>
            <span class="status ${statusClass}">${statusText}</span>
          </div>
        </div>
      `;
    })
    .join("");
}

// ===== ПАГІНАЦІЯ =====
function renderPagination(totalPages, current) {
  if (totalPages <= 1) {
    pagination.innerHTML = "";
    return;
  }

  let html = "";
  const maxVisible = 7;
  let start = Math.max(1, current - 3);
  let end = Math.min(totalPages, start + maxVisible - 1);

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1);
  }

  if (start > 1) {
    html += `<button onclick="goToPage(1)">1</button>`;
    if (start > 2) html += `<span>...</span>`;
  }

  for (let i = start; i <= end; i++) {
    html += `<button onclick="goToPage(${i})" class="${i === current ? "active" : ""}">${i}</button>`;
  }

  if (end < totalPages) {
    if (end < totalPages - 1) html += `<span>...</span>`;
    html += `<button onclick="goToPage(${totalPages})">${totalPages}</button>`;
  }

  pagination.innerHTML = html;
}

function goToPage(page) {
  renderPage(page);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ===== ПОШУК =====
searchBtn.addEventListener("click", () => renderPage(1));
searchInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") renderPage(1);
});

// ===== ВІДКРИТТЯ МАНГИ =====
function openManga(mangaId) {
  window.location.href = `reader.html?id=${mangaId}`;
}

// ===== ДОДАВАННЯ МАНГИ (збереження в JSON) =====
const modal = document.getElementById("addModal");
const addBtn = document.getElementById("addMangaBtn");
const closeBtn = document.querySelector(".close-modal");
const form = document.getElementById("addMangaForm");

addBtn.addEventListener("click", () => (modal.style.display = "block"));
closeBtn.addEventListener("click", () => (modal.style.display = "none"));
window.addEventListener("click", (e) => {
  if (e.target === modal) modal.style.display = "none";
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const newManga = {
    id: Date.now(),
    title: document.getElementById("newTitle").value,
    title_ua:
      document.getElementById("newTitleUa").value ||
      document.getElementById("newTitle").value,
    description:
      document.getElementById("newDescription").value || "Опис відсутній",
    genres: document
      .getElementById("newGenres")
      .value.split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    cover:
      document.getElementById("newCover").value ||
      "https://via.placeholder.com/200x280?text=New+Manga",
    author: document.getElementById("newAuthor").value || "Невідомий автор",
    status: document.getElementById("newStatus").value,
    chapters: [],
  };

  allMangas.push(newManga);

  try {
    const response = await fetch("save-manga.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mangas: allMangas }),
    });

    if (response.ok) {
      mangaCount.textContent = allMangas.length;
      renderPage(1);
      modal.style.display = "none";
      form.reset();
      alert(t("modal_success"));
    } else {
      throw new Error("Помилка збереження");
    }
  } catch (err) {
    alert(t("modal_error"));
    console.error(err);
    mangaCount.textContent = allMangas.length;
    renderPage(1);
    modal.style.display = "none";
    form.reset();
  }
});

// ===== ПЕРЕМИКАЧ МОВ (оновлений) =====
document.addEventListener("DOMContentLoaded", function () {
  const langSelect = document.getElementById("languageSelect");
  if (langSelect) {
    langSelect.value = currentLanguage;
    langSelect.addEventListener("change", function () {
      setLanguage(this.value);
      updateAllTexts();
      // Перезавантажуємо каталог для оновлення назв
      renderPage(currentPage);
    });
  }

  updateAllTexts();
});

// ===== СТАРТ =====
loadMangas();
