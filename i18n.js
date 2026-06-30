// ===== i18n.js =====
const translations = {
  uk: {
    // Головна сторінка
    app_title: "📖 Manga Reader",
    search_placeholder: "Пошук манги за назвою...",
    search_button: "🔍",
    add_manga_button: "➕ Додати мангу",
    footer_text: "📚 Власна база даних • Кількість манг:",
    no_results: "😕 Нічого не знайдено",
    no_results_hint: "Спробуйте змінити пошук або додайте нові манги",
    loading_error: "❌ Помилка завантаження бази даних",
    retry_button: "🔄 Оновити",
    manga_count: "Манги",

    // Модальне вікно
    modal_title: "➕ Додати нову мангу",
    modal_title_label: "Назва",
    modal_title_ua_label: "Назва (українською)",
    modal_description_label: "Опис",
    modal_genres_label: "Жанри (через кому, наприклад: Екшн, Драма)",
    modal_cover_label: "URL обкладинки",
    modal_author_label: "Автор",
    modal_status_label: "Статус",
    modal_status_ongoing: "Онґоїнг",
    modal_status_completed: "Завершено",
    modal_status_frozen: "Заморожено",
    modal_submit: "➕ Додати",
    modal_close: "Закрити",
    modal_success: "✅ Мангу додано успішно!",
    modal_error: "❌ Помилка збереження. Мангу додано лише тимчасово.",

    // Читалка
    reader_back: "← Назад",
    reader_loading: "Завантаження...",
    reader_prev: "◀",
    reader_next: "▶",
    reader_prev_title: "Попередня глава",
    reader_next_title: "Наступна глава",
    reader_select_chapter: "Вибір глави",
    reader_chapter: "Глава",
    reader_pages: "стор.",
    reader_no_pages: "😕 У цій главі немає сторінок",
    reader_no_chapters: "😕 Немає доступних глав",
    reader_error: "❌ Помилка завантаження",
    reader_retry: "🔄 Повторити",
    reader_scroll_top: "До верху",
    reader_settings: "⚙️ Налаштування",

    // Налаштування читалки
    settings_width: "Ширина контейнера:",
    settings_narrow: "Вузько",
    settings_wide: "Широко",
    settings_bg: "Фон:",
    settings_bg_dark: "Темний",
    settings_bg_darker: "Дуже темний",
    settings_bg_gray: "Сірий",
    settings_bg_sepia: "Світлий (сепія)",
    settings_bg_white: "Білий",
    settings_reset: "↺ Скинути",

    // Статуси
    status_ongoing: "Онґоїнг",
    status_completed: "Завершено",
    status_frozen: "Заморожено",

    // Повідомлення
    manga_not_found: "😕 Мангу не знайдено",
    chapter_loading: "⏳ Завантаження сторінок...",
    no_id: "❌ ID манги не вказано",
  },

  en: {
    // Main page
    app_title: "📖 Manga Reader",
    search_placeholder: "Search manga by title...",
    search_button: "🔍",
    add_manga_button: "➕ Add manga",
    footer_text: "📚 Own database • Manga count:",
    no_results: "😕 Nothing found",
    no_results_hint: "Try changing your search or add new manga",
    loading_error: "❌ Database loading error",
    retry_button: "🔄 Retry",
    manga_count: "Manga",

    // Modal
    modal_title: "➕ Add new manga",
    modal_title_label: "Title",
    modal_title_ua_label: "Title (Ukrainian)",
    modal_description_label: "Description",
    modal_genres_label: "Genres (comma separated, e.g. Action, Drama)",
    modal_cover_label: "Cover URL",
    modal_author_label: "Author",
    modal_status_label: "Status",
    modal_status_ongoing: "Ongoing",
    modal_status_completed: "Completed",
    modal_status_frozen: "Frozen",
    modal_submit: "➕ Add",
    modal_close: "Close",
    modal_success: "✅ Manga added successfully!",
    modal_error: "❌ Save error. Manga added temporarily only.",

    // Reader
    reader_back: "← Back",
    reader_loading: "Loading...",
    reader_prev: "◀",
    reader_next: "▶",
    reader_prev_title: "Previous chapter",
    reader_next_title: "Next chapter",
    reader_select_chapter: "Select chapter",
    reader_chapter: "Chapter",
    reader_pages: "pages",
    reader_no_pages: "😕 No pages in this chapter",
    reader_no_chapters: "😕 No chapters available",
    reader_error: "❌ Loading error",
    reader_retry: "🔄 Retry",
    reader_scroll_top: "Top",
    reader_settings: "⚙️ Settings",

    // Reader settings
    settings_width: "Container width:",
    settings_narrow: "Narrow",
    settings_wide: "Wide",
    settings_bg: "Background:",
    settings_bg_dark: "Dark",
    settings_bg_darker: "Darker",
    settings_bg_gray: "Gray",
    settings_bg_sepia: "Light (sepia)",
    settings_bg_white: "White",
    settings_reset: "↺ Reset",

    // Statuses
    status_ongoing: "Ongoing",
    status_completed: "Completed",
    status_frozen: "Frozen",

    // Messages
    manga_not_found: "😕 Manga not found",
    chapter_loading: "⏳ Loading pages...",
    no_id: "❌ No manga ID provided",
  },

  ru: {
    // Главная страница
    app_title: "📖 Manga Reader",
    search_placeholder: "Поиск манги по названию...",
    search_button: "🔍",
    add_manga_button: "➕ Добавить мангу",
    footer_text: "📚 Собственная база данных • Количество манг:",
    no_results: "😕 Ничего не найдено",
    no_results_hint: "Попробуйте изменить поиск или добавьте новые манги",
    loading_error: "❌ Ошибка загрузки базы данных",
    retry_button: "🔄 Обновить",
    manga_count: "Манги",

    // Модальное окно
    modal_title: "➕ Добавить новую мангу",
    modal_title_label: "Название",
    modal_title_ua_label: "Название (на украинском)",
    modal_description_label: "Описание",
    modal_genres_label: "Жанры (через запятую, например: Экшн, Драма)",
    modal_cover_label: "URL обложки",
    modal_author_label: "Автор",
    modal_status_label: "Статус",
    modal_status_ongoing: "Онгоинг",
    modal_status_completed: "Завершено",
    modal_status_frozen: "Заморожено",
    modal_submit: "➕ Добавить",
    modal_close: "Закрыть",
    modal_success: "✅ Манга успешно добавлена!",
    modal_error: "❌ Ошибка сохранения. Манга добавлена только временно.",

    // Читалка
    reader_back: "← Назад",
    reader_loading: "Загрузка...",
    reader_prev: "◀",
    reader_next: "▶",
    reader_prev_title: "Предыдущая глава",
    reader_next_title: "Следующая глава",
    reader_select_chapter: "Выбор главы",
    reader_chapter: "Глава",
    reader_pages: "стр.",
    reader_no_pages: "😕 В этой главе нет страниц",
    reader_no_chapters: "😕 Нет доступных глав",
    reader_error: "❌ Ошибка загрузки",
    reader_retry: "🔄 Повторить",
    reader_scroll_top: "Наверх",
    reader_settings: "⚙️ Настройки",

    // Настройки читалки
    settings_width: "Ширина контейнера:",
    settings_narrow: "Узко",
    settings_wide: "Широко",
    settings_bg: "Фон:",
    settings_bg_dark: "Темный",
    settings_bg_darker: "Очень темный",
    settings_bg_gray: "Серый",
    settings_bg_sepia: "Светлый (сепия)",
    settings_bg_white: "Белый",
    settings_reset: "↺ Сбросить",

    // Статусы
    status_ongoing: "Онгоинг",
    status_completed: "Завершено",
    status_frozen: "Заморожено",

    // Сообщения
    manga_not_found: "😕 Манга не найдена",
    chapter_loading: "⏳ Загрузка страниц...",
    no_id: "❌ ID манги не указан",
  },
};

