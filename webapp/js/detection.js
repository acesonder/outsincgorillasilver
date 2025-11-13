/**
 * Detection Manager for OUTSINC
 * Handles object detection using TensorFlow.js and COCO-SSD model
 */

class DetectionManager {
    constructor() {
        this.model = null;
        this.isDetecting = false;
        this.detectionInterval = null;
        this.video = null;
        this.canvas = null;
        this.ctx = null;
        this.detectedObjects = new Map();
        this.trackedEntities = new Map();
        
        // Categories we're interested in
        this.humanCategories = ['person'];
        this.vehicleCategories = ['car', 'truck', 'bus', 'motorcycle'];
    }

    async initialize() {
        try {
            // Load the model (we'll use a placeholder detection for now)
            // In a real implementation, you would load TensorFlow.js and COCO-SSD
            console.log('Initializing detection model...');
            this.model = 'placeholder'; // await cocoSsd.load();
            return true;
        } catch (error) {
            console.error('Error initializing detection model:', error);
            return false;
        }
    }

    async startCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'environment',
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            });

            this.video = document.getElementById('camera-feed');
            this.canvas = document.getElementById('detection-canvas');
            
            if (this.video && this.canvas) {
                this.video.srcObject = stream;
                this.ctx = this.canvas.getContext('2d');
                
                this.video.addEventListener('loadedmetadata', () => {
                    this.canvas.width = this.video.videoWidth;
                    this.canvas.height = this.video.videoHeight;
                });

                return true;
            }
            return false;
        } catch (error) {
            console.error('Error accessing camera:', error);
            alert('Unable to access camera. Please ensure camera permissions are granted.');
            return false;
        }
    }

    stopCamera() {
        if (this.video && this.video.srcObject) {
            const tracks = this.video.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            this.video.srcObject = null;
        }
    }

    startDetection() {
        if (!this.model) {
            console.error('Detection model not loaded');
            return;
        }

        const settings = window.storageManager.getSettings();
        this.isDetecting = true;
        
        this.detectionInterval = setInterval(() => {
            this.detectObjects();
        }, settings.detectionInterval);
    }

    stopDetection() {
        this.isDetecting = false;
        if (this.detectionInterval) {
            clearInterval(this.detectionInterval);
            this.detectionInterval = null;
        }
    }

    async detectObjects() {
        if (!this.video || !this.canvas || !this.isDetecting) return;

        try {
            // Clear canvas
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            // In a real implementation, this would use TensorFlow.js
            // For demo purposes, we'll simulate detections
            const predictions = this.simulateDetection();

            // Process predictions
            this.processDetections(predictions);
            
            // Update UI
            this.updateDetectionUI();
        } catch (error) {
            console.error('Error during detection:', error);
        }
    }

    simulateDetection() {
        // Simulate random detections for demo purposes
        const detections = [];
        const settings = window.storageManager.getSettings();
        
        // Randomly detect objects based on sensitivity
        if (Math.random() < settings.detectionSensitivity) {
            const types = ['person', 'car', 'truck', 'bus'];
            const type = types[Math.floor(Math.random() * types.length)];
            
            detections.push({
                class: type,
                score: 0.7 + Math.random() * 0.3,
                bbox: [
                    Math.random() * (this.canvas.width - 200),
                    Math.random() * (this.canvas.height - 200),
                    150 + Math.random() * 100,
                    150 + Math.random() * 100
                ]
            });
        }

        return detections;
    }

    processDetections(predictions) {
        const settings = window.storageManager.getSettings();
        const currentTime = Date.now();

        predictions.forEach(prediction => {
            const type = this.categorizeDetection(prediction.class);
            if (!type) return;

            const objectId = this.getObjectId(prediction);
            const distance = this.estimateDistance(prediction.bbox);

            if (distance <= settings.maxDistance) {
                this.detectedObjects.set(objectId, {
                    id: objectId,
                    type: type,
                    class: prediction.class,
                    bbox: prediction.bbox,
                    score: prediction.score,
                    distance: distance,
                    lastSeen: currentTime
                });
            }
        });

        // Remove old detections (not seen for 3 seconds)
        for (const [id, obj] of this.detectedObjects.entries()) {
            if (currentTime - obj.lastSeen > 3000) {
                this.detectedObjects.delete(id);
            }
        }
    }

    categorizeDetection(className) {
        if (this.humanCategories.includes(className)) {
            return 'person';
        } else if (this.vehicleCategories.includes(className)) {
            return 'vehicle';
        }
        return null;
    }

    getObjectId(prediction) {
        // Generate a consistent ID based on position and class
        const x = Math.floor(prediction.bbox[0] / 50);
        const y = Math.floor(prediction.bbox[1] / 50);
        return `${prediction.class}_${x}_${y}`;
    }

    estimateDistance(bbox) {
        // Rough distance estimation based on bounding box size
        // Larger objects are assumed to be closer
        const area = bbox[2] * bbox[3];
        const maxArea = this.canvas.width * this.canvas.height;
        const ratio = area / maxArea;
        
        // Map ratio to distance (inverse relationship)
        const distance = Math.max(1, Math.min(50, 50 * (1 - ratio)));
        return Math.round(distance * 10) / 10;
    }

    updateDetectionUI() {
        const container = document.getElementById('bubbles-container');
        if (!container) return;

        // Clear existing bubbles
        container.innerHTML = '';

        // Create bubbles for detected objects
        for (const [id, obj] of this.detectedObjects.entries()) {
            const bubble = this.createBubble(obj);
            container.appendChild(bubble);
        }

        // Update stats
        const detectedCount = document.getElementById('detected-count');
        const trackedCount = document.getElementById('tracked-count');
        
        if (detectedCount) {
            detectedCount.textContent = `Detected: ${this.detectedObjects.size}`;
        }
        if (trackedCount) {
            trackedCount.textContent = `Tracked: ${this.trackedEntities.size}`;
        }
    }

    createBubble(obj) {
        const bubble = document.createElement('div');
        bubble.className = 'detection-bubble';
        
        // Check if this object is already tracked
        let status = 'unknown';
        const entity = this.findTrackedEntity(obj);
        if (entity) {
            status = entity.status || 'unknown';
        }

        // Set bubble color based on status
        if (status === 'verified') {
            bubble.classList.add('green');
        } else if (status === 'unverified') {
            bubble.classList.add('yellow');
        } else {
            bubble.classList.add('red');
        }

        // Position bubble
        const x = obj.bbox[0] + obj.bbox[2] / 2 - 40;
        const y = obj.bbox[1] - 80;
        bubble.style.left = `${x}px`;
        bubble.style.top = `${y}px`;

        // Add label if enabled
        const settings = window.storageManager.getSettings();
        if (settings.showLabels) {
            const label = document.createElement('div');
            label.className = 'bubble-label';
            label.textContent = entity?.name || obj.class;
            if (settings.showDistance) {
                label.textContent += ` (${obj.distance}m)`;
            }
            bubble.appendChild(label);
        }

        // Add click handler
        bubble.addEventListener('click', () => {
            this.onBubbleClick(obj);
        });

        return bubble;
    }

    findTrackedEntity(obj) {
        // Look for matching tracked entity
        for (const [id, entity] of this.trackedEntities.entries()) {
            if (entity.type === obj.type && this.isSimilarPosition(entity.lastPosition, obj.bbox)) {
                return entity;
            }
        }
        return null;
    }

    isSimilarPosition(pos1, pos2) {
        if (!pos1 || !pos2) return false;
        const threshold = 100;
        return Math.abs(pos1[0] - pos2[0]) < threshold && 
               Math.abs(pos1[1] - pos2[1]) < threshold;
    }

    async onBubbleClick(obj) {
        // Capture screenshot
        const screenshot = await this.captureScreenshot(obj.bbox);
        
        // Find or create entity
        let entity = this.findTrackedEntity(obj);
        
        if (!entity) {
            // Create new entity
            entity = {
                id: window.storageManager.generateId(),
                type: obj.type,
                class: obj.class,
                name: `${obj.class} #${this.trackedEntities.size + 1}`,
                status: 'unknown',
                lastPosition: obj.bbox,
                lastDistance: obj.distance
            };
            
            // Save to storage
            entity = window.storageManager.saveEntity(entity);
            
            // Add to tracked entities
            this.trackedEntities.set(entity.id, entity);
            
            // Save screenshot
            if (screenshot) {
                window.storageManager.addScreenshot(entity.id, screenshot);
            }
        } else {
            // Update existing entity
            entity.lastSeen = new Date().toISOString();
            entity.lastDistance = obj.distance;
            entity.lastPosition = obj.bbox;
            window.storageManager.updateEntity(entity.id, entity);
            
            // Save screenshot if auto-screenshot is enabled
            const settings = window.storageManager.getSettings();
            if (settings.autoScreenshot && screenshot) {
                window.storageManager.addScreenshot(entity.id, screenshot);
            }
        }

        // Open editor
        if (window.uiManager) {
            window.uiManager.openEntityEditor(entity.id);
        }
    }

    async captureScreenshot(bbox) {
        if (!this.video || !this.canvas) return null;

        try {
            // Create temporary canvas
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            
            // Set canvas size to bounding box size (or larger for context)
            const padding = 50;
            tempCanvas.width = bbox[2] + padding * 2;
            tempCanvas.height = bbox[3] + padding * 2;
            
            // Draw the cropped region
            tempCtx.drawImage(
                this.video,
                bbox[0] - padding, bbox[1] - padding,
                tempCanvas.width, tempCanvas.height,
                0, 0,
                tempCanvas.width, tempCanvas.height
            );
            
            // Convert to data URL
            return tempCanvas.toDataURL('image/jpeg', 0.8);
        } catch (error) {
            console.error('Error capturing screenshot:', error);
            return null;
        }
    }

    loadTrackedEntities() {
        const entities = window.storageManager.getAllEntities();
        this.trackedEntities.clear();
        entities.forEach(entity => {
            this.trackedEntities.set(entity.id, entity);
        });
    }

    getDetectionStats() {
        return {
            isDetecting: this.isDetecting,
            detectedCount: this.detectedObjects.size,
            trackedCount: this.trackedEntities.size,
            cameraActive: this.video && this.video.srcObject !== null
        };
    }
}

// Create global instance
window.detectionManager = new DetectionManager();
