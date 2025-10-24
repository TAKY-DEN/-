from bs4 import BeautifulSoup
import json
import re

levels = {
    'a2': 'A2',
    'b1': 'B1', 
    'b2': 'B2',
    'c1': 'C1',
    'c2': 'C2'
}

for level_code, level_name in levels.items():
    filename = f"{level_code}-sentences.html"
    
    print(f"\n{'='*60}")
    print(f"Processing {level_name} sentences...")
    print(f"{'='*60}")
    
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            html = f.read()
        
        soup = BeautifulSoup(html, 'html.parser')
        
        # Find all table rows
        rows = soup.find_all('tr')
        
        sentences = []
        
        for row in rows:
            tds = row.find_all('td')
            if len(tds) >= 3:
                # Extract text from each column
                english = tds[0].decode_contents()
                arabic = tds[1].decode_contents()
                pronunciation = tds[2].decode_contents()
                
                # Clean and extract plain text for audio
                english_plain = re.sub(r'<[^>]+>', '', english).strip()
                
                sentences.append({
                    'english_html': english,
                    'arabic_html': arabic,
                    'pronunciation_html': pronunciation,
                    'english_plain': english_plain
                })
        
        print(f"✅ Extracted {len(sentences)} sentences")
        
        # Save to JSON
        output_file = f'{level_code}_sentences_extracted.json'
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(sentences, f, ensure_ascii=False, indent=2)
        
        print(f"✅ Saved to {output_file}")
        
    except FileNotFoundError:
        print(f"❌ File {filename} not found!")
    except Exception as e:
        print(f"❌ Error: {e}")

print(f"\n{'='*60}")
print("✅ All sentences extracted successfully!")
print(f"{'='*60}")
