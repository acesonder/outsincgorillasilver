/**
 * Storage Manager for OUTSINC
 * Handles local storage of tracked entities
 */

class StorageManager {
    constructor() {
        this.storageKey = 'outsinc_entities';
        this.settingsKey = 'outsinc_settings';
        this.initializeStorage();
    }

    initializeStorage() {
        if (!localStorage.getItem(this.storageKey)) {
            localStorage.setItem(this.storageKey, JSON.stringify([]));
        }
        if (!localStorage.getItem(this.settingsKey)) {
            this.saveSettings(this.getDefaultSettings());
        }
    }

    getDefaultSettings() {
        return {
            detectionSensitivity: 0.5,
            detectionInterval: 1000,
            maxDistance: 20,
            showLabels: true,
            autoScreenshot: true,
            showDistance: true,
            maxScreenshots: 10
        };
    }

    saveEntity(entity) {
        const entities = this.getAllEntities();
        const existingIndex = entities.findIndex(e => e.id === entity.id);
        
        if (existingIndex >= 0) {
            // Update existing entity
            entities[existingIndex] = {
                ...entities[existingIndex],
                ...entity,
                lastSeen: new Date().toISOString(),
                totalSightings: (entities[existingIndex].totalSightings || 0) + 1
            };
        } else {
            // Add new entity
            entities.push({
                ...entity,
                id: entity.id || this.generateId(),
                firstSeen: new Date().toISOString(),
                lastSeen: new Date().toISOString(),
                totalSightings: 1,
                screenshots: []
            });
        }
        
        localStorage.setItem(this.storageKey, JSON.stringify(entities));
        return entities[existingIndex >= 0 ? existingIndex : entities.length - 1];
    }

    getAllEntities() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : [];
    }

    getEntity(id) {
        const entities = this.getAllEntities();
        return entities.find(e => e.id === id);
    }

    updateEntity(id, updates) {
        const entities = this.getAllEntities();
        const index = entities.findIndex(e => e.id === id);
        
        if (index >= 0) {
            entities[index] = { ...entities[index], ...updates };
            localStorage.setItem(this.storageKey, JSON.stringify(entities));
            return entities[index];
        }
        
        return null;
    }

    deleteEntity(id) {
        const entities = this.getAllEntities();
        const filtered = entities.filter(e => e.id !== id);
        localStorage.setItem(this.storageKey, JSON.stringify(filtered));
    }

    addScreenshot(entityId, screenshotData) {
        const entity = this.getEntity(entityId);
        if (!entity) return;

        if (!entity.screenshots) {
            entity.screenshots = [];
        }

        const settings = this.getSettings();
        const maxScreenshots = settings.maxScreenshots || 10;

        entity.screenshots.push({
            data: screenshotData,
            timestamp: new Date().toISOString()
        });

        // Keep only the most recent screenshots
        if (entity.screenshots.length > maxScreenshots) {
            entity.screenshots = entity.screenshots.slice(-maxScreenshots);
        }

        this.updateEntity(entityId, { screenshots: entity.screenshots });
    }

    getEntitiesByType(type) {
        const entities = this.getAllEntities();
        return entities.filter(e => e.type === type);
    }

    getEntitiesByStatus(status) {
        const entities = this.getAllEntities();
        return entities.filter(e => e.status === status);
    }

    saveSettings(settings) {
        localStorage.setItem(this.settingsKey, JSON.stringify(settings));
    }

    getSettings() {
        const data = localStorage.getItem(this.settingsKey);
        return data ? JSON.parse(data) : this.getDefaultSettings();
    }

    clearAllData() {
        if (confirm('Are you sure you want to clear all saved data? This cannot be undone.')) {
            localStorage.removeItem(this.storageKey);
            localStorage.removeItem(this.settingsKey);
            this.initializeStorage();
            return true;
        }
        return false;
    }

    getStorageStats() {
        const entities = this.getAllEntities();
        const totalScreenshots = entities.reduce((sum, e) => sum + (e.screenshots?.length || 0), 0);
        
        return {
            totalEntities: entities.length,
            totalHumans: entities.filter(e => e.type === 'person').length,
            totalVehicles: entities.filter(e => e.type === 'vehicle').length,
            totalScreenshots: totalScreenshots,
            storageUsed: this.getStorageSize()
        };
    }

    getStorageSize() {
        let total = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                total += localStorage[key].length + key.length;
            }
        }
        return (total / 1024).toFixed(2) + ' KB';
    }

    generateId() {
        return 'entity_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    exportData() {
        const data = {
            entities: this.getAllEntities(),
            settings: this.getSettings(),
            exportDate: new Date().toISOString()
        };
        return JSON.stringify(data, null, 2);
    }

    importData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            if (data.entities) {
                localStorage.setItem(this.storageKey, JSON.stringify(data.entities));
            }
            if (data.settings) {
                this.saveSettings(data.settings);
            }
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }
}

// Create global instance
window.storageManager = new StorageManager();