// Поточна мова (з localStorage або браузера)
let currentLanguage = localStorage.getItem("manga_language") || "uk";

// Функція для отримання перекладу
function t(key) {
  return translations[currentLanguage]?.[key] || translations.uk[key] || key;
}

// Функція для зміни мови
function setLanguage(lang) {
  if (translations[lang]) {
    currentLanguage = lang;
    localStorage.setItem("manga_language", lang);
    document.documentElement.lang = lang;
    updateAllTexts();
  }
}

// Оновлення всіх текстів на сторінці
function updateAllTexts() {
  // Елементи з атрибутом data-i18n
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const translation = t(key);
    if (translation) {
      el.textContent = translation;
    }
  });

  // Плейсхолдери
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    const translation = t(key);
    if (translation) {
      el.placeholder = translation;
    }
  });

  // Titles
  document.querySelectorAll("[data-i18n-title]").forEach((el) => {
    const key = el.getAttribute("data-i18n-title");
    const translation = t(key);
    if (translation) {
      el.title = translation;
    }
  });

  // ARIA labels
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
}

// Отримання перекладу для статусу
function translateStatus(status) {
  const statusMap = {
    Онґоїнг: t("status_ongoing"),
    Завершено: t("status_completed"),
    Заморожено: t("status_frozen"),
    Ongoing: t("status_ongoing"),
    Completed: t("status_completed"),
    Frozen: t("status_frozen"),
  };
  return statusMap[status] || status;
}

// ===== i18n.js (доповнення) =====

// ... ваш існуючий код ...

// Функція для отримання назви манги в поточній мові
function getMangaTitle(manga) {
  const lang = currentLanguage;

  // Перевіряємо наявність перекладу для поточної мови
  if (lang === "uk" && manga.title_ua) return manga.title_ua;
  if (lang === "en" && manga.title_en) return manga.title_en;
  if (lang === "ru" && manga.title_ru) return manga.title_ru;

  // Якщо немає перекладу - повертаємо оригінальну назву
  return manga.title;
}

// Функція для отримання опису манги в поточній мові
function getMangaDescription(manga) {
  const lang = currentLanguage;

  if (lang === "uk" && manga.description_ua) return manga.description_ua;
  if (lang === "en" && manga.description_en) return manga.description_en;
  if (lang === "ru" && manga.description_ru) return manga.description_ru;

  return manga.description || "Опис відсутній";
}

// Функція для отримання альтернативних назв
function getAlternativeTitles(manga) {
  const titles = [];
  const current = getMangaTitle(manga);

  // Додаємо всі доступні назви, крім поточної
  if (manga.title_ua && manga.title_ua !== current)
    titles.push(`🇺🇦 ${manga.title_ua}`);
  if (manga.title_en && manga.title_en !== current)
    titles.push(`🇬🇧 ${manga.title_en}`);
  if (manga.title_ru && manga.title_ru !== current)
    titles.push(`🇷🇺 ${manga.title_ru}`);
  if (manga.title && manga.title !== current) titles.push(`📖 ${manga.title}`);

  return titles;
}
