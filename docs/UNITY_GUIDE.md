# OUTSINC Unity Implementation Guide
## Complete Step-by-Step Guide for Meta Quest 3S

This guide provides comprehensive instructions for building the OUTSINC mixed reality detection app in Unity for Meta Quest 3S.

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Project Setup](#project-setup)
3. [Meta Quest SDK Integration](#meta-quest-sdk-integration)
4. [Scene Configuration](#scene-configuration)
5. [Object Detection Implementation](#object-detection-implementation)
6. [UI System](#ui-system)
7. [Data Persistence](#data-persistence)
8. [Meta Quest 3S Optimizations](#meta-quest-3s-optimizations)
9. [Building and Deployment](#building-and-deployment)

---

## Prerequisites

### Required Software
- **Unity Editor**: Version 2022.3 LTS or newer
- **Android Build Support**: Install via Unity Hub
- **JDK**: OpenJDK 11 or newer
- **Android SDK**: API Level 29 or higher
- **Meta Quest Developer Hub**: Latest version
- **Git**: For version control (optional)

### Meta Quest 3S Setup
1. Enable Developer Mode on your Meta Quest 3S:
   - Install Meta Quest mobile app
   - Go to Settings → Developer Mode
   - Toggle Developer Mode ON
2. Connect headset to PC via USB-C cable
3. Accept USB debugging prompt in headset

### Unity Hub Setup
```
1. Download Unity Hub from unity.com
2. Install Unity 2022.3 LTS
3. Add Android Build Support module
4. Add OpenXR Plugin
```

---

## Project Setup

### Step 1: Create New Unity Project

```
1. Open Unity Hub
2. Click "New Project"
3. Select "3D (URP)" template
4. Project Name: "OUTSINC"
5. Location: Choose your preferred directory
6. Click "Create Project"
```

### Step 2: Configure Build Settings

```
1. Go to File → Build Settings
2. Select "Android" platform
3. Click "Switch Platform"
4. Set the following:
   - Texture Compression: ASTC
   - Minimum API Level: Android 10.0 (API Level 29)
   - Target API Level: Android 12.0 (API Level 31)
```

### Step 3: Configure Player Settings

```
1. In Build Settings, click "Player Settings"
2. Company Name: "Your Name"
3. Product Name: "OUTSINC"
4. Package Name: "com.yourname.outsinc"
5. Version: 1.0.0

Under Other Settings:
- Color Space: Linear
- Auto Graphics API: Disable
- Graphics APIs: OpenGLES3, Vulkan
- Multithreaded Rendering: Enable
- Scripting Backend: IL2CPP
- Target Architectures: ARM64

Under XR Settings:
- Stereo Rendering Mode: Multiview
```

---

## Meta Quest SDK Integration

### Step 1: Install Meta XR All-in-One SDK

```
1. Open Package Manager (Window → Package Manager)
2. Click "+" → "Add package from git URL"
3. Enter: https://github.com/oculus-samples/Unity-Movement.git
4. Or download from Meta Developer Portal
```

### Step 2: Install Required Packages

Via Package Manager, install:
- **XR Plugin Management**
- **OpenXR Plugin**
- **Meta XR Core SDK**
- **Meta XR Interaction SDK**
- **Meta XR Platform SDK**

```
Window → Package Manager → Unity Registry
Search and Install:
1. XR Interaction Toolkit
2. XR Plugin Management
3. OpenXR Plugin
```

### Step 3: Configure XR Plugin Management

```
1. Edit → Project Settings → XR Plugin Management
2. Enable "Oculus" under Android tab
3. Go to OpenXR settings:
   - Interaction Profiles: Add "Oculus Touch Controller Profile"
   - Render Mode: Multi-Pass or Single Pass Instanced
   - Depth Submission Mode: Depth 16 Bit
```

### Step 4: Configure Meta Quest Settings

```
1. Edit → Project Settings → Oculus
2. Target Devices: Quest 3S
3. Enable Passthrough: Yes
4. Enable Hand Tracking: Yes
5. Enable Scene Understanding: Yes
```

---

## Scene Configuration

### Step 1: Create Main Scene Structure

```
1. Delete default Main Camera and Directional Light
2. Create new scene: MainScene
3. Save in Assets/Scenes/
```

### Step 2: Add XR Origin

```
1. Right-click in Hierarchy
2. XR → XR Origin (Action-based)
3. This creates:
   - XR Origin
   - Main Camera
   - Left/Right Controllers
```

### Step 3: Enable Passthrough

Create new script: `PassthroughManager.cs`

```csharp
using UnityEngine;
using UnityEngine.XR;

public class PassthroughManager : MonoBehaviour
{
    private OVRPassthroughLayer passthroughLayer;
    
    void Start()
    {
        // Create passthrough layer
        GameObject passthroughObj = new GameObject("Passthrough");
        passthroughLayer = passthroughObj.AddComponent<OVRPassthroughLayer>();
        
        passthroughLayer.textureOpacity = 1f;
        passthroughLayer.edgeRenderingEnabled = false;
        passthroughLayer.hidden = false;
    }
}
```

Attach to XR Origin.

---

## Object Detection Implementation

### Step 1: Install Barracuda (Unity ML)

```
1. Package Manager → Unity Registry
2. Search "Barracuda"
3. Install "Barracuda" package
```

### Step 2: Create Detection Manager

Create script: `DetectionManager.cs`

```csharp
using UnityEngine;
using Unity.Barracuda;
using System.Collections.Generic;

public class DetectionManager : MonoBehaviour
{
    [Header("Detection Settings")]
    public NNModel modelAsset;
    public float detectionThreshold = 0.5f;
    public float detectionInterval = 1.0f;
    public float maxDetectionDistance = 20f;
    
    private Model runtimeModel;
    private IWorker worker;
    private Camera mainCamera;
    private float lastDetectionTime;
    
    private List<DetectedObject> detectedObjects = new List<DetectedObject>();
    
    void Start()
    {
        mainCamera = Camera.main;
        LoadModel();
    }
    
    void LoadModel()
    {
        if (modelAsset != null)
        {
            runtimeModel = ModelLoader.Load(modelAsset);
            worker = WorkerFactory.CreateWorker(WorkerFactory.Type.ComputePrecompiled, runtimeModel);
        }
        else
        {
            Debug.LogWarning("No model asset assigned!");
        }
    }
    
    void Update()
    {
        if (Time.time - lastDetectionTime > detectionInterval)
        {
            PerformDetection();
            lastDetectionTime = Time.time;
        }
    }
    
    void PerformDetection()
    {
        // Get camera texture
        RenderTexture renderTexture = new RenderTexture(416, 416, 24);
        mainCamera.targetTexture = renderTexture;
        mainCamera.Render();
        
        // Convert to Tensor
        Texture2D texture = new Texture2D(416, 416, TextureFormat.RGB24, false);
        RenderTexture.active = renderTexture;
        texture.ReadPixels(new Rect(0, 0, 416, 416), 0, 0);
        texture.Apply();
        
        // Run inference
        Tensor inputTensor = new Tensor(texture, channels: 3);
        worker.Execute(inputTensor);
        
        // Get output
        Tensor outputTensor = worker.PeekOutput();
        
        // Process detections
        ProcessDetections(outputTensor);
        
        // Cleanup
        inputTensor.Dispose();
        mainCamera.targetTexture = null;
        RenderTexture.active = null;
        Destroy(renderTexture);
        Destroy(texture);
    }
    
    void ProcessDetections(Tensor output)
    {
        detectedObjects.Clear();
        
        // Parse output tensor (format depends on model)
        // This is a simplified example
        for (int i = 0; i < output.length; i += 6)
        {
            float confidence = output[i + 4];
            if (confidence > detectionThreshold)
            {
                int classId = Mathf.RoundToInt(output[i + 5]);
                Vector2 center = new Vector2(output[i], output[i + 1]);
                Vector2 size = new Vector2(output[i + 2], output[i + 3]);
                
                DetectedObject obj = new DetectedObject
                {
                    classId = classId,
                    confidence = confidence,
                    boundingBox = new Rect(center.x - size.x / 2, center.y - size.y / 2, size.x, size.y),
                    worldPosition = ScreenToWorldPosition(center)
                };
                
                detectedObjects.Add(obj);
            }
        }
        
        // Notify detection UI
        DetectionUI.Instance?.UpdateDetections(detectedObjects);
    }
    
    Vector3 ScreenToWorldPosition(Vector2 screenPos)
    {
        Ray ray = mainCamera.ScreenPointToRay(new Vector3(screenPos.x * Screen.width, screenPos.y * Screen.height, 0));
        return ray.GetPoint(5f); // 5 meters in front
    }
    
    void OnDestroy()
    {
        worker?.Dispose();
    }
}

[System.Serializable]
public class DetectedObject
{
    public int classId;
    public float confidence;
    public Rect boundingBox;
    public Vector3 worldPosition;
    public float distance;
}
```

### Step 3: Create Bubble UI System

Create script: `BubbleIndicator.cs`

```csharp
using UnityEngine;
using TMPro;

public class BubbleIndicator : MonoBehaviour
{
    public enum BubbleStatus { Unknown, Unverified, Verified }
    
    [Header("References")]
    public MeshRenderer bubbleRenderer;
    public TextMeshPro labelText;
    public Canvas infoCanvas;
    
    [Header("Colors")]
    public Color redColor = Color.red;
    public Color yellowColor = Color.yellow;
    public Color greenColor = Color.green;
    
    private BubbleStatus currentStatus = BubbleStatus.Unknown;
    private TrackedEntity entity;
    
    void Start()
    {
        SetStatus(BubbleStatus.Unknown);
    }
    
    public void SetStatus(BubbleStatus status)
    {
        currentStatus = status;
        
        Color targetColor = status switch
        {
            BubbleStatus.Verified => greenColor,
            BubbleStatus.Unverified => yellowColor,
            _ => redColor
        };
        
        bubbleRenderer.material.color = targetColor;
        bubbleRenderer.material.SetColor("_EmissionColor", targetColor * 0.5f);
    }
    
    public void SetEntity(TrackedEntity trackedEntity)
    {
        entity = trackedEntity;
        labelText.text = entity.name;
        SetStatus(entity.status);
    }
    
    void Update()
    {
        // Billboard effect - always face camera
        transform.LookAt(Camera.main.transform);
        transform.Rotate(0, 180, 0);
        
        // Pulsing animation
        float scale = 1f + Mathf.Sin(Time.time * 2f) * 0.1f;
        transform.localScale = Vector3.one * scale;
    }
    
    public void OnBubbleClicked()
    {
        EntityEditorUI.Instance?.OpenEditor(entity);
        AudioManager.Instance?.PlayClickSound();
    }
}
```

### Step 4: Create Object Spawner

Create script: `BubbleSpawner.cs`

```csharp
using UnityEngine;
using System.Collections.Generic;

public class BubbleSpawner : MonoBehaviour
{
    [Header("Prefabs")]
    public GameObject bubblePrefab;
    
    [Header("Settings")]
    public float bubbleHeight = 2f;
    
    private Dictionary<string, GameObject> activeBubbles = new Dictionary<string, GameObject>();
    
    public void SpawnBubble(DetectedObject detection, TrackedEntity entity)
    {
        string key = entity?.id ?? $"temp_{detection.classId}_{Time.time}";
        
        if (activeBubbles.ContainsKey(key))
        {
            // Update existing bubble
            UpdateBubblePosition(key, detection.worldPosition);
            return;
        }
        
        // Create new bubble
        Vector3 spawnPos = detection.worldPosition + Vector3.up * bubbleHeight;
        GameObject bubble = Instantiate(bubblePrefab, spawnPos, Quaternion.identity);
        
        BubbleIndicator indicator = bubble.GetComponent<BubbleIndicator>();
        if (entity != null)
        {
            indicator.SetEntity(entity);
        }
        
        activeBubbles[key] = bubble;
    }
    
    public void UpdateBubblePosition(string key, Vector3 worldPos)
    {
        if (activeBubbles.TryGetValue(key, out GameObject bubble))
        {
            bubble.transform.position = worldPos + Vector3.up * bubbleHeight;
        }
    }
    
    public void RemoveBubble(string key)
    {
        if (activeBubbles.TryGetValue(key, out GameObject bubble))
        {
            Destroy(bubble);
            activeBubbles.Remove(key);
        }
    }
    
    public void ClearAllBubbles()
    {
        foreach (var bubble in activeBubbles.Values)
        {
            Destroy(bubble);
        }
        activeBubbles.Clear();
    }
}
```

---

## UI System

### Step 1: Create Loading Screen

```
1. Create Canvas: UI → Canvas
2. Name: "LoadingCanvas"
3. Canvas Scaler: Scale With Screen Size
4. Reference Resolution: 1920x1080
5. Add Image for background
6. Add TextMeshPro for "OUTSINC" text
7. Add Animation: Fade in/out
```

Create script: `LoadingScreen.cs`

```csharp
using UnityEngine;
using UnityEngine.UI;
using TMPro;
using System.Collections;

public class LoadingScreen : MonoBehaviour
{
    public TextMeshProUGUI logoText;
    public Image background;
    public float fadeDuration = 2f;
    public float displayDuration = 3f;
    
    void Start()
    {
        StartCoroutine(ShowLoadingSequence());
    }
    
    IEnumerator ShowLoadingSequence()
    {
        // Fade in logo
        yield return FadeText(logoText, 0f, 1f, fadeDuration);
        
        // Hold
        yield return new WaitForSeconds(displayDuration);
        
        // Fade out everything
        yield return FadeOut();
        
        // Load main menu
        MenuManager.Instance?.ShowMainMenu();
        gameObject.SetActive(false);
    }
    
    IEnumerator FadeText(TextMeshProUGUI text, float from, float to, float duration)
    {
        float elapsed = 0f;
        Color color = text.color;
        
        while (elapsed < duration)
        {
            elapsed += Time.deltaTime;
            color.a = Mathf.Lerp(from, to, elapsed / duration);
            text.color = color;
            yield return null;
        }
    }
    
    IEnumerator FadeOut()
    {
        yield return FadeText(logoText, 1f, 0f, fadeDuration);
        
        // Fade background
        float elapsed = 0f;
        Color bgColor = background.color;
        
        while (elapsed < fadeDuration)
        {
            elapsed += Time.deltaTime;
            bgColor.a = Mathf.Lerp(1f, 0f, elapsed / fadeDuration);
            background.color = bgColor;
            yield return null;
        }
    }
}
```

### Step 2: Create Main Menu

Create script: `MenuManager.cs`

```csharp
using UnityEngine;
using UnityEngine.UI;

public class MenuManager : MonoBehaviour
{
    public static MenuManager Instance { get; private set; }
    
    [Header("UI Panels")]
    public GameObject mainMenuPanel;
    public GameObject settingsPanel;
    public GameObject savedItemsPanel;
    public GameObject diagnosticsPanel;
    
    [Header("Buttons")]
    public Button startButton;
    public Button viewItemsButton;
    public Button settingsButton;
    public Button diagnosticsButton;
    
    void Awake()
    {
        Instance = this;
    }
    
    void Start()
    {
        SetupButtons();
        ShowMainMenu();
    }
    
    void SetupButtons()
    {
        startButton.onClick.AddListener(OnStartSession);
        viewItemsButton.onClick.AddListener(OnViewItems);
        settingsButton.onClick.AddListener(OnSettings);
        diagnosticsButton.onClick.AddListener(OnDiagnostics);
    }
    
    public void ShowMainMenu()
    {
        HideAllPanels();
        mainMenuPanel.SetActive(true);
    }
    
    void HideAllPanels()
    {
        mainMenuPanel.SetActive(false);
        settingsPanel.SetActive(false);
        savedItemsPanel.SetActive(false);
        diagnosticsPanel.SetActive(false);
    }
    
    void OnStartSession()
    {
        HideAllPanels();
        GameManager.Instance?.StartDetectionSession();
    }
    
    void OnViewItems()
    {
        HideAllPanels();
        savedItemsPanel.SetActive(true);
        SavedItemsUI.Instance?.LoadItems();
    }
    
    void OnSettings()
    {
        HideAllPanels();
        settingsPanel.SetActive(true);
        SettingsUI.Instance?.LoadSettings();
    }
    
    void OnDiagnostics()
    {
        HideAllPanels();
        diagnosticsPanel.SetActive(true);
        DiagnosticsUI.Instance?.LoadDiagnostics();
    }
}
```

---

## Data Persistence

### Step 1: Create Data Models

Create script: `DataModels.cs`

```csharp
using System;
using System.Collections.Generic;
using UnityEngine;

[Serializable]
public class TrackedEntity
{
    public string id;
    public string name;
    public string type; // "person" or "vehicle"
    public BubbleIndicator.BubbleStatus status;
    public DateTime firstSeen;
    public DateTime lastSeen;
    public float lastDistance;
    public int totalSightings;
    public List<string> screenshotPaths;
    public string licensePlate; // For vehicles
}

[Serializable]
public class AppSettings
{
    public float detectionSensitivity = 0.5f;
    public float detectionInterval = 1.0f;
    public float maxDistance = 20f;
    public bool showLabels = true;
    public bool autoScreenshot = true;
    public bool showDistance = true;
    public int maxScreenshots = 10;
}

[Serializable]
public class GameData
{
    public List<TrackedEntity> entities = new List<TrackedEntity>();
    public AppSettings settings = new AppSettings();
}
```

### Step 2: Create Save System

Create script: `SaveManager.cs`

```csharp
using System.IO;
using UnityEngine;

public class SaveManager : MonoBehaviour
{
    public static SaveManager Instance { get; private set; }
    
    private string saveFilePath;
    private GameData gameData;
    
    void Awake()
    {
        Instance = this;
        saveFilePath = Path.Combine(Application.persistentDataPath, "gamedata.json");
        LoadData();
    }
    
    public void LoadData()
    {
        if (File.Exists(saveFilePath))
        {
            string json = File.ReadAllText(saveFilePath);
            gameData = JsonUtility.FromJson<GameData>(json);
        }
        else
        {
            gameData = new GameData();
        }
    }
    
    public void SaveData()
    {
        string json = JsonUtility.ToJson(gameData, true);
        File.WriteAllText(saveFilePath, json);
        Debug.Log($"Data saved to {saveFilePath}");
    }
    
    public void SaveEntity(TrackedEntity entity)
    {
        var existing = gameData.entities.Find(e => e.id == entity.id);
        if (existing != null)
        {
            gameData.entities.Remove(existing);
        }
        gameData.entities.Add(entity);
        SaveData();
    }
    
    public TrackedEntity GetEntity(string id)
    {
        return gameData.entities.Find(e => e.id == id);
    }
    
    public List<TrackedEntity> GetAllEntities()
    {
        return gameData.entities;
    }
    
    public void DeleteEntity(string id)
    {
        gameData.entities.RemoveAll(e => e.id == id);
        SaveData();
    }
    
    public void SaveSettings(AppSettings settings)
    {
        gameData.settings = settings;
        SaveData();
    }
    
    public AppSettings GetSettings()
    {
        return gameData.settings;
    }
    
    public void ClearAllData()
    {
        gameData = new GameData();
        SaveData();
    }
    
    public void SaveScreenshot(string entityId, Texture2D screenshot)
    {
        string screenshotDir = Path.Combine(Application.persistentDataPath, "screenshots");
        if (!Directory.Exists(screenshotDir))
        {
            Directory.CreateDirectory(screenshotDir);
        }
        
        string filename = $"{entityId}_{System.DateTime.Now.Ticks}.png";
        string filepath = Path.Combine(screenshotDir, filename);
        
        byte[] bytes = screenshot.EncodeToPNG();
        File.WriteAllBytes(filepath, bytes);
        
        var entity = GetEntity(entityId);
        if (entity != null)
        {
            if (entity.screenshotPaths == null)
                entity.screenshotPaths = new List<string>();
            
            entity.screenshotPaths.Add(filepath);
            
            // Keep only max screenshots
            int maxScreenshots = gameData.settings.maxScreenshots;
            if (entity.screenshotPaths.Count > maxScreenshots)
            {
                entity.screenshotPaths.RemoveAt(0);
            }
            
            SaveEntity(entity);
        }
    }
}
```

### Step 3: Create Screenshot Manager

Create script: `ScreenshotManager.cs`

```csharp
using UnityEngine;
using System.Collections;

public class ScreenshotManager : MonoBehaviour
{
    public static ScreenshotManager Instance { get; private set; }
    
    void Awake()
    {
        Instance = this;
    }
    
    public IEnumerator CaptureScreenshot(string entityId)
    {
        // Wait for end of frame
        yield return new WaitForEndOfFrame();
        
        // Create texture
        Texture2D screenshot = new Texture2D(Screen.width, Screen.height, TextureFormat.RGB24, false);
        screenshot.ReadPixels(new Rect(0, 0, Screen.width, Screen.height), 0, 0);
        screenshot.Apply();
        
        // Save
        SaveManager.Instance?.SaveScreenshot(entityId, screenshot);
        
        // Cleanup
        Destroy(screenshot);
    }
}
```

---

## Meta Quest 3S Optimizations

### Performance Settings

```csharp
// Add to GameManager.cs Start() method

void OptimizeForQuest3S()
{
    // Set target frame rate
    Application.targetFrameRate = 90; // Quest 3S supports 90Hz
    
    // Enable foveated rendering
    OVRManager.fixedFoveatedRenderingLevel = OVRManager.FixedFoveatedRenderingLevel.High;
    
    // Set CPU/GPU levels
    OVRManager.cpuLevel = 3;
    OVRManager.gpuLevel = 3;
    
    // Enable dynamic resolution
    OVRManager.eyeTextureResolutionScale = 1.0f;
    
    // Quality settings
    QualitySettings.vSyncCount = 0;
    QualitySettings.antiAliasing = 2;
    QualitySettings.shadows = ShadowQuality.HardOnly;
    
    // Physics settings
    Physics.defaultSolverIterations = 4;
    Physics.defaultSolverVelocityIterations = 1;
}
```

### Memory Management

```csharp
// Add memory management
using UnityEngine.Profiling;

public class MemoryManager : MonoBehaviour
{
    public float checkInterval = 30f;
    private float lastCheckTime;
    
    void Update()
    {
        if (Time.time - lastCheckTime > checkInterval)
        {
            CheckMemory();
            lastCheckTime = Time.time;
        }
    }
    
    void CheckMemory()
    {
        long totalMemory = Profiler.GetTotalReservedMemoryLong();
        long usedMemory = Profiler.GetTotalAllocatedMemoryLong();
        
        float percentUsed = (float)usedMemory / totalMemory;
        
        if (percentUsed > 0.85f)
        {
            Debug.LogWarning("Memory usage high, cleaning up...");
            Resources.UnloadUnusedAssets();
            System.GC.Collect();
        }
    }
}
```

---

## Building and Deployment

### Step 1: Pre-Build Checklist

```
✓ All scenes added to Build Settings
✓ XR Plugin Management configured
✓ Android platform selected
✓ Package name set correctly
✓ Signing key configured (if required)
✓ All required permissions added
```

### Step 2: Configure Android Manifest

Create or edit: `Assets/Plugins/Android/AndroidManifest.xml`

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    
    <uses-feature android:name="android.hardware.camera" android:required="true" />
    <uses-feature android:name="android.hardware.vr.headtracking" android:required="true" android:version="1" />
    
    <application>
        <meta-data android:name="com.oculus.supportedDevices" android:value="quest3s" />
        <meta-data android:name="com.oculus.intent.category.VR" android:value="vr_only" />
    </application>
</manifest>
```

### Step 3: Build APK

```
1. File → Build Settings
2. Click "Build" or "Build And Run"
3. Choose output location
4. Wait for build to complete
```

### Step 4: Install on Quest 3S

**Option A: Via Unity (Build and Run)**
- Connect Quest via USB
- Click "Build and Run"
- Wear headset and accept installation

**Option B: Via ADB**
```bash
adb install -r YourApp.apk
```

**Option C: Via Meta Quest Developer Hub**
```
1. Open MQDH
2. Connect device
3. Go to "Device Manager"
4. Click "Install APK"
5. Select your APK file
```

### Step 5: Testing Checklist

```
✓ App launches successfully
✓ Loading screen displays correctly
✓ Passthrough is visible
✓ Main menu is interactive
✓ Detection system initializes
✓ Bubbles appear and are clickable
✓ Entity data saves/loads correctly
✓ Screenshots capture properly
✓ Settings persist
✓ Performance is smooth (90fps)
```

---

## Troubleshooting

### Common Issues

**Issue: Black screen on Quest**
- Solution: Ensure passthrough is properly configured
- Check XR Origin camera settings
- Verify Oculus plugin is enabled

**Issue: Detection not working**
- Solution: Check model is assigned
- Verify Barracuda package is installed
- Test camera feed is accessible

**Issue: Poor performance**
- Solution: Lower texture quality
- Reduce detection frequency
- Enable dynamic batching
- Use object pooling for bubbles

**Issue: APK won't install**
- Solution: Check package name is unique
- Verify signing configuration
- Ensure Quest is in developer mode
- Try uninstalling previous version

---

## Additional Resources

### Meta Quest Documentation
- [Meta Quest Developer Center](https://developer.oculus.com/)
- [Unity XR Documentation](https://docs.unity3d.com/Manual/XR.html)
- [OpenXR Plugin Guide](https://docs.unity3d.com/Packages/com.unity.xr.openxr@latest)

### Machine Learning Resources
- [Barracuda Documentation](https://docs.unity3d.com/Packages/com.unity.barracuda@latest)
- [ONNX Model Zoo](https://github.com/onnx/models)
- [TensorFlow to ONNX Conversion](https://github.com/onnx/tensorflow-onnx)

### Community Support
- Unity Forums: [XR Section](https://forum.unity.com/forums/xr.197/)
- Meta Quest Developers: [Discord](https://discord.gg/oculus)
- Reddit: r/OculusQuest, r/Unity3D

---

## Next Steps

1. **Enhance Detection**: Train custom ML models for better accuracy
2. **Add Features**: Implement hand tracking, voice commands
3. **Multiplayer**: Add shared AR experiences
4. **Cloud Sync**: Sync tracked entities across devices
5. **Analytics**: Track usage patterns and improve UX

---

## Conclusion

This guide provides everything needed to build OUTSINC for Meta Quest 3S. Follow each step carefully, test frequently, and refer to the troubleshooting section as needed.

For questions or support, please refer to the resources section above.

**Happy developing!**
