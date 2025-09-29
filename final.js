// Global variables
let currentTab = "single";
let cart = [];
let currentPrice = 0;
let currentShapeTarget = "";
let selectedShape = null;
let shapeData = {
  currentShape: null,
  rotation: 0,
  widthA: 0,
  heightA: 0,
  lengthC: 0,
  customName: "",
  reference: "",
  templateFile: null,
};

const singleUnitPricing = {
  "4mm": {
    clear: 93.3,
    "low-iron": 122.49,
    satin: 123.0,
    "painted-ral-9010": 192.3, // Assuming White
    "painted-ral-9016": 192.3, // Assuming White
    "painted-custom-white": 192.3, // Assuming White
    "painted-custom-black": 192.3, // Assuming Black
    black: 192.3, // Direct mapping for black glass type
  },
  "6mm": {
    clear: 111.6,
    "low-iron": 138.53,
    satin: 167.7,
    "tinted-bronze": 186.8,
    "tinted-grey": 186.8,
    "painted-ral-9010": 207.3, // Assuming White
    "painted-ral-9016": 207.3, // Assuming White
    "painted-custom-white": 207.3, // Assuming White
    "painted-custom-black": 207.3, // Assuming Black
    black: 207.3,
  },
  "8mm": {
    clear: 132.5,
    "low-iron": 197.08,
    satin: 207.3,
    "painted-ral-9010": 266.7, // Assuming White
    "painted-ral-9016": 266.7, // Assuming White
    "painted-custom-white": 266.7, // Assuming White
    "painted-custom-black": 266.7, // Assuming Black
    black: 266.7,
  },
  "10mm": {
    clear: 149.0,
    "low-iron": 228.97,
    satin: 227.1,
    "tinted-bronze": 263.4,
    "tinted-grey": 263.4,
    "painted-ral-9010": 298.6, // Assuming White
    "painted-ral-9016": 298.6, // Assuming White
    "painted-custom-white": 298.6, // Assuming White
    "painted-custom-black": 298.6, // Assuming Black
    black: 298.6,
  },
};
const doubleGlazedPricing = {
  external: {
    "4mm-clear": 39.75,
    "4mm-pattern": 45.05,
    "4mm-satin": 99.6,
    "6mm-clear": 65.25,
    "6.4mm-clear-laminate": 95.0,
    "6.8mm-acoustic": 111.3,
  },
  internal: {
    "4mm-clear": 39.75,
    "4mm-planitherm": 45.05,
    "4mm-planitherm-1": 65.4,
    "6mm-clear": 65.25,
    "6mm-planitherm": 89.7,
    "6mm-planitherm-laminate": 106.0,
  },
};
const tripleGlazedPricing = {
  external: {
    "4mm-clear": 39.75,
    "4mm-pattern": 45.05,
    "4mm-satin": 99.6,
    "6mm-clear": 65.25,
    "6.4mm-clear-laminate": 95.0,
    "6.8mm-acoustic": 111.3,
  },
  centre: {
    "4mm-clear": 39.75,
    "4mm-planitherm": 45.05,
    "4mm-planitherm-1": 65.4,
    "6mm-clear": 65.25,
    "6mm-planitherm": 89.7,
    "6mm-planitherm-laminate": 106.0,
  },
  internal: {
    "4mm-clear": 39.75,
    "4mm-planitherm": 45.05,
    "4mm-planitherm-1": 65.4,
    "6mm-clear": 65.25,
    "6mm-planitherm": 89.7,
    "6mm-planitherm-laminate": 106.0,
  },
};
// Initialize the calculator
document.addEventListener("DOMContentLoaded", function () {
  cart = JSON.parse(localStorage.getItem("glassCart")) || [];
  updateNavCartCount();
  initializeTabs();
  initializeEventListeners();
  initializeShapeModalListeners();
  calculatePrice();
  return isValid;
  const chargeableArea = Math.max(area, 0.3);

  return chargeableArea * totalGlassPricePerSqm;
});

function initializeShapeModalListeners() {
  // Rotation button listeners
  document.querySelectorAll(".rotation-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".rotation-btn").forEach((b) => {
        b.classList.remove("border-blue-500", "bg-blue-50");
      });
      this.classList.add("border-blue-500", "bg-blue-50");
      document.getElementById("shapeRotation").value = this.dataset.rotation;
      validateShapeForm();
    });
  });

  // Input field listeners for real-time validation and calculation
  ["shapeWidthA", "shapeHeightA", "shapeLengthC", "customShapeName"].forEach(
    (id) => {
      const element = document.getElementById(id);
      if (element) {
        element.addEventListener("input", function () {
          updateShapeCalculations();
          validateShapeForm();
        });
      }
    }
  );
}

// Tab functionality
function initializeTabs() {
  const tabButtons = document.querySelectorAll(".tab-btn");

  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const tabId = this.id.replace("Tab", "");
      switchTab(tabId);
    });
  });
}

function switchTab(tabId) {
  // Remove active class from all tabs
  document
    .querySelectorAll(".tab-btn")
    .forEach((btn) => btn.classList.remove("tab-active"));
  document
    .querySelectorAll(".tab-content")
    .forEach((content) => content.classList.add("hidden"));

  // Add active class to selected tab
  document.getElementById(tabId + "Tab").classList.add("tab-active");

  // Show corresponding content
  if (tabId === "single") {
    document.getElementById("singleUnit").classList.remove("hidden");
    currentTab = "single";
  } else if (tabId === "double") {
    document.getElementById("doubleGlazed").classList.remove("hidden");
    currentTab = "double";
  } else if (tabId === "triple") {
    document.getElementById("tripleGlazed").classList.remove("hidden");
    currentTab = "triple";
  }

  // Clear any error messages when switching tabs
  document
    .querySelectorAll(".error-message")
    .forEach((error) => error.classList.add("hidden"));

  calculatePrice();
}

// Event listeners
function initializeEventListeners() {
  // Shape selection
  document.querySelectorAll(".shape-option").forEach((option) => {
    option.addEventListener("click", function () {
      const shape = this.dataset.shape;
      const tabType = currentTab;

      // Remove selection from all shapes in current tab
      document.querySelectorAll(".shape-option").forEach((opt) => {
        opt.classList.remove("shape-selected");
      });

      // Add selection to clicked shape
      this.classList.add("shape-selected");

      // Set hidden input value
      document.getElementById(tabType + "Shape").value = shape;

      // Show/hide custom shape input
      const customContainer = document.getElementById(
        tabType + "CustomShapeContainer"
      );
      if (shape === "other") {
        customContainer.classList.remove("hidden");
      } else {
        customContainer.classList.add("hidden");
        document.getElementById(tabType + "CustomShape").value = "";
      }

      calculatePrice();
    });
  });

  // Dimension inputs
  ["single", "double", "triple"].forEach((type) => {
    const widthInput = document.getElementById(type + "Width");
    const heightInput = document.getElementById(type + "Height");

    if (widthInput)
      widthInput.addEventListener("input", () => updateArea(type));
    if (heightInput)
      heightInput.addEventListener("input", () => updateArea(type));
  });

  // Color preview functionality
  const doubleColorSelect = document.getElementById("doubleSpacerColor");
  const tripleColorSelect = document.getElementById("tripleSpacerColor");

  if (doubleColorSelect) {
    doubleColorSelect.addEventListener("change", function () {
      updateColorPreview("doubleColorPreview", this.value);
    });
  }

  if (tripleColorSelect) {
    tripleColorSelect.addEventListener("change", function () {
      updateColorPreview("tripleColorPreview", this.value);
    });
  }

  // All other inputs
  document.addEventListener("change", calculatePrice);
  document.addEventListener("input", calculatePrice);

  // Add to cart button
  document.getElementById("addToCart").addEventListener("click", addToCart);
}

// Update area calculation
function updateArea(type) {
  const width = parseFloat(document.getElementById(type + "Width").value) || 0;
  const height =
    parseFloat(document.getElementById(type + "Height").value) || 0;
  const area = (width * height) / 1000000; // Convert mm² to m²

  document.getElementById(type + "Area").textContent = area.toFixed(3) + " m²";
  calculatePrice();
}

// Configuration validation (price calculations removed)
function calculatePrice() {
  // Price calculations removed - configuration validation only
  currentPrice = 0;
}

// Price calculation functions removed - configuration only

