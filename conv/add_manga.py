# ===== add_manga.py =====
import os
import json
from pathlib import Path

# ===== НАЛАШТУВАННЯ =====
MANGA_FOLDER = "mangas/Підняття_рівня_самотужки"  # Папка з мангою
MANGA_ID = 4  # ID манги
MANGA_TITLE = "Підняття рівня самотужки"
MANGA_TITLE_UA = "Підняття рівня самотужки"
MANGA_DESCRIPTION = "Історія про звичайного хлопця, який отримує можливість підвищувати свій рівень у реальному житті."
MANGA_GENRES = ["Екшн", "Пригоди", "Фентезі"]
MANGA_AUTHOR = "Автор"
MANGA_STATUS = "Онґоїнг"
COVER_IMAGE = f"{MANGA_FOLDER}/cover.jpg"

def scan_chapters(manga_folder):
    """Сканує папки з главами та створює список сторінок"""
    chapters = []
    
    # Шукаємо всі папки chapter_*
    for item in sorted(os.listdir(manga_folder)):
        if item.startswith("chapter_") and os.path.isdir(os.path.join(manga_folder, item)):
            chapter_path = os.path.join(manga_folder, item)
            
            # Шукаємо всі зображення у папці
            pages = []
            for file in sorted(os.listdir(chapter_path)):
                if file.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
                    pages.append(f"{manga_folder}/{item}/{file}")
            
            if pages:
                # Отримуємо номер глави
                chapter_num = int(item.split("_")[1])
                chapters.append({
                    "number": chapter_num,
                    "title": f"Глава {chapter_num}",
                    "pages": pages
                })
    
    return chapters

def update_mangas_json(manga_data):
    """Оновлює mangas.json"""
    json_path = "mangas.json"
    
    # Завантажуємо існуючу базу
    if os.path.exists(json_path):
        with open(json_path, "r", encoding="utf-8") as f:
            data = json.load(f)
    else:
        data = {"mangas": []}
    
    # Шукаємо мангу за ID
    existing = next((m for m in data["mangas"] if m["id"] == MANGA_ID), None)
    
    if existing:
        # Оновлюємо існуючу
        existing["chapters"] = manga_data["chapters"]
        print(f"✅ Оновлено мангу: {MANGA_TITLE}")
    else:
        # Додаємо нову
        data["mangas"].append(manga_data)
        print(f"✅ Додано нову мангу: {MANGA_TITLE}")
    
    # Зберігаємо
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=4)
    
    print(f"📁 Збережено у {json_path}")

def main():
    print("=" * 60)
    print("📚 ДОДАВАННЯ МАНГИ У БАЗУ ДАНИХ")
    print("=" * 60)
    
    # Перевіряємо, чи існує папка
    if not os.path.exists(MANGA_FOLDER):
        print(f"❌ Папку '{MANGA_FOLDER}' не знайдено!")
        print("📁 Переконайтеся, що папка з мангою існує.")
        return
    
    # Скануємо глави
    print(f"\n🔍 Сканування папки: {MANGA_FOLDER}")
    chapters = scan_chapters(MANGA_FOLDER)
    
    if not chapters:
        print("❌ Не знайдено жодної глави!")
        return
    
    print(f"📖 Знайдено глав: {len(chapters)}")
    for ch in chapters:
        print(f"  📄 Глава {ch['number']}: {len(ch['pages'])} сторінок")
    
    # Формуємо дані про мангу
    manga_data = {
        "id": MANGA_ID,
        "title": MANGA_TITLE,
        "title_ua": MANGA_TITLE_UA,
        "description": MANGA_DESCRIPTION,
        "genres": MANGA_GENRES,
        "cover": COVER_IMAGE if os.path.exists(COVER_IMAGE) else "https://via.placeholder.com/200x280?text=No+Cover",
        "author": MANGA_AUTHOR,
        "status": MANGA_STATUS,
        "chapters": chapters
    }
    
    # Оновлюємо JSON
    update_mangas_json(manga_data)
    
    print("=" * 60)
    print("✅ ГОТОВО!")
    print(f"📚 Додано мангу: {MANGA_TITLE}")
    print(f"📖 Кількість глав: {len(chapters)}")
    print("=" * 60)

if __name__ == "__main__":
    main()