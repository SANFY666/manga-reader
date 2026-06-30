# ===== convert.py (ВИПРАВЛЕНИЙ) =====
import os
import sys
import fitz  # pip install PyMuPDF
from PIL import Image  # pip install Pillow
import zipfile
import shutil
from pathlib import Path

# ===== НАЛАШТУВАННЯ (змініть тут) =====
INPUT_FOLDER = "input"  # Папка з вашими .cbr та .pdf файлами
OUTPUT_FOLDER = "mangas"  # Папка для збереження конвертованих зображень
MANGA_NAME = "Моя_Манга"  # Назва папки для цієї манги

# ===== ФУНКЦІЇ КОНВЕРТАЦІЇ =====

def convert_pdf_to_images(pdf_path, output_folder):
    """Конвертує PDF у JPG"""
    try:
        doc = fitz.open(pdf_path)
        os.makedirs(output_folder, exist_ok=True)
        
        total_pages = len(doc)
        print(f"📄 Конвертація PDF: {os.path.basename(pdf_path)} ({total_pages} сторінок)")
        
        for page_num in range(total_pages):
            page = doc[page_num]
            pix = page.get_pixmap(dpi=200)
            img_path = os.path.join(output_folder, f"page_{page_num+1:03d}.jpg")
            pix.save(img_path)
            print(f"  ✅ Сторінка {page_num+1}/{total_pages}")
        
        doc.close()
        print(f"✅ Готово: {output_folder}\n")
        return True
    except Exception as e:
        print(f"❌ Помилка конвертації PDF: {e}")
        return False

def convert_cbr_to_images(cbr_path, output_folder):
    """Конвертує CBR у JPG"""
    temp_folder = "temp_images"
    try:
        os.makedirs(output_folder, exist_ok=True)
        os.makedirs(temp_folder, exist_ok=True)
        
        print(f"📦 Конвертація CBR: {os.path.basename(cbr_path)}")
        
        # Розпаковуємо CBR (це ZIP-архів)
        try:
            with zipfile.ZipFile(cbr_path, 'r') as zip_ref:
                zip_ref.extractall(temp_folder)
        except Exception as e:
            print(f"  ⚠️ Не вдалося розпакувати CBR: {e}")
            print("  💡 Можливо, це RAR-архів. Встановіть rarfile: pip install rarfile")
            shutil.rmtree(temp_folder, ignore_errors=True)
            return False
        
        # Шукаємо зображення
        images = []
        for root, dirs, files in os.walk(temp_folder):
            for f in files:
                if f.lower().endswith(('.jpg', '.jpeg', '.png', '.gif', '.bmp')):
                    images.append(os.path.join(root, f))
        
        images.sort()
        
        if not images:
            print("  ❌ У CBR не знайдено зображень")
            shutil.rmtree(temp_folder, ignore_errors=True)
            return False
        
        print(f"  📸 Знайдено {len(images)} зображень")
        
        # Конвертуємо у JPG
        for i, img_path in enumerate(images, 1):
            try:
                with Image.open(img_path) as img:
                    jpg_path = os.path.join(output_folder, f"page_{i:03d}.jpg")
                    if img.mode in ('RGBA', 'LA', 'P'):
                        img = img.convert('RGB')
                    img.save(jpg_path, 'JPEG', quality=90)
                    print(f"  ✅ Сторінка {i}/{len(images)}")
            except Exception as e:
                print(f"  ⚠️ Помилка обробки {img_path}: {e}")
        
        # Очищаємо тимчасові файли
        shutil.rmtree(temp_folder, ignore_errors=True)
        print(f"✅ Готово: {output_folder}\n")
        return True
        
    except Exception as e:
        print(f"❌ Помилка конвертації CBR: {e}")
        shutil.rmtree(temp_folder, ignore_errors=True)
        return False

def find_files(input_folder):
    """Шукає всі .pdf та .cbr файли у папці"""
    pdf_files = []
    cbr_files = []
    
    if not os.path.exists(input_folder):
        return pdf_files, cbr_files
    
    for root, dirs, files in os.walk(input_folder):
        for file in files:
            file_path = os.path.join(root, file)
            if file.lower().endswith('.pdf'):
                pdf_files.append(file_path)
            elif file.lower().endswith('.cbr'):
                cbr_files.append(file_path)
    
    return pdf_files, cbr_files

# ===== ГОЛОВНА ФУНКЦІЯ =====

