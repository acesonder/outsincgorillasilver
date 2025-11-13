/**
 * UI Manager for OUTSINC
 * Handles all UI interactions and view management
 */

class UIManager {
    constructor() {
        this.currentView = null;
        this.currentEntity = null;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Main menu buttons
        document.getElementById('start-btn')?.addEventListener('click', () => {
            this.showMRView();
        });

        document.getElementById('view-items-btn')?.addEventListener('click', () => {
            this.showSavedItemsView();
        });

        document.getElementById('settings-btn')?.addEventListener('click', () => {
            this.showSettingsView();
        });

        document.getElementById('diagnostics-btn')?.addEventListener('click', () => {
            this.showDiagnosticsView();
        });

        // MR View controls
        document.getElementById('back-to-menu-btn')?.addEventListener('click', () => {
            this.showMainMenu();
        });

        document.getElementById('toggle-detection-btn')?.addEventListener('click', (e) => {
            this.toggleDetection(e.target);
        });

        // Saved Items View
        document.getElementById('close-items-btn')?.addEventListener('click', () => {
            this.showMainMenu();
        });

        // Filter tabs
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.filterItems(e.target.dataset.filter);
            });
        });

        // Entity Editor
        document.getElementById('close-editor-btn')?.addEventListener('click', () => {
            this.closeEntityEditor();
        });

        document.getElementById('save-entity-btn')?.addEventListener('click', () => {
            this.saveEntityChanges();
        });

        document.getElementById('delete-entity-btn')?.addEventListener('click', () => {
            this.deleteEntity();
        });

        // Settings View
        document.getElementById('close-settings-btn')?.addEventListener('click', () => {
            this.showMainMenu();
        });

        this.initializeSettingsControls();

        // Diagnostics View
        document.getElementById('close-diagnostics-btn')?.addEventListener('click', () => {
            this.showMainMenu();
        });
    }

    initializeSettingsControls() {
        const sensitivityInput = document.getElementById('detection-sensitivity');
        const sensitivityValue = document.getElementById('sensitivity-value');
        
        if (sensitivityInput && sensitivityValue) {
            sensitivityInput.addEventListener('input', (e) => {
                sensitivityValue.textContent = e.target.value;
            });
        }

        document.getElementById('clear-storage-btn')?.addEventListener('click', () => {
            if (window.storageManager.clearAllData()) {
                alert('All data cleared successfully!');
                this.showMainMenu();
            }
        });

        // Load current settings
        this.loadSettings();
    }

    loadSettings() {
        const settings = window.storageManager.getSettings();
        
        const elements = {
            'detection-sensitivity': settings.detectionSensitivity,
            'detection-interval': settings.detectionInterval,
            'max-distance': settings.maxDistance,
            'show-labels': settings.showLabels,
            'auto-screenshot': settings.autoScreenshot,
            'show-distance': settings.showDistance,
            'max-screenshots': settings.maxScreenshots
        };

        for (const [id, value] of Object.entries(elements)) {
            const element = document.getElementById(id);
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = value;
                } else {
                    element.value = value;
                }
            }
        }

        // Update sensitivity display
        const sensitivityValue = document.getElementById('sensitivity-value');
        if (sensitivityValue) {
            sensitivityValue.textContent = settings.detectionSensitivity;
        }
    }

    saveSettings() {
        const settings = {
            detectionSensitivity: parseFloat(document.getElementById('detection-sensitivity').value),
            detectionInterval: parseInt(document.getElementById('detection-interval').value),
            maxDistance: parseInt(document.getElementById('max-distance').value),
            showLabels: document.getElementById('show-labels').checked,
            autoScreenshot: document.getElementById('auto-screenshot').checked,
            showDistance: document.getElementById('show-distance').checked,
            maxScreenshots: parseInt(document.getElementById('max-screenshots').value)
        };

        window.storageManager.saveSettings(settings);
    }

    hideAllViews() {
        document.getElementById('loading-screen')?.classList.add('hidden');
        document.getElementById('main-menu')?.classList.add('hidden');
        document.getElementById('mr-view')?.classList.add('hidden');
        document.getElementById('saved-items-view')?.classList.add('hidden');
        document.getElementById('settings-view')?.classList.add('hidden');
        document.getElementById('diagnostics-view')?.classList.add('hidden');
    }

    showLoadingScreen() {
        this.hideAllViews();
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.classList.remove('hidden');
        loadingScreen.classList.remove('fade-out');
        
        // Fade out after 3 seconds
        setTimeout(() => {
            loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                this.showMainMenu();
            }, 1000);
        }, 3000);
    }

    showMainMenu() {
        this.hideAllViews();
        document.getElementById('main-menu')?.classList.remove('hidden');
        this.currentView = 'menu';
        
        // Stop detection and camera if active
        window.detectionManager.stopDetection();
        window.detectionManager.stopCamera();
        
        // Save settings if coming from settings view
        if (this.currentView === 'settings') {
            this.saveSettings();
        }
    }

    async showMRView() {
        this.hideAllViews();
        document.getElementById('mr-view')?.classList.remove('hidden');
        this.currentView = 'mr';

        // Initialize camera and detection
        const cameraStarted = await window.detectionManager.startCamera();
        if (cameraStarted) {
            await window.detectionManager.initialize();
            window.detectionManager.loadTrackedEntities();
            window.detectionManager.startDetection();
        } else {
            alert('Failed to start camera. Returning to menu.');
            this.showMainMenu();
        }
    }

    showSavedItemsView() {
        this.hideAllViews();
        document.getElementById('saved-items-view')?.classList.remove('hidden');
        this.currentView = 'items';
        this.loadSavedItems('all');
    }

    showSettingsView() {
        this.hideAllViews();
        document.getElementById('settings-view')?.classList.remove('hidden');
        this.currentView = 'settings';
        this.loadSettings();
    }

    showDiagnosticsView() {
        this.hideAllViews();
        document.getElementById('diagnostics-view')?.classList.remove('hidden');
        this.currentView = 'diagnostics';
        this.loadDiagnostics();
    }

    toggleDetection(button) {
        if (window.detectionManager.isDetecting) {
            window.detectionManager.stopDetection();
            button.textContent = 'Resume Detection';
        } else {
            window.detectionManager.startDetection();
            button.textContent = 'Pause Detection';
        }
    }

    loadSavedItems(filter = 'all') {
        const itemsGrid = document.getElementById('items-grid');
        if (!itemsGrid) return;

        itemsGrid.innerHTML = '';

        let entities = window.storageManager.getAllEntities();

        // Apply filter
        if (filter === 'person') {
            entities = entities.filter(e => e.type === 'person');
        } else if (filter === 'vehicle') {
            entities = entities.filter(e => e.type === 'vehicle');
        }

        // Update filter tabs
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.filter === filter);
        });

        if (entities.length === 0) {
            itemsGrid.innerHTML = '<p style="color: rgba(255,255,255,0.6); text-align: center; grid-column: 1/-1;">No saved items found.</p>';
            return;
        }

        // Sort by last seen (most recent first)
        entities.sort((a, b) => new Date(b.lastSeen) - new Date(a.lastSeen));

        entities.forEach(entity => {
            const card = this.createItemCard(entity);
            itemsGrid.appendChild(card);
        });
    }

    createItemCard(entity) {
        const card = document.createElement('div');
        card.className = `item-card ${entity.status || 'unknown'}`;

        const screenshot = entity.screenshots?.[entity.screenshots.length - 1];
        const screenshotData = screenshot?.data || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect width="100" height="100" fill="%23333"/%3E%3Ctext x="50" y="50" text-anchor="middle" fill="%23666" font-size="14"%3ENo Image%3C/text%3E%3C/svg%3E';

        const lastSeen = entity.lastSeen ? new Date(entity.lastSeen).toLocaleString() : 'Unknown';
        const distance = entity.lastDistance ? `${entity.lastDistance}m` : 'Unknown';

        card.innerHTML = `
            <img src="${screenshotData}" alt="${entity.name}" class="item-screenshot">
            <div class="item-info">
                <h3>${entity.name}</h3>
                <p>Type: ${entity.type}</p>
                <p>Last Seen: ${lastSeen}</p>
                <p>Distance: ${distance}</p>
                <p>Sightings: ${entity.totalSightings || 0}</p>
            </div>
        `;

        card.addEventListener('click', () => {
            this.openEntityEditor(entity.id);
        });

        return card;
    }

    filterItems(filter) {
        this.loadSavedItems(filter);
    }

    openEntityEditor(entityId) {
        const entity = window.storageManager.getEntity(entityId);
        if (!entity) return;

        this.currentEntity = entity;

        const editor = document.getElementById('entity-editor');
        editor.classList.remove('hidden');

        // Populate form
        document.getElementById('editor-title').textContent = `Edit: ${entity.name}`;
        document.getElementById('entity-name').value = entity.name;
        document.getElementById('entity-status').value = entity.status || 'unknown';
        document.getElementById('entity-type').value = entity.type;

        // Populate statistics
        document.getElementById('first-seen').textContent = entity.firstSeen ? 
            new Date(entity.firstSeen).toLocaleString() : 'Unknown';
        document.getElementById('last-seen').textContent = entity.lastSeen ? 
            new Date(entity.lastSeen).toLocaleString() : 'Unknown';
        document.getElementById('last-distance').textContent = entity.lastDistance ? 
            `${entity.lastDistance}m` : 'Unknown';
        document.getElementById('total-sightings').textContent = entity.totalSightings || 0;

        // Show license plate for vehicles
        const licensePlateGroup = document.getElementById('license-plate-group');
        if (entity.type === 'vehicle') {
            licensePlateGroup.style.display = 'flex';
            document.getElementById('license-plate').textContent = entity.licensePlate || 'Not detected';
        } else {
            licensePlateGroup.style.display = 'none';
        }

        // Load screenshots
        this.loadEntityScreenshots(entity);
    }

    loadEntityScreenshots(entity) {
        const grid = document.getElementById('screenshots-grid');
        grid.innerHTML = '';

        if (!entity.screenshots || entity.screenshots.length === 0) {
            grid.innerHTML = '<p style="color: rgba(255,255,255,0.6);">No screenshots available</p>';
            return;
        }

        entity.screenshots.forEach((screenshot, index) => {
            const img = document.createElement('img');
            img.src = screenshot.data;
            img.alt = `Screenshot ${index + 1}`;
            img.className = 'screenshot-thumb';
            img.title = new Date(screenshot.timestamp).toLocaleString();
            
            img.addEventListener('click', () => {
                this.viewScreenshotFullsize(screenshot.data);
            });

            grid.appendChild(img);
        });
    }

    viewScreenshotFullsize(dataUrl) {
        const win = window.open('', '_blank');
        win.document.write(`<img src="${dataUrl}" style="max-width:100%;height:auto;">`);
    }

    closeEntityEditor() {
        document.getElementById('entity-editor').classList.add('hidden');
        this.currentEntity = null;
    }

    saveEntityChanges() {
        if (!this.currentEntity) return;

        const updates = {
            name: document.getElementById('entity-name').value,
            status: document.getElementById('entity-status').value
        };

        window.storageManager.updateEntity(this.currentEntity.id, updates);
        
        // Update tracked entity in detection manager
        if (window.detectionManager.trackedEntities.has(this.currentEntity.id)) {
            const tracked = window.detectionManager.trackedEntities.get(this.currentEntity.id);
            Object.assign(tracked, updates);
        }

        alert('Changes saved successfully!');
        this.closeEntityEditor();
        
        // Refresh items view if we're in it
        if (this.currentView === 'items') {
            this.loadSavedItems('all');
        }
    }

    deleteEntity() {
        if (!this.currentEntity) return;

        if (confirm(`Are you sure you want to delete ${this.currentEntity.name}?`)) {
            window.storageManager.deleteEntity(this.currentEntity.id);
            
            // Remove from tracked entities
            window.detectionManager.trackedEntities.delete(this.currentEntity.id);
            
            alert('Entity deleted successfully!');
            this.closeEntityEditor();
            
            // Refresh items view if we're in it
            if (this.currentView === 'items') {
                this.loadSavedItems('all');
            }
        }
    }

    loadDiagnostics() {
        // System Information
        const systemInfo = document.getElementById('system-info');
        systemInfo.innerHTML = `
            <div class="diag-item">
                <span class="diag-label">User Agent:</span>
                <span class="diag-value">${navigator.userAgent}</span>
            </div>
            <div class="diag-item">
                <span class="diag-label">Platform:</span>
                <span class="diag-value">${navigator.platform}</span>
            </div>
            <div class="diag-item">
                <span class="diag-label">Language:</span>
                <span class="diag-value">${navigator.language}</span>
            </div>
            <div class="diag-item">
                <span class="diag-label">Screen Resolution:</span>
                <span class="diag-value">${window.screen.width}x${window.screen.height}</span>
            </div>
        `;

        // Camera Status
        const cameraStatus = document.getElementById('camera-status');
        const stats = window.detectionManager.getDetectionStats();
        cameraStatus.innerHTML = `
            <div class="diag-item">
                <span class="diag-label">Camera Active:</span>
                <span class="diag-value">${stats.cameraActive ? 'Yes' : 'No'}</span>
            </div>
            <div class="diag-item">
                <span class="diag-label">Video Permissions:</span>
                <span class="diag-value">${navigator.mediaDevices ? 'Granted' : 'Not Available'}</span>
            </div>
        `;

        // Storage Status
        const storageStats = window.storageManager.getStorageStats();
        const storageStatus = document.getElementById('storage-status');
        storageStatus.innerHTML = `
            <div class="diag-item">
                <span class="diag-label">Total Entities:</span>
                <span class="diag-value">${storageStats.totalEntities}</span>
            </div>
            <div class="diag-item">
                <span class="diag-label">Humans Tracked:</span>
                <span class="diag-value">${storageStats.totalHumans}</span>
            </div>
            <div class="diag-item">
                <span class="diag-label">Vehicles Tracked:</span>
                <span class="diag-value">${storageStats.totalVehicles}</span>
            </div>
            <div class="diag-item">
                <span class="diag-label">Total Screenshots:</span>
                <span class="diag-value">${storageStats.totalScreenshots}</span>
            </div>
            <div class="diag-item">
                <span class="diag-label">Storage Used:</span>
                <span class="diag-value">${storageStats.storageUsed}</span>
            </div>
        `;

        // Performance Stats
        const performanceStats = document.getElementById('performance-stats');
        performanceStats.innerHTML = `
            <div class="diag-item">
                <span class="diag-label">Detection Active:</span>
                <span class="diag-value">${stats.isDetecting ? 'Yes' : 'No'}</span>
            </div>
            <div class="diag-item">
                <span class="diag-label">Currently Detected:</span>
                <span class="diag-value">${stats.detectedCount}</span>
            </div>
            <div class="diag-item">
                <span class="diag-label">Currently Tracked:</span>
                <span class="diag-value">${stats.trackedCount}</span>
            </div>
        `;
    }
}

// Create global instance
window.uiManager = new UIManager();
