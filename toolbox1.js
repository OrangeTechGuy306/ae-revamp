//////////////   js script  /////////////////


// ==================== GLOBAL STATE & CONFIGURATION ====================
let selectedLoadValue = null;
let calculationHistory = [];
const MAX_HISTORY = 10;

// Camera & Image Recognition State
let cameraStream = null;
let scannedDevices = [];
let totalScannedWattage = 0;
let lastScannedResult = null; // Store last scan for user approval

// App configuration
const APP_CONFIG = {
  inverter: {
    brand: "Growatt",
    model: "MIN 5000TL-X",
    price: 150000,
    maxSolarInput: 10,
    maxACOutput: 8,
    systemLoss: 0.95
  },
  panel: {
    brand: "Jinko Solar",
    model: "Cheetah HC",
    wattage: 300,
    panelFactor: 1.2
  },
  battery: {
    brand: "LG Chem",
    model: "RESU 10H",
    price: 50000,
    DOD: 0.8,
    efficiency: 0.8
  },
  environment: {
    emissionFactor: 0.42 // kg CO2 per kWh
  },
  // Common appliance wattage database
  applianceWattage: {
    'refrigerator': 600,
    'washing machine': 1200,
    'air conditioner': 1500,
    'heater': 1500,
    'microwave': 1000,
    'oven': 3000,
    'dishwasher': 1800,
    'television': 100,
    'laptop': 65,
    'desktop': 400,
    'printer': 300,
    'blender': 500,
    'iron': 1200,
    'fan': 75,
    'light bulb': 15,
    'led light': 10,
    'fluorescent': 20,
    'kettle': 2200,
    'toaster': 1500,
    'coffee maker': 1200,
    'pump': 800,
    'router': 12,
    'modem': 10
  }
};

// ==================== CAMERA & IMAGE SCANNING MODULE ====================

/**
 * Initialize camera for device scanning
 */
async function initCamera() {
  try {
    const video = document.getElementById('cameraVideo');
    if (!video) {
      showError('Camera video element not found in HTML');
      return;
    }

    // Request camera access
    cameraStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
    });

    video.srcObject = cameraStream;
    video.play();

    // Show camera container
    const cameraCont = document.getElementById('cameraContainer');
    if (cameraCont) {
      cameraCont.style.display = 'block';
    }

    showSuccess('Camera started successfully!');
  } catch (err) {
    showError('Camera access denied. Please enable camera permissions: ' + err.message);
    console.error('Camera error:', err);
  }
}

/**
 * Stop camera stream
 */
function stopCamera() {
  if (cameraStream) {
    cameraStream.getTracks().forEach(track => track.stop());
    cameraStream = null;
  }

  const video = document.getElementById('cameraVideo');
  if (video) {
    video.srcObject = null;
  }

  const cameraCont = document.getElementById('cameraContainer');
  if (cameraCont) {
    cameraCont.style.display = 'none';
  }

  showSuccess('Camera stopped');
}

/**
 * Capture image from camera
 * @returns {Canvas} Canvas element with captured image
 */
function captureImage() {
  const video = document.getElementById('cameraVideo');
  const canvas = document.getElementById('captureCanvas');

  if (!video || !canvas) {
    showError('Video or canvas element not found');
    return null;
  }

  const ctx = canvas.getContext('2d');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0);

  return canvas;
}

/**
 * Analyze captured image using OCR (Tesseract) or manual detection
 * This function detects text (wattage) from appliance labels in images
 */
async function analyzeImage(canvas) {
  if (!canvas) {
    showError('No image to analyze');
    return [];
  }

  try {
    // Try to use Tesseract.js for OCR (if available)
    const imageData = canvas.toDataURL('image/png');
    
    // If Tesseract is available, use it
    if (typeof Tesseract !== 'undefined') {
      return await analyzeWithTesseract(imageData);
    } else {
      // Fallback to manual pattern detection
      return analyzeWithPatternMatching(imageData);
    }
  } catch (err) {
    console.error('Image analysis error:', err);
    showError('Error analyzing image: ' + err.message);
    return [];
  }
}

/**
 * Analyze image using Tesseract OCR
 * @param {string} imageData Base64 image data
 * @returns {Array} Extracted devices with wattages
 */
async function analyzeWithTesseract(imageData) {
  try {
    const { data: { text } } = await Tesseract.recognize(imageData, 'eng');
    
    // First try to extract wattage patterns (e.g., "1500W", "1500 W", "1500 Watts")
    const wattagePattern = /(\d+)\s*w(?:att)?s?/gi;
    const matches = text.matchAll(wattagePattern);
    const wattages = [];

    for (const match of matches) {
      const wattage = parseFloat(match[1]);
      if (wattage > 0 && wattage < 50000) { // Reasonable wattage range
        wattages.push(wattage);
      }
    }

    // If wattages found, try to identify appliance type from text
    if (wattages.length > 0) {
      const devices = [];
      const textLower = text.toLowerCase();
      let detectedType = 'Device';

      // Identify device type from text
      for (const [type, wattage] of Object.entries(APP_CONFIG.applianceWattage)) {
        if (textLower.includes(type.toLowerCase())) {
          detectedType = type.charAt(0).toUpperCase() + type.slice(1);
          break;
        }
      }

      wattages.forEach(w => {
        devices.push({
          type: detectedType,
          wattage: w
        });
      });

      return devices;
    }

    // If no wattage found in text, try visual identification
    return identifyApplianceByVisuals(imageData);
  } catch (err) {
    console.error('Tesseract error:', err);
    // Fallback to visual identification on error
    return identifyApplianceByVisuals(imageData);
  }
}

/**
 * Fallback: Analyze image using pattern matching & visual identification
 * @param {string} imageData Base64 image data
 * @returns {Promise<Array>} Detected devices with estimated wattages
 */
async function analyzeWithPatternMatching(imageData) {
  // Try visual identification first
  return await identifyApplianceByVisuals(imageData);
}

/**
 * Identify appliance by visual characteristics (colors, shapes, patterns)
 * @param {string} imageData Base64 image data
 * @returns {Array} Detected devices with typical wattages
 */
function identifyApplianceByVisuals(imageData) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = function() {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        // Get image data for color analysis
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        // Analyze color distribution
        const colorHistogram = analyzeColorHistogram(data);
        const dominantColor = getDominantColor(colorHistogram);

        // Visual identification rules based on colors and patterns
        const detectedDevice = identifyByColorAndShape(dominantColor, colorHistogram);
        
        if (detectedDevice) {
          resolve([detectedDevice]);
        } else {
          // Fallback to user prompt
          resolve(promptForDeviceIdentification());
        }
      } catch (err) {
        console.error('Error in visual identification:', err);
        resolve(promptForDeviceIdentification());
      }
    };
    
    img.onerror = function() {
      console.error('Error loading image');
      resolve(promptForDeviceIdentification());
    };
    
    img.src = imageData;
  });
}

