# OUTSINC Usage Guide

Complete guide for using the OUTSINC Mixed Reality Detection App.

## Table of Contents
1. [Getting Started](#getting-started)
2. [Web App Usage](#web-app-usage)
3. [Features Explained](#features-explained)
4. [Tips & Best Practices](#tips--best-practices)
5. [FAQ](#faq)

---

## Getting Started

### Launching the Web App

#### Option 1: Direct File Access (Simple)
1. Navigate to the `webapp` folder
2. Double-click `index.html`
3. Your default browser will open the app

#### Option 2: Local Server (Recommended)
```bash
cd webapp
python -m http.server 8000
# Then open browser to http://localhost:8000
```

**Why use a server?**
- Better camera access permissions
- More reliable localStorage
- Closer to production environment

### First Time Setup

1. **Loading Screen**: Wait for the OUTSINC logo animation (3 seconds)
2. **Main Menu**: You'll see four options
3. **Camera Permission**: When starting detection, allow camera access

---

## Web App Usage

### Main Menu

The main menu provides four options:

#### 1️⃣ Start New Session
Begin real-time detection and tracking.

**What happens:**
- Camera activates
- Detection system starts
- Bubbles appear over detected objects
- You can click bubbles to track entities

#### 2️⃣ View Saved Items
Browse all tracked entities.

**Features:**
- Filter by type (All/Humans/Vehicles)
- See preview screenshots
- View quick statistics
- Click to edit details

#### 3️⃣ Settings
Customize app behavior.

**Adjustable parameters:**
- Detection sensitivity
- Detection frequency
- Maximum distance
- Display options
- Storage limits

#### 4️⃣ Diagnostics
Monitor system status and performance.

**Information shown:**
- System details
- Camera status
- Storage usage
- Performance metrics

---

## Features Explained

### Detection System

#### How It Works
1. Camera captures video feed
2. Detection algorithm analyzes frames
3. Objects are identified (humans/vehicles)
4. Bubbles appear at detected positions

#### Detection Parameters

**Sensitivity (0.1 - 1.0)**
- Lower = Fewer false positives, might miss some
- Higher = More detections, may include false positives
- Default: 0.5 (balanced)

**Interval (100 - 5000ms)**
- Lower = More frequent checks, higher CPU usage
- Higher = Less frequent, better performance
- Default: 1000ms (1 second)

**Max Distance (1 - 50m)**
- Only detects objects within this range
- Estimated based on object size
- Default: 20m

### Bubble System

#### Color Meanings

🔴 **Red Bubble - Unknown**
- New, untracked entity
- Click to add to tracking
- Default status for new detections

🟡 **Yellow Bubble - Unverified**
- Entity is tracked
- Not yet verified/trusted
- Intermediate status

🟢 **Green Bubble - Verified**
- Entity is trusted
- Fully verified
- High confidence status

#### Interacting with Bubbles

1. **Click to Track**: Click any red bubble to start tracking
2. **View Info**: Click tracked bubbles to see details
3. **Edit Entity**: Opens the entity editor

### Entity Editor

When you click a bubble, the editor opens:

#### Basic Information
- **Name**: Custom name for the entity
- **Status**: Change color (Unknown/Unverified/Verified)
- **Type**: Automatically detected (person/vehicle)

#### Statistics
- **First Seen**: When first detected
- **Last Seen**: Most recent detection
- **Last Distance**: Distance at last sighting
- **Total Sightings**: Number of times seen
- **License Plate**: For vehicles (if detected)

#### Screenshots
- Gallery of captured images
- Click to view full-size
- Automatic capture on detection
- Configurable storage limit

#### Actions
- **Save**: Apply changes
- **Delete**: Remove entity from tracking

### Saved Items View

Browse all tracked entities:

#### Filtering
- **All**: Show everything
- **Humans**: Only people
- **Vehicles**: Only cars/trucks/buses

#### Item Cards
Each card shows:
- Latest screenshot
- Entity name
- Type
- Last seen date/time
- Distance
- Total sightings

Click any card to open the entity editor.

### Settings Panel

#### Detection Settings

**Detection Sensitivity**
- Slider: 0.1 to 1.0
- Affects confidence threshold
- Adjust if too many/few detections

**Detection Interval**
- Input: 100 to 5000ms
- Time between detection checks
- Lower = more responsive, higher CPU

**Max Detection Distance**
- Input: 1 to 50 meters
- Objects beyond this are ignored
- Based on estimated distance

#### Display Settings

**Show Labels on Bubbles**
- Toggle on/off
- Shows entity name on bubble
- Useful for quick identification

**Auto Screenshot on Detection**
- Toggle on/off
- Captures image when entity appears
- Builds history automatically

**Show Distance Information**
- Toggle on/off
- Displays distance on labels
- Helps with spatial awareness

#### Storage Settings

**Max Screenshots per Entity**
- Input: 1 to 50
- Limits storage per entity
- Oldest deleted when limit reached
- Default: 10

**Clear All Data**
- Button: Dangerous action!
- Deletes all tracked entities
- Clears all screenshots
- Cannot be undone

### Diagnostics View

Monitor the app's health:

#### System Information
- User agent (browser details)
- Platform (OS)
- Language
- Screen resolution

#### Camera Status
- Active/Inactive
- Permission status
- Feed resolution

#### Storage Status
- Total entities tracked
- Humans count
- Vehicles count
- Total screenshots
- Storage space used

#### Performance Stats
- Detection active/paused
- Currently detected count
- Currently tracked count
- Frame rate (if available)

---

## Tips & Best Practices

### Getting Best Results

#### Detection Tips

1. **Good Lighting**: Better light = better detection
2. **Clear View**: Avoid obstructions
3. **Steady Camera**: Reduce motion blur
4. **Appropriate Distance**: Too close/far reduces accuracy
5. **One at a Time**: Focus on one entity initially

#### Performance Tips

1. **Adjust Interval**: Increase if performance lags
2. **Lower Sensitivity**: Reduce false positives
3. **Limit Distance**: Focus on nearby objects
4. **Clear Old Data**: Remove unused entities
5. **Restart Browser**: If performance degrades

#### Organization Tips

1. **Name Entities**: Use descriptive names
2. **Update Status**: Change colors as verified
3. **Regular Cleanup**: Delete unnecessary entities
4. **Review Screenshots**: Keep best images
5. **Export Data**: Backup before clearing

### Common Workflows

#### Tracking a New Person

1. Start detection session
2. Point camera at person
3. Wait for red bubble to appear
4. Click the red bubble
5. Enter a name (e.g., "John Smith")
6. Set status to yellow (unverified)
7. Save

Next time:
- Bubble appears as yellow
- Click to view statistics
- Verify and set to green if confirmed

#### Tracking a Vehicle

1. Start detection session
2. Point camera at vehicle
3. Red bubble appears above car
4. Click bubble
5. Name it (e.g., "Blue Honda")
6. Check for license plate (if visible)
7. Save

Vehicle tracking includes:
- Color information
- Vehicle type (car/truck/bus)
- License plate (when detected)

#### Daily Usage

**Morning:**
1. Start session
2. Track people you see
3. Update statuses

**Throughout Day:**
- Quick glances at saved items
- Update information as needed

**Evening:**
- Review statistics
- Clean up duplicates
- Adjust settings if needed

---

## FAQ

### General Questions

**Q: Does this work offline?**
A: Yes! All data is stored locally. No internet required after loading.

**Q: Where is my data stored?**
A: In your browser's localStorage, on your device only.

**Q: Can I export my data?**
A: Currently no built-in export. Future feature planned.

**Q: Is my privacy protected?**
A: Absolutely. No data leaves your device. Camera is local only.

### Technical Questions

**Q: Which browsers work best?**
A: Chrome and Firefox are recommended. Safari and Edge also work.

**Q: Why isn't detection working?**
A: The demo uses simulated detection. For real detection, integrate TensorFlow.js (see README).

**Q: Can I use this on mobile?**
A: Yes, but desktop is recommended for better performance.

**Q: How much storage does it use?**
A: Depends on screenshots. Typically 1-5MB for 50 entities.

### Usage Questions

**Q: How do I delete an entity?**
A: Open entity editor, click "Delete" button at bottom.

**Q: Can I change bubble colors?**
A: Yes, in the entity editor, change the "Status" dropdown.

**Q: How many screenshots are saved?**
A: Default is 10 per entity. Configurable in Settings (1-50).

**Q: What if I close the browser?**
A: All data persists! It will be there when you return.

### Troubleshooting

**Q: Camera permission denied?**
A: Check browser settings, enable camera for this site.

**Q: Bubbles not appearing?**
A: Check detection is not paused. Adjust sensitivity in settings.

**Q: Storage full error?**
A: Clear old data or reduce max screenshots setting.

**Q: App is slow?**
A: Increase detection interval, close other tabs, restart browser.

**Q: Screenshots not saving?**
A: Check localStorage not disabled. Try different browser.

---

## Keyboard Shortcuts

- **Escape**: Close modal or return to menu
- **Space**: Toggle detection (when in MR view)

---

## Best Practices Summary

✅ **DO:**
- Use good lighting
- Name entities clearly
- Update statuses regularly
- Clear old data periodically
- Adjust settings for your needs

❌ **DON'T:**
- Use in complete darkness
- Track too many entities at once
- Leave detection running idle
- Fill storage without cleanup
- Use with other camera apps

---

## Getting Help

If you encounter issues:

1. Check this guide first
2. Review [README.md](../README.md)
3. Check browser console for errors
4. Try different browser
5. Open GitHub issue if problem persists

---

## Future Features

Planned enhancements:
- Real ML detection integration
- Export/import data
- Cloud synchronization
- Hand gesture controls
- Voice commands
- Advanced filtering
- Statistics dashboard

---

**Enjoy using OUTSINC!** 🚀

For Unity implementation, see [UNITY_GUIDE.md](UNITY_GUIDE.md)
