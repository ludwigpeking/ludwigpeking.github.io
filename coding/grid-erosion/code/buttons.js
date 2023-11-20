let buttonList = [];
let inputElements = [];
let labelElements = [];
let sceneSelect;
let _sceneTitleElement;
let showProsperity = false;
let isTrafficShown = false;

const params = [
  { name: "streetCount", type: "int" },
  { name: "avenueCount", type: "int" },
  { name: "streetWidth", type: "int" },
  { name: "blockParcelCount", type: "int" },
  { name: "parcelWidth", type: "int" },
  { name: "parcelDepth", type: "int" },
  { name: "res", type: "int" },
];

function getSceneTitleElement() {
  if (!_sceneTitleElement) {
    _sceneTitleElement = select("#scene-title");
  }
  return _sceneTitleElement;
}

function resetParameters() {
  currentParams = scenes.newYork;
  console.log("Parameters reset to default");
  buttons();
}

function inputs() {
  if (sceneSelect) {
    sceneSelect.remove();
  }
  inputElements.forEach((input) => input.remove());
  labelElements.forEach((label) => label.remove());
  inputElements = [];
  labelElements = [];

  sceneSelect = createSelect();
  sceneSelect.position(10, height + 90).style("padding", "5px"); // Adjust position as needed
  for (const scene in scenes) {
    sceneSelect.option(scene);
  }
  sceneSelect.changed(() => {
    selectedScene = sceneSelect.value();
    changeScene(selectedScene);
  });
  sceneSelect.value(selectedScene);

  inputElements.push(sceneSelect); // To ensure it gets removed and updated like other inputs
  const sceneTitle = getSceneTitleElement();
  if (sceneTitle) {
    sceneTitle
      .html(capitalizeFirstLetter(selectedScene) + " Grid")
      .style("top", "10px");
  }

  inputElements = params.map((param, index) => {
    const label = createElement("label", capitalizeFirstLetter(param.name))
      .position(index * 100 + 10, height + 120)
      .style("font-size", "12px");

    labelElements.push(label); // Store label elements to update them later

    const input = createInput("")
      .value(currentParams[param.name])
      .position(index * 100 + 10, height + 140)
      .size(87, 20);

    if (param.type === "int") {
      input.attribute("type", "number").attribute("step", "1");
    }

    input.changed(() => {
      updateParameter(param.name, input.value(), param.type);
    });

    return input;
  });
}

function getDefaultValue(paramName) {
  return currentParams[paramName] || "";
}

function createNumberInput(paramName) {
  const input = createInput("");
  input.attribute("type", "number");
  input.attribute("step", "1"); // Increment by 1
  input.value(window[paramName]); // Set the default value
  return input;
}

