# OUTSINC - Mixed Reality Detection App

A Meta Quest 3S mixed reality application for detecting and tracking humans and vehicles in real-world environments.

![OUTSINC Logo](https://img.shields.io/badge/OUTSINC-Mixed%20Reality-blue)
![Platform](https://img.shields.io/badge/Platform-Meta%20Quest%203S-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 🌟 Overview

OUTSINC is an innovative mixed reality application that uses computer vision to detect and track humans and vehicles in your environment. Each detected object is marked with a color-coded bubble indicator that can be clicked to save and track information about that entity.

### Key Features

- **👤 Human Detection**: Automatically detects and tracks people in your environment
- **🚗 Vehicle Detection**: Identifies cars, trucks, buses, and motorcycles
- **🔴🟡🟢 Color-Coded Status System**:
  - **Red**: Unknown/New entity
  - **Yellow**: Unverified entity
  - **Green**: Verified/Trusted entity
- **📸 Automatic Screenshots**: Captures images each time an entity is detected
- **💾 Local Storage**: Persists all tracked data between sessions
- **📊 Detailed Statistics**:
  - First seen timestamp
  - Last seen timestamp
  - Distance at last sighting
  - Total number of sightings
  - License plate detection (vehicles)
- **🎨 Beautiful Loading Screen**: 3D "OUTSINC" text with cloud animations
- **⚙️ Customizable Settings**: Adjust detection sensitivity, intervals, and more
- **📱 Diagnostics Panel**: Monitor system performance and status

## 📦 Repository Contents

This repository includes:

1. **Web App Prototype** (`webapp/`): A fully functional web-based version
2. **Unity Implementation Guide** (`docs/UNITY_GUIDE.md`): Complete step-by-step instructions for building in Unity
3. **Documentation**: Setup guides and user manuals

## 🚀 Quick Start

### Web App (Demo)

The web app provides a browser-based prototype of OUTSINC:

```bash
# Clone the repository
git clone https://github.com/acesonder/outsincgorillasilver.git
cd outsincgorillasilver/webapp

# Open in browser
# Simply open index.html in a modern web browser
# Or use a local server:
python -m http.server 8000
# Then navigate to http://localhost:8000
```

**Requirements:**
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Camera access permissions
- Local storage enabled

### Unity Version (Meta Quest 3S)

For the full Meta Quest 3S implementation, follow the comprehensive guide:

👉 **[Unity Implementation Guide](docs/UNITY_GUIDE.md)**

## 📱 Web App Features

### 1. Loading Screen
Beautiful animated intro with 3D "OUTSINC" text and cloud background that fades into the main menu.

### 2. Main Menu
- **Start New Session**: Begin detecting and tracking
- **View Saved Items**: Browse all tracked entities
- **Settings**: Customize app behavior
- **Diagnostics**: View system information

### 3. Detection View
Real-time camera feed with overlay bubbles showing detected entities. Click any bubble to:
- Save the entity
- Edit its name
- Change status (red/yellow/green)
- View statistics
- Browse screenshots

### 4. Saved Items Browser
Grid view of all tracked entities with:
- Filtering by type (humans/vehicles)
- Preview screenshots
- Quick stats display
- Click to edit details

### 5. Settings Panel
Adjust parameters:
- Detection sensitivity (0.1 - 1.0)
- Detection interval (ms)
- Max detection distance
- Display options
- Screenshot limits
- Clear all data

### 6. Diagnostics
Monitor:
- System information
- Camera status
- Storage usage
- Detection performance

## 🏗️ Project Structure

```
outsincgorillasilver/
├── webapp/                 # Web application
│   ├── index.html         # Main HTML file
│   ├── css/
│   │   └── styles.css     # Styling
│   └── js/
│       ├── app.js         # Main application logic
│       ├── detection.js   # Detection manager
│       ├── storage.js     # Local storage manager
│       └── ui.js          # UI manager
├── docs/
│   └── UNITY_GUIDE.md     # Complete Unity implementation guide
└── README.md              # This file
```

## 🎮 How to Use

### Web App Usage

1. **Launch**: Open `webapp/index.html` in your browser
2. **Wait**: Watch the OUTSINC loading screen
3. **Menu**: Select from main menu options
4. **Start Session**: Click "Start New Session"
5. **Grant Permissions**: Allow camera access
6. **Detect**: Point camera at people or vehicles
7. **Click Bubbles**: Click red bubbles to track new entities
8. **Edit**: Modify names and set status colors
9. **View Stats**: Check tracking statistics and screenshots

### Unity/Meta Quest 3S Usage

Follow the detailed instructions in [UNITY_GUIDE.md](docs/UNITY_GUIDE.md) to:
1. Set up Unity project
2. Install Meta XR SDK
3. Configure for Quest 3S
4. Implement detection system
5. Build and deploy

## 🔧 Technical Details

### Web App Technology Stack

- **HTML5**: Structure and layout
- **CSS3**: Styling with animations
- **JavaScript (ES6+)**: Application logic
- **Local Storage API**: Data persistence
- **MediaDevices API**: Camera access
- **Canvas API**: Detection visualization

### Detection System

The web app includes a simulated detection system. For production use:

**Recommended ML Models:**
- **COCO-SSD**: General object detection
- **MobileNet**: Lightweight image classification
- **YOLO**: Real-time object detection
- **TensorFlow.js**: In-browser ML inference

**Integration Example:**
```javascript
// Load TensorFlow.js and COCO-SSD
<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs"></script>
<script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd"></script>

// Initialize in detection.js
async initialize() {
    this.model = await cocoSsd.load();
}
```

### Unity Implementation

The Unity version uses:
- **Unity ML-Agents**: Machine learning integration
- **Barracuda**: Neural network inference
- **Meta XR SDK**: Quest 3S integration
- **OpenXR**: Cross-platform XR support
- **Unity UI**: Menu and overlay system

## ⚙️ Configuration

### Settings Options

| Setting | Default | Range | Description |
|---------|---------|-------|-------------|
| Detection Sensitivity | 0.5 | 0.1 - 1.0 | How confident detection must be |
| Detection Interval | 1000ms | 100 - 5000ms | Time between detection checks |
| Max Distance | 20m | 1 - 50m | Maximum detection range |
| Show Labels | On | On/Off | Display names on bubbles |
| Auto Screenshot | On | On/Off | Capture images automatically |
| Show Distance | On | On/Off | Display distance information |
| Max Screenshots | 10 | 1 - 50 | Screenshots stored per entity |

## 🔒 Privacy & Data

- **All data stored locally**: No cloud sync or external servers
- **Camera access**: Used only for real-time detection
- **No tracking**: App does not send any data externally
- **User control**: Delete all data anytime via settings
- **Screenshots**: Stored only on your device

## 🐛 Troubleshooting

### Web App Issues

**Camera not working:**
- Ensure browser has camera permissions
- Try HTTPS connection (required by some browsers)
- Check if camera is used by another app

**Detection not working:**
- Simulated detection is demo-only
- Integrate TensorFlow.js for real detection
- Check console for errors

**Storage full:**
- Clear old data in Settings
- Reduce max screenshots per entity
- Export and backup data

### Unity Issues

See [UNITY_GUIDE.md - Troubleshooting](docs/UNITY_GUIDE.md#troubleshooting) section.

## 🚦 Browser Compatibility

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 90+ | ✅ Full |
| Firefox | 88+ | ✅ Full |
| Safari | 14+ | ✅ Full |
| Edge | 90+ | ✅ Full |

## 📋 Requirements

### Web App
- Modern web browser with camera support
- Minimum 2GB RAM
- Camera device
- ~10MB storage for cached data

### Unity/Meta Quest 3S
- Unity 2022.3 LTS or newer
- Meta Quest 3S headset
- Developer mode enabled
- USB-C cable for deployment
- Windows/Mac/Linux PC

## 🔮 Future Enhancements

Potential additions:
- [ ] Cloud synchronization
- [ ] Multi-user shared tracking
- [ ] Advanced ML model training
- [ ] Voice commands
- [ ] Hand tracking integration
- [ ] Spatial mapping integration
- [ ] Export/import functionality
- [ ] Analytics dashboard

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check the [Unity Guide](docs/UNITY_GUIDE.md) for detailed instructions
- Review the troubleshooting sections

## 🙏 Acknowledgments

- Meta Quest SDK team
- Unity Technologies
- TensorFlow.js team
- Open source community

---

**Made with ❤️ for Mixed Reality**

*Compatible with Meta Quest 3S*
