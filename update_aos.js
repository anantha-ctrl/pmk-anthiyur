const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf-8');

// Add AOS css
if (!content.includes('aos.css')) {
    content = content.replace('<!-- Custom CSS -->', '<!-- AOS CSS -->\n    <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">\n    <!-- Custom CSS -->');
}

// Add AOS js
if (!content.includes('aos.js')) {
    content = content.replace('<!-- Custom JS -->', '<!-- AOS JS -->\n    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>\n    <script>AOS.init({duration: 1000, once: true, offset: 120});</script>\n    <!-- Custom JS -->');
}

// Convert classes to AOS attributes
content = content.replace(/class="([^"]*)animate-on-scroll fade-in-up([^"]*)"/g, 'class="$1 $2" data-aos="fade-up"');
content = content.replace(/class="([^"]*)animate-on-scroll fade-in-left([^"]*)"/g, 'class="$1 $2" data-aos="fade-left"');
content = content.replace(/class="([^"]*)animate-on-scroll fade-in-right([^"]*)"/g, 'class="$1 $2" data-aos="fade-right"');

// Clean up weird spaces from replacement
content = content.replace(/class=" /g, 'class="');
content = content.replace(/  "/g, ' "');

fs.writeFileSync('index.html', content);
console.log('Successfully injected AOS animations into index.html');