function updateParameter(paramName, value, type) {
  if (type === "int") {
    value = parseInt(value);
  }
  currentParams[paramName] = value;
  needUpdate = true;

  const labelIndex = params.findIndex((param) => param.name === paramName);
  if (labelIndex !== -1) {
    labelElements[labelIndex].html(
      capitalizeFirstLetter(paramName) + ": " + value
    );
  }
  ({
    streetCount,
    avenueCount,
    streetWidth,
    blockParcelCount,
    parcelWidth,
    parcelDepth,
    res,
    parkEdges,
    parkContinue,
    needUpdate,
    squareEdges,
    broadway,
  } = currentParams);
  buttons();
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function buttons() {
  const buttonHeight = 40;
  const buttonLineHeight = 45;
  const buttonWidth = 150;
  const progressBarWidth = 50; // Width of the progress bar
  const progressBarHeight = 40;
  for (let btn of buttonList) {
    btn.remove();
  }
  buttonList = [];
  const buttonData = [
    {
      label: "Auto",
      gridPosition: { i: 0, j: 0 },
      mousePressed: () => autoGeneration(),
    },
    {
      label: "Traffic!",
      gridPosition: { i: 0, j: 1 },
      mousePressed: () => generateRandomTraffic10(),
    },
    {
      label: "More Traffic!<br>(Wait a Few Secs)",
      gridPosition: { i: 1, j: 1 },
      mousePressed: () => generateRandomTraffic100(),
    },
    {
      label: "Lot More Traffic! <br>(Wait a Few Secs)",
      gridPosition: { i: 2, j: 1 },
      mousePressed: () => generateRandomTraffic300(),
    },
    {
      label: (showProsperity ? "Hide" : "Show") + " Parcel Prosperity",
      gridPosition: { i: 3, j: 1 },
      mousePressed: () => redrawTheParcelsProsperity(),
    },

    {
      label: "Destroy 20% Random Parcels",
      gridPosition: { i: 0, j: 2 },
      mousePressed: () => destroyRandomParcels(),
    },
    {
      label: "Destroy 10% Low Prosperity Parcels",
      gridPosition: { i: 1, j: 2 },
      mousePressed: () => destoryParcelsLowProsper(),
    },
    {
      label: "Reduce Prosperity of All Parcels by 50%",
      gridPosition: { i: 2, j: 2 },
      mousePressed: () => destoryParcelsHalfProsper(),
    },
    {
      label: "Traffic Decline 50%",
      gridPosition: { i: 3, j: 2 },
      mousePressed: () => trafficDecline(),
    },

    {
      label: "Make Informal Parcels",
      gridPosition: { i: 0, j: 3 },
      mousePressed: () => spawnOneParcel(),
    },
    {
      label: "Claim Tiles",
      gridPosition: { i: 1, j: 3 },
      mousePressed: () => parcelClaimOneTile(),
    },

    {
      label: "Traffic Clear",
      gridPosition: { i: 0, j: 4 },
      mousePressed: () => trafficClear(),
    },
    {
      label: "Reset to Default Parameters",
      gridPosition: { i: 1, j: 4 },
      mousePressed: () => resetParameters(),
    },
    {
      label: (isTrafficShown ? "Hide" : "Show") + " Traffic",
      gridPosition: { i: 2, j: 4 },
      mousePressed: () => showTraffic(),
    },
  ];

  buttonData.forEach((button) => {
    const x = button.gridPosition.i * buttonWidth + 10;
    const y = height + 170 + button.gridPosition.j * buttonLineHeight;

    const btn = createButton(button.label);
    btn.position(x, y);
    btn.size(buttonWidth - 5, buttonHeight);
    btn.mousePressed(button.mousePressed);
    if (button.label === "Auto") {
      btn.style("font-weight", "bold"); // Make text bold
      btn.style("background-color", "#eac"); // Set background color to pink
    }
    buttonList.push(btn);
  });
  const existingProgressBar = document.getElementById("progressBar");
  if (existingProgressBar) {
    existingProgressBar.remove();
  }
  const progressBar = createDiv("").position(160, height + 170); // Adjust position as needed
  progressBar.size(50, 40); // Set size of the progress bar
  progressBar.id("progressBar");
}

function generateRandomTraffic(times = 1) {
  for (let i = 0; i < times; i++) {
    let start = weightedRandom(parcels, "prosperity").accessPoint;
    let end = weightedRandom(parcels, "prosperity").accessPoint;
    // fill(255, 0, 0);
    // rect(start.i * res, start.j * res, res, res);
    // rect(end.i * res, end.j * res, res, res);
    pathfinding(start, end);
  }
}

function generateRandomTraffic10() {
  generateRandomTraffic(10);
}

function generateRandomTraffic300() {
  generateRandomTraffic(300);
}

function generateRandomTraffic100() {
  generateRandomTraffic(100);
}
function redrawTheParcelsProsperity() {
  const btn = buttonList.find(
    (b) =>
      b.html() === "Show Parcel Prosperity" ||
      b.html() === "Hide Parcel Prosperity"
  );

  if (!showProsperity) {
    console.log("redrawTheParcelsProsperity");
    for (const parcel of parcels) {
      for (const tile of parcel.tiles) {
        fill(
          255 - 10 * sqrt(parcel.prosperity),
          255 - 10 * sqrt(parcel.prosperity),
          255
        );
        noStroke();
        rect(tile.i * res, tile.j * res, res, res);
      }
    }
    showProsperity = true;

    // change button label to "Hide Parcel Prosperity"
    if (btn) btn.html("Hide Parcel Prosperity");
  } else {
    for (let tile of tiles) {
      if (parcels.includes(tile.owner)) tile.show();
    }
    showProsperity = false;

    // change button label to "Show Parcel Prosperity"
    if (btn) btn.html("Show Parcel Prosperity");
  }
}

//remove Buttons and inputs when updating parameters
function removeButtonsAndInputsIfThereAre() {
  for (let btn of buttonList) {
    btn.remove();
  }
  buttonList = []; // Clear the button list

  for (let input of inputElements) {
    input.remove();
  }
  inputElements = []; // Clear the input list
}

function setSceneInDropdown(sceneName) {
  sceneSelect.selected(sceneName); // using selected() function if it's p5.js
}

function changeScene(sceneName) {
  const scene = scenes[sceneName];
  const sceneTitle = getSceneTitleElement();
  if (sceneTitle) {
    sceneTitle.html(capitalizeFirstLetter(`${sceneName}`));
  }
  if (scene) {
    currentParams = scene;
    updateGlobalParametersFromCurrent();
    needUpdate = true;

    setSceneInDropdown(sceneName); // Update the dropdown value
    buttons();
    console.log(`Switched to ${sceneName} scene`);
  } else {
    console.log(`Scene ${sceneName} not found`);
  }
}

function updateGlobalParametersFromCurrent() {
  ({
    streetCount,
    avenueCount,
    streetWidth,
    blockParcelCount,
    parcelWidth,
    parcelDepth,
    res,
    parkEdges,
    parkContinue,
    needUpdate,
    squareEdges,
    broadway,
  } = currentParams);
}