// Form validation
/*function validateForm() {
            let isValid = true;
            const shapeDetails = document.getElementById(currentTab + 'ShapeDetails');
            
            // Clear all error messages first
            document.querySelectorAll('.error-message').forEach(error => error.classList.add('hidden'));
            
            if (currentTab === 'single') {
                // Glass type validation
                const glassType = document.getElementById('singleGlassType');
                if (!glassType || !glassType.value) {
                    showError('singleGlassTypeError', 'Please select a glass type');
                    isValid = false;
                }

                // Shape validation
                const shape = document.getElementById('singleShape');
                if (!shape || !shape.value) {
                    showError('singleShapeError', 'Please select a shape');
                    isValid = false;
                }

                // Dimensions validation
                const widthInput = document.getElementById('singleWidth');
                const heightInput = document.getElementById('singleHeight');
                const width = widthInput ? parseFloat(widthInput.value) : 0;
                const height = heightInput ? parseFloat(heightInput.value) : 0;
                
                if (!width || width < 100 || width > 2800) {
                    showError('singleWidthError', 'Width must be between 100-2800mm');
                    isValid = false;
                }
                
                if (!height || height < 100 || height > 2800) {
                    showError('singleHeightError', 'Height must be between 100-2800mm');
                    isValid = false;
                }

                // Custom shape validation
                if (shape && shape.value === 'other') {
                    const customShapeInput = document.getElementById('singleCustomShape');
                    const customShape = customShapeInput ? customShapeInput.value : '';
                    if (!customShape || customShape.trim() === '') {
                        showError('singleCustomShapeError', 'Please describe the custom shape');
                        isValid = false;
                    }
                }
            } else if (currentTab === 'double') {
                // Glass validation
                const outerGlass = document.getElementById('doubleOuterGlass');
                const innerGlass = document.getElementById('doubleInnerGlass');
                const spacerWidth = document.getElementById('doubleSpacerWidth');
                
                if (!outerGlass || !outerGlass.value) {
                    showError('doubleOuterGlassError', 'Please select external glass');
                    isValid = false;
                }
                
                if (!innerGlass || !innerGlass.value) {
                    showError('doubleInnerGlassError', 'Please select internal glass');
                    isValid = false;
                }
                
                if (!spacerWidth || !spacerWidth.value) {
                    showError('doubleSpacerWidthError', 'Please select spacer bar width');
                    isValid = false;
                }

                // Toughened glass validation
                const toughened = document.querySelector('input[name="doubleToughened"]:checked');
                if (!toughened) {
                    showError('doubleToughenedError', 'Please select toughened glass option');
                    isValid = false;
                }

                // Shape validation
                const shape = document.getElementById('doubleShape');
                if (!shape || !shape.value) {
                    showError('doubleShapeError', 'Please select a shape');
                    isValid = false;
                }

                // Dimensions validation
                const widthInput = document.getElementById('doubleWidth');
                const heightInput = document.getElementById('doubleHeight');
                const width = widthInput ? parseFloat(widthInput.value) : 0;
                const height = heightInput ? parseFloat(heightInput.value) : 0;
                
                if (!width || width < 100 || width > 2800) {
                    showError('doubleWidthError', 'Width must be between 100-2800mm');
                    isValid = false;
                }
                
                if (!height || height < 100 || height > 2800) {
                    showError('doubleHeightError', 'Height must be between 100-2800mm');
                    isValid = false;
                }

                // Custom shape validation
                if (shape && shape.value === 'other') {
                    const customShapeInput = document.getElementById('doubleCustomShape');
                    const customShape = customShapeInput ? customShapeInput.value : '';
                    if (!customShape || customShape.trim() === '') {
                        showError('doubleCustomShapeError', 'Please describe the custom shape');
                        isValid = false;
                    }
                }
            } else if (currentTab === 'triple') {
                // Glass validation
                const outerGlass = document.getElementById('tripleOuterGlass');
                const centreGlass = document.getElementById('tripleCentreGlass');
                const innerGlass = document.getElementById('tripleInnerGlass');
                const spacer1Width = document.getElementById('tripleSpacer1Width');
                const spacer2Width = document.getElementById('tripleSpacer2Width');
                
                if (!outerGlass || !outerGlass.value) {
                    showError('tripleOuterGlassError', 'Please select external glass');
                    isValid = false;
                }
                
                if (!centreGlass || !centreGlass.value) {
                    showError('tripleCentreGlassError', 'Please select centre glass');
                    isValid = false;
                }
                
                if (!innerGlass || !innerGlass.value) {
                    showError('tripleInnerGlassError', 'Please select internal glass');
                    isValid = false;
                }
                
                if (!spacer1Width || !spacer1Width.value) {
                    showError('tripleSpacer1WidthError', 'Please select spacer bar 1 width');
                    isValid = false;
                }
                
                if (!spacer2Width || !spacer2Width.value) {
                    showError('tripleSpacer2WidthError', 'Please select spacer bar 2 width');
                    isValid = false;
                }

                // Toughened glass validation
                const toughened = document.querySelector('input[name="tripleToughened"]:checked');
                if (!toughened) {
                    showError('tripleToughenedError', 'Please select toughened glass option');
                    isValid = false;
                }

                // Shape validation
                const shape = document.getElementById('tripleShape');
                if (!shape || !shape.value) {
                    showError('tripleShapeError', 'Please select a shape');
                    isValid = false;
                }

                // Dimensions validation
                const widthInput = document.getElementById('tripleWidth');
                const heightInput = document.getElementById('tripleHeight');
                const width = widthInput ? parseFloat(widthInput.value) : 0;
                const height = heightInput ? parseFloat(heightInput.value) : 0;
                
                if (!width || width < 100 || width > 2800) {
                    showError('tripleWidthError', 'Width must be between 100-2800mm');
                    isValid = false;
                }
                
                if (!height || height < 100 || height > 2800) {
                    showError('tripleHeightError', 'Height must be between 100-2800mm');
                    isValid = false;
                }

                // Custom shape validation
                if (shape && shape.value === 'other') {
                    const customShapeInput = document.getElementById('tripleCustomShape');
                    const customShape = customShapeInput ? customShapeInput.value : '';
                    if (!customShape || customShape.trim() === '') {
                        showError('tripleCustomShapeError', 'Please describe the custom shape');
                        isValid = false;
                    }
                }
            }

            return isValid;
        }*/
function validateForm() {
  let isValid = true;
  const shapeDetails = document.getElementById(currentTab + "ShapeDetails");
  if (currentTab === "single") {
    // Glass thickness validation
    const glassThickness = document.getElementById("singleGlassThickness");
    if (!glassThickness || !glassThickness.value) {
      showError("singleGlassThicknessError", "Please select glass thickness");
      isValid = false;
    }

    // Glass type validation
    const glassType = document.querySelector(
      'input[name="singleGlassType"]:checked'
    );
    if (!glassType) {
      showError("singleGlassTypeError", "Please select a glass type");
      isValid = false;
    }
    // Shape validation
    if (!shapeDetails || shapeDetails.classList.contains("hidden")) {
      showError("singleShapeError", "Please select and configure a shape");
      isValid = false;
    }
  } else if (currentTab === "double") {
    // Glass validation
    const outerGlass = document.getElementById("doubleOuterGlass");
    const innerGlass = document.getElementById("doubleInnerGlass");
    const spacerWidth = document.getElementById("doubleSpacerWidth");
    const spacerColor = document.getElementById("doubleSpacerColor");

    if (!outerGlass || !outerGlass.value) {
      showError("doubleOuterGlassError", "Please select external glass");
      isValid = false;
    }

    if (!innerGlass || !innerGlass.value) {
      showError("doubleInnerGlassError", "Please select internal glass");
      isValid = false;
    }
    if (!spacerWidth || !spacerWidth.value) {
      showError("doubleSpacerWidthError", "Please select spacer width");
      isValid = false;
    }

    if (!spacerColor || !spacerColor.value) {
      showError("doubleSpacerColorError", "Please select spacer color");
      isValid = false;
    }

    // Shape validation
    if (!shapeDetails || shapeDetails.classList.contains("hidden")) {
      showError("doubleShapeError", "Please select and configure a shape");
      isValid = false;
    }
  } else if (currentTab === "triple") {
    // Glass validation
    const outerGlass = document.getElementById("tripleOuterGlass");
    const centreGlass = document.getElementById("tripleCentreGlass");
    const innerGlass = document.getElementById("tripleInnerGlass");
    const spacerWidth = document.getElementById("tripleSpacerWidth");
    const spacerColor = document.getElementById("tripleSpacerColor");

    if (!outerGlass || !outerGlass.value) {
      showError("tripleOuterGlassError", "Please select external glass");
      isValid = false;
    }

    if (!centreGlass || !centreGlass.value) {
      showError("tripleCentreGlassError", "Please select centre glass");
      isValid = false;
    }

    if (!innerGlass || !innerGlass.value) {
      showError("tripleInnerGlassError", "Please select internal glass");
      isValid = false;
    }
    if (!spacerWidth || !spacerWidth.value) {
      showError("tripleSpacerWidthError", "Please select spacer width");
      isValid = false;
    }

    if (!spacerColor || !spacerColor.value) {
      showError("tripleSpacerColorError", "Please select spacer color");
      isValid = false;
    }

    // Shape validation
    if (!shapeDetails || shapeDetails.classList.contains("hidden")) {
      showError("tripleShapeError", "Please select and configure a shape");
      isValid = false;
    }
  }

  return isValid;
}
function showError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.classList.remove("hidden");
  }
}

