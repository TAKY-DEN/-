import re
from bs4 import BeautifulSoup

levels = ['a2', 'b1', 'b2', 'c1', 'c2']

for level in levels:
    filename = f"{level}-sentences.html"
    
    print(f"\n{'='*50}")
    print(f"Processing {level.upper()} sentences...")
    print(f"{'='*50}")
    
    try:
        # Read HTML file
        with open(filename, 'r', encoding='utf-8') as f:
            html = f.read()
        
        # Extract sentences from onclick attributes
        pattern = r"speakText\('([^']+)'\)"
        matches = re.findall(pattern, html)
        
        print(f"✅ Found {len(matches)} sentences")
        
        # Save to JSON for audio generation
        import json
        sentences_data = [{'english': text} for text in matches]
        
        with open(f'{level}_sentences_data.json', 'w', encoding='utf-8') as f:
            json.dump(sentences_data, f, ensure_ascii=False, indent=2)
        
        print(f"✅ Saved to {level}_sentences_data.json")
        
    except FileNotFoundError:
        print(f"❌ File {filename} not found!")
    except Exception as e:
        print(f"❌ Error: {e}")

print(f"\n{'='*50}")
print("✅ All files processed!")
print(f"{'='*50}")
