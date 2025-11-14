# OUTSINC Quick Start Guide

Get up and running with OUTSINC in 5 minutes!

## 🚀 For the Web App

### Step 1: Get the Code
```bash
git clone https://github.com/acesonder/outsincgorillasilver.git
cd outsincgorillasilver/webapp
```

### Step 2: Run It

**Option A - Simple (Double Click)**
```
Just open webapp/index.html in your browser!
```

**Option B - Local Server (Better)**
```bash
# Using Python 3
python -m http.server 8000

# Or Python 2
python -m SimpleHTTPServer 8000

# Or Node.js (if you have http-server)
npx http-server -p 8000
```

Then open: `http://localhost:8000`

### Step 3: Use It
1. ✅ Watch the loading screen animation
2. ✅ Click "Start New Session" from menu
3. ✅ Allow camera access when prompted
4. ✅ Point camera around - bubbles will appear
5. ✅ Click red bubbles to track entities
6. ✅ Edit names and set status colors

**That's it!** You're tracking!

---

## 🎮 For Meta Quest 3S (Unity)

### Prerequisites
- Unity 2022.3 LTS or newer
- Meta Quest 3S headset
- Developer mode enabled
- USB-C cable

### Quick Setup

1. **Create Unity Project**
   ```
   - Open Unity Hub
   - New Project → 3D (URP)
   - Name: OUTSINC
   ```

2. **Switch to Android**
   ```
   - File → Build Settings
   - Select Android
   - Switch Platform
   ```

3. **Install Meta XR SDK**
   ```
   - Package Manager
   - Add package from git URL
   - Install Meta XR All-in-One SDK
   ```

4. **Follow Full Guide**
   
   📖 See [UNITY_GUIDE.md](UNITY_GUIDE.md) for complete instructions

---

## 📱 Features Overview

### What You Can Do

✅ **Detect & Track**
- Humans (people in your view)
- Vehicles (cars, trucks, buses)

✅ **Color-Code Entities**
- 🔴 Red = New/Unknown
- 🟡 Yellow = Unverified
- 🟢 Green = Verified/Trusted

✅ **Save Information**
- Custom names
- First seen / Last seen
- Distance tracking
- Sighting count
- Screenshots

✅ **Browse History**
- View all tracked entities
- Filter by type
- Review screenshots
- Check statistics

✅ **Customize Settings**
- Detection sensitivity
- Detection frequency
- Display options
- Storage limits

---

## 🎯 Quick Tips

### For Best Detection
- ✅ Good lighting helps
- ✅ Clear, unobstructed view
- ✅ Point camera at subjects
- ✅ Allow camera permissions
- ✅ Adjust sensitivity if needed

### Managing Data
- 📝 Name entities descriptively
- 🎨 Update colors as you verify
- 🗑️ Clean up old/duplicate entries
- 💾 Data saves automatically

### Performance
- ⚡ Increase interval if slow
- 📊 Check diagnostics panel
- 🔄 Restart browser if needed
- 🧹 Clear old screenshots

---

## 🆘 Quick Troubleshooting

### Camera Not Working?
```
1. Check browser permissions
2. Try HTTPS connection
3. Close other camera apps
4. Try different browser
```

### No Bubbles Appearing?
```
1. Ensure detection not paused
2. Adjust sensitivity (Settings)
3. Check console for errors
4. Verify camera is working
```

### Slow Performance?
```
1. Increase detection interval
2. Close unused browser tabs
3. Clear old data
4. Reduce max screenshots
```

---

## 📚 Next Steps

Once you're up and running:

1. **Explore Features**
   - Try all menu options
   - Experiment with settings
   - Track various entities

2. **Read Full Docs**
   - [Usage Guide](USAGE_GUIDE.md) - Detailed features
   - [Unity Guide](UNITY_GUIDE.md) - Quest 3S version
   - [README](../README.md) - Full documentation

3. **Customize**
   - Adjust settings to your needs
   - Integrate real ML models
   - Build for Quest 3S

---

## 🔗 Important Links

- **Full README**: [README.md](../README.md)
- **Usage Guide**: [USAGE_GUIDE.md](USAGE_GUIDE.md)
- **Unity Guide**: [UNITY_GUIDE.md](UNITY_GUIDE.md)
- **GitHub Repo**: [outsincgorillasilver](https://github.com/acesonder/outsincgorillasilver)

---

## ✅ Checklist

Before you start, ensure:

**Web App:**
- [ ] Modern browser (Chrome, Firefox, Safari, Edge)
- [ ] Camera device available
- [ ] Camera permissions granted
- [ ] Local storage enabled

**Unity/Quest:**
- [ ] Unity 2022.3+ installed
- [ ] Android Build Support
- [ ] Meta Quest 3S headset
- [ ] Developer mode enabled
- [ ] USB cable for deployment

---

**You're all set! Start tracking!** 🎉

For questions: Open an issue on GitHub or check the [Usage Guide](USAGE_GUIDE.md)
