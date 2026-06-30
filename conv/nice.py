# ===== convert_pdf_to_pages.py (оновлений) =====
import os
import fitz  # pip install PyMuPDF
from pathlib import Path

# ===== НАЛАШТУВАННЯ =====
PDF_FILE = ""  # або залиште порожнім для автоматичного пошуку
OUTPUT_FOLDER = "mangas/Атака_титанов/chapter_1"
MANGA_NAME = "Атака_титанов"

def find_pdf_file():
    """Шукає PDF-файл у поточній папці та всіх підпапках"""
    
    # Якщо вказано конкретний файл і він існує
    if PDF_FILE and os.path.exists(PDF_FILE):
        return PDF_FILE
    
    # Шукаємо всі PDF у поточній папці
    pdf_files = []
    for root, dirs, files in os.walk("."):
        for file in files:
            if file.lower().endswith('.pdf'):
                pdf_files.append(os.path.join(root, file))
    
    if not pdf_files:
        return None
    
    if len(pdf_files) == 1:
        return pdf_files[0]
    
    # Якщо кілька PDF - показуємо вибір
    print("\n📄 Знайдено кілька PDF-файлів:")
    for i, f in enumerate(pdf_files, 1):
        print(f"  {i}. {f}")
    
    while True:
        try:
            choice = input(f"\n👉 Виберіть номер (1-{len(pdf_files)}): ").strip()
            idx = int(choice) - 1
            if 0 <= idx < len(pdf_files):
                return pdf_files[idx]
        except:
            pass
        print("❌ Невірний вибір, спробуйте ще раз")

def convert_pdf_to_images():
    """Конвертує PDF у JPG сторінки"""
    
    # Шукаємо PDF
    pdf_path = find_pdf_file()
    
    if not pdf_path:
        print("\n❌ Не знайдено жодного PDF-файлу!")
        print("📁 Покладіть PDF у папку зі скриптом або вкажіть шлях.")
        return
    
    print(f"\n📄 Знайдено PDF: {pdf_path}")
    
    # Створюємо папку
    os.makedirs(OUTPUT_FOLDER, exist_ok=True)
    
    print(f"📁 Збереження у: {OUTPUT_FOLDER}")
    print("-" * 50)
    
    doc = fitz.open(pdf_path)
    total_pages = len(doc)
    
    print(f"📖 Кількість сторінок: {total_pages}")
    print("-" * 50)
    
    for page_num in range(total_pages):
        page = doc[page_num]
        # Висока якість (DPI 200)
        pix = page.get_pixmap(dpi=200)
        img_path = os.path.join(OUTPUT_FOLDER, f"page_{page_num+1:03d}.jpg")
        pix.save(img_path)
        
        # Показуємо прогрес
        if (page_num + 1) % 10 == 0 or page_num == total_pages - 1:
            print(f"✅ {page_num + 1}/{total_pages} сторінок")
    
    doc.close()
    print("-" * 50)
    print(f"✅ ГОТОВО! {total_pages} сторінок збережено у:")
    print(f"   {os.path.abspath(OUTPUT_FOLDER)}")

if __name__ == "__main__":
    convert_pdf_to_images()