def main():
    global INPUT_FOLDER, OUTPUT_FOLDER, MANGA_NAME
    
    print("=" * 60)
    print("📚 КОНВЕРТЕР МАНГИ У ЗОБРАЖЕННЯ")
    print("=" * 60)
    
    # Перевіряємо наявність папки input
    if not os.path.exists(INPUT_FOLDER):
        print(f"\n❌ Папку '{INPUT_FOLDER}' не знайдено!")
        print(f"📁 Створіть папку '{INPUT_FOLDER}' і покладіть туди ваші .cbr та .pdf файли.")
        print("\nАБО вкажіть шлях до папки з файлами:")
        custom_path = input("👉 Введіть шлях до папки (або натисніть Enter для виходу): ").strip()
        
        if custom_path and os.path.exists(custom_path):
            INPUT_FOLDER = custom_path
        else:
            if custom_path:
                print(f"❌ Папку '{custom_path}' не знайдено!")
            print("❌ Роботу завершено.")
            return
    
    # Шукаємо файли
    print(f"\n🔍 Пошук файлів у папці: {INPUT_FOLDER}")
    pdf_files, cbr_files = find_files(INPUT_FOLDER)
    
    print(f"📄 Знайдено PDF: {len(pdf_files)}")
    print(f"📦 Знайдено CBR: {len(cbr_files)}")
    
    if not pdf_files and not cbr_files:
        print("\n❌ Не знайдено жодного .pdf або .cbr файлу!")
        print(f"📁 Переконайтеся, що файли є у папці '{INPUT_FOLDER}'")
        return
    
    # Питаємо назву манги
    print(f"\n📝 Поточна назва манги: {MANGA_NAME}")
    new_name = input("👉 Введіть назву манги (або натисніть Enter для збереження поточної): ").strip()
    if new_name:
        MANGA_NAME = new_name
    
    # Створюємо папку для вихідних файлів
    manga_output = os.path.join(OUTPUT_FOLDER, MANGA_NAME)
    os.makedirs(manga_output, exist_ok=True)
    
    print(f"\n📁 Збереження у: {manga_output}\n")
    
    # Конвертуємо PDF
    chapter_counter = 1
    for pdf_file in pdf_files:
        chapter_folder = os.path.join(manga_output, f"chapter_{chapter_counter}")
        print(f"\n📖 Конвертація глави {chapter_counter}...")
        if convert_pdf_to_images(pdf_file, chapter_folder):
            chapter_counter += 1
    
    # Конвертуємо CBR
    for cbr_file in cbr_files:
        chapter_folder = os.path.join(manga_output, f"chapter_{chapter_counter}")
        print(f"\n📖 Конвертація глави {chapter_counter}...")
        if convert_cbr_to_images(cbr_file, chapter_folder):
            chapter_counter += 1
    
    print("=" * 60)
    print(f"✅ КОНВЕРТАЦІЮ ЗАВЕРШЕНО!")
    print(f"📁 Всі файли збережено у: {manga_output}")
    print(f"📚 Кількість конвертованих глав: {chapter_counter - 1}")
    print("=" * 60)
    
    # Показуємо, як додати мангу на сайт
    print("\n📝 Щоб додати мангу на сайт:")
    print(f"1. Скопіюйте папку '{MANGA_NAME}' у папку 'mangas/' вашого сайту")
    print("2. Додайте запис у mangas.json:")
    print(f'''
    {{
        "id": 1,
        "title": "{MANGA_NAME}",
        "title_ua": "{MANGA_NAME}",
        "description": "Опис вашої манги",
        "genres": ["Екшн", "Драма"],
        "cover": "mangas/{MANGA_NAME}/cover.jpg",
        "author": "Автор",
        "status": "Онґоїнг",
        "chapters": [''')
    
    for i in range(1, chapter_counter):
        print(f'''        {{
            "number": {i},
            "title": "Глава {i}",
            "pages": [''')
        # Рахуємо кількість сторінок у главі
        chapter_path = os.path.join(manga_output, f"chapter_{i}")
        if os.path.exists(chapter_path):
            pages = sorted([f for f in os.listdir(chapter_path) if f.endswith('.jpg')])
            for j, page in enumerate(pages):
                comma = "," if j < len(pages) - 1 else ""
                print(f'                "mangas/{MANGA_NAME}/chapter_{i}/{page}"{comma}')
        print("            ]")
        comma = "," if i < chapter_counter - 1 else ""
        print(f"        }}{comma}")
    
    print('    ]')
    print('}')

if __name__ == "__main__":
    main()