function labelTemplate(asset, labelIndex) {
    return `<div class="ksdLabel">
        <div class="stripes top">
            <p>Kentfield School District</p>
        </div>
        <div class="labelBody">
            <h1 class="labelName">${asset[1].trim()}</h1>
            <div class="labelVisuals">
                <div class="labelArt">
                    <img src="aps_HyperDither.png" />
                </div>
                <div id="qrcode_${asset[0].trim()}" class="qrcode" data-asset-tag="${asset[0].trim()}"></div>
            </div>
        </div>
        <div class="stripes bottom">
            <p>${asset[2].trim()}<span class="labelIndex"> - ${labelIndex}</span></p>
            <p>${asset[0].trim()}</p>
        </div>
    </div>`
};

function placeholderTemplate() {
    return `<div class="ksdLabel placeholder">
        <div class="stripes top"><p>&nbsp;</p></div>
        <div class="labelBody">
            <h1 class="labelName">Blank</h1>
        </div>
        <div class="stripes bottom"><p>&nbsp;</p></div>
    </div>`
};

function createLabel(labelData, counter) {
    var temp = document.createElement('div');
    temp.innerHTML = labelTemplate(labelData, counter+1);
    temp.addEventListener("click", function (event) {
        event.stopPropagation();
        event.preventDefault();
        event.currentTarget.parentNode.insertBefore(createPlaceholderLabel(), event.currentTarget);
    }, false);
    return temp;
};

function createPlaceholderLabel() {
    var temp = document.createElement('div');
    temp.innerHTML = placeholderTemplate();
    temp.addEventListener("click", function (event) {
        event.stopPropagation();
        event.preventDefault();
        event.currentTarget.parentNode.removeChild(event.currentTarget);
    }, false);
    return temp;
}


// Clear any classes from allClasses, then set class on element.
function setClassExclusively(targetElement, newClass, allClasses) {
    // Attempt to remove all possible label classes.
    allClasses.forEach(function(opt) {
        try {
            targetElement.classList.remove(opt.value);
        }
        catch (e) {}
    });
    targetElement.classList.add(newClass);
};

// Set class defining label type based on selection from list of label types.
function updateLabelType(newType) {
    setClassExclusively(window.dGO.printArea, newType, window.dGO.allLabelTypes);
};

// Set class defining text size based on selection from list of text sizes.
function updateTextSize(newSize) {
    setClassExclusively(window.dGO.printArea, newSize, window.dGO.allTextSizes);
};

function getLabelData(dataSource) {
    // dataSource is a placeholder for possible future options.
    // Get label data from the CSV text area.
    var items = Papa.parse(window.dGO.csvDataArea.value, {
        header: false,
        skipEmptyLines: true
    });
    return items;
};

// Render the labels from CSV data.
function renderLabels() {
    window.dGO.printArea.innerHTML = ''; // Clear out previous labels.

    var items = getLabelData(null);
    // Create a label for each line of the CSV.
    items.data.forEach(function(item, i) {
        window.dGO.printArea.appendChild(createLabel(item, i));
    })

    // Generate and insert QR Codes
    var qrcodes = document.querySelectorAll('.qrcode');
    qrcodes.forEach(function(el, i){
        new QRCode(el, {
            text: el.dataset.assetTag,
            // Printer resolution is 1200dpi, but 600px is probably more than enough.
            width: 600,
            height: 600,
            useSVG: true, // This doesn't seem to do anything.
            correctLevel: QRCode.CorrectLevel.M
        });
    });
}

window.dGO = {
    allLabelTypes: [],
    allTextSizes: [],
    printArea: null,
    labelTypeSelector: null,
    textSizeSelector: null,
    csvDataArea: null,
};


// Launch when DOM is ready.
function whenDocumentIsReady(fn) {
    if (document.readyState != 'loading'){
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}


whenDocumentIsReady(function() {
    // Set up some DOM-related globals. A lazy expedient.
    window.dGO.csvDataArea = document.getElementById('csvData');
    window.dGO.printArea = document.getElementById('printArea');
    window.dGO.labelTypeSelector = document.getElementById('labelType');
    window.dGO.textSizeSelector = document.getElementById('h1Size');
    window.dGO.allLabelTypes = Array.apply(null, window.dGO.labelTypeSelector.options);
    window.dGO.allTextSizes = Array.apply(null, window.dGO.textSizeSelector.options);


    // Add event listeners for the controls.
    document.getElementById('labelType').addEventListener("change", function (event) {
        // console.log(event.srcElement);
        updateLabelType(event.currentTarget.value);
    }, false);

    document.getElementById('h1Size').addEventListener("change", function (event) {
        updateTextSize(event.currentTarget.value);
    }, false);

    document.querySelector('input[name="testing"]').addEventListener("change", function (event) {
        if (event.currentTarget.checked) {
            window.dGO.printArea.classList.add('testing');
        } else {
            window.dGO.printArea.classList.remove('testing');
        }
    }, false);

    document.getElementById('renderLabels').addEventListener("click", function (event) {
        event.stopPropagation();
        event.preventDefault();
        renderLabels();
    }, false);


    // Manually set the label type and text size based on default selected
    // menu items.
    var manualChangeEvent = new Event('change');
    window.dGO.labelTypeSelector.dispatchEvent(manualChangeEvent);
    window.dGO.textSizeSelector.dispatchEvent(manualChangeEvent);

    // Initial rendering.
    renderLabels();

});
