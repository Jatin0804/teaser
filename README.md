# Quralyst Waitlist Page

A responsive waitlist webpage built with HTML, CSS, and JavaScript that adapts perfectly to all screen sizes using the provided 3D assets and designs.

## Features

- ✨ **Fully Responsive**: Adapts to mobile, tablet, laptop, and monitor screens
- 🎨 **Glass Morphism UI**: Beautiful transparent glass-like container
- 🖼️ **Dynamic 3D Assets**: Different 3D shapes for different screen sizes
- 📧 **Email Collection**: Captures and stores email addresses
- 📱 **Mobile-First Design**: Optimized for all devices
- 🎯 **Pixel Perfect**: Matches the provided Figma designs
- 💾 **Data Storage**: Saves emails locally with export functionality

## Screen Breakpoints

- **Mobile**: < 768px (uses mobile 3D objects)
- **Tablet**: 768px - 1024px (scaled laptop objects)
- **Laptop**: 1024px - 1400px (laptop 3D objects)
- **Monitor**: > 1400px (monitor 3D objects)

## File Structure

```
├── index.html          # Main HTML file
├── styles.css          # CSS with responsive design
├── script.js           # JavaScript for functionality
├── logo.png           # Quralyst logo
├── laptop objects/    # 3D shapes for laptop screens
│   ├── bottom 3d shape.png
│   ├── bottom left 3d shape.png
│   └── right 3d shape.png
├── mobile objects/    # 3D shapes for mobile screens
│   ├── bottom left 3d object.png
│   ├── bottom right 3d object.png
│   └── top right 3d object.png
└── monitor objects/   # 3D shapes for monitor screens
    ├── bottom monitor 3d shape.png
    ├── left bottom monitor 3dd shape.png
    └── right monitor 3d shape.png
```

## How to Use

1. **Open the webpage**: Simply open `index.html` in any modern web browser
2. **View on different devices**: The page automatically adapts to your screen size
3. **Join waitlist**: Enter email and click "Join Waitlist"
4. **Admin functions**: Open browser console for admin commands

## Email Storage

The webpage stores emails locally in the browser's localStorage. For production use, you may want to integrate with:

- Backend API
- Database
- Email service (Mailchimp, ConvertKit, etc.)

### Admin Console Commands

Open browser console (F12) and use these commands:

```javascript
viewEmails()      // View all saved emails
exportToCSV()     // Download emails as CSV file
clearEmails()     // Clear all saved emails
```

## Responsive Design Details

### Mobile (< 768px)
- Compact glass container
- Mobile-specific 3D objects
- Stacked form elements
- Optimized touch targets

### Tablet (768px - 1024px)
- Medium-sized glass container
- Scaled laptop 3D objects
- Balanced proportions

### Laptop (1024px - 1400px)
- Standard glass container
- Original laptop 3D objects
- Optimal reading experience

### Monitor (> 1400px)
- Large glass container
- Monitor-specific 3D objects
- Enhanced visual hierarchy

## Customization

### Colors
Edit the CSS variables in `styles.css`:
- Background gradient
- Glass container opacity
- Button colors
- Text colors

### Content
Edit the text content in `index.html`:
- Main title
- Subtitle
- Description
- Features list

### 3D Objects
Replace the PNG files with your own 3D objects while maintaining the same file structure and naming convention.

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## Performance

- Optimized images loading
- Efficient CSS animations
- Minimal JavaScript footprint
- Fast rendering on all devices

## Production Notes

For production deployment:

1. **Optimize images**: Compress PNG files for faster loading
2. **Add backend**: Integrate with server for email storage
3. **Analytics**: Add Google Analytics or similar
4. **SEO**: Add meta tags and structured data
5. **CDN**: Use CDN for faster global loading

## License

This project is created for Quralyst waitlist page. All assets and designs are proprietary.