// Add to cart functionality
function addToCart() {
  if (!validateForm()) {
    alert("Please complete all required fields before adding to cart.");
    return;
  }

  const item = collectFormData();
  if (!item) return;

  cart.push(item);
  localStorage.setItem("glassCart", JSON.stringify(cart));

  updateNavCartCount();
  showSuccessPopup();

  // Reset form after successful add
  //resetCurrentForm();
}
function collectFormData() {
  const item = {
    id: Date.now(),
    type: currentTab,
    quantity: 1,
    details: [],
    price: 0,
    image: "",
  };

  const shapeName = document.getElementById(
    currentTab + "SelectedShape"
  ).textContent;
  const width = document.getElementById(
    currentTab + "SelectedWidth"
  ).textContent;
  const height = document.getElementById(
    currentTab + "SelectedHeight"
  ).textContent;
  item.description = `${shapeName} (${width} x ${height})`;

  // Add the unit type to the details
  let unitTypeDescription = "";
  if (item.type === "single") {
    unitTypeDescription = "Single Unit";
  } else if (item.type === "double") {
    unitTypeDescription = "Double Glazed Unit";
  } else if (item.type === "triple") {
    unitTypeDescription = "Triple Glazed Unit";
  }
  if (unitTypeDescription) {
    item.details.push(`Unit Type: ${unitTypeDescription}`);
  }

  // Set image based on tab
  if (currentTab === "single") {
    item.image = "/views/single unit.jpeg";
  } else if (currentTab === "double") {
    item.image = "/views/double.jpeg";
  } else if (currentTab === "triple") {
    item.image = "/views/triple.jpeg";
  }

  // --- Common Shape Details (from shapeData object) ---
  item.details.push(`Rotation: ${shapeData.rotation}°`);
  if (shapeData.lengthC > 0) {
    item.details.push(`Length C: ${shapeData.lengthC}mm`);
  }
  if (shapeData.customName) {
    item.details.push(`Custom Name: ${shapeData.customName}`);
  }
  if (shapeData.reference) {
    item.details.push(`Reference: ${shapeData.reference}`);
  }
  if (shapeData.templateFile) {
    item.details.push(`Template File: ${shapeData.templateFile.name}`);
  }
  // --- Add calculated metrics ---
  const area = document.getElementById(currentTab + "ShapeArea").textContent;
  const linear = document.getElementById(
    currentTab + "ShapeLinear"
  ).textContent;
  const weight = document.getElementById(
    currentTab + "ShapeWeight"
  ).textContent;

  item.details.push(`Area: ${area}`);
  item.details.push(`Linear Metre: ${linear}`);
  item.details.push(`Weight: ${weight}`);
  // --- Tab-Specific Details ---
  let itemPrice = parseFloat(
    document
      .getElementById(currentTab + "ShapeCost")
      .textContent.replace("£", "")
  );

  if (currentTab === "single") {
    // Step 1: Glass Configuration
    const thickness = document.getElementById("singleGlassThickness").value;
    const glassType = document.querySelector(
      'input[name="singleGlassType"]:checked'
    ).value;
    item.details.push(`Glass: ${thickness} ${glassType}`);

    if (glassType === "tinted") {
      const tint = document.querySelector(
        'input[name="singleTintColor"]:checked'
      )?.value;
      if (tint)
        item.details.push(
          `Tint: ${tint.charAt(0).toUpperCase() + tint.slice(1)}`
        );
    }
    if (glassType === "painted") {
      const colorType = document.querySelector(
        'input[name="singleColorType"]:checked'
      )?.value;
      if (colorType === "ral") {
        const ralColor = document.getElementById("singleRALColor").value;
        if (ralColor) item.details.push(`Color: ${ralColor}`);
      } else if (colorType === "custom") {
        const customColor = document.getElementById("singleCustomColor").value;
        if (customColor) item.details.push(`Custom Color: ${customColor}`);
      }
    }
    // Add Polished and Toughened details for Single Unit
    item.details.push("Polished Glass (P.A.R)");
    item.details.push("Toughened Glass");
    // Step 3: Optional Extras
    const corners = document.querySelector(
      'input[name="singleCorners"]:checked'
    ).value;
    item.details.push(
      `Corners: ${corners.charAt(0).toUpperCase() + corners.slice(1)}`
    );

    const holes = document.querySelector('input[name="singleHoles"]:checked');
    if (holes) {
      item.details.push(`Holes: ${holes.value}`);
      if (holes.value === "custom") {
        const numHoles = document.getElementById("singleNumberOfHoles").value;
        const holeFile = document.getElementById("singleHoleTemplate").files[0];
        if (numHoles) item.details.push(`- Number of Holes: ${numHoles}`);
        if (holeFile) item.details.push(`- Hole Template: ${holeFile.name}`);
      }
    }

    if (document.getElementById("singlePetFlap").checked) {
      const petFlapPrice = parseFloat(
        document.getElementById("singlePetFlap").dataset.price
      );
      item.details.push("Pet Flap/Vent Hole");
      itemPrice += petFlapPrice;
    }
  } else if (currentTab === "double" || currentTab === "triple") {
    // Step 1: Glass Configuration
    item.details.push(
      `Outer: ${
        document.getElementById(currentTab + "OuterGlassText").textContent
      }`
    );
    if (
      document.getElementById(currentTab + "OuterGlass").value === "4mm-pattern"
    ) {
      const pattern = document.querySelector(
        `input[name="${currentTab}OuterPattern"]:checked`
      )?.value;
      if (pattern) item.details.push(`- Pattern: ${pattern}`);
    }
    item.details.push("Toughened Glass");
    if (currentTab === "triple") {
      item.details.push(
        `Centre: ${
          document.getElementById("tripleCentreGlassText").textContent
        }`
      );
    }
    item.details.push(
      `Inner: ${
        document.getElementById(currentTab + "InnerGlassText").textContent
      }`
    );
    item.details.push(
      `Spacer: ${
        document.getElementById(currentTab + "SpacerWidthText").textContent
      }, ${document.getElementById(currentTab + "SpacerColorText").textContent}`
    );

    // Step 3: Optional Extras
    const extrasSelect = document.getElementById(currentTab + "Extras");
    const selectedExtra = extrasSelect.options[extrasSelect.selectedIndex];
    const extraPrice = parseFloat(selectedExtra.dataset.price);

    if (extraPrice > 0) {
      item.details.push(`Feature: ${selectedExtra.textContent}`);
      itemPrice += extraPrice;
    }

    if (document.getElementById(currentTab + "PetFlap").checked) {
      const petFlapPrice = parseFloat(
        document.getElementById(currentTab + "PetFlap").dataset.price
      );
      item.details.push("Pet Flap/Vent Hole");
      itemPrice += petFlapPrice;
    }
  }

  item.price = itemPrice;
  return item;
}

/*function collectFormData() {
  const item = {
    id: Date.now(),
    type: currentTab,
    quantity: 1,
    details: [],
    price: 0,
    image: "",
  };
  const shapeName = document.getElementById(
    currentTab + "SelectedShape"
  ).textContent;
  const width = document.getElementById(
    currentTab + "SelectedWidth"
  ).textContent;
  const height = document.getElementById(
    currentTab + "SelectedHeight"
  ).textContent;
  item.description = `${shapeName} (${width} x ${height})`;

  // Set image based on tab
  if (currentTab === "single") {
    item.image = "/views/single unit.jpeg";
  } else if (currentTab === "double") {
    item.image = "/views/double.jpeg";
  } else if (currentTab === "triple") {
    item.image = "/views/triple.jpeg";
  }

  // Common Shape Details
  item.details.push(
    `Rotation: ${
      document.getElementById(currentTab + "SelectedRotation").textContent
    }`
  );
  if (shapeData.reference)
    item.details.push(`Reference: ${shapeData.reference}`);
  if (shapeData.templateFile)
    item.details.push(`Template: ${shapeData.templateFile.name}`);

  let itemPrice = parseFloat(
    document
      .getElementById(currentTab + "ShapeCost")
      .textContent.replace("£", "")
  );
  if (currentTab === "single") {
    const thickness = document.getElementById("singleGlassThickness").value;
    const glassType = document.querySelector(
      'input[name="singleGlassType"]:checked'
    ).value;
    item.details.push(`Glass: ${thickness} ${glassType}`);

    if (glassType === "tinted") {
      const tint = document.querySelector(
        'input[name="singleTintColor"]:checked'
      ).value;
      item.details.push(
        `Tint: ${tint.charAt(0).toUpperCase() + tint.slice(1)}`
      );
    }
    if (glassType === "painted") {
      const colorType = document.querySelector(
        'input[name="singleColorType"]:checked'
      ).value;
      if (colorType === "ral") {
        item.details.push(
          `Color: ${document.getElementById("singleRALColor").value}`
        );
      } else {
        item.details.push(
          `Color: ${document.getElementById("singleCustomColor").value}`
        );
      }
    }
    const corners = document.querySelector(
      'input[name="singleCorners"]:checked'
    ).value;
    item.details.push(
      `Corners: ${corners.charAt(0).toUpperCase() + corners.slice(1)}`
    );

    const holes = document.querySelector('input[name="singleHoles"]:checked');
    if (holes) {
      item.details.push(`Holes: ${holes.value}`);
    }

    if (document.getElementById("singlePetFlap").checked) {
      const petFlapPrice = parseFloat(
        document.getElementById("singlePetFlap").dataset.price
      );
      item.details.push("Pet Flap/Vent Hole");
      itemPrice += petFlapPrice;
    }
  } else if (currentTab === "double" || currentTab === "triple") {
    const extrasSelect = document.getElementById(currentTab + "Extras");
    const selectedExtra = extrasSelect.options[extrasSelect.selectedIndex];
    const extraPrice = parseFloat(selectedExtra.dataset.price);

    if (extraPrice > 0) {
      item.details.push(`Feature: ${selectedExtra.textContent}`);
      itemPrice += extraPrice;
    }

    if (document.getElementById(currentTab + "PetFlap").checked) {
      const petFlapPrice = parseFloat(
        document.getElementById(currentTab + "PetFlap").dataset.price
      );
      item.details.push("Pet Flap/Vent Hole");
      itemPrice += petFlapPrice;
    }

    item.details.push(
      `Outer: ${
        document.getElementById(currentTab + "OuterGlassText").textContent
      }`
    );
    if (currentTab === "triple") {
      item.details.push(
        `Centre: ${
          document.getElementById(currentTab + "CentreGlassText").textContent
        }`
      );
    }
    item.details.push(
      `Inner: ${
        document.getElementById(currentTab + "InnerGlassText").textContent
      }`
    );
    item.details.push(
      `Spacer: ${
        document.getElementById(currentTab + "SpacerWidthText").textContent
      }, ${document.getElementById(currentTab + "SpacerColorText").textContent}`
    );
  }

  item.price = itemPrice;
  return item;
}*/

