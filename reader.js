// ===== reader.js (з налаштуваннями ширини, фону та багатомовністю) =====
const urlParams = new URLSearchParams(window.location.search);
const mangaId = parseInt(urlParams.get("id"));

const titleEl = document.getElementById("mangaTitle");
const pagesContainer = document.getElementById("pagesContainer");
const chapterNumber = document.getElementById("chapterNumber");
const pageCount = document.getElementById("pageCount");
const chapterSelect = document.getElementById("chapterSelect");
const prevBtn = document.getElementById("prevChapter");
const nextBtn = document.getElementById("nextChapter");

// === Елементи налаштувань ===
const settingsToggle = document.getElementById("settingsToggle");
const settingsPanel = document.getElementById("settingsPanel");
const widthSlider = document.getElementById("widthSlider");
const widthValue = document.getElementById("widthValue");
const bgColorSelect = document.getElementById("bgColorSelect");
const resetBtn = document.getElementById("resetSettingsBtn");
const readerContainer = document.getElementById("readerContainer");

let mangaData = null;
let chapters = [];
let currentChapterIndex = 0;

// ===== НАЛАШТУВАННЯ (збереження в localStorage) =====
const SETTINGS_KEY = "manga_reader_settings";

function loadSettings() {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      const settings = JSON.parse(saved);
      return settings;
    }
  } catch (e) {}
  return { width: 80, bgColor: "#0d0d0d" };
}

function saveSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {}
}

function applySettings(settings) {
  // Ширина
  widthSlider.value = settings.width;
  widthValue.textContent = settings.width + "%";
  readerContainer.style.maxWidth = settings.width + "%";

  // Фон
  bgColorSelect.value = settings.bgColor;
  document.body.style.backgroundColor = settings.bgColor;
  pagesContainer.style.backgroundColor = settings.bgColor;
}

// ===== ПАНЕЛЬ НАЛАШТУВАНЬ =====
settingsToggle.addEventListener("click", () => {
  settingsPanel.classList.toggle("open");
  settingsToggle.classList.toggle("active");
});

// Повзунок ширини
widthSlider.addEventListener("input", function () {
  const value = this.value;
  widthValue.textContent = value + "%";
  readerContainer.style.maxWidth = value + "%";

  const settings = loadSettings();
  settings.width = parseInt(value);
  saveSettings(settings);
});

// Вибір фону
bgColorSelect.addEventListener("change", function () {
  const color = this.value;
  document.body.style.backgroundColor = color;
  pagesContainer.style.backgroundColor = color;

  const settings = loadSettings();
  settings.bgColor = color;
  saveSettings(settings);
});

// Скидання налаштувань
resetBtn.addEventListener("click", () => {
  const defaultSettings = { width: 80, bgColor: "#0d0d0d" };
  saveSettings(defaultSettings);
  applySettings(defaultSettings);
  settingsPanel.classList.remove("open");
  settingsToggle.classList.remove("active");
});

// ===== ПЕРЕМИКАЧ МОВ =====
document.addEventListener("DOMContentLoaded", function () {
  const langSelect = document.getElementById("languageSelect");
  if (langSelect) {
    langSelect.value = currentLanguage;
    langSelect.addEventListener("change", function () {
      setLanguage(this.value);
      updateReaderTexts();
      // Оновлюємо відображення глави (номер та сторінки)
      if (chapters.length > 0) {
        updateChapterDisplay(currentChapterIndex);
      }
    });
  }

  // Оновлюємо тексти при завантаженні
  updateReaderTexts();
});

// Оновлення текстів читалки
function updateReaderTexts() {
  // Оновлюємо всі елементи з data-i18n
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const translation = t(key);
    if (translation) {
      el.textContent = translation;
    }
  });

  // Оновлюємо placeholders
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    const translation = t(key);
    if (translation) {
      el.placeholder = translation;
    }
  });

  // Оновлюємо titles
  document.querySelectorAll("[data-i18n-title]").forEach((el) => {
    const key = el.getAttribute("data-i18n-title");
    const translation = t(key);
    if (translation) {
      el.title = translation;
    }
  });

  // Оновлюємо aria-labels
  document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
    const key = el.getAttribute("data-i18n-aria");
    const translation = t(key);
    if (translation) {
      el.setAttribute("aria-label", translation);
    }
  });

  // Оновлюємо селектор мови
  const langSelect = document.getElementById("languageSelect");
  if (langSelect) {
    langSelect.value = currentLanguage;
  }

  // Оновлюємо відображення глави, якщо дані завантажені
  if (chapters.length > 0) {
    updateChapterDisplay(currentChapterIndex);
  }
}

// Отримуємо назву манги в поточній мові
function getDisplayTitle(manga) {
  return getMangaTitle(manga);
}

// ===== ЗАВАНТАЖЕННЯ ДАНИХ =====
async function loadMangaData() {
  if (!mangaId) {
    pagesContainer.innerHTML = `
      <p style="text-align:center; padding:50px; color:#ff6b6b;">
        ${t("no_id")}
      </p>
    `;
    return;
  }

  try {
    const res = await fetch("mangas.json");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    mangaData = data.mangas.find((m) => m.id === mangaId);

    if (!mangaData) {
      pagesContainer.innerHTML = `
        <p style="text-align:center; padding:50px;">
          ${t("manga_not_found")}
        </p>
      `;
      return;
    }

    titleEl.textContent = getMangaTitle(mangaData);
    chapters = mangaData.chapters || [];

    if (chapters.length === 0) {
      pagesContainer.innerHTML = `
        <p style="text-align:center; padding:50px;">
          ${t("reader_no_chapters")}
        </p>
      `;
      return;
    }

    // Сортуємо за номером
    chapters.sort((a, b) => a.number - b.number);

    // Заповнюємо випадаючий список
    populateChapterSelect();

    // Застосовуємо налаштування
    const settings = loadSettings();
    applySettings(settings);

    // ВІДКРИВАЄМО ПЕРШУ ГЛАВУ
    currentChapterIndex = 0;
    loadChapter(currentChapterIndex);

    // Оновлюємо тексти після завантаження
    updateReaderTexts();
  } catch (err) {
    console.error("Помилка:", err);
    pagesContainer.innerHTML = `
      <div style="text-align:center; padding:50px; color:#ff6b6b;">
        <h2>${t("reader_error")}</h2>
        <p>${err.message}</p>
        <button onclick="loadMangaData()" style="padding:10px 25px; background:#ff6b6b; border:none; border-radius:8px; color:#fff; cursor:pointer; margin-top:15px;">
          ${t("reader_retry")}
        </button>
      </div>
    `;
  }
}

