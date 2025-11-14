/**
 * OUTSINC - Mixed Reality Detection App
 * Main Application Entry Point
 */

class OutsincApp {
    constructor() {
        this.initialized = false;
    }

    async initialize() {
        console.log('Initializing OUTSINC...');
        
        try {
            // Show loading screen
            window.uiManager.showLoadingScreen();
            
            // Wait for DOM to be fully loaded
            await this.waitForDOM();
            
            // Initialize storage
            console.log('Storage initialized');
            
            // Check for camera permissions
            await this.checkPermissions();
            
            this.initialized = true;
            console.log('OUTSINC initialized successfully');
            
        } catch (error) {
            console.error('Error initializing OUTSINC:', error);
            alert('Failed to initialize application: ' + error.message);
        }
    }

    async waitForDOM() {
        return new Promise((resolve) => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
    }

    async checkPermissions() {
        // Check if we have access to required APIs
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error('Camera API not supported in this browser');
        }

        if (!localStorage) {
            throw new Error('Local Storage not supported in this browser');
        }

        console.log('Required permissions available');
    }

    getVersion() {
        return '1.0.0';
    }

    getInfo() {
        return {
            name: 'OUTSINC',
            version: this.getVersion(),
            description: 'Mixed Reality Detection App for Meta Quest 3S',
            features: [
                'Human detection and tracking',
                'Vehicle detection and tracking',
                'Color-coded status bubbles (Red/Yellow/Green)',
                'Local storage of tracked entities',
                'Screenshot capture',
                'Statistics tracking',
                'Customizable settings'
            ]
        };
    }
}

// Initialize app when page loads
const app = new OutsincApp();

// Start the app
window.addEventListener('load', () => {
    app.initialize();
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    // Stop detection and camera
    if (window.detectionManager) {
        window.detectionManager.stopDetection();
        window.detectionManager.stopCamera();
    }
});

// Expose app globally for debugging
window.outsincApp = app;

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Escape key to go back or close modals
    if (e.key === 'Escape') {
        const editor = document.getElementById('entity-editor');
        if (editor && !editor.classList.contains('hidden')) {
            window.uiManager.closeEntityEditor();
        } else if (window.uiManager.currentView !== 'menu') {
            window.uiManager.showMainMenu();
        }
    }
    
    // Space to toggle detection when in MR view
    if (e.key === ' ' && window.uiManager.currentView === 'mr') {
        e.preventDefault();
        const toggleBtn = document.getElementById('toggle-detection-btn');
        if (toggleBtn) {
            toggleBtn.click();
        }
    }
});

// Handle visibility change (pause detection when tab is hidden)
document.addEventListener('visibilitychange', () => {
    if (document.hidden && window.detectionManager && window.detectionManager.isDetecting) {
        console.log('Page hidden, pausing detection');
        window.detectionManager.stopDetection();
    }
});

console.log('%cOUTSINC v' + app.getVersion(), 'font-size: 24px; font-weight: bold; color: #667eea;');
console.log('%cMixed Reality Detection System', 'font-size: 14px; color: #999;');
