# 🎨 Interactive Whiteboard Application

![Whiteboard Demo](https://img.shields.io/badge/React-19.1.1-blue) ![License](https://img.shields.io/badge/License-MIT-green) ![Build](https://img.shields.io/badge/Build-Passing-brightgreen) ![CSS](https://img.shields.io/badge/CSS-TailwindCSS-blue)

## 📖 Introduction

Interactive Whiteboard is a powerful web-based drawing application built with React that provides a complete digital canvas experience. This application streamlines your creative workflow by offering professional-grade drawing tools, intuitive controls, and seamless user experience for digital art, note-taking, and collaborative brainstorming.

Perfect for educators, students, designers, and professionals who need a versatile digital canvas for collaboration, presentation, and creative expression!

## ✨ Key Features

### 🎨 **Smart Drawing Tools**
- **🖌️ Brush Tool**: Free-hand drawing with smooth stroke rendering and pressure sensitivity
- **📏 Line Tool**: Create precise straight lines with customizable thickness
- **🔲 Rectangle Tool**: Draw rectangles with independent stroke and fill color options
- **⭕ Circle Tool**: Perfect circles and ellipses with customizable styling
- **➡️ Arrow Tool**: Directional arrows for annotations and flowcharts
- **📝 Text Tool**: Add text with real-time editing and font size control
- **🧹 Smart Eraser**: Intelligent element detection for precise removal

### 🎨 **Advanced Customization**
- **🌈 Color Picker**: Custom color selector with hex value support
- **🎯 Preset Colors**: Quick access to professionally curated color palette
- **📏 Dynamic Sizing**: Real-time brush size and stroke thickness adjustment
- **🖊️ Fill Options**: Independent stroke and fill color controls for shapes
- **⚡ Real-time Preview**: Live feedback during tool selection and customization

### 🚀 **Professional Features**
- **↩️ Unlimited Undo/Redo**: Complete history management with keyboard shortcuts
- **🎯 Precision Erasing**: Smart detection for filled shapes and stroke boundaries
- **📱 Responsive Design**: Seamless experience across desktop, tablet, and mobile devices
- **⌨️ Keyboard Shortcuts**: Professional workflow with Ctrl+Z/Ctrl+Y support
- **🔄 Real-time Rendering**: Smooth, lag-free drawing with optimized performance

## 🎯 Perfect For

- 👨‍🏫 **Educators**: Interactive teaching, presentations, and student engagement
- 👨‍💻 **Developers**: System architecture diagrams, flowcharts, and wireframes
- 🎨 **Designers**: Rapid prototyping, mockups, and creative ideation
- 📚 **Students**: Digital note-taking, problem solving, and study materials
- 💼 **Teams**: Collaborative brainstorming, planning sessions, and remote workshops
- 🏠 **Remote Workers**: Virtual whiteboard for online meetings and presentations

## 📁 Repository Structure

```
whiteboard/
├── 📁 public/
│   ├── 🌐 index.html              # Main HTML template
│   └── 📄 manifest.json           # PWA manifest configuration
├── 📁 src/
│   ├── 📁 components/
│   │   ├── 📁 Board/
│   │   │   ├── 📄 index.js         # Canvas component with drawing logic
│   │   │   └── 📄 index.module.css # Canvas styling and responsive design
│   │   ├── 📁 Toolbar/
│   │   │   ├── 📄 index.js         # Tool selection interface
│   │   │   └── 📄 index.module.css # Toolbar styling and layout
│   │   └── 📁 Toolbox/
│   │       ├── 📄 index.js         # Color picker and size controls
│   │       └── 📄 index.module.css # Toolbox styling with TailwindCSS
│   ├── 📁 store/
│   │   ├── 📄 boardProvider.js     # Canvas state management & history
│   │   ├── 📄 board-context.js     # Board context definitions
│   │   ├── 📄 toolboxProvider.js   # Tool state management
│   │   └── 📄 toolbox-context.js   # Toolbox context definitions
│   ├── 📁 utils/
│   │   ├── 📄 element.js           # Element creation and collision detection
│   │   └── 📄 math.js              # Mathematical utilities for shapes
│   ├── 📄 constants.js             # Application constants and tool definitions
│   ├── 📄 App.js                   # Main application component
│   ├── 📄 index.js                 # Application entry point
│   └── 📄 index.css                # Global styles and TailwindCSS imports
├── 📄 package.json                 # Dependencies and build scripts
├── 📄 tailwind.config.js           # TailwindCSS configuration
├── 📄 postcss.config.js            # PostCSS configuration
├── 📄 .gitignore                   # Git ignore rules
├── 📄 LICENSE                      # MIT License
└── 📄 README.md                    # This documentation
```

## 🚀 Getting Started

### 📋 Prerequisites

Before you begin, ensure you have:

- 💻 **Node.js** (version 16.0 or higher recommended)
- 📦 **npm** or **yarn** package manager
- 🌐 Modern web browser (Chrome, Firefox, Safari, Edge)
- 📝 Text editor (Visual Studio Code recommended)
- 🔧 Git for version control (optional)

### 📥 Installation Methods

#### Method 1: For Developers (Recommended)

**Clone the Repository**
```bash
git clone https://github.com/Nishkarsh0Sharma/whiteboard.git
cd whiteboard
```

**Install Dependencies**
```bash
npm install
```

**Start Development Server**
```bash
npm start
```

**Access Application**
- Open your browser and navigate to `http://localhost:3000`

#### Method 2: Direct Download

**Download ZIP**
- Click the green "Code" button on GitHub
- Select "Download ZIP"
- Extract the downloaded file

**Setup and Run**
- Follow steps 2-4 from Method 1 above

### ✅ Verification Steps

✅ Look for the toolbar at the top with all drawing tools  
✅ Verify the toolbox appears on the left with color and size controls  
✅ Test brush tool by clicking and dragging on the canvas  
✅ Try different tools (line, rectangle, circle, arrow, text)  
✅ Test undo/redo functionality with Ctrl+Z and Ctrl+Y  
✅ Verify eraser works on different element types  

## 🎮 How to Use

### 🖌️ **Drawing Basics**

1. **🎯 Select a Tool**: Click any tool from the top toolbar
2. **🎨 Choose Colors**: Use the color picker or preset colors in the left toolbox
3. **📏 Adjust Settings**: Use sliders for brush size, stroke thickness, or font size
4. **✏️ Start Creating**: Click and drag on the canvas to create elements

### 📊 **Tool Reference Guide**

| Tool | Description | Usage | Keyboard |
|------|-------------|-------|----------|
| 🖌️ **Brush** | Free-hand drawing with smooth strokes | Click and drag to draw | B |
| 📏 **Line** | Create straight lines | Click start point, drag to end | L |
| 🔲 **Rectangle** | Draw rectangular shapes | Click corner, drag to opposite corner | R |
| ⭕ **Circle** | Create circles and ellipses | Click center, drag to set radius | C |
| ➡️ **Arrow** | Directional arrows with arrowheads | Click start, drag to create arrow | A |
| 📝 **Text** | Add editable text labels | Click to place, type your text | T |
| 🧹 **Eraser** | Remove elements intelligently | Click on elements to delete | E |

### 🔍 **Advanced Features**

**🎨 Color Management**
- **Color Picker**: Click the circular color picker for custom colors
- **Preset Palette**: Quick selection from curated color collection
- **Fill vs Stroke**: Independent color control for shape outlines and fills
- **No Fill Option**: Create outline-only shapes with the crossed-out color box

**📏 Size Controls**
- **Brush Size**: 1-10 pixel range for drawing tools
- **Font Size**: 12-64 pixel range for text elements
- **Real-time Preview**: See size changes instantly

### ⌨️ **Keyboard Shortcuts**

- `Ctrl + Z` - Undo last action
- `Ctrl + Y` - Redo action
- `Ctrl + Shift + Z` - Alternative redo
- `Click` - Select/activate current tool
- `Drag` - Create shapes and draw strokes
- `Enter` - Confirm text input
- `Escape` - Cancel current operation

## 🛠️ Technical Implementation

### 🏗️ **Core Technologies**

- **React 19.1.1**: Modern UI framework with concurrent features and hooks
- **HTML5 Canvas**: High-performance 2D graphics rendering
- **RoughJS 4.6.6**: Hand-drawn, sketchy graphics library
- **Perfect Freehand 1.2.2**: Smooth brush stroke rendering with pressure sensitivity
- **TailwindCSS 3.4.17**: Utility-first CSS framework for rapid styling
- **Context API**: Centralized state management for tools and canvas data

### 🔧 **Key Implementation Examples**

```javascript
// Smart brush stroke rendering
const handleBrushDraw = useCallback((event) => {
  const { clientX, clientY } = event;
  const newPoint = { x: clientX, y: clientY };
  
  const brushElement = {
    id: Date.now(),
    type: TOOL_ITEMS.BRUSH,
    points: [...currentPoints, newPoint],
    stroke: currentStroke,
    size: currentSize
  };
  
  // Generate smooth path using perfect-freehand
  const stroke = getStroke(brushElement.points, {
    size: brushElement.size,
    thinning: 0.5,
    smoothing: 0.5,
    streamline: 0.5,
  });
  
  brushElement.path = new Path2D(getSvgPathFromStroke(stroke));
  updateElement(brushElement);
}, [currentPoints, currentStroke, currentSize]);

// Intelligent eraser with shape fill detection
const isPointNearElement = (element, pointX, pointY) => {
  const { x1, y1, x2, y2, type, fill } = element;
  
  switch (type) {
    case TOOL_ITEMS.RECTANGLE:
    case TOOL_ITEMS.CIRCLE:
      // Check stroke boundaries
      const onBorder = (
        isPointCloseToLine(x1, y1, x2, y1, pointX, pointY) ||
        isPointCloseToLine(x2, y1, x2, y2, pointX, pointY) ||
        isPointCloseToLine(x2, y2, x1, y2, pointX, pointY) ||
        isPointCloseToLine(x1, y2, x1, y1, pointX, pointY)
      );
      
      // Check fill area for filled shapes
      const inFill = fill !== null && (
        pointX >= Math.min(x1, x2) && pointX <= Math.max(x1, x2) &&
        pointY >= Math.min(y1, y2) && pointY <= Math.max(y1, y2)
      );
      
      return onBorder || inFill;
      
    case TOOL_ITEMS.TEXT:
      const textWidth = element.text.length * (element.size || 32) * 0.6;
      const textHeight = element.size || 32;
      return (
        pointX >= x1 && pointX <= x1 + textWidth &&
        pointY >= y1 && pointY <= y1 + textHeight
      );
      
    default:
      return false;
  }
};

// Comprehensive undo/redo system
const useHistory = () => {
  const [history, setHistory] = useState([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      return history[historyIndex - 1];
    }
    return null;
  }, [history, historyIndex]);
  
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      return history[historyIndex + 1];
    }
    return null;
  }, [history, historyIndex]);
  
  const addToHistory = useCallback((elements) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...elements]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);
  
  return { undo, redo, addToHistory };
};
```

### 📊 **Architecture Overview**

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│    Toolbar      │    │     Toolbox      │    │      Board      │
│                 │    │                  │    │                 │
│ • Tool Icons    │◄──►│ • Color Picker   │◄──►│ • Canvas API    │
│ • Active State  │    │ • Size Sliders   │    │ • Event Handler │
│ • Tool Switch   │    │ • Fill Toggle    │    │ • Element Render│
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                        │                        │
         └────────────────────────┼────────────────────────┘
                                  ▼
                    ┌──────────────────────────┐
                    │    State Management      │
                    │                          │
                    │ • Board Provider         │
                    │ • Toolbox Provider       │
                    │ • History Management     │
                    │ • Element Store          │
                    └──────────────────────────┘
```

## 🎓 Learning & Development

### 📚 **Educational Value**

This project demonstrates advanced concepts in:

- 🏗️ **React Architecture**: Component composition, hooks, and context patterns
- 🎨 **Canvas Programming**: 2D graphics, path rendering, and performance optimization  
- 🔧 **State Management**: Complex state with history and undo/redo systems
- 🎯 **Event Handling**: Mouse events, keyboard shortcuts, and touch support
- 📱 **Responsive Design**: CSS Grid, Flexbox, and mobile-first approach
- ⚡ **Performance**: Memoization, useCallback, and rendering optimization

### 🛤️ **Development Journey**

**Foundation** → React setup, component structure, and basic canvas integration  
**Core Tools** → Implement drawing tools with RoughJS and canvas API  
**State Management** → Context providers for tool and canvas state  
**User Interface** → Responsive toolbox and toolbar with TailwindCSS  
**Advanced Features** → Undo/redo, intelligent eraser, and text editing  
**Optimization** → Performance tuning and cross-device compatibility  

### 🔧 **Development Setup**

```bash
# Clone repository
git clone https://github.com/Nishkarsh0Sharma/whiteboard.git
cd whiteboard

# Install dependencies
npm install

# Start development server with hot reload
npm start

# Build for production
npm run build

# Run tests
npm test

# Analyze bundle size
npm run build && npx serve -s build
```

### 🐛 **Debugging Tips**

| Component | Debug Method | Location |
|-----------|--------------|----------|
| Canvas Rendering | Browser DevTools → Canvas tab | Canvas element |
| State Changes | React DevTools → Components | Component tree |
| Performance | DevTools → Performance tab | Timeline analysis |
| Touch Events | DevTools → Device simulation | Mobile viewport |
| Memory Usage | DevTools → Memory tab | Heap snapshots |

## 🚀 Future Enhancements

### 🎯 **Planned Features**

- 💾 **Save/Export**: Export drawings as PNG, SVG, or PDF files
- 📱 **Touch Support**: Native touch and gesture support for tablets
- 👥 **Real-time Collaboration**: Multi-user editing with WebSocket integration
- 📂 **Layer Management**: Layer-based editing with visibility controls
- 🎨 **Advanced Tools**: Bezier curves, gradients, and pattern fills
- 🔍 **Zoom/Pan**: Canvas navigation for detailed work on large drawings
- 📷 **Screenshot Mode**: Export specific canvas regions
- 🎵 **Animation Timeline**: Basic animation and keyframe support

### 💡 **Enhancement Ideas**

- **Grid System**: Snap-to-grid functionality with customizable spacing
- **Shape Library**: Pre-built shapes, symbols, and template collections
- **Measurement Tools**: Rulers, guides, and dimension indicators
- **Version Control**: Git-like versioning with branching and merging
- **Plugin Architecture**: Extensible tool system for custom functionality
- **Accessibility**: Full keyboard navigation and screen reader support
- **Themes**: Dark mode, high contrast, and customizable color schemes
- **Cloud Storage**: Integration with Google Drive, Dropbox, and OneDrive

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### 🔧 **Ways to Contribute**

- 🐛 **Report Bugs**: Found an issue? Create a detailed bug report with steps to reproduce
- 💡 **Suggest Features**: Have ideas? Share them in the issues section with use cases
- 🔧 **Submit Pull Requests**: Fix bugs, implement features, or improve performance
- 📖 **Improve Documentation**: Help enhance README, code comments, and tutorials
- 🎨 **Design Assets**: Contribute UI/UX improvements, icons, or visual enhancements

### 📋 **Contribution Guidelines**

1. Fork the repository and create your feature branch
2. Follow the existing code style and component patterns
3. Add tests for new functionality when applicable
4. Update documentation for any API changes
5. Create a Pull Request with clear description and screenshots

```bash
# Contribution workflow
git checkout -b feature/amazing-feature
git commit -m 'Add amazing feature: description'
git push origin feature/amazing-feature
# Open Pull Request on GitHub
```

### 🏆 **Contributors**

Thanks to all the amazing people who have contributed to this project!

<!-- Add contributor images/links when you have them -->

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### 📋 **License Summary**

- ✅ **Permissions**: Use, copy, modify, merge, publish, distribute, sublicense, sell
- ❌ **Limitations**: No warranty, no liability from the authors
- 📝 **Conditions**: Include license and copyright notice in all copies

## 🆘 Support & FAQ

### ❓ **Frequently Asked Questions**

**Q: The drawing feels laggy on my device**  
A: Try reducing brush size, closing other browser tabs, or using Chrome for better Canvas performance.

**Q: Can I save my drawings permanently?**  
A: Currently drawings are stored in browser memory. Persistent saving is planned for future releases.

**Q: Does it work on tablets and mobile devices?**  
A: Basic functionality works on touch devices. Full mobile optimization is in active development.

**Q: How do I change the canvas background color?**  
A: Canvas background customization is planned for the next major release.

**Q: Can multiple people draw on the same canvas?**  
A: Real-time collaboration is a planned feature. Currently it's single-user only.

### 🐛 **Found a Bug?**

If you encounter any issues:

1. Check existing [Issues](https://github.com/Nishkarsh0Sharma/whiteboard/issues)
2. If your issue isn't listed, create a new issue with:
   - Clear description of the problem
   - Steps to reproduce the issue
   - Expected vs actual behavior
   - Screenshots or video if applicable
   - Browser version and operating system
   - Console error messages if any

---

## 👨‍💻 Author

<div align="center">
  <img src="https://github.com/Nishkarsh0Sharma.png" width="100" height="100" style="border-radius: 50%;" alt="Nishkarsh Sharma">
  
  **Nishkarsh Sharma**  
  *Chrome Extension Developer*
  
  [![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Nishkarsh0Sharma)
  [![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/nishkarsh-sharma-20689b269/)
  
  📧 **Email**: [nishkarshsharma2004@gmail.com](mailto:nishkarshsharma2004@gmail.com)  
  💬 **Feel free to reach out for collaboration, questions, or feedback!**
</div>

---

## 🙏 Acknowledgments

- 💡 **Inspiration**: Traditional whiteboard tools and modern digital art applications
- 🎨 **Libraries**: RoughJS for hand-drawn aesthetics, Perfect Freehand for smooth strokes
- 📚 **Community**: React community for best practices, patterns, and continuous learning
- 🌟 **Users**: Thanks to all users providing valuable feedback and feature suggestions
- 🔧 **Tools**: Create React App, TailwindCSS, and the entire open-source ecosystem

---

## ⭐ **If you found this project helpful, please give it a star!** ⭐

### 🚀 **Happy Drawing!**

*Build something amazing, one stroke at a time!*

**Made with ❤️ by Nishkarsh Sharma**

© 2025 Interactive Whiteboard Application. All rights reserved.