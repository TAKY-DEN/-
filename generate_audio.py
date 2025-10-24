from gtts import gTTS
import json
import os

# Read sentences from the extracted file
with open('sentences_data.json', 'r', encoding='utf-8') as f:
    sentences = json.load(f)

print(f"Found {len(sentences)} sentences")

# Generate audio files
for i, sentence in enumerate(sentences, 1):
    english_text = sentence['english']
    
    # Clean the text (remove HTML tags if any)
    import re
    clean_text = re.sub(r'<[^>]+>', '', english_text)
    
    print(f"Generating audio {i}/93: {clean_text[:50]}...")
    
    try:
        # Generate TTS with US English accent
        tts = gTTS(text=clean_text, lang='en', slow=False, tld='us')
        
        # Save to file
        filename = f"audio/a1/sentence_{i}.mp3"
        tts.save(filename)
        
        print(f"  ✓ Saved: {filename}")
    except Exception as e:
        print(f"  ✗ Error: {e}")

print("\n✅ All audio files generated successfully!")