/**
 * Analyze color distribution in image
 * @param {Uint8ClampedArray} data Pixel data
 * @returns {Object} Color histogram
 */
function analyzeColorHistogram(data) {
  const histogram = {
    red: 0, green: 0, blue: 0,
    black: 0, white: 0, metal: 0, plastic: 0
  };

  // Sample every 4th pixel (for performance)
  for (let i = 0; i < data.length; i += 16) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    if (a < 128) continue; // Skip transparent pixels

    // Count dominant colors
    if (r > 200 && g > 200 && b > 200) histogram.white++;
    else if (r < 50 && g < 50 && b < 50) histogram.black++;
    else if (Math.abs(r - g) < 20 && Math.abs(g - b) < 20) histogram.metal++; // Gray/metallic
    else if (r > g && r > b) histogram.red++;
    else if (g > r && g > b) histogram.green++;
    else if (b > r && b > g) histogram.blue++;
    else histogram.plastic++;
  }

  return histogram;
}

/**
 * Get dominant color from histogram
 * @param {Object} histogram Color histogram
 * @returns {string} Dominant color name
 */
function getDominantColor(histogram) {
  const colors = Object.entries(histogram)
    .sort(([,a], [,b]) => b - a);
  return colors[0][0];
}

/**
 * Identify appliance by color and histogram patterns
 * @param {string} dominantColor Primary color
 * @param {Object} histogram Color distribution
 * @returns {Object|null} Detected device with wattage
 */
function identifyByColorAndShape(dominantColor, histogram) {
  // Device identification rules based on visual characteristics
  const identificationRules = {
    // Red appliances
    red: {
      check: (h) => h.red > h.blue && h.red > h.green,
      devices: ['heater', 'oven', 'stove'],
      weights: [1500, 3000, 3500]
    },
    // White/metallic appliances
    white: {
      check: (h) => h.white > 100 && h.metal > 50,
      devices: ['refrigerator', 'washing machine', 'dishwasher'],
      weights: [600, 500, 1800]
    },
    // Black appliances
    black: {
      check: (h) => h.black > 100,
      devices: ['television', 'microwave', 'laptop'],
      weights: [100, 1000, 65]
    },
    // Metallic/Gray
    metal: {
      check: (h) => h.metal > 100,
      devices: ['air conditioner', 'fan', 'heater'],
      weights: [1500, 75, 1500]
    },
    // Blue appliances
    blue: {
      check: (h) => h.blue > h.red && h.blue > h.green,
      devices: ['water pump', 'ac unit'],
      weights: [750, 1500]
    }
  };

  // Try to match appliance based on color characteristics
  for (const [color, rule] of Object.entries(identificationRules)) {
    if (rule.check(histogram)) {
      // Return a random device from the matched category
      const idx = Math.floor(Math.random() * rule.devices.length);
      return {
        type: rule.devices[idx],
        wattage: rule.weights[idx],
        confidence: 'medium'
      };
    }
  }

  return null;
}

/**
 * Prompt user to identify appliance when visual detection uncertain
 * @returns {Array} User-selected device
 */
function promptForDeviceIdentification() {
  const commonDevices = Object.entries(APP_CONFIG.applianceWattage)
    .slice(0, 15)
    .map(([name, wattage]) => `${name} (${wattage}W)`)
    .join('\n');

  const selection = prompt(
    'Could not identify appliance automatically.\n\n' +
    'Common devices:\n' +
    commonDevices +
    '\n\nEnter device name from list above (or custom name):',
    'refrigerator'
  );

  if (!selection) return [];

  const selectionLower = selection.toLowerCase();
  const defaultWattage = APP_CONFIG.applianceWattage[selectionLower] || 500;

  return [{
    type: selection.charAt(0).toUpperCase() + selection.slice(1),
    wattage: defaultWattage,
    confidence: 'user_selected'
  }];
}

/**
 * Scan device and add to total load
 */
async function scanDevice() {
  // Capture image
  const canvas = captureImage();
  if (!canvas) return;

  // Show processing overlay
  const processingOverlay = document.getElementById('processingOverlay');
  if (processingOverlay) {
    processingOverlay.style.display = 'flex';
  }

  setLoading(true);

  // Analyze image
  const detectedItems = await analyzeImage(canvas);

  setLoading(false);

  // Hide processing overlay
  if (processingOverlay) {
    processingOverlay.style.display = 'none';
  }

  if (detectedItems.length === 0) {
    showError('❌ No valid electronics detected. Please aim at an appliance label or specifications.');
    return;
  }

  // Get the first detected item
  const item = detectedItems[0];
  lastScannedResult = item;

  // Show result display
  const resultDisplay = document.getElementById('scanResultDisplay');
  const resultDeviceName = document.getElementById('resultDeviceName');
  const resultWattage = document.getElementById('resultWattage');
  const resultAlert = document.getElementById('resultAlert');

  if (resultDisplay && resultDeviceName && resultWattage) {
    resultDisplay.style.display = 'block';
    resultDeviceName.textContent = item.type || 'Unknown Device';
    resultWattage.textContent = item.wattage || '—';

    // Check if item is valid electronics
    if (item.wattage && item.wattage > 0) {
      resultAlert.style.display = 'none';
      showSuccess(`✅ Detected: ${item.type} (${item.wattage}W) - Click "Add to Load" to continue`);
    } else {
      resultAlert.style.display = 'block';
      resultAlert.style.background = 'rgba(255, 87, 34, 0.2)';
      resultAlert.style.borderLeft = '3px solid #ff5722';
      resultAlert.style.color = '#ff9800';
      resultAlert.innerHTML = '⚠️ Invalid electronics detected. Ensure object is an appliance with wattage rating.';
    }
  }
}

/**
 * Get emoji for device type
 * @param {string} deviceType Device type name
 * @returns {string} Emoji representation
 */
function getDeviceEmoji(deviceType) {
  const emojiMap = {
    'refrigerator': '🧊',
    'washing machine': '🧺',
    'air conditioner': '❄️',
    'heater': '🔥',
    'microwave': '🍲',
    'oven': '🔪',
    'dishwasher': '🍽️',
    'television': '📺',
    'laptop': '💻',
    'desktop': '🖥️',
    'printer': '🖨️',
    'blender': '🥤',
    'iron': '👔',
    'fan': '💨',
    'light bulb': '💡',
    'led light': '💡',
    'fluorescent': '💡',
    'kettle': '☕',
    'toaster': '🍞',
    'coffee maker': '☕',
    'pump': '💧',
    'router': '📡',
    'modem': '📡',
    'device': '⚡'
  };
  
  const lowerType = deviceType.toLowerCase();
  return emojiMap[lowerType] || '⚡';
}

