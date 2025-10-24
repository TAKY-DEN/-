import json

# Read A1 template
with open('a1-sentences-new.html', 'r', encoding='utf-8') as f:
    template = f.read()

levels_info = {
    'a2': {'name': 'A2', 'title': 'جمل المستوى A2', 'count': 61},
    'b1': {'name': 'B1', 'title': 'جمل المستوى B1', 'count': 42},
    'b2': {'name': 'B2', 'title': 'جمل المستوى B2', 'count': 45},
    'c1': {'name': 'C1', 'title': 'جمل المستوى C1', 'count': 41},
    'c2': {'name': 'C2', 'title': 'جمل المستوى C2', 'count': 41}
}

for level_code, info in levels_info.items():
    print(f"\n{'='*60}")
    print(f"Creating {info['name']} sentences page...")
    print(f"{'='*60}")
    
    # Read sentences data
    with open(f'{level_code}_sentences_extracted.json', 'r', encoding='utf-8') as f:
        sentences = json.load(f)
    
    # Create cards HTML
    cards_html = ""
    for i, sentence in enumerate(sentences, 1):
        cards_html += f'''        <div class="sentence-card" data-index="{i}">
            <div class="sentence-number">{i}</div>
            <div class="sentence-row english-row">
                <div class="row-label">🇬🇧 الإنجليزية:</div>
                <div class="row-content">{sentence['english_html']}</div>
            </div>
            <div class="sentence-row arabic-row">
                <div class="row-label">🇸🇦 العربية:</div>
                <div class="row-content">{sentence['arabic_html']}</div>
            </div>
            <div class="sentence-row pronunciation-row">
                <div class="row-label">🔊 النطق:</div>
                <div class="row-content">{sentence['pronunciation_html']}</div>
            </div>
            <div class="sentence-actions">
                <button class="save-btn" data-index="{i}">💾 حفظ</button>
                <button class="audio-btn" data-audio-index="{i}">🔊 استماع</button>
            </div>
        </div>
'''
    
    # Replace placeholders in template
    new_page = template
    new_page = new_page.replace('data-level="a1"', f'data-level="{level_code}"')
    new_page = new_page.replace('جمل المستوى A1', info['title'])
    new_page = new_page.replace('93 جملة', f'{info["count"]} جملة')
    new_page = new_page.replace('audio/a1/', f'audio/{level_code}/')
    
    # Find and replace the sentences cards section
    import re
    pattern = r'<div id="sentences-cards">.*?</div>\s*</div>\s*</div>\s*<!-- StreamElements'
    replacement = f'<div id="sentences-cards">\n{cards_html}    </div>\n</div>\n</div>\n\n<!-- StreamElements'
    new_page = re.sub(pattern, replacement, new_page, flags=re.DOTALL)
    
    # Save new page
    output_file = f'{level_code}-sentences-new.html'
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(new_page)
    
    print(f"✅ Created {output_file}")

print(f"\n{'='*60}")
print("✅ All sentence pages created successfully!")
print(f"{'='*60}")
