# PhotographyX — World-Class Portfolio

A production-ready, world-class photography portfolio featuring refined typography, sophisticated animations, and exceptional attention to detail.

## ✨ Features

### Design Excellence
- **Distinctive Typography**: Crimson Pro for editorial headlines, DM Sans for body text, JetBrains Mono for technical details
- **Refined Color System**: Sophisticated dark theme with carefully calibrated contrast and opacity levels
- **Atmospheric Effects**: Ambient gradients, mesh backgrounds, and subtle grid overlays
- **Micro-interactions**: Smooth hover states, staggered animations, and delightful transitions

### User Experience
- **Keyboard Navigation**: Full arrow key support in lightbox, escape to close, tab focus management
- **Image Counter**: Shows current position in gallery (e.g., "3 / 12")
- **Scroll Animations**: Elements fade in as you scroll with IntersectionObserver
- **Animated Counters**: Stats count up when they enter the viewport
- **Mobile-First**: Fully responsive with hamburger menu and touch-optimized interactions

### Performance & Accessibility
- **Lazy Loading**: Images load only when needed
- **WebP Support**: Supports modern image formats alongside JPG/PNG
- **Focus Management**: Proper focus trapping in lightbox modal
- **Skip Links**: Screen reader navigation assistance
- **ARIA Labels**: Comprehensive accessibility attributes
- **Reduced Motion**: Respects user's motion preferences
- **SEO Optimized**: Meta tags, Open Graph, and semantic HTML

### Production Features
- **Auto Image Detection**: Automatically finds h1.jpg, h2.jpg, v1.png, etc.
- **Extension Fallbacks**: Tries multiple extensions (jpg, JPG, jpeg, png, PNG, webp, WEBP)
- **Error Handling**: Graceful fallbacks for missing images
- **Loading States**: Beautiful animated spinners while content loads
- **Security Headers**: XSS protection, frame denial, content type sniffing prevention

## 📁 Project Structure

```
photographyx/
├── index.html          # Main HTML with semantic structure
├── styles.css          # Complete design system
├── app.js             # Gallery logic and interactions
├── vercel.json        # Deployment configuration
├── images/            # Your photography (create this folder)
│   ├── h1.jpg         # Horizontal image 1
│   ├── h2.jpg         # Horizontal image 2
│   ├── h3.jpg         # Horizontal image 3
│   ├── v1.jpg         # Vertical image 1
│   ├── v2.jpg         # Vertical image 2
│   └── v3.jpg         # Vertical image 3
└── favicon.ico        # Your favicon
```

## 🚀 Quick Start

### 1. Add Your Images

Create an `images` folder and add your photos:

**Horizontal Images** (landscape format):
- `h1.jpg`, `h2.jpg`, `h3.jpg`, etc.

**Vertical Images** (portrait format):
- `v1.jpg`, `v2.jpg`, `v3.jpg`, etc.

The system will automatically detect up to 50 images per category.

### 2. Customize Captions

Edit `app.js` to add captions for your images:

```javascript
const imageCaptions = {
  'h1': 'Your caption for horizontal image 1',
  'h2': 'Your caption for horizontal image 2',
  'v1': 'Your caption for vertical image 1',
  // ...
};
```

### 3. Update Content

Edit `index.html` to customize:
- Studio name and description
- Featured projects
- Journal entries
- About section
- Contact information

### 4. Deploy

**Option A: Vercel (Recommended)**
```bash
npm i -g vercel
vercel
```

**Option B: Netlify**
```bash
npm i -g netlify-cli
netlify deploy
```

**Option C: GitHub Pages**
Push to GitHub and enable Pages in repository settings.

## 🎨 Customization

### Colors

Edit CSS variables in `styles.css`:

```css
:root {
  --bg: #0a0a0a;              /* Main background */
  --text: #efefef;            /* Primary text */
  --accent: #ffffff;          /* Highlight color */
  --text-dim: #8a8a8a;       /* Muted text */
}
```

### Typography

Change fonts in `index.html` and update CSS variables:

```css
:root {
  --font-display: 'Your Display Font', serif;
  --font-body: 'Your Body Font', sans-serif;
  --font-mono: 'Your Mono Font', monospace;
}
```

### Layout

Modify grid configurations in `styles.css`:

```css
.horizontal-gallery {
  grid-template-columns: repeat(auto-fill, minmax(420px, 1fr));
}

.vertical-gallery {
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
}
```

## 📱 Responsive Breakpoints

- Desktop: 1400px+
- Tablet: 768px - 1399px
- Mobile: < 768px
- Small Mobile: < 480px

## ⌨️ Keyboard Shortcuts

When lightbox is open:
- `←` Previous image
- `→` Next image
- `Esc` Close lightbox
- `Tab` Navigate controls

## 🔧 Advanced Configuration

### Image Detection

Edit `app.js` to change image folder or max images:

```javascript
const IMAGES_DIR = 'images';  // Your image folder
const MAX_IMAGES = 50;        // Max images to scan
```

### Add More Extensions

```javascript
const EXTENSIONS = ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'webp', 'WEBP', 'avif', 'AVIF'];
```

## 🌐 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile Safari 14+
- Samsung Internet 14+

## 📊 Performance Tips

1. **Optimize Images**: Use tools like ImageOptim or Squoosh
2. **WebP Format**: Convert images to WebP for better compression
3. **Size Recommendations**:
   - Horizontal: 1920px wide, 1080-1440px tall
   - Vertical: 1080px wide, 1920px tall
   - Keep under 500KB per image

## 🎯 SEO Checklist

- [x] Semantic HTML structure
- [x] Meta descriptions
- [x] Open Graph tags
- [x] Alt text for images
- [x] Descriptive headings
- [ ] Add `og-image.jpg` (1200x630px)
- [ ] Create `robots.txt`
- [ ] Add Google Analytics (optional)
- [ ] Submit sitemap to Google

## 📄 License

This is a custom portfolio template. Modify and use for your photography business.

## 🙏 Credits

Typography: Google Fonts (Crimson Pro, DM Sans, JetBrains Mono)

---

**Need help?** Check the JavaScript console for debugging info. All operations log to console with `[PhotographyX]` prefix.

**Ready to go world-class?** Add your stunning photography and deploy! 🚀