/**
 * Update scanned devices display as emojis in input field
 */
function updateScannedDevicesList() {
  const loadInput = document.getElementById('load');
  if (!loadInput) return;

  // Create emoji display string with count indicators
  let emojiDisplay = '';
  const tooltipTexts = [];
  const uniqueDevices = {};

  // Group devices by type
  scannedDevices.forEach((device) => {
    if (!uniqueDevices[device.type]) {
      uniqueDevices[device.type] = {
        type: device.type,
        wattage: device.wattage,
        count: device.count || 1,
        emoji: getDeviceEmoji(device.type)
      };
    } else {
      uniqueDevices[device.type].count += (device.count || 1);
    }
  });

  // Build emoji and tooltip display
  Object.values(uniqueDevices).forEach((device) => {
    emojiDisplay += device.emoji;
    const countStr = device.count > 1 ? ` ×${device.count}` : '';
    const totalWattage = device.wattage * device.count;
    tooltipTexts.push(`${device.emoji} ${device.type}${countStr}: ${totalWattage}W`);
  });

  // Update input placeholder/display with emoji and total
  if (scannedDevices.length > 0) {
    loadInput.placeholder = `${emojiDisplay} Total: ${totalScannedWattage}W`;
    loadInput.title = tooltipTexts.join('\n');
  } else {
    loadInput.placeholder = 'e.g. 1000';
    loadInput.title = '';
  }

}

/**
 * Remove scanned device from list
 * @param {number} index Device index to remove
 */
function removeScannedDevice(index) {
  if (index >= 0 && index < scannedDevices.length) {
    const removed = scannedDevices.splice(index, 1)[0];
    totalScannedWattage -= removed.wattage;
    updateScannedDevicesList();
    updateTotalLoadFromScans();
    viewLoadListModal(); // Refresh the modal
    showSuccess('Device removed');
  }
}

/**
 * Add last scanned result to devices list
 */
function addLastScannedResult() {
  if (!lastScannedResult || !lastScannedResult.wattage) {
    showError('No valid scan result to add');
    return;
  }

  // Check if device already exists (duplicate detection)
  const existingDevice = scannedDevices.find(d => 
    d.type.toLowerCase() === lastScannedResult.type.toLowerCase()
  );

  if (existingDevice) {
    // Increment count instead of adding duplicate
    existingDevice.count = (existingDevice.count || 1) + 1;
    totalScannedWattage += lastScannedResult.wattage;
    showSuccess(`✅ ${lastScannedResult.type} scanned again (x${existingDevice.count})`);
  } else {
    // Add new device
    scannedDevices.push({
      type: lastScannedResult.type,
      wattage: lastScannedResult.wattage,
      count: 1,
      timestamp: new Date().toLocaleTimeString()
    });
    totalScannedWattage += lastScannedResult.wattage;
    showSuccess(`✅ ${lastScannedResult.type} (${lastScannedResult.wattage}W) added to load`);
  }

  updateScannedDevicesList();
  updateTotalLoadFromScans();
  viewLoadListModal(); // Auto-show updated list
}

/**
 * View load list in modal with grouped devices
 */
function viewLoadListModal() {
  const modal = document.getElementById('loadListModal');
  if (!modal) return;

  const content = document.getElementById('loadListContent');
  if (!content) return;

  // Group devices by type and sum counts
  const groupedDevices = {};
  let uniqueCount = 0;
  let totalWattage = 0;

  scannedDevices.forEach(device => {
    if (!groupedDevices[device.type]) {
      groupedDevices[device.type] = {
        type: device.type,
        wattage: device.wattage,
        count: device.count || 1,
        totalWattage: device.wattage * (device.count || 1),
        emoji: getDeviceEmoji(device.type)
      };
      uniqueCount++;
    } else {
      groupedDevices[device.type].count += (device.count || 1);
      groupedDevices[device.type].totalWattage += device.wattage * (device.count || 1);
    }
    totalWattage += device.wattage * (device.count || 1);
  });

  // Build HTML list
  let html = '';
  if (Object.keys(groupedDevices).length === 0) {
    html = '<div style="text-align: center; padding: 20px; color: #9fb0d0;"><p>No devices scanned yet</p></div>';
  } else {
    Object.values(groupedDevices).forEach((device, idx) => {
      const totalForDevice = device.wattage * device.count;
      html += `
        <div style="background: rgba(106,209,255,0.1); border-left: 3px solid #00d466; margin-bottom: 10px; padding: 12px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
          <div style="flex: 1;">
            <div style="color: #fff; font-weight: 600; margin-bottom: 4px;">
              <span style="font-size: 16px; margin-right: 8px;">${device.emoji}</span>
              ${device.type}
              ${device.count > 1 ? `<span style="color: #ffc107; margin-left: 6px;">×${device.count}</span>` : ''}
            </div>
            <div style="color: #9fb0d0; font-size: 12px;">
              ${device.wattage}W ${device.count > 1 ? `= ${totalForDevice}W total` : ''}
            </div>
          </div>
          <button onclick="removeScannedDevice(${idx})" style="background: #ff6b6b; color: white; padding: 6px 10px; border: none; border-radius: 4px; cursor: pointer; font-size: 11px; font-weight: 600;">Remove</button>
        </div>
      `;
    });
  }

  content.innerHTML = html;

  // Update totals
  const itemsCount = document.getElementById('totalItemsCount');
  const totalWattageDisplay = document.getElementById('totalWattageDisplay');

  if (itemsCount) itemsCount.textContent = uniqueCount;
  if (totalWattageDisplay) totalWattageDisplay.textContent = totalWattage + 'W';

  // Show modal
  modal.style.display = 'flex';
}

/**
 * Update total load power field with scanned total
 */
function updateTotalLoadFromScans() {
  const loadInput = document.getElementById('load');
  if (loadInput && totalScannedWattage > 0) {
    loadInput.value = totalScannedWattage;
    
    // Trigger input event for any listeners
    loadInput.dispatchEvent(new Event('change', { bubbles: true }));
    loadInput.dispatchEvent(new Event('input', { bubbles: true }));
    
    showSuccess(`Total Load Updated: ${totalScannedWattage}W`);
  }
}

/**
 * Clear all scanned devices
 */
function clearScannedDevices() {
  if (confirm('Clear all scanned devices?')) {
    scannedDevices = [];
    totalScannedWattage = 0;
    updateScannedDevicesList();
    
    const loadInput = document.getElementById('load');
    if (loadInput) {
      loadInput.value = '';
    }
    
    showSuccess('Scanned devices cleared');
  }
}