/*            if (currentTab === 'single') {
                const glassTypeEl = document.getElementById('singleGlassType');
                const shapeEl = document.getElementById('singleShape');
                const widthEl = document.getElementById('singleWidth');
                const heightEl = document.getElementById('singleHeight');
                const customShapeEl = document.getElementById('singleCustomShape');
                const referenceEl = document.getElementById('singleReference');
                const petFlapEl = document.getElementById('singlePetFlap');
                
                item.glassType = glassTypeEl ? glassTypeEl.value : '';
                item.shape = shapeEl ? shapeEl.value : '';
                item.width = widthEl ? widthEl.value : '';
                item.height = heightEl ? heightEl.value : '';
                item.customShape = customShapeEl ? customShapeEl.value : '';
                item.reference = referenceEl ? referenceEl.value : '';
                item.petFlap = petFlapEl ? petFlapEl.checked : false;
            } else if (currentTab === 'double') {
                const outerGlassEl = document.getElementById('doubleOuterGlass');
                const innerGlassEl = document.getElementById('doubleInnerGlass');
                const spacerWidthEl = document.getElementById('doubleSpacerWidth');
                const spacerTypeEl = document.getElementById('doubleSpacerType');
                const toughenedEl = document.querySelector('input[name="doubleToughened"]:checked');
                const shapeEl = document.getElementById('doubleShape');
                const widthEl = document.getElementById('doubleWidth');
                const heightEl = document.getElementById('doubleHeight');
                const customShapeEl = document.getElementById('doubleCustomShape');
                const referenceEl = document.getElementById('doubleReference');
                const extrasEl = document.getElementById('doubleExtras');
                const petFlapEl = document.getElementById('doublePetFlap');
                
                item.outerGlass = outerGlassEl ? outerGlassEl.value : '';
                item.innerGlass = innerGlassEl ? innerGlassEl.value : '';
                item.spacerWidth = spacerWidthEl ? spacerWidthEl.value : '';
                item.spacerType = spacerTypeEl ? spacerTypeEl.value : '';
                item.toughened = toughenedEl ? toughenedEl.value : '';
                item.shape = shapeEl ? shapeEl.value : '';
                item.width = widthEl ? widthEl.value : '';
                item.height = heightEl ? heightEl.value : '';
                item.customShape = customShapeEl ? customShapeEl.value : '';
                item.reference = referenceEl ? referenceEl.value : '';
                item.extras = extrasEl ? extrasEl.value : '';
                item.petFlap = petFlapEl ? petFlapEl.checked : false;
            } else if (currentTab === 'triple') {
                const outerGlassEl = document.getElementById('tripleOuterGlass');
                const centreGlassEl = document.getElementById('tripleCentreGlass');
                const innerGlassEl = document.getElementById('tripleInnerGlass');
                const spacer1WidthEl = document.getElementById('tripleSpacer1Width');
                const spacer2WidthEl = document.getElementById('tripleSpacer2Width');
                const spacerTypeEl = document.getElementById('tripleSpacerType');
                const toughenedEl = document.querySelector('input[name="tripleToughened"]:checked');
                const shapeEl = document.getElementById('tripleShape');
                const widthEl = document.getElementById('tripleWidth');
                const heightEl = document.getElementById('tripleHeight');
                const customShapeEl = document.getElementById('tripleCustomShape');
                const referenceEl = document.getElementById('tripleReference');
                const extrasEl = document.getElementById('tripleExtras');
                const petFlapEl = document.getElementById('triplePetFlap');
                
                item.outerGlass = outerGlassEl ? outerGlassEl.value : '';
                item.centreGlass = centreGlassEl ? centreGlassEl.value : '';
                item.innerGlass = innerGlassEl ? innerGlassEl.value : '';
                item.spacer1Width = spacer1WidthEl ? spacer1WidthEl.value : '';
                item.spacer2Width = spacer2WidthEl ? spacer2WidthEl.value : '';
                item.spacerType = spacerTypeEl ? spacerTypeEl.value : '';
                item.toughened = toughenedEl ? toughenedEl.value : '';
                item.shape = shapeEl ? shapeEl.value : '';
                item.width = widthEl ? widthEl.value : '';
                item.height = heightEl ? heightEl.value : '';
                item.customShape = customShapeEl ? customShapeEl.value : '';
                item.reference = referenceEl ? referenceEl.value : '';
                item.extras = extrasEl ? extrasEl.value : '';
                item.petFlap = petFlapEl ? petFlapEl.checked : false;
            }

            return item;
        }*/
function resetCurrentForm() {
  if (currentTab === "single") {
    const elements = {
      singleGlassType: "",
      singleShape: "",
      singleWidth: "",
      singleHeight: "",
      singleCustomShape: "",
      singleReference: "",
      singleExtras: "none",
    };

    Object.keys(elements).forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.value = elements[id];
    });

    const petFlap = document.getElementById("singlePetFlap");
    if (petFlap) petFlap.checked = false;

    const customContainer = document.getElementById(
      "singleCustomShapeContainer"
    );
    if (customContainer) customContainer.classList.add("hidden");
  } else if (currentTab === "double") {
    const elements = {
      doubleOuterGlass: "",
      doubleInnerGlass: "",
      doubleSpacerWidth: "",
      doubleSpacerColor: "",
      doubleShape: "",
      doubleWidth: "",
      doubleHeight: "",
      doubleCustomShape: "",
      doubleReference: "",
      doubleExtras: "none",
    };

    Object.keys(elements).forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.value = elements[id];
    });

    document
      .querySelectorAll('input[name="doubleToughened"]')
      .forEach((radio) => (radio.checked = false));

    const petFlap = document.getElementById("doublePetFlap");
    if (petFlap) petFlap.checked = false;

    const customContainer = document.getElementById(
      "doubleCustomShapeContainer"
    );
    if (customContainer) customContainer.classList.add("hidden");
  } else if (currentTab === "triple") {
    const elements = {
      tripleOuterGlass: "",
      tripleCentreGlass: "",
      tripleInnerGlass: "",
      tripleSpacerWidth: "",
      tripleSpacerColor: "",
      tripleShape: "",
      tripleWidth: "",
      tripleHeight: "",
      tripleCustomShape: "",
      tripleReference: "",
      tripleExtras: "none",
    };

    Object.keys(elements).forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.value = elements[id];
    });

    document
      .querySelectorAll('input[name="tripleToughened"]')
      .forEach((radio) => (radio.checked = false));

    const petFlap = document.getElementById("triplePetFlap");
    if (petFlap) petFlap.checked = false;

    const customContainer = document.getElementById(
      "tripleCustomShapeContainer"
    );
    if (customContainer) customContainer.classList.add("hidden");
  }

  // Clear shape selections
  document.querySelectorAll(".shape-option").forEach((opt) => {
    opt.classList.remove("shape-selected");
  });

  // Update area display
  updateArea(currentTab);
  window.location.reload();
}
function updateNavCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById("navCartCount").textContent = count;
}

