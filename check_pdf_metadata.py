import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

from pypdf import PdfReader

# Check PDF metadata
pdf_files = [
    'public/pdf/vivian_characters.pdf',
    'public/pdf/education_flyer.pdf',
    'public/pdf/rainbow-project-for-educators-2025.pdf'
]

for pdf_file in pdf_files:
    try:
        reader = PdfReader(pdf_file)
        metadata = reader.metadata
        print(f"\n{pdf_file}:")
        print(f"  Title: {metadata.get('/Title', 'No title')}")
        print(f"  Author: {metadata.get('/Author', 'No author')}")
        print(f"  Subject: {metadata.get('/Subject', 'No subject')}")
    except Exception as e:
        print(f"Error reading {pdf_file}: {e}")