/**
 * Add device by selecting image from file system
 * Opens file picker directly and analyzes the selected image
 */
function addDeviceManually() {
  // Create file input for image selection
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.style.display = 'none';
  
  fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      // Show camera container
      const cameraCont = document.getElementById('cameraContainer');
      if (cameraCont) {
        cameraCont.style.display = 'block';
      }
      
      // Show processing overlay
      const processingOverlay = document.getElementById('processingOverlay');
      if (processingOverlay) {
        processingOverlay.style.display = 'flex';
      }
      
      setLoading(true);
      
      // Read image file
      const reader = new FileReader();
      reader.onload = async (event) => {
        const img = new Image();
        img.onload = async () => {
          try {
            // Display uploaded image preview
            const uploadedImagePreview = document.getElementById('uploadedImagePreview');
            if (uploadedImagePreview) {
              uploadedImagePreview.src = event.target.result;
            }
            
            // Create canvas and analyze
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            
            // Analyze image
            const result = await analyzeImage(canvas);
            
            setLoading(false);
            
            // Hide processing overlay
            if (processingOverlay) {
              processingOverlay.style.display = 'none';
            }
            
            if (result && result.length > 0) {
              // Get the first detected item
              const item = result[0];
              lastScannedResult = item;

              // Hide camera video and show upload result display
              const videoElement = document.getElementById('cameraVideo');
              if (videoElement) {
                videoElement.style.display = 'none';
              }
              
              const scanResultDisplay = document.getElementById('scanResultDisplay');
              if (scanResultDisplay) {
                scanResultDisplay.style.display = 'none';
              }

              const uploadResultDisplay = document.getElementById('uploadResultDisplay');
              const uploadResultDeviceName = document.getElementById('uploadResultDeviceName');
              const uploadResultWattage = document.getElementById('uploadResultWattage');
              const uploadResultAlert = document.getElementById('uploadResultAlert');

              if (uploadResultDisplay && uploadResultDeviceName && uploadResultWattage) {
                uploadResultDisplay.style.display = 'block';
                uploadResultDeviceName.textContent = item.type || 'Unknown Device';
                uploadResultWattage.textContent = item.wattage || '—';

                // Check if item is valid electronics
                if (item.wattage && item.wattage > 0) {
                  uploadResultAlert.style.display = 'none';
                  showSuccess(`✅ Detected: ${item.type} (${item.wattage}W) - Click "Add to Load" to add`);
                } else {
                  uploadResultAlert.style.display = 'block';
                  uploadResultAlert.style.background = 'rgba(255, 87, 34, 0.2)';
                  uploadResultAlert.style.borderLeft = '3px solid #ff5722';
                  uploadResultAlert.style.color = '#ff9800';
                  uploadResultAlert.innerHTML = '⚠️ Invalid electronics detected. Ensure image shows an appliance with wattage rating.';
                }
              }
              
            } else {
              setLoading(false);
              if (processingOverlay) {
                processingOverlay.style.display = 'none';
              }
              showError('❌ No valid electronics detected in the image. Try a clearer photo with visible wattage or specifications.');
            }
          } catch (err) {
            console.error('Error processing image:', err);
            setLoading(false);
            if (processingOverlay) {
              processingOverlay.style.display = 'none';
            }
            showError('Error analyzing image: ' + err.message);
          }
        };
        img.onerror = () => {
          setLoading(false);
          if (processingOverlay) {
            processingOverlay.style.display = 'none';
          }
          showError('Error loading image');
        };
        img.src = event.target.result;
      };
      reader.onerror = () => {
        setLoading(false);
        if (processingOverlay) {
          processingOverlay.style.display = 'none';
        }
        showError('Error reading file');
      };
      reader.readAsDataURL(file);
      
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
      const processingOverlay = document.getElementById('processingOverlay');
      if (processingOverlay) {
        processingOverlay.style.display = 'none';
      }
      showError('Error analyzing image: ' + error.message);
    }
    
    // Remove the input element
    if (document.body.contains(fileInput)) {
      document.body.removeChild(fileInput);
    }
  });
  
  // Trigger file picker
  document.body.appendChild(fileInput);
  fileInput.click();
}

/**
 * Close upload result and prepare for next upload
 */
function closeUploadResult() {
  const uploadResultDisplay = document.getElementById('uploadResultDisplay');
  const videoElement = document.getElementById('cameraVideo');
  
  if (uploadResultDisplay) {
    uploadResultDisplay.style.display = 'none';
  }
  
  if (videoElement) {
    videoElement.style.display = 'block';
  }
  
  // Trigger file picker for next image
  addDeviceManually();
}
function initLoadSelector() {
  const loadItems = document.querySelectorAll('.load-item');
  
  loadItems.forEach(item => {
    const topBtn = item.querySelector('.top-btn');
    const bottomBtn = item.querySelector('.bottom-btn');

    function activateItem() { 
      // Remove active from all
      loadItems.forEach(i => i.classList.remove('active'));
      // Mark this active
      item.classList.add('active');
      // Extract numeric percentage
      const valueText = topBtn.textContent.replace('%', '');
      selectedLoadValue = parseInt(valueText);
      
      // Update UI feedback
      // Update input field to reflect selected button
      const batteryInput = document.getElementById('batteryEff');
      if (batteryInput) {
        batteryInput.value = selectedLoadValue;
        // trigger input event in case other listeners exist
        batteryInput.dispatchEvent(new Event('input', { bubbles: true }));
      }

      updateLoadDisplay();
    }

    // Add listener once
    if (!item.hasAttribute('data-listener')) {
      topBtn.addEventListener('click', activateItem);
      bottomBtn.addEventListener('click', activateItem);
      item.setAttribute('data-listener', 'true');
    }
  });
}