function updateCartDisplay() {
  const cartItemsContainer = document.getElementById("cartItems");
  const cartSummary = document.getElementById("cartSummary");
  const cartItemCountEl = document.getElementById("cartItemCount");
  const cartTotalEl = document.getElementById("cartTotal"); // New element for total price

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
                    <div class="cart-empty">
                        <svg fill="currentColor" viewBox="0 0 20 20">
                            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
                        </svg>
                        <p class="text-lg font-medium">Your cart is empty</p>
                        <p class="text-sm mt-2">Add some glass units to get started</p>
                    </div>
                `;
    cartSummary.classList.add("hidden");
    return;
  }

  let html = "";
  let totalItems = 0;
  let totalPrice = 0;
  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    totalItems += item.quantity;
    totalPrice += itemTotal;
    html += `
                    <div class="cart-item">
                        <div class="flex justify-between items-start mb-3">
                            <div class="flex-1">
                                <h4 class="font-semibold text-gray-800">${
                                  item.description
                                }</h4>
                                <ul class="text-xs text-gray-600 list-disc list-inside mt-1">
                                    ${item.details
                                      .map((detail) => `<li>${detail}</li>`)
                                      .join("")}
                                </ul>
                            </div>
                            <button onclick="removeFromCart(${index})" class="text-red-500 hover:text-red-700 ml-4 flex-shrink-0">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                                </svg>
                            </button>
                        </div>
                        <div class="flex justify-between items-center mt-4">
                            <div class="quantity-controls">
                                <button class="quantity-btn" onclick="updateQuantity(${index}, -1)" ${
      item.quantity <= 1 ? "disabled" : ""
    }>-</button>
                                <span class="quantity-display">${
                                  item.quantity
                                }</span>
                                <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
                            </div>
                            <div class="text-right">
                                <p class="text-lg font-bold text-blue-600">£${itemTotal.toFixed(
                                  2
                                )}</p>
                                <p class="text-xs text-gray-500">£${item.price.toFixed(
                                  2
                                )} each</p>
                            </div>
                        </div>
                    </div>
                `;
  });

  cartItemsContainer.innerHTML = html;

  // Update cart summary
  cartItemCountEl.textContent = totalItems;
  if (cartTotalEl) {
    cartTotalEl.textContent = `£${totalPrice.toFixed(2)}`;
  }

  cartSummary.classList.remove("hidden");
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartDisplay();
}

function updateQuantity(index, change) {
  cart[index].quantity += change;
  if (cart[index].quantity < 1) {
    cart[index].quantity = 1;
  }
  updateCartDisplay();
}

function showSuccessPopup() {
  const popup = document.getElementById("successPopup");
  popup.classList.add("show");

  setTimeout(() => {
    popup.classList.remove("show");
  }, 1000);
}

// New functions for updated glass configuration
function showSingleGlassTypes() {
  const thickness = document.getElementById("singleGlassThickness").value;
  const container = document.getElementById("singleGlassTypeContainer");
  const tintedOptions = document.getElementById("singleTintedOptions");

  if (thickness) {
    container.classList.remove("hidden");

    // Show/hide tinted options based on thickness
    if (thickness === "6mm" || thickness === "10mm") {
      // Tinted glass is available for 6mm and 10mm
    } else {
      // Hide tinted options and clear selection if not 6mm or 10mm
      tintedOptions.classList.add("hidden");
      document
        .querySelectorAll('input[name="singleTintColor"]')
        .forEach((radio) => (radio.checked = false));
    }
  } else {
    container.classList.add("hidden");
    tintedOptions.classList.add("hidden");
  }

  // Clear glass type selection when thickness changes
  document
    .querySelectorAll('input[name="singleGlassType"]')
    .forEach((radio) => (radio.checked = false));
  document.querySelectorAll(".glass-type-option").forEach((option) => {
    option.classList.remove("border-blue-500", "bg-blue-50");
  });

  calculatePrice();
}

function handleSingleGlassTypeChange() {
  const selectedType = document.querySelector(
    'input[name="singleGlassType"]:checked'
  );
  const paintedOptions = document.getElementById("singlePaintedOptions");
  const tintedOptions = document.getElementById("singleTintedOptions");
  const thickness = document.getElementById("singleGlassThickness").value;

  // Hide all sub-options first
  paintedOptions.classList.add("hidden");
  tintedOptions.classList.add("hidden");

  if (selectedType) {
    // Update visual selection
    document.querySelectorAll(".glass-type-option").forEach((option) => {
      option.classList.remove("border-blue-500", "bg-blue-50");
    });
    selectedType
      .closest("label")
      .querySelector(".glass-type-option")
      .classList.add("border-blue-500", "bg-blue-50");

    // Show relevant sub-options
    if (selectedType.value === "painted") {
      paintedOptions.classList.remove("hidden");
    } else if (
      selectedType.value === "tinted" &&
      (thickness === "6mm" || thickness === "10mm")
    ) {
      tintedOptions.classList.remove("hidden");
    }
  }

  calculatePrice();
}

function toggleSingleColorInputs() {
  const colorType = document.querySelector(
    'input[name="singleColorType"]:checked'
  );
  const ralSelect = document.getElementById("singleRALColor");
  const customInput = document.getElementById("singleCustomColor");

  ralSelect.classList.add("hidden");
  customInput.classList.add("hidden");

  if (colorType) {
    if (colorType.value === "ral") {
      ralSelect.classList.remove("hidden");
    } else if (colorType.value === "custom") {
      customInput.classList.remove("hidden");
    }
  }
}

function showDoublePatternOptions(glassType) {
  const glassSelect = document.getElementById("doubleOuterGlass");
  const patternOptions = document.getElementById("doubleOuterPatternOptions");

  if (glassSelect.value === "4mm-pattern") {
    patternOptions.classList.remove("hidden");
  } else {
    patternOptions.classList.add("hidden");
    // Clear pattern selection
    document
      .querySelectorAll('input[name="doubleOuterPattern"]')
      .forEach((radio) => (radio.checked = false));
    document
      .querySelectorAll("#doubleOuterPatternOptions .glass-type-option")
      .forEach((option) => {
        option.classList.remove("border-blue-500", "bg-blue-50");
      });
  }
}

function showTriplePatternOptions(glassType) {
  const glassSelect = document.getElementById("tripleOuterGlass");
  const patternOptions = document.getElementById("tripleOuterPatternOptions");

  if (glassSelect.value === "4mm-pattern") {
    patternOptions.classList.remove("hidden");
  } else {
    patternOptions.classList.add("hidden");
    // Clear pattern selection
    document
      .querySelectorAll('input[name="tripleOuterPattern"]')
      .forEach((radio) => (radio.checked = false));
    document
      .querySelectorAll("#tripleOuterPatternOptions .glass-type-option")
      .forEach((option) => {
        option.classList.remove("border-blue-500", "bg-blue-50");
      });
  }
}

// Shape data
const shapes = [
  { value: "square", name: "Square/Rectangle", icon: "⬜", needsLength: false },
  {
    value: "triangle",
    name: "Right Angle Triangle",
    icon: "🔺",
    needsLength: false,
  },
  { value: "rake1", name: "Rake 1", icon: "📐", needsLength: true },
  { value: "rake2", name: "Rake 2", icon: "🔷", needsLength: true },
  { value: "rake3", name: "Rake 3", icon: "🔶", needsLength: true },
  { value: "rake4", name: "Rake 4", icon: "🔸", needsLength: true },
  { value: "circle", name: "Circle", icon: "⭕", needsLength: false },
  { value: "arched", name: "Arched-Top", icon: "🌙", needsLength: true },
  {
    value: "quarter-circle",
    name: "1/4 Circle",
    icon: "◐",
    needsLength: false,
  },
  { value: "trapezium", name: "Trapezium", icon: "⬟", needsLength: true },
  {
    value: "parallelogram",
    name: "Parallelogram",
    icon: "▱",
    needsLength: true,
  },
  { value: "custom", name: "Custom", icon: "🔷", needsLength: false },
];

// Glass and spacer data (prices removed)
const glassData = {
  external: [
    {
      value: "4mm-clear",
      name: "4mm Clear Glass",
      image:
        "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=300&h=200&fit=crop",
    },
    {
      value: "4mm-pattern",
      name: "4mm Pattern Glass",
      image:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop",
    },
    {
      value: "4mm-satin",
      name: "4mm Satin Glass",
      image:
        "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=300&h=200&fit=crop",
    },
    {
      value: "6mm-clear",
      name: "6mm Clear Glass",
      image:
        "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=300&h=200&fit=crop",
    },
    {
      value: "6.4mm-clear-laminate",
      name: "6.4mm Clear Laminate",
      image:
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=200&fit=crop",
    },
    {
      value: "6.8mm-acoustic",
      name: "6.8mm Acoustic Glass",
      image:
        "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=300&h=200&fit=crop",
    },
  ],
  internal: [
    {
      value: "4mm-clear",
      name: "4mm Clear Glass",
      image:
        "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=300&h=200&fit=crop",
    },
    {
      value: "4mm-planitherm",
      name: "4mm Planitherm",
      image:
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=200&fit=crop",
    },
    {
      value: "4mm-planitherm-1",
      name: "4mm Planitherm 1.0",
      image:
        "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=300&h=200&fit=crop",
    },
    {
      value: "6mm-clear",
      name: "6mm Clear Glass",
      image:
        "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=300&h=200&fit=crop",
    },
    {
      value: "6mm-planitherm",
      name: "6mm Planitherm",
      image:
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=200&fit=crop",
    },
    {
      value: "6mm-planitherm-laminate",
      name: "6mm Planitherm Laminate",
      image:
        "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=300&h=200&fit=crop",
    },
  ],
};

const spacerData = {
  widths: [
    {
      value: "6",
      name: "6mm Width",
      image:
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=200&fit=crop",
    },
    {
      value: "8",
      name: "8mm Width",
      image:
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=200&fit=crop",
    },
    {
      value: "10",
      name: "10mm Width",
      image:
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=200&fit=crop",
    },
    {
      value: "12",
      name: "12mm Width",
      image:
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=200&fit=crop",
    },
    {
      value: "14",
      name: "14mm Width",
      image:
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=200&fit=crop",
    },
    {
      value: "16",
      name: "16mm Width",
      image:
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=200&fit=crop",
    },
    {
      value: "18",
      name: "18mm Width",
      image:
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=200&fit=crop",
    },
    {
      value: "24",
      name: "24mm Width",
      image:
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=200&fit=crop",
    },
  ],
  colors: [
    {
      value: "silver",
      name: "Silver",
      color: "#C0C0C0",
      image:
        "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=300&h=200&fit=crop",
    },
    {
      value: "gold",
      name: "Gold",
      color: "#FFD700",
      image:
        "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=300&h=200&fit=crop",
    },
    {
      value: "white",
      name: "White WarmEdge",
      color: "#FFFFFF",
      image:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop",
    },
    {
      value: "grey",
      name: "Grey WarmEdge",
      color: "#6B7280",
      image:
        "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=300&h=200&fit=crop",
    },
    {
      value: "black",
      name: "Black WarmEdge",
      color: "#000000",
      image:
        "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=300&h=200&fit=crop",
    },
  ],
};

// Modal functionality
let currentModalTarget = "";
let selectedOption = null;

// Shape Modal Functions
function openShapeModal(target) {
  currentShapeTarget = target;
  selectedShape = null;

  const modal = document.getElementById("shapeModal");
  const title = document.getElementById("shapeModalTitle");
  const container = document.getElementById("shapeOptionsContainer");
  const configPanel = document.getElementById("shapeConfigPanel");

  title.textContent = "Select Shape";
  configPanel.classList.add("hidden");

  // Reset shape data
  shapeData = {
    currentShape: null,
    rotation: 0,
    widthA: 0,
    heightA: 0,
    lengthC: 0,
    customName: "",
    reference: "",
    templateFile: null,
  };

  // Populate shape options
  container.innerHTML = "";
  shapes.forEach((shape) => {
    const option = document.createElement("div");
    option.className =
      "shape-option cursor-pointer border-2 border-gray-200 rounded-lg p-3 text-center hover:border-blue-400 transition-all";
    option.dataset.value = shape.value;
    option.dataset.name = shape.name;
    option.dataset.icon = shape.icon;
    option.dataset.needsLength = shape.needsLength;

    option.innerHTML = `
                    <div class="text-3xl mb-2">${shape.icon}</div>
                    <p class="text-sm font-medium">${shape.name}</p>
                `;

    option.addEventListener("click", function () {
      selectShapeType(this);
    });

    container.appendChild(option);
  });

  modal.classList.remove("hidden");
}

function selectShapeType(element) {
  // Remove selection from all shapes
  document.querySelectorAll(".shape-option").forEach((opt) => {
    opt.classList.remove("border-blue-500", "bg-blue-50");
  });

  // Add selection to clicked shape
  element.classList.add("border-blue-500", "bg-blue-50");
  selectedShape = element;

  // Update shape data
  shapeData.currentShape = element.dataset.value;

  // Show configuration panel
  const configPanel = document.getElementById("shapeConfigPanel");
  configPanel.classList.remove("hidden");

  // Update preview
  updateShapePreview(element.dataset.icon, element.dataset.name);

  // Show/hide length field based on shape
  const lengthContainer = document.getElementById("shapeLengthContainer");
  const customContainer = document.getElementById("customShapeContainer");
  const templateContainer = document.getElementById("templateUploadContainer");

  if (element.dataset.needsLength === "true") {
    lengthContainer.classList.remove("hidden");
  } else {
    lengthContainer.classList.add("hidden");
  }

  // Always show the template upload option
  templateContainer.classList.remove("hidden");

  if (element.dataset.value === "custom") {
    customContainer.classList.remove("hidden");
  } else {
    customContainer.classList.add("hidden");
  }

  // Reset form fields
  document.getElementById("shapeWidthA").value = "";
  document.getElementById("shapeHeightA").value = "";
  document.getElementById("shapeLengthC").value = "";
  document.getElementById("customShapeName").value = "";
  document.getElementById("shapeReference").value = "";
  document.getElementById("shapeRotation").value = "0";

  // Reset rotation buttons
  document.querySelectorAll(".rotation-btn").forEach((btn) => {
    btn.classList.remove("border-blue-500", "bg-blue-50");
  });
  document
    .querySelector('.rotation-btn[data-rotation="0"]')
    .classList.add("border-blue-500", "bg-blue-50");

  // Update rotation icons
  updateRotationIcons(element.dataset.icon);

  // Clear calculations
  updateShapeCalculations();

  // Enable/disable select button
  validateShapeForm();
}

function updateShapePreview(icon, name) {
  document.getElementById("shapePreview").textContent = icon;
  document.getElementById("shapePreviewName").textContent = name;
}

function updateRotationIcons(baseIcon) {
  // Update rotation preview icons (simplified - in real app would show actual rotations)
  document.getElementById("rotation0").textContent = baseIcon;
  document.getElementById("rotation90").textContent = baseIcon;
  document.getElementById("rotation180").textContent = baseIcon;
  document.getElementById("rotation270").textContent = baseIcon;
}

function closeShapeModal() {
  document.getElementById("shapeModal").classList.add("hidden");
  currentShapeTarget = "";
  selectedShape = null;
}

function selectShapeOption() {
  if (!selectedShape || !validateShapeForm()) {
    return;
  }

  // Collect form data
  shapeData.widthA =
    parseFloat(document.getElementById("shapeWidthA").value) || 0;
  shapeData.heightA =
    parseFloat(document.getElementById("shapeHeightA").value) || 0;
  shapeData.lengthC =
    parseFloat(document.getElementById("shapeLengthC").value) || 0;
  shapeData.customName = document.getElementById("customShapeName").value || "";
  shapeData.reference = document.getElementById("shapeReference").value || "";
  shapeData.rotation =
    parseInt(document.getElementById("shapeRotation").value) || 0;

  // Update the target elements
  const hiddenInput = document.getElementById(currentShapeTarget + "Shape");
  const textSpan = document.getElementById(currentShapeTarget + "ShapeText");
  const detailsDiv = document.getElementById(
    currentShapeTarget + "ShapeDetails"
  );

  if (hiddenInput && textSpan) {
    hiddenInput.value = selectedShape.dataset.value;
    textSpan.textContent = selectedShape.dataset.name;
    textSpan.classList.remove("text-gray-500");
    textSpan.classList.add("text-gray-800");
  }

  // Show shape details
  if (detailsDiv) {
    detailsDiv.classList.remove("hidden");
    updateShapeDetailsDisplay();
  }

  calculatePrice();
  closeShapeModal();
}

function validateShapeForm() {
  const widthA = parseFloat(document.getElementById("shapeWidthA").value) || 0;
  const heightA =
    parseFloat(document.getElementById("shapeHeightA").value) || 0;
  const lengthC =
    parseFloat(document.getElementById("shapeLengthC").value) || 0;
  const customName = document.getElementById("customShapeName").value || "";

  let isValid = true;

  if (!selectedShape) {
    isValid = false;
  }

  if (widthA < 100 || widthA > 2800) {
    isValid = false;
  }

  if (heightA < 100 || heightA > 2800) {
    isValid = false;
  }

  if (
    selectedShape &&
    selectedShape.dataset.needsLength === "true" &&
    (lengthC < 100 || lengthC > 2800)
  ) {
    isValid = false;
  }

  if (
    selectedShape &&
    selectedShape.dataset.value === "custom" &&
    !customName.trim()
  ) {
    isValid = false;
  }

  // Update select button state
  const selectBtn = document.getElementById("selectShapeBtn");
  if (selectBtn) {
    selectBtn.disabled = !isValid;
  }

  return isValid;
}

function getSingleUnitGlassCost(area) {
  const thickness = document.getElementById("singleGlassThickness").value;
  const glassType = document.querySelector(
    'input[name="singleGlassType"]:checked'
  )?.value;

  if (!thickness || !glassType || !singleUnitPricing[thickness]) {
    return 0;
  }

  let priceKey = glassType;

  if (glassType === "tinted") {
    const tintColor = document.querySelector(
      'input[name="singleTintColor"]:checked'
    )?.value;
    if (!tintColor) return 0;
    priceKey = `tinted-${tintColor}`;
  } else if (glassType === "painted") {
    // Simplified logic for painted glass pricing based on your data
    // This assumes 'White' and 'Black' are the primary priced custom colors.
    const colorType = document.querySelector(
      'input[name="singleColorType"]:checked'
    )?.value;
    if (colorType === "ral") {
      const ralColor = document.getElementById("singleRALColor").value;
      if (ralColor.includes("9010") || ralColor.includes("9016")) {
        priceKey = "painted-ral-9010"; // Use a generic white key
      }
    } else if (colorType === "custom") {
      const customColor = document
        .getElementById("singleCustomColor")
        .value.toLowerCase();
      if (customColor.includes("white")) {
        priceKey = "painted-custom-white";
      } else if (customColor.includes("black")) {
        priceKey = "painted-custom-black";
      }
    }
  } else if (glassType === "black") {
    priceKey = "black";
  }

  const pricePerSqm = singleUnitPricing[thickness][priceKey] || 0;

  // Minimum area charge of 0.3 m²
  const chargeableArea = Math.max(area, 0.3);

  return chargeableArea * pricePerSqm;
}
function getDoubleGlazedGlassCost(area) {
  const outerGlassType = document.getElementById("doubleOuterGlass").value;
  const innerGlassType = document.getElementById("doubleInnerGlass").value;

  if (!outerGlassType || !innerGlassType) {
    return 0;
  }

  const outerPricePerSqm = doubleGlazedPricing.external[outerGlassType] || 0;
  const innerPricePerSqm = doubleGlazedPricing.internal[innerGlassType] || 0;

  const totalGlassPricePerSqm = outerPricePerSqm + innerPricePerSqm;

  // Minimum area charge of 0.3 m²
  const chargeableArea = Math.max(area, 0.3);

  return chargeableArea * totalGlassPricePerSqm;
}
function getTripleGlazedGlassCost(area) {
  const outerGlassType = document.getElementById("tripleOuterGlass").value;
  const centreGlassType = document.getElementById("tripleCentreGlass").value;
  const innerGlassType = document.getElementById("tripleInnerGlass").value;

  if (!outerGlassType || !centreGlassType || !innerGlassType) {
    return 0;
  }

  const outerPricePerSqm = tripleGlazedPricing.external[outerGlassType] || 0;
  const centrePricePerSqm = tripleGlazedPricing.centre[centreGlassType] || 0;
  const innerPricePerSqm = tripleGlazedPricing.internal[innerGlassType] || 0;

  const totalGlassPricePerSqm =
    outerPricePerSqm + centrePricePerSqm + innerPricePerSqm;

  // Minimum area charge of 0.3 m²
  const chargeableArea = Math.max(area, 0.3);

  return chargeableArea * totalGlassPricePerSqm;
}

function updateShapeDetailsDisplay() {
  const area = calculateShapeArea();
  const linear = calculateLinearMetre();
  const weight = calculateWeight(area);
  let glassCost = 0;
  if (currentTab === "single") {
    glassCost = getSingleUnitGlassCost(area);
  } else if (currentTab === "double") {
    glassCost = getDoubleGlazedGlassCost(area);
  } else if (currentTab === "triple") {
    glassCost = getTripleGlazedGlassCost(area);
  }
  const shapeCost = getShapeCost();
  const oversizeCost = getOversizeCost();
  const totalCost = glassCost + shapeCost + oversizeCost;

  // Update shape configuration details
  document.getElementById(currentShapeTarget + "SelectedShape").textContent =
    selectedShape.dataset.name;
  document.getElementById(currentShapeTarget + "SelectedRotation").textContent =
    shapeData.rotation + "°";
  document.getElementById(currentShapeTarget + "SelectedWidth").textContent =
    shapeData.widthA + "mm";
  document.getElementById(currentShapeTarget + "SelectedHeight").textContent =
    shapeData.heightA + "mm";
  document.getElementById(currentShapeTarget + "ShapeWeight").textContent =
    weight.toFixed(2) + " kg";
  document.getElementById(currentShapeTarget + "ShapeCost").textContent =
    "£" + totalCost.toFixed(2);

  // Show/hide Length C based on shape
  const lengthCDisplay = document.getElementById(
    currentShapeTarget + "LengthCDisplay"
  );
  if (selectedShape.dataset.needsLength === "true" && shapeData.lengthC > 0) {
    lengthCDisplay.classList.remove("hidden");
    document.getElementById(
      currentShapeTarget + "SelectedLengthC"
    ).textContent = shapeData.lengthC + "mm";
  } else {
    lengthCDisplay.classList.add("hidden");
  }

  // Show/hide Custom Name based on shape
  const customNameDisplay = document.getElementById(
    currentShapeTarget + "CustomNameDisplay"
  );
  if (selectedShape.dataset.value === "custom" && shapeData.customName) {
    customNameDisplay.classList.remove("hidden");
    document.getElementById(
      currentShapeTarget + "SelectedCustomName"
    ).textContent = shapeData.customName;
  } else {
    customNameDisplay.classList.add("hidden");
  }

  // Update reference and template
  document.getElementById(currentShapeTarget + "ShapeRef").textContent =
    shapeData.reference || "-";
  document.getElementById(currentShapeTarget + "TemplateFile").textContent =
    shapeData.templateFile ? shapeData.templateFile.name : "-";

  // Update calculated values
  document.getElementById(currentShapeTarget + "ShapeArea").textContent =
    area.toFixed(3) + " m²";
  document.getElementById(currentShapeTarget + "ShapeLinear").textContent =
    linear.toFixed(3) + " m";
  document.getElementById(currentShapeTarget + "ShapeWeight").textContent =
    weight.toFixed(2) + " kg";
  document.getElementById(currentShapeTarget + "ShapeCost").textContent =
    "£" + totalCost.toFixed(2);
}

function updateShapeCalculations() {
  const area = calculateShapeArea();
  const linear = calculateLinearMetre();
  const weight = calculateWeight(area);

  // Update modal calculations
  document.getElementById("calculatedArea").textContent = area.toFixed(3);
  document.getElementById("calculatedLinear").textContent = linear.toFixed(3);
  document.getElementById("calculatedWeight").textContent = weight.toFixed(2);
  document.getElementById("calculatedArea").textContent = area.toFixed(3);

  // Calculate costs (simplified)
  let glassCost = 0;
  if (currentTab === "single") {
    glassCost = getSingleUnitGlassCost(area);
  } else if (currentTab === "double") {
    glassCost = getDoubleGlazedGlassCost(area);
  } else if (currentTab === "triple") {
    glassCost = getTripleGlazedGlassCost(area);
  }
  const shapeCost = getShapeCost();
  const oversizeCost = getOversizeCost();

  document.getElementById("calculatedGlassCost").textContent =
    glassCost.toFixed(2);
  document.getElementById("calculatedShapeCost").textContent =
    shapeCost.toFixed(2);
  document.getElementById("calculatedOversizeCost").textContent =
    oversizeCost.toFixed(2);
}

function calculateShapeArea() {
  const widthA = parseFloat(document.getElementById("shapeWidthA").value) || 0;
  const heightA =
    parseFloat(document.getElementById("shapeHeightA").value) || 0;
  const lengthC =
    parseFloat(document.getElementById("shapeLengthC").value) || 0;

  if (!selectedShape || widthA === 0 || heightA === 0) return 0;

  const widthM = widthA / 1000;
  const heightM = heightA / 1000;
  const lengthM = lengthC / 1000;

  switch (selectedShape.dataset.value) {
    case "square":
      return widthM * heightM;
    case "triangle":
      return (widthM * heightM) / 2;
    case "circle":
      const radius = Math.min(widthM, heightM) / 2;
      return Math.PI * radius * radius;
    case "quarter-circle":
      const qRadius = Math.min(widthM, heightM) / 2;
      return (Math.PI * qRadius * qRadius) / 4;
    case "trapezium":
      return ((widthM + lengthM) * heightM) / 2;
    case "parallelogram":
      return widthM * heightM;
    case "arched":
      const rectArea = widthM * heightM;
      const archRadius = widthM / 2;
      const archArea = (Math.PI * archRadius * archRadius) / 2;
      return rectArea + archArea;
    default:
      return widthM * heightM; // Default to rectangle
  }
}

function calculateLinearMetre() {
  const widthA = parseFloat(document.getElementById("shapeWidthA").value) || 0;
  const heightA =
    parseFloat(document.getElementById("shapeHeightA").value) || 0;
  const lengthC =
    parseFloat(document.getElementById("shapeLengthC").value) || 0;

  if (!selectedShape || widthA === 0 || heightA === 0) return 0;

  const widthM = widthA / 1000;
  const heightM = heightA / 1000;
  const lengthM = lengthC / 1000;

  switch (selectedShape.dataset.value) {
    case "square":
      return 2 * (widthM + heightM);
    case "triangle":
      return widthM + heightM + Math.sqrt(widthM * widthM + heightM * heightM);
    case "circle":
      const radius = Math.min(widthM, heightM) / 2;
      return 2 * Math.PI * radius;
    case "quarter-circle":
      const qRadius = Math.min(widthM, heightM) / 2;
      return (Math.PI * qRadius) / 2 + widthM + heightM;
    default:
      return 2 * (widthM + heightM); // Default to rectangle perimeter
  }
}

function calculateWeight(area) {
  // Simplified weight calculation: 25kg per m² for glass
  return area * 25;
}

function getShapeCost() {
  if (!selectedShape) return 0;

  const shapeCosts = {
    square: 10,
    triangle: 15,
    rake1: 20,
    rake2: 25,
    rake3: 30,
    rake4: 35,
    circle: 20,
    arched: 25,
    "quarter-circle": 20,
    trapezium: 25,
    parallelogram: 20,
    custom: 50,
  };

  return shapeCosts[selectedShape.dataset.value] || 0;
}

function getOversizeCost() {
  const widthA = parseFloat(document.getElementById("shapeWidthA").value) || 0;
  const heightA =
    parseFloat(document.getElementById("shapeHeightA").value) || 0;

  // Oversize cost for dimensions over 2000mm
  let cost = 0;
  if (widthA > 2000) cost += 25;
  if (heightA > 2000) cost += 25;

  return cost;
}

function handleTemplateUpload(input) {
  const file = input.files[0];
  const preview = document.getElementById("templatePreview");
  const fileName = document.getElementById("templateFileName");

  if (file) {
    preview.classList.remove("hidden");
    fileName.textContent = file.name;
    shapeData.templateFile = file;
  } else {
    preview.classList.add("hidden");
    fileName.textContent = "";
    shapeData.templateFile = null;
  }
}

function openGlassModal(target) {
  currentModalTarget = target;
  selectedOption = null;

  const modal = document.getElementById("glassModal");
  const title = document.getElementById("glassModalTitle");
  const container = document.getElementById("glassOptionsContainer");

  // Set title based on target
  if (target.includes("Outer")) {
    title.textContent = "Select External Glass";
  } else if (target.includes("Inner")) {
    title.textContent = "Select Internal Glass";
  } else if (target.includes("Centre")) {
    title.textContent = "Select Centre Glass";
  }

  // Determine which glass data to use
  let data = target.includes("Outer") ? glassData.external : glassData.internal;

  // Populate options
  container.innerHTML = "";
  data.forEach((glass) => {
    const option = document.createElement("div");
    option.className =
      "glass-option cursor-pointer border-2 border-gray-200 rounded-lg overflow-hidden hover:border-blue-400 transition-all";
    option.dataset.value = glass.value;
    option.dataset.name = glass.name;
    option.innerHTML = `
                    <img src="${glass.image}" alt="${glass.name}" class="w-full h-32 object-cover" onerror="this.src=''; this.alt='Image failed to load'; this.style.display='none';">
                    <div class="p-3">
                        <p class="font-medium text-gray-800">${glass.name}</p>
                        <p class="text-sm text-gray-600">Professional glass option</p>
                    </div>
                `;

    option.addEventListener("click", function () {
      document.querySelectorAll(".glass-option").forEach((opt) => {
        opt.classList.remove("border-blue-500", "bg-blue-50");
      });
      this.classList.add("border-blue-500", "bg-blue-50");
      selectedOption = this;
    });

    container.appendChild(option);
  });

  modal.classList.remove("hidden");
}

function openSpacerModal(target) {
  currentModalTarget = target;
  selectedOption = null;

  const modal = document.getElementById("spacerModal");
  const title = document.getElementById("spacerModalTitle");
  const container = document.getElementById("spacerOptionsContainer");

  // Set title and data based on target
  let data, titleText;
  if (target.includes("Width")) {
    titleText = "Select Spacer Bar Width";
    data = spacerData.widths;
  } else if (target.includes("Color")) {
    titleText = "Select Spacer Bar Color";
    data = spacerData.colors;
  }

  title.textContent = titleText;

  // Populate options
  container.innerHTML = "";
  const gridClass = target.includes("Color")
    ? "grid-cols-2 sm:grid-cols-3"
    : "grid-cols-2 sm:grid-cols-4";
  container.className = `grid ${gridClass} gap-4 max-h-96 overflow-y-auto`;

  data.forEach((item) => {
    const option = document.createElement("div");
    option.className =
      "spacer-option cursor-pointer border-2 border-gray-200 rounded-lg overflow-hidden hover:border-blue-400 transition-all";
    option.dataset.value = item.value;
    option.dataset.name = item.name;
    if (item.color) option.dataset.color = item.color;

    option.innerHTML = `
                    <img src="${item.image}" alt="${
      item.name
    }" class="w-full h-24 object-cover" onerror="this.src=''; this.alt='Image failed to load'; this.style.display='none';">
                    <div class="p-3">
                        ${
                          item.color
                            ? `<div class="w-6 h-6 rounded border border-gray-300 mb-2" style="background-color: ${
                                item.color
                              }; ${
                                item.color === "#FFFFFF"
                                  ? "border: 2px solid #D1D5DB;"
                                  : ""
                              }"></div>`
                            : ""
                        }
                        <p class="font-medium text-gray-800 text-sm">${
                          item.name
                        }</p>
                    </div>
                `;

    option.addEventListener("click", function () {
      document.querySelectorAll(".spacer-option").forEach((opt) => {
        opt.classList.remove("border-blue-500", "bg-blue-50");
      });
      this.classList.add("border-blue-500", "bg-blue-50");
      selectedOption = this;
    });

    container.appendChild(option);
  });

  modal.classList.remove("hidden");
}

function closeGlassModal() {
  document.getElementById("glassModal").classList.add("hidden");
  currentModalTarget = "";
  selectedOption = null;
}

function closeSpacerModal() {
  document.getElementById("spacerModal").classList.add("hidden");
  currentModalTarget = "";
  selectedOption = null;
}

function selectGlassOption() {
  if (!selectedOption) {
    alert("Please select a glass type first");
    return;
  }

  const value = selectedOption.dataset.value;
  const name = selectedOption.dataset.name;

  // Update the appropriate elements based on currentModalTarget
  let hiddenInputId, textSpanId;

  if (currentModalTarget === "doubleOuter") {
    hiddenInputId = "doubleOuterGlass";
    textSpanId = "doubleOuterGlassText";
  } else if (currentModalTarget === "doubleInner") {
    hiddenInputId = "doubleInnerGlass";
    textSpanId = "doubleInnerGlassText";
  } else if (currentModalTarget === "tripleOuter") {
    hiddenInputId = "tripleOuterGlass";
    textSpanId = "tripleOuterGlassText";
  } else if (currentModalTarget === "tripleCentre") {
    hiddenInputId = "tripleCentreGlass";
    textSpanId = "tripleCentreGlassText";
  } else if (currentModalTarget === "tripleInner") {
    hiddenInputId = "tripleInnerGlass";
    textSpanId = "tripleInnerGlassText";
  }

  const hiddenInput = document.getElementById(hiddenInputId);
  const textSpan = document.getElementById(textSpanId);

  if (hiddenInput && textSpan) {
    hiddenInput.value = value;
    textSpan.textContent = name;
    textSpan.classList.remove("text-gray-500");
    textSpan.classList.add("text-gray-800");
  }

  // Handle pattern glass options visibility
  if (currentModalTarget === "doubleOuter") {
    const patternOptions = document.getElementById("doubleOuterPatternOptions");
    if (value === "4mm-pattern") {
      patternOptions.classList.remove("hidden");
    } else {
      patternOptions.classList.add("hidden");
      // Clear pattern selection when hiding
      document
        .querySelectorAll('input[name="doubleOuterPattern"]')
        .forEach((radio) => (radio.checked = false));
      document
        .querySelectorAll("#doubleOuterPatternOptions .glass-type-option")
        .forEach((option) => {
          option.classList.remove("border-blue-500", "bg-blue-50");
        });
    }
  } else if (currentModalTarget === "tripleOuter") {
    const patternOptions = document.getElementById("tripleOuterPatternOptions");
    if (value === "4mm-pattern") {
      patternOptions.classList.remove("hidden");
    } else {
      patternOptions.classList.add("hidden");
      // Clear pattern selection when hiding
      document
        .querySelectorAll('input[name="tripleOuterPattern"]')
        .forEach((radio) => (radio.checked = false));
      document
        .querySelectorAll("#tripleOuterPatternOptions .glass-type-option")
        .forEach((option) => {
          option.classList.remove("border-blue-500", "bg-blue-50");
        });
    }
  }

  calculatePrice();
  closeGlassModal();
}

function selectSpacerOption() {
  if (!selectedOption) {
    alert("Please select an option first");
    return;
  }

  const value = selectedOption.dataset.value;
  const name = selectedOption.dataset.name;
  const color = selectedOption.dataset.color;

  // Update the appropriate elements based on currentModalTarget
  let hiddenInputId, textSpanId, previewId;

  if (currentModalTarget === "doubleWidth") {
    hiddenInputId = "doubleSpacerWidth";
    textSpanId = "doubleSpacerWidthText";
  } else if (currentModalTarget === "doubleColor") {
    hiddenInputId = "doubleSpacerColor";
    textSpanId = "doubleSpacerColorText";
    previewId = "doubleColorPreview";
  } else if (currentModalTarget === "tripleWidth") {
    hiddenInputId = "tripleSpacerWidth";
    textSpanId = "tripleSpacerWidthText";
  } else if (currentModalTarget === "tripleColor") {
    hiddenInputId = "tripleSpacerColor";
    textSpanId = "tripleSpacerColorText";
    previewId = "tripleColorPreview";
  }

  const hiddenInput = document.getElementById(hiddenInputId);
  const textSpan = document.getElementById(textSpanId);

  if (hiddenInput && textSpan) {
    hiddenInput.value = value;
    textSpan.textContent = name;
    textSpan.classList.remove("text-gray-500");
    textSpan.classList.add("text-gray-800");

    // Update color preview if it's a color selection
    if (color && previewId) {
      updateColorPreview(previewId, value);
    }
  }

  calculatePrice();
  closeSpacerModal();
}

// Add event listeners for glass options
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".glass-option").forEach((option) => {
    option.addEventListener("click", function () {
      // Remove selection from all options
      document.querySelectorAll(".glass-option").forEach((opt) => {
        opt.classList.remove("bg-blue-100", "border-blue-500");
      });

      // Add selection to clicked option
      this.classList.add("bg-blue-100", "border-blue-500");
      selectedGlassOption = this;
    });
  });

  // Add event listeners for radio button selections with visual feedback
  document.querySelectorAll('input[type="radio"]').forEach((radio) => {
    radio.addEventListener("change", function () {
      if (this.closest(".glass-type-option")) {
        // Remove selection from all options in the same group
        const groupName = this.name;
        document.querySelectorAll(`input[name="${groupName}"]`).forEach((r) => {
          const option = r.closest("label").querySelector(".glass-type-option");
          if (option) {
            option.classList.remove("border-blue-500", "bg-blue-50");
          }
        });

        // Add selection to clicked option
        const option =
          this.closest("label").querySelector(".glass-type-option");
        if (option) {
          option.classList.add("border-blue-500", "bg-blue-50");
        }
      }
    });
  });
});

// Color preview functionality
function updateColorPreview(previewId, colorValue) {
  const preview = document.getElementById(previewId);
  if (!preview) return;

  const colorMap = {
    silver: "#C0C0C0",
    gold: "#FFD700",
    white: "#FFFFFF",
    grey: "#6B7280",
    black: "#000000",
  };

  if (colorValue && colorMap[colorValue]) {
    preview.style.backgroundColor = colorMap[colorValue];
    preview.classList.remove("hidden");

    // Add border for white color visibility
    if (colorValue === "white") {
      preview.style.border = "2px solid #D1D5DB";
    } else {
      preview.style.border = "1px solid #D1D5DB";
    }
  } else {
    preview.classList.add("hidden");
  }
}

// File upload functionality
function handleFileUpload(input, previewId) {
  const file = input.files[0];
  const preview = document.getElementById(previewId);
  const fileName = document.getElementById(
    previewId.replace("Preview", "FileName")
  );

  if (file) {
    preview.classList.remove("hidden");
    if (fileName) {
      fileName.textContent = file.name;
    }
  } else {
    preview.classList.add("hidden");
    if (fileName) {
      fileName.textContent = "";
    }
  }
}

// Corner and hole option functionality
function toggleSingleHoleOptions() {
  const selectedHole = document.querySelector(
    'input[name="singleHoles"]:checked'
  );
  const customOptions = document.getElementById("singleCustomHoleOptions");

  // Update visual selection
  document.querySelectorAll(".hole-option").forEach((option) => {
    option.classList.remove("border-blue-500", "bg-blue-50");
  });

  if (selectedHole) {
    selectedHole
      .closest("label")
      .querySelector(".hole-option")
      .classList.add("border-blue-500", "bg-blue-50");

    if (selectedHole.value === "custom") {
      customOptions.classList.remove("hidden");
    } else {
      customOptions.classList.add("hidden");
      // Clear custom options when hiding
      document.getElementById("singleHoleTemplate").value = "";
      document.getElementById("singleNumberOfHoles").value = "";
      document
        .getElementById("singleHoleTemplatePreview")
        .classList.add("hidden");
    }
  }
}

function handleSingleHoleTemplateUpload(input) {
  const file = input.files[0];
  const preview = document.getElementById("singleHoleTemplatePreview");
  const fileName = document.getElementById("singleHoleTemplateFileName");

  if (file) {
    preview.classList.remove("hidden");
    fileName.textContent = file.name;
  } else {
    preview.classList.add("hidden");
    fileName.textContent = "";
  }
}

// Add event listeners for corner and hole options
document.addEventListener("DOMContentLoaded", function () {
  // Corner option listeners
  document.querySelectorAll('input[name="singleCorners"]').forEach((radio) => {
    radio.addEventListener("change", function () {
      document.querySelectorAll(".corner-option").forEach((option) => {
        option.classList.remove("border-blue-500", "bg-blue-50");
      });

      if (this.checked) {
        this.closest("label")
          .querySelector(".corner-option")
          .classList.add("border-blue-500", "bg-blue-50");
      }
    });
  });

  // Hole option listeners
  document.querySelectorAll('input[name="singleHoles"]').forEach((radio) => {
    radio.addEventListener("change", toggleSingleHoleOptions);
  });
});
