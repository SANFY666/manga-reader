# ===== conv/one_piece.py =====
import os
import json
import sys

# Додаємо кореневу папку до шляху
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# ===== НАЛАШТУВАННЯ =====
MANGA_ID = 3
MANGA_NAME = "Атака_титанов"
CHAPTER_NUMBER = 1
CHAPTER_TITLE = "Романтична зоря"

# Папка зі сторінками (відносно кореневої папки)
PAGES_FOLDER = "mangas/Атака_титанов/chapter_1"

def get_pages():
    """Автоматично збирає всі сторінки з папки"""
    # Беремо шлях відносно кореневої папки
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    full_path = os.path.join(base_dir, PAGES_FOLDER)
    
    pages = []
    
    if not os.path.exists(full_path):
        print(f"❌ Папку '{full_path}' не знайдено!")
        return []
    
    # Збираємо всі зображення
    for file in sorted(os.listdir(full_path)):
        if file.lower().endswith(('.jpg', '.jpeg', '.png')):
            pages.append(f"{PAGES_FOLDER}/{file}")
    
    return pages

def update_json():
    # Беремо шлях до JSON у кореневій папці
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    json_path = os.path.join(base_dir, "mangas.json")
    
    if not os.path.exists(json_path):
        print(f"❌ Файл '{json_path}' не знайдено!")
        return
    
    # Завантажуємо JSON
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    # Шукаємо мангу за ID
    manga = next((m for m in data["mangas"] if m["id"] == MANGA_ID), None)
    
    if not manga:
        print(f"❌ Мангу з ID {MANGA_ID} не знайдено!")
        return
    
    # Отримуємо сторінки
    pages = get_pages()
    
    if not pages:
        print("❌ Не знайдено жодної сторінки!")
        print(f"📁 Переконайтеся, що папка '{PAGES_FOLDER}' містить зображення.")
        return
    
    print(f"📖 Знайдено сторінок: {len(pages)}")
    
    # Оновлюємо главу
    if manga["chapters"]:
        manga["chapters"][0]["pages"] = pages
        manga["chapters"][0]["title"] = CHAPTER_TITLE
    else:
        manga["chapters"] = [{
            "number": CHAPTER_NUMBER,
            "title": CHAPTER_TITLE,
            "pages": pages
        }]
    
    # Зберігаємо
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=4)
    
    print(f"✅ Оновлено! Додано {len(pages)} сторінок у {MANGA_NAME}")

if __name__ == "__main__":
    update_json()