// Update load display feedback
function updateLoadDisplay() {
  if (selectedLoadValue) {
    const loadFeedback = document.getElementById('loadFeedback');
    if (loadFeedback) {
      loadFeedback.textContent = `Selected: ${selectedLoadValue}% Load`;
      loadFeedback.style.display = 'block';
    }
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', initLoadSelector);

// Sync from input -> buttons: when the batteryEff input changes, highlight matching button
function bindBatteryInputSync() {
  const batteryInput = document.getElementById('batteryEff');
  if (!batteryInput) return;

  batteryInput.addEventListener('input', () => {
    const raw = batteryInput.value;
    const num = parseInt(raw, 10);
    const loadItems = document.querySelectorAll('.load-item');

    // If value is a valid percentage 10-100 and matches one of the buttons, activate it
    let matched = false;
    if (!isNaN(num) && num >= 10 && num <= 100) {
      loadItems.forEach(item => {
        const topBtn = item.querySelector('.top-btn');
        if (!topBtn) return;
        const btnValue = parseInt(topBtn.textContent.replace('%', ''), 10);
        if (btnValue === num) {
          // activate this
          loadItems.forEach(i => i.classList.remove('active'));
          item.classList.add('active');
          selectedLoadValue = num;
          matched = true;
        }
      });
    }

    if (!matched) {
      // clear selection if no exact match
      document.querySelectorAll('.load-item').forEach(i => i.classList.remove('active'));
      selectedLoadValue = isNaN(num) ? null : num;
    }

    updateLoadDisplay();
  });
}

// initialize input sync on DOM ready as well
document.addEventListener('DOMContentLoaded', bindBatteryInputSync);



// ==================== UTILITY FUNCTIONS ====================

/**
 * Validates all input fields for calculation
 * @returns {Object|null} Validated input object or null if invalid
 */
function getAndValidateInputs() {
  const inputs = {
    totalEnergyUsage: parseFloat(document.getElementById('load').value),
    usageHr: parseFloat(document.getElementById('usagehrDay').value),
    peakSunHr: parseFloat(document.getElementById('psh').value),
    panelFact: parseFloat(document.getElementById('panelEff').value),
    DepthOfDischarge: parseFloat(document.getElementById('dod').value),
    batteryEff: parseFloat(document.getElementById('batteryEff').value),
    systemLosses: parseFloat(document.getElementById('sysLoss').value)
  };

  // Validate all inputs are positive numbers
  for (const [key, value] of Object.entries(inputs)) {
    if (isNaN(value) || value <= 0) {
      showError(`Invalid input for ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}. Please enter a positive number.`);
      return null;
    }
  }

  // Validate load percentage is selected
  if (!selectedLoadValue || selectedLoadValue <= 0 || selectedLoadValue > 100) {
    showError("Please select a valid load percentage (10%-100%).");
    return null;
  }

  return inputs;
}

/**
 * Show error message to user
 * @param {string} message Error message to display
 */
function showError(message) {
  alert(message);
  console.error('[SolarKit Error]:', message);
}

/**
 * Show success message
 * @param {string} message Success message
 */
function showSuccess(message) {
  const done = document.getElementById("done");
  if (done) {
    done.textContent = '✅ ' + message;
    done.style.display = "block";
    setTimeout(() => { done.style.display = "none"; }, 2000);
  }
}

/**
 * Display loading state
 * @param {boolean} show Whether to show loading state
 */
function setLoading(show) {
  const loading = document.getElementById("loading");
  if (loading) {
    loading.style.display = show ? "block" : "none";
  }
}

/**
 * Calculate system voltage based on battery capacity
 * @param {number} batteryBank Battery capacity in kWh
 * @returns {number} System voltage
 */
function calculateSystemVoltage(batteryBank) {
  if (batteryBank <= 2) return 12;
  if (batteryBank <= 5) return 24;
  if (batteryBank <= 50) return 48;
  if (batteryBank <= 100) return 96;
  if (batteryBank <= 200) return 360;
  return 500;
}

/**
 * Format number with specified decimal places
 * @param {number} num Number to format
 * @param {number} decimals Decimal places
 * @returns {string} Formatted number
 */
function formatNumber(num, decimals = 2) {
  return parseFloat(num).toFixed(decimals);
}

/**
 * Add calculation to history
 * @param {Object} result Calculation result
 */
function addToHistory(result) {
  calculationHistory.unshift({
    timestamp: new Date().toLocaleTimeString(),
    load: selectedLoadValue,
    energy: result.totalEnergy,
    capacity: result.solarCapacity
  });
  
  if (calculationHistory.length > MAX_HISTORY) {
    calculationHistory.pop();
  }
}

// ==================== MAIN CALCULATION ENGINE ====================

/**
 * Core solar system calculation engine
 * @returns {Object|null} Calculation results or null if invalid
 */
function SolarKitEngineSystem(){
  // Validate inputs
  const inputs = getAndValidateInputs();
  if (!inputs) return null;

  const {
    totalEnergyUsage,
    usageHr,
    peakSunHr
  } = inputs;

  // Extract configuration
  const { maxSolarInput, maxACOutput } = APP_CONFIG.inverter;
  const { wattage: pvWattage } = APP_CONFIG.panel;
  const { DOD } = APP_CONFIG.battery;

  // ==================== CORE CALCULATIONS ====================

  // Convert load to kWh
  const totalEnergyKw = totalEnergyUsage / 1000;
  const totalEnergyWEff = totalEnergyKw / DOD;

  // Battery bank sizing (kWh)
  const batteryBank = totalEnergyWEff * (selectedLoadValue / 100) * usageHr;

  // Calculate system voltage
  const checkingVolt = calculateSystemVoltage(batteryBank);

  // Solar panel sizing
  const panelForLoad = totalEnergyWEff;
  const panelForBattery = batteryBank / peakSunHr;
  const solarCap = panelForBattery + panelForLoad;

  // Daily energy generation
  const dailyEnergyGen = batteryBank + (panelForLoad * peakSunHr);

  // Panel count
  const pvArrayNos = solarCap / (pvWattage / 1000);

  // Inverter sizing
  const invertersByPV = Math.ceil(solarCap / maxSolarInput);
  const invertersByLoad = Math.ceil(totalEnergyWEff / maxACOutput);
  const invertNos = Math.max(invertersByPV, invertersByLoad);
  const ACCapacity = (maxACOutput * 1000 * invertNos) / 1000;

  // Create result object
  const result = {
    // Configuration
    inverterBrand: APP_CONFIG.inverter.brand,
    inverterModel: APP_CONFIG.inverter.model,
    inverterPrice: APP_CONFIG.inverter.price,
    pvBrand: APP_CONFIG.panel.brand,
    pvModel: APP_CONFIG.panel.model,
    pvWattage: APP_CONFIG.panel.wattage,
    batteryBrand: APP_CONFIG.battery.brand,
    batteryModel: APP_CONFIG.battery.model,
    batteryPrice: APP_CONFIG.battery.price,

    // Calculated values (formatted)
    totalEnergy: formatNumber(totalEnergyKw, 1),
    batteryBankSize: formatNumber(batteryBank, 2),
    dailyEnergyGeneneration: formatNumber(dailyEnergyGen, 1),
    solarCapacity: formatNumber(solarCap, 2),
    pvArrayNos: Math.floor(pvArrayNos),
    inverterNos: invertNos,
    inverterCapacity: formatNumber(ACCapacity, 0),
    checkingVolt: checkingVolt,
    selectedLoad: selectedLoadValue,
    totalEnergyWEff: formatNumber(totalEnergyWEff, 2)
  };

  // Add to history
  addToHistory(result);

  return result;
}

// DEPRECATED CODE BELOW - TODO: CLEAN UP
function OLD_SolarKitEngineSystem(){
        // Get input values
      const totalEnergyUsage = parseFloat(document.getElementById('load').value);
      const usageHr = parseFloat(document.getElementById('usagehrDay').value);
      const peakSunHr = parseFloat(document.getElementById('psh').value);
      const panelFact = parseFloat(document.getElementById('panelEff').value);
      const DepthOfDischarge = parseFloat(document.getElementById('dod').value);
      const batteryEff = parseFloat(document.getElementById('batteryEff').value);
      const systemLosses = parseFloat(document.getElementById('sysLoss').value);
      
      // Validate inputs
      if (
        isNaN(totalEnergyUsage) || totalEnergyUsage <= 0 ||
        isNaN(usageHr) || usageHr <= 0 ||
        isNaN(peakSunHr) || peakSunHr <= 0 ||
        isNaN(panelFact) || panelFact <= 0 ||
        isNaN(DepthOfDischarge) || DepthOfDischarge <= 0 ||
        isNaN(batteryEff) || batteryEff <= 0 ||
        isNaN(systemLosses) || systemLosses <= 0
      ) {
        alert("Please enter valid positive numbers for all fields.");
        return null;
      }
      
      // Validate selected load
      if (!selectedLoadValue || selectedLoadValue <= 0) {
        alert("Please select a valid load percentage (10%-100%).");
        return null;
      }

      // ----------------------------

      // load recommendation Parameters
      const efficiencyLoad = 80;

        // Inverter Recommendation parameters
      const maxSolarInput = 10;  // kW DC input
      const maxACOutput = 8;     // kW AC output
      const systemLoss = 0.95;
      const inverterBrand = "Growatt";
      const inverterModel = "MIN 5000TL-X";
      const inverterPrice = 150000; // NGN

        // Panel Recommendation parameters
      const pvBrand = "Jinko Solar";
      const pvModel = "Cheetah HC ";
      const pvWattage = 300; // Watts per panel
      const panelFactor = 1.2; // Convert to kW

      //   Battery Recommendation parameters
      const batteryBrand = "LG Chem";
      const batteryModel = "RESU 10H";
      const batteryPrice = 50000; // NGN per kWh
      const DOD = 0.8;
      const batteryEfficiency = 0.8;


       // ------------------------------
         // Calculations
       // ------------------------------


       
      // Convert load to kWh
      const totalEnergyKw = (totalEnergyUsage / 1000);
      const totalEnergyWEff = (totalEnergyKw / efficiencyLoad);
        //systemEff === 90%  

      // Battery-------
      // Battery bank sizing (kWh)
      const batteryBank = ((totalEnergyWEff * (selectedLoadValue / 100)) * (usageHr));
    //   0.9 === DOD
    //  0.9 === systemEff
    //   
         let checkingVolt;
        if (batteryBank <= 2) checkingVolt = 12;
        else if (batteryBank <= 5) checkingVolt = 24;
        else if (batteryBank <= 50) checkingVolt = 48;
        else if (batteryBank <= 100) checkingVolt = 96;
        else if (batteryBank <= 200) checkingVolt = 360;
        else checkingVolt = 500;

          // -------------ESTIMATE DAILY ENERGY -------------
         const selectedLoad = selectedLoadValue; // get selected load value

        //   panel for load
        const panelForLoad = (totalEnergyWEff);
        // sun === 80%
        // panelFact (derated Factor) === 82%
        //  panel for battery
        // batteryEff === 90%
        // inverterEff === 90%
        // systemLoss === 95%
        const panelForBattery = batteryBank / (peakSunHr);  

          const solarCap = ((panelForBattery) + (panelForLoad)); // Total solar capacity in kW

      const dailyEnergyGen = (batteryBank)+ (panelForLoad * peakSunHr); // Daily energy consumption in kWh

     

          // ------------- SOLAR ARRAY CALCULATION -----------
      // PV needed for charging battery and supplying load (kW)
     

         // ----------- PANEL COUNT ROUND UP -----------
        //  -----
      const pvArrayNos = (solarCap) / (pvWattage / 1000);

         // ------------- INVERTER ----------------
      // 5. Inverter sizing
      const invertersByPV = Math.ceil(solarCap / maxSolarInput);
      const invertersByLoad = Math.ceil((totalEnergyWEff) / maxACOutput);
      const invertNos = Math.floor(invertersByPV, invertersByLoad);
      const ACCapacity = ((maxACOutput * 1000) * invertNos) / 1000;
      /////////////////

     



      return{
        // backupPercentage: value,
        inverterBrand: inverterBrand,
        inverterModel: inverterModel,
        inverterPrice: inverterPrice,
        pvBrand: pvBrand,
        pvModel: pvModel,
        pvWattage: pvWattage,
        batteryBrand: batteryBrand,
        batteryModel: batteryModel,
        batteryPrice: batteryPrice,
        totalEnergy: (totalEnergyKw).toFixed(1),
        batteryBankSize:((batteryBank)),
        dailyEnergyGeneneration: (dailyEnergyGen).toFixed(1),
        solarCapacity: (solarCap),
        pvArrayNos:Math.floor(pvArrayNos),
        inverterNos: invertNos,
        inverterCapacity: (ACCapacity).toFixed(0),
        checkingVolt: checkingVolt,
        selectedLoad: selectedLoad, // returns numeric only
        totalEnergyWEff:(totalEnergyWEff)
        
      }
    }

// ==================== UI UPDATE FUNCTIONS ====================

/**
 * Update results display with calculation values
 * @param {Object} result Calculation result object
 */
function updateResultsDisplay(result) {
  const elements = {
    'panelWatt': result.pvWattage + 'W',
    'panelBrand': result.pvBrand,
    'loadResult': result.totalEnergy + ' Kw',
    'BatteryCapacity': result.batteryBankSize + ' KwHr',
    'checkingVolt': result.checkingVolt + ' Volt',
    'dailyEnergyGeneration': result.dailyEnergyGeneneration + ' kW/day',
    'kwD': 'kW/day',
    'requiredPV': result.solarCapacity + ' KW',
    'pv': 'Pv_Kwatt Required',
    'pvNos': result.pvArrayNos + ' Nos',
    'pvN': result.pvArrayNos + ' Units. ' + result.pvModel,
    'inverterNos': result.inverterNos + ' Nos',
    'requiredInverterO': 'MaxOutput ' + result.inverterCapacity + ' KwP'
  };

  // Update all elements safely
  Object.entries(elements).forEach(([id, content]) => {
    const element = document.getElementById(id);
    if (element) {
      element.innerHTML = content;
    }
  });
}

/**
 * Handle compute array calculation with UI feedback
 */
function computeArray(){
  const result = SolarKitEngineSystem();
  if(!result) return;

  setLoading(true);

  // Simulate processing delay
  setTimeout(() => {
    setLoading(false);
    showSuccess('Array calculation completed!');

    // Update display
    updateResultsDisplay(result);

  }, 2000); // Reduced from 3000 for faster feedback
}

// ==================== QUOTATION GENERATION ====================

/**
 * Generate and display professional quotation
 */
function quotation(){
  const result = SolarKitEngineSystem();
  if(!result) return;

  const quotationPage = document.querySelector('.quotation');
  if (!quotationPage) {
    showError('Quotation template not found in HTML.');
    return;
  }

  setLoading(true);

  // Simulate processing
  setTimeout(() => {
    setLoading(false);
    showSuccess('Quotation generated successfully!');

    quotationPage.style.display = "block";
    setTimeout(() => {
      quotationPage.classList.add("show");
    }, 50);

    // Populate quotation data
    populateQuotationData(result);

  }, 2000);
}

/**
 * Populate all quotation fields with calculated data
 * @param {Object} result Calculation result
 */
function populateQuotationData(result) {
  // System specifications
  const specFields = {
    'ArrayBrand': result.pvBrand,
    'arrayModel': result.pvModel,
    'requiredArray': result.solarCapacity + ' KwG',
    'pvSpecInc': '<span class="mark mark-check" aria-hidden="true"></span>',
    'systemBrand': result.inverterBrand,
    'systemModel': result.inverterModel,
    'systemRequire': result.inverterCapacity,
    'maxP': 'MaxP',
    'systemSpecInc': '<span class="mark mark-check" aria-hidden="true"></span>',
    'batteryBrand': 'Felicity',
    'batteryModel': 'Lithium2E2D',
    'RequiredBattery': result.batteryBankSize,
    'kwP': 'KwP',
    'batterySpecInc': '<span class="mark mark-check" aria-hidden="true"></span>'
  };

  // Mounting & cables
  const infrastructureFields = {
    'mountingStructure': 'Mounting Structure',
    'MountinSBrandi': 'Will be determined',
    'MountingBrandii': 'at site survey',
    'MountingSRequiredi': 'Will be determined',
    'MountingSRequiredii': 'at site survey',
    'mountingStructureInc': '<span class="mark mark-check" aria-hidden="true"></span>',
    'CableBrandi': 'Flex Cables',
    'CableBrandii': '6-75 mm² available',
    'cableModeli': 'Full gauge supplied',
    'cableModelii': 'at site',
    'cablingInc': '<span class="mark mark-check" aria-hidden="true"></span>'
  };

  // Protection devices
  const protectionFields = {
    'ProtectionRequired': '40k MSC',
    'MSC': 'Main Switch',
    'Light': '20k NSC',
    'NSC': 'Neutral Safety',
    'strike': '≤2.2kV VPL',
    'VPL': 'Voltage Protection',
    'protectionDeviceInc': '<span class="mark mark-check" aria-hidden="true"></span>'
  };

  // Merge all fields
  const allFields = { ...specFields, ...infrastructureFields, ...protectionFields };

  // Update all elements
  Object.entries(allFields).forEach(([id, content]) => {
    const element = document.getElementById(id);
    if (element) {
      element.innerHTML = content;
    }
  });

  // Calculate and populate performance metrics
  const selectedLoad = selectedLoadValue;
  const HLT = (result._batteryBankRaw / result.totalEnergyWEff) * selectedLoad / 10;
  const emissionSavings = (result._dailyEnergyRaw * APP_CONFIG.environment.emissionFactor).toFixed(2);

  const performanceFields = {
    'selectedValue%': selectedLoad + '%',
    'generatedEnergy': result.dailyEnergyGeneneration,
    'backupTime': HLT.toFixed(1) + ' hrs',
    'co2Savings': emissionSavings + ' kg CO₂/year',
    'systemCapacity': result.inverterCapacity + ' kW Power',
    'batteryCapacity': result.batteryBankSize + ' KwHr Bank'
  };

  Object.entries(performanceFields).forEach(([id, content]) => {
    const element = document.getElementById(id);
    if (element) {
      if (id === 'co2Savings') {
        element.innerText = content;
      } else {
        element.innerHTML = content;
      }
    }
  });

  // Set date and quotation reference if elements exist
  const dateEl = document.getElementById("date");
  if (dateEl) {
    const today = new Date();
    dateEl.innerHTML = today.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  const refEl = document.getElementById("quotationRef");
  if (refEl) {
    const today = new Date();
    const ref = 'AER-' + today.getFullYear() + String(today.getMonth() + 1).padStart(2, '0') + 
                String(Math.floor(Math.random() * 10000)).padStart(4, '0');
    refEl.innerHTML = ref;
  }
}

// Print Quotation page alone
function print() {
  const quotationSection = document.querySelector('.quotation');
  const quotationPage2 = document.querySelector('.quotation-page-2');
  const quotationPage3 = document.querySelector('.quotation-page-3');
  const quotationPageLast = document.querySelector('.quotation-page-last');
  if (!quotationSection) {
    alert('No quotation available. Please generate one first.');
    return;
  }
  // Open a new window; attempt to inline the main stylesheet for reliable printing
  const printWindow = window.open('', '_blank', 'width=1200,height=900');

  // Print overrides to ensure A3 and color preservation with multi-page support
  const printOverrides = `
    /* Force A3 and full color on print */
    @page { size: A3 portrait; margin: 10mm; }
    html,body { height:100%; }
    body { background: #044381; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .quotation { width: 297mm; max-width: 297mm; margin: 0; page-break-after: always; }
    .quotation .hero img { width: 100%; height: auto; }
    .quotation-page-2 { width: 297mm; max-width: 297mm; margin: 0; padding: 30mm; page-break-before: always; display: block !important; }
    .quotation-page-3 { width: 297mm; max-width: 297mm; margin: 0; padding: 30mm; page-break-before: always; display: block !important; }
    .quotation-page-last { width: 297mm; max-width: 297mm; margin: 0; padding: 30mm; page-break-before: always; display: block !important; }
    .logo-badge { border: 1px solid #fff !important; }
    #cameraPanel, #loadListModal, #scanResultDisplay, #uploadResultDisplay { display: none !important; }
  `;

  // Helper to write content into the print window
  function writePrintWindow(cssText) {
    // Build all pages content
    let printContent = quotationSection.outerHTML;
    if (quotationPage2) {
      printContent += quotationPage2.outerHTML;
    }
    if (quotationPage3) {
      printContent += quotationPage3.outerHTML;
    }
    if (quotationPageLast) {
      printContent += quotationPageLast.outerHTML;
    }

    const head = `
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>A.E Renewable - Complete Quotation & Profile</title>
        <style>${cssText}\n${printOverrides}</style>
      </head>
    `;

    const body = `
      <body>
        ${printContent}
        <script>
          window.addEventListener('load', function(){ setTimeout(function(){ window.print(); }, 250); });
        <\/script>
      </body>
    `;

    printWindow.document.open();
    printWindow.document.write('<!doctype html><html>' + head + body + '</html>');
    printWindow.document.close();
  }

  // Try to fetch the stylesheet and inline it. If fetch fails, fallback to linking.
  fetch('toolBox.css').then(resp => {
    if (!resp.ok) throw new Error('Stylesheet fetch failed');
    return resp.text();
  }).then(cssText => {
    writePrintWindow(cssText);
  }).catch(err => {
    // Fallback: use a minimal base style and include overrides
    const fallbackCSS = '*{box-sizing:border-box;margin:0;padding:0} body{font-family:Arial,Helvetica,sans-serif;}';
    writePrintWindow(fallbackCSS);
  });
}

// Download Quotation as HTML File
function downloadQuotationHTML() {
  const quotationSection = document.querySelector('.quotation');
  if (!quotationSection) {
    alert('No quotation available. Please generate one first.');
    return;
  }
  
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const fileName = `AE_Renewable_Quotation_${dateStr}.html`;
  
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>A.E Renewable - Quotation</title>
      <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family: Arial, sans-serif; background:#f5f5f5; padding:20px; }
        .container { max-width:1000px; margin:0 auto; }
      </style>
    </head>
    <body>
      <div class="container">
        ${quotationSection.innerHTML}
      </div>
    </body>
    </html>
  `;
  
  // Create blob and download
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

// ==================== ADDITIONAL UTILITY FUNCTIONS ====================

/**
 * Reset all inputs and display
 */
function resetInputs() {
  // Reset form inputs
  document.getElementById('load').value = '';
  document.getElementById('usagehrDay').value = '';
  document.getElementById('psh').value = '5';
  document.getElementById('panelEff').value = '30';
  document.getElementById('dod').value = '80';
  document.getElementById('sysLoss').value = '0.8';
  document.getElementById('batteryEff').value = '100';

  // Reset load selector
  selectedLoadValue = null;
  document.querySelectorAll('.load-item').forEach(item => {
    item.classList.remove('active');
  });

  // Reset results display
  const resultsEl = document.getElementById('results');
  if (resultsEl) {
    resultsEl.innerHTML = 'Results will appear here after calculation';
  }

  // Hide quotation
  const quotationPage = document.querySelector('.quotation');
  if (quotationPage) {
    quotationPage.classList.remove('show');
    quotationPage.style.display = 'none';
  }

  showSuccess('Form reset successfully!');
}

/**
 * Export calculation history as JSON
 */
function exportHistory() {
  if (calculationHistory.length === 0) {
    showError('No calculation history to export.');
    return;
  }

  const dataStr = JSON.stringify(calculationHistory, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `solar-kit-history-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  showSuccess('History exported successfully!');
}

/**
 * Display calculation history in console (for debugging)
 */
function viewHistory() {
  if (calculationHistory.length === 0) {
    console.log('No calculation history');
    return;
  }
  console.table(calculationHistory);
  showSuccess(`Showing ${calculationHistory.length} calculation(s) in console`);
}

/**
 * Clear calculation history
 */
function clearHistory() {
  if (confirm('Are you sure you want to clear the calculation history?')) {
    calculationHistory = [];
    showSuccess('History cleared!');
  }
}

/**
 * Validate all inputs before calculation
 * @returns {boolean} True if all inputs are valid
 */
function validateBeforeCalc() {
  const inputs = getAndValidateInputs();
  return inputs !== null;
}

/**
 * Get summary of last calculation
 * @returns {string} Summary text
 */
function getLastCalculationSummary() {
  if (calculationHistory.length === 0) {
    return 'No calculations yet. Please run a calculation first.';
  }
  const last = calculationHistory[0];
  return `Last: ${last.timestamp} | Load: ${last.load}% | Energy: ${last.energy} kW | Capacity: ${last.capacity} kW`;
}

// ==================== KEYBOARD & ACCESSIBILITY ====================

/**
 * Setup keyboard navigation and shortcuts
 */
function setupKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to calculate
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      const computeBtn = document.getElementById('compute');
      if (computeBtn) {
        computeBtn.click();
      }
    }

    // Ctrl/Cmd + Q for quotation
    if ((e.ctrlKey || e.metaKey) && e.key === 'q') {
      const quotationBtn = document.getElementById('copy');
      if (quotationBtn) {
        quotationBtn.click();
      }
    }

    // Ctrl/Cmd + R to reset
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
      resetInputs();
    }

    // Escape to close quotation
    if (e.key === 'Escape') {
      const quotationPage = document.querySelector('.quotation');
      if (quotationPage && quotationPage.classList.contains('show')) {
        quotationPage.classList.remove('show');
        quotationPage.style.display = 'none';
      }
    }
  });
}

