function claimVacantParcel() {
  const vacantParcel = [];
  for (let parcel of parcels) {
    if (parcel.claimed === false) {
      vacantParcel.push(parcel);
    }
  }
}
//spawn a parcel on a random vacant tile belong to the open space, where tile's traffic value is smaller than 2
function spawnOneParcel(rate = 0.1) {
  let highTiles = getHighTrafficTiles(round(parcels.length * 0.5));
  console.log(highTiles.length);
  for (let tile of highTiles) {
    if (tile.owner == openSpace && random() < rate) {
      tile.owner = new SpawnedParcel(tile.i, tile.j);
      parcels.push(tile.owner);
      tile.owner.show();
      tile.owner.tiles.push(tile);
      tile.streetFront = true;
      tile.frontageIndex = 0;
    }
  }
}

function parcelClaimOneTile(bar = 50) {
  for (let parcel of parcels) {
    if (parcel.prosperity > random() * bar) {
      parcel.claimOneTile();
    }
  }
}

function trafficDecline(minus = 1) {
  // reduce tiles' traffic value by 1
  for (let tile of tiles) {
    if (tile.owner == openSpace) {
      fill(120);
      noStroke();
      rect(tile.i * res, tile.j * res, res, res);

      if (tile.traffic > 0) {
        tile.traffic = max(tile.traffic - minus, 0);
      }
      fill(255, 0, 0, tile.traffic * 50);
      noStroke();
      rect(tile.i * res, tile.j * res, res, res);
    }
  }
}

function trafficClear() {
  for (let tile of tiles) {
    tile.traffic = 0;
    if (tile.owner == openSpace) {
      fill(120);
      noStroke();
      rect(tile.i * res, tile.j * res, res, res);
    }
  }
  routes = [];
  redrawPark();
}

function showTraffic() {
  const btn = buttonList.find(
    (b) => b.html() === "Show Traffic" || b.html() === "Hide Traffic"
  );

  if (!isTrafficShown) {
    console.log("Showing traffic");
    for (let tile of tiles) {
      if (tile.owner == openSpace) {
        //background color fill the tile
        fill(120);
        noStroke();
        rect(tile.i * res, tile.j * res, res, res);

        fill(255, 0, 0, tile.traffic * 50);
        noStroke();
        rect(tile.i * res, tile.j * res, res, res);
      }
    }
    redrawPark();
    isTrafficShown = true;

    // change button label to "Hide Traffic"
    if (btn) btn.html("Hide Traffic");
  } else {
    console.log("Hiding traffic");
    for (let tile of tiles) {
      if (tile.owner == openSpace) {
        tile.show(); // Assuming tile.show() resets the tile's appearance
      }
    }
    isTrafficShown = false;

    // change button label to "Show Traffic"
    if (btn) btn.html("Show Traffic");
  }
}

function destroyRandomParcels(rate = 0.2) {
  console.log("destroy random parcels", parcels.length, "   rate: ", rate);
  const numParcelsToDestroy = Math.floor(parcels.length * rate);
  for (let i = 0; i < numParcelsToDestroy; i++) {
    const randomIndex = Math.floor(Math.random() * parcels.length);
    parcels.splice(randomIndex, 1);
  }
  console.log(parcels.length);
  background(120);

  gridMap = creategridMap(parcels, cellSize);
  refreshTileOfRemovedParcels();
  redrawParcels();
  routes = [];
}

function destoryParcelsLowProsper(rate = 0.1) {
  //sort the parcels by prosperity descending
  parcels.sort((a, b) => (a.prosperity > b.prosperity ? 1 : -1));
  //remove the parcels with low prosperity
  for (let i = 0; i < parcels.length * rate; i++) {
    parcels.splice(i, 1);
  }
  background(120);

  redrawParcels();
  gridMap = creategridMap(parcels, cellSize);
  refreshTileOfRemovedParcels();
}
//all parcels' proserity value reduced by 50%
function destoryParcelsHalfProsper(rate = 0.5) {
  for (let i = 0; i < parcels.length; i++) {
    parcels[i].prosperity = parcels[i].prosperity * rate;
  }
  background(120);
  redrawParcels();
  refreshTileOfRemovedParcels();
}

function refreshTileOfRemovedParcels() {
  for (const tile of tiles) {
    if (!parcels.includes(tile.owner)) {
      tile.streetFront = false;
      tile.accessPoint = false;
      tile.owner = openSpace;
      tile.wall = false;
      tile.onFence = false;
      tile.frontageIndex = 0;
      tile.color = color(120);
    }
    if (tile.park == true) {
      tile.owner = park;
      tile.streetFront = false;
      tile.accessPoint = false;
      tile.wall = true;
      tile.onFence = false;
      tile.frontageIndex = 0;
      tile.color = color(120, 255, 180);
    }
  }
}

async function autoGeneration() {
  const totalIterations = 10;
  for (let i = 0; i < totalIterations; i++) {
    // Calculate the progress percentage
    const progress = (i / totalIterations) * 100;

    // Update the progress bar
    updateProgressBar(progress);

    // Execute your operations
    await new Promise((resolve) => {
      setTimeout(() => {
        generateRandomTraffic(10);
        destoryParcelsLowProsper(0.01);
        // trafficDecline(0.1);
        destroyRandomParcels(0.02);
        spawnOneParcel(0.01);
        generateRandomTraffic(5);
        parcelClaimOneTile(5);
        isTrafficShown = false;
        showTraffic();
        resolve();
      }, 0); // Small delay to allow UI updates
    });
  }
  // Update the progress bar to indicate completion
  updateProgressBar(100); // Set progress to 100% on completion
}

function updateProgressBar(progress) {
  const maxProgressBarWidth = 300; // Maximum width of the progress bar at 100%
  const progressBarElement = document.getElementById("progressBar");
  if (progressBarElement) {
    let adjustedProgress = Math.min(progress, 100); // Ensure progress does not exceed 100%
    let pixelWidth = (adjustedProgress / 100) * maxProgressBarWidth; // Calculate width in pixels

    progressBarElement.style.width = `${pixelWidth}px`;
    progressBarElement.style.backgroundColor =
      adjustedProgress < 100 ? "#add8e6" : "#90ee90"; // Lighter colors
    progressBarElement.style.color = "black"; // Text color
    progressBarElement.style.textAlign = "center"; // Center the text
    progressBarElement.style.lineHeight = progressBarElement.style.height; // Align text vertically
    progressBarElement.style.fontSize = "14px"; // Font size of the text
    progressBarElement.textContent = `${adjustedProgress.toFixed(0)}%`; // Set the text to show the percentage
  }
}
