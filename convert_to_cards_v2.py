from bs4 import BeautifulSoup
import re

# Read the HTML file
with open('a1-sentences.html', 'r', encoding='utf-8') as f:
    content = f.read()

soup = BeautifulSoup(content, 'html.parser')

# Find all table rows (excluding header)
tbody = soup.find('tbody')
rows = tbody.find_all('tr')

print(f"Processing {len(rows)} sentences...")

# Build the new card-based HTML
cards_html = []

for i, row in enumerate(rows, 1):
    tds = row.find_all('td')
    if len(tds) >= 3:
        english = tds[0].decode_contents()
        arabic = tds[1].decode_contents()
        pronunciation = tds[2].decode_contents()
        
        # Extract plain text for audio
        english_text = tds[0].get_text()
        
        card_html = f'''        <div class="sentence-card" data-index="{i}">
            <div class="sentence-number">{i}</div>
            <div class="sentence-row english-row">
                <div class="row-label">🇬🇧 الإنجليزية:</div>
                <div class="row-content">{english}</div>
            </div>
            <div class="sentence-row arabic-row">
                <div class="row-label">🇸🇦 العربية:</div>
                <div class="row-content">{arabic}</div>
            </div>
            <div class="sentence-row pronunciation-row">
                <div class="row-label">🔊 النطق:</div>
                <div class="row-content">{pronunciation}</div>
            </div>
            <div class="sentence-actions">
                <button class="save-btn" data-index="{i}">💾 حفظ</button>
                <button class="audio-btn" onclick="speakText('{english_text.strip()}')">🔊 استماع</button>
            </div>
        </div>'''
        
        cards_html.append(card_html)

# Save the cards HTML to a file
with open('sentences_cards_v2.html', 'w', encoding='utf-8') as f:
    f.write('\n'.join(cards_html))

print(f"✅ Created {len(cards_html)} sentence cards")
print("Saved to: sentences_cards_v2.html")