/**
 * Initialize form for Enter key submission
 */
function setupFormSubmission() {
  const form = document.getElementById('calcForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      computeArray();
    });
  }

  // Allow Enter in number inputs to trigger compute
  ['load', 'usagehrDay', 'psh', 'panelEff', 'dod', 'sysLoss', 'batteryEff'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          computeArray();
        }
      });
    }
  });
}

// ==================== CAMERA PANEL TOGGLE ====================

/**
 * Toggle camera panel visibility
 */
function toggleCameraPanel(event) {
  event.preventDefault();
  const cameraPanel = document.getElementById('cameraPanel');
  if (cameraPanel) {
    cameraPanel.style.display = cameraPanel.style.display === 'none' ? 'flex' : 'none';
  }
}

/**
 * Close camera panel
 */
function closeCameraPanel() {
  const cameraPanel = document.getElementById('cameraPanel');
  if (cameraPanel) {
    cameraPanel.style.display = 'none';
    // Stop camera if running
    stopCamera();
  }
}

// ==================== INITIALIZATION ====================

/**
 * Initialize the entire application
 */
function initializeApp() {
  console.log('🌞 Initializing Solar Kit Engine...');
  
  // Setup UI components
  initLoadSelector();
  setupKeyboardShortcuts();
  setupFormSubmission();

  // Log initialization complete
  console.log('✅ Solar Kit Engine initialized successfully');
  console.log('Keyboard shortcuts: Ctrl+Enter (calculate), Ctrl+Q (quotation), Ctrl+R (reset), Esc (close)');
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}










////////////////////////////////// html file //////////////////////////////////








    






////////////////////////////////////// css file /////////////////////////////////////



/* global and page styles */