// ===== ЗАПОВНЕННЯ ВИПАДАЮЧОГО СПИСКУ =====
function populateChapterSelect() {
  chapterSelect.innerHTML = "";

  chapters.forEach((ch, index) => {
    const option = document.createElement("option");
    option.value = index;
    const title = ch.title ? `: ${ch.title}` : "";
    option.textContent = `${t("reader_chapter")} ${ch.number}${title}`;
    chapterSelect.appendChild(option);
  });
}

// ===== ОНОВЛЕННЯ ВІДОБРАЖЕННЯ ГЛАВИ =====
function updateChapterDisplay(index) {
  if (index < 0 || index >= chapters.length) return;

  const chapter = chapters[index];
  chapterNumber.textContent = `${t("reader_chapter")} ${chapter.number}`;
  chapterSelect.value = index;

  const pages = chapter.pages || [];
  const pagesText = t("reader_pages");
  pageCount.textContent =
    pages.length > 0 ? `${pages.length} ${pagesText}` : "";
}

// ===== ЗАВАНТАЖЕННЯ ГЛАВИ =====
function loadChapter(index) {
  if (index < 0 || index >= chapters.length) return;

  currentChapterIndex = index;
  const chapter = chapters[index];

  // Оновлюємо відображення
  updateChapterDisplay(index);

  // Оновлюємо кнопки
  prevBtn.disabled = index === 0;
  nextBtn.disabled = index === chapters.length - 1;

  const pages = chapter.pages || [];

  if (pages.length === 0) {
    pagesContainer.innerHTML = `
      <p style="text-align:center; padding:50px;">
        ${t("reader_no_pages")}
      </p>
    `;
    return;
  }

  // Показуємо завантаження
  pagesContainer.innerHTML = `
    <p style="text-align:center; padding:50px;">
      ${t("chapter_loading")}
    </p>
  `;

  // Рендеримо сторінки з невеликою затримкою для відображення завантаження
  setTimeout(() => {
    pagesContainer.innerHTML = pages
      .map(
        (pageUrl, i) => `
          <img src="${pageUrl}" alt="Сторінка ${i + 1}" loading="lazy"
               onerror="this.style.display='none'" />
        `,
      )
      .join("");

    // Скролимо до верху
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, 300);
}

// ===== ОБРОБНИКИ ПОДІЙ =====

// Випадаючий список
chapterSelect.addEventListener("change", function () {
  const index = parseInt(this.value);
  if (!isNaN(index) && index !== currentChapterIndex) {
    loadChapter(index);
  }
});

// Кнопки навігації
prevBtn.addEventListener("click", () => {
  if (currentChapterIndex > 0) {
    loadChapter(currentChapterIndex - 1);
  }
});

nextBtn.addEventListener("click", () => {
  if (currentChapterIndex < chapters.length - 1) {
    loadChapter(currentChapterIndex + 1);
  }
});

// Клавіатурні стрілки
document.addEventListener("keydown", (e) => {
  if (e.target.tagName === "SELECT" || e.target.tagName === "INPUT") return;

  if (e.key === "ArrowLeft" || e.key === "PageUp") {
    e.preventDefault();
    prevBtn.click();
  } else if (e.key === "ArrowRight" || e.key === "PageDown") {
    e.preventDefault();
    nextBtn.click();
  } else if (e.key === "Home") {
    e.preventDefault();
    loadChapter(0);
  } else if (e.key === "End") {
    e.preventDefault();
    loadChapter(chapters.length - 1);
  }
});

// Кнопка скролу до верху
function addScrollTopButton() {
  const btn = document.createElement("button");
  btn.className = "scroll-top-btn";
  btn.innerHTML = "⬆";
  btn.setAttribute("data-i18n-title", "reader_scroll_top");
  btn.title = "До верху";
  btn.setAttribute("aria-label", "Прокрутити до верху");
  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  document.body.appendChild(btn);
}
addScrollTopButton();

// ===== ПРИХОВУВАННЯ ВСІЄЇ ШАПКИ ПРИ СКРОЛІ =====
let lastScrollTop = 0;
const headerElement = document.querySelector("header"); // Тепер вибираємо весь header

window.addEventListener(
  "scroll",
  function () {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Якщо скролимо вниз і прокрутили більше 50px
    if (scrollTop > lastScrollTop && scrollTop > 50) {
      headerElement.classList.add("hidden-on-scroll");

      // Закриваємо панель налаштувань, щоб не заважала
      if (settingsPanel.classList.contains("open")) {
        settingsPanel.classList.remove("open");
        settingsToggle.classList.remove("active");
      }
    } else {
      // Якщо скролимо вгору - повертаємо
      headerElement.classList.remove("hidden-on-scroll");
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  },
  false,
);

// ===== ЗАПУСК =====
loadMangaData();
