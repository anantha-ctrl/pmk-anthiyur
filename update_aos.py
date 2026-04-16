import re
import os

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Add AOS css
if 'aos.css' not in content:
    content = content.replace('<!-- Custom CSS -->', '<!-- AOS CSS -->\n    <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">\n    <!-- Custom CSS -->')

# Add AOS js
if 'aos.js' not in content:
    content = content.replace('<!-- Custom JS -->', '<!-- AOS JS -->\n    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>\n    <script>AOS.init({duration: 1000, once: true, offset: 120});</script>\n    <!-- Custom JS -->')

# Convert classes to AOS attributes
content = re.sub(r'class="([^"]*)animate-on-scroll fade-in-up([^"]*)"', r'class="\1\2" data-aos="fade-up"', content)
content = re.sub(r'class="([^"]*)animate-on-scroll fade-in-left([^"]*)"', r'class="\1\2" data-aos="fade-left"', content)
content = re.sub(r'class="([^"]*)animate-on-scroll fade-in-right([^"]*)"', r'class="\1\2" data-aos="fade-right"', content)

# Clean up weird spaces from replacement
content = content.replace('class=" ', 'class="')
content = content.replace('  "', ' "')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print('Successfully injected AOS animations into index.html')
