import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

from pypdf import PdfReader, PdfWriter

# PDF files and their new titles
pdf_files = [
    {
        'path': 'public/pdf/vivian_characters.pdf',
        'title': '朗読ワーク資料 vivian登場人物'
    },
    {
        'path': 'public/pdf/education_flyer.pdf',
        'title': '先生向けご案内チラシ'
    },
    {
        'path': 'public/pdf/rainbow-project-for-educators-2025.pdf',
        'title': '教育関係者向けビビアン活動説明資料'
    }
]

for pdf_info in pdf_files:
    file_path = pdf_info['path']
    new_title = pdf_info['title']

    try:
        reader = PdfReader(file_path)
        writer = PdfWriter()

        # Copy all pages
        for page in reader.pages:
            writer.add_page(page)

        # Update metadata with DisplayDocTitle
        writer.add_metadata({
            '/Title': new_title
        })

        # Set viewer preferences to display document title
        from pypdf.generic import DictionaryObject, NameObject, BooleanObject
        viewer_prefs = DictionaryObject()
        viewer_prefs.update({
            NameObject('/DisplayDocTitle'): BooleanObject(True)
        })
        writer._root_object.update({
            NameObject('/ViewerPreferences'): viewer_prefs
        })

        # Write to the same file
        with open(file_path, 'wb') as output_file:
            writer.write(output_file)

        print(f"Updated {file_path} with title '{new_title}' and DisplayDocTitle=True")
    except Exception as e:
        print(f"Error updating {file_path}: {e}")

print("\nAll PDF display settings have been updated!")
