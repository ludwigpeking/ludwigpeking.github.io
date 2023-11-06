function claimVacantParcel() {
  const vacantParcel = [];
  for (let parcel of parcels){
    if(parcel.claimed === false){
      vacantParcel.push(parcel);
    }
  } 
}
//spawn a parcel on a random vacant tile belong to the open space, where tile's traffic value is smaller than 2
function spawnOneParcel(){
  let highTiles = getHighTrafficTiles(round(parcels.length * 0.5));
  console.log(highTiles.length);
    for (let tile of highTiles) {
      if (tile.owner == openSpace && random()<0.1) {
        tile.owner = new SpawnedParcel(tile.i, tile.j);
        parcels.push(tile.owner);
        tile.owner.show();
        tile.owner.tiles.push(tile);
        tile.streetFront = true;
        tile.frontageIndex = 0;
      }
    }  
}

function parcelClaimOneTile() {
  for (let parcel of parcels) {
    if(parcel.prosperity > random()*50){
      parcel.claimOneTile();
    }
    
  }
}

function trafficDecline() {
  // reduce tiles' traffic value by 1
  for (let tile of tiles) {
      if (tile.owner == openSpace) {
          fill(120)
          noStroke()
          rect(tile.i * res, tile.j * res, res, res)

          if (tile.traffic > 0) {
              tile.traffic = max(tile.traffic -1, 0);
          }
          fill(255, 0, 0, tile.traffic * 50)
          noStroke()
          rect(tile.i * res, tile.j * res, res, res)
      }   
  }
}

function trafficClear(){
  for (let tile of tiles) {
    tile.traffic = 0;
    if (tile.owner == openSpace) {
      fill(120)
      noStroke()
      rect(tile.i * res, tile.j * res, res, res)
    }
  }
  routes = [];
  redrawPark();
}

function showTraffic() {
  const btn = buttonList.find(b => b.html() === "Show Traffic" || b.html() === "Hide Traffic");
  
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
              tile.show();  // Assuming tile.show() resets the tile's appearance
          }
      }
      isTrafficShown = false;

      // change button label to "Show Traffic"
      if (btn) btn.html("Show Traffic");
  }
}


function destroyRandomParcels() {
    console.log("destroy random parcels", parcels.length)
  const numParcelsToDestroy = Math.floor(parcels.length * 0.2);
  for (let i = 0; i < numParcelsToDestroy; i++) {
    const randomIndex = Math.floor(Math.random() * parcels.length);
    parcels.splice(randomIndex, 1);
  }
  console.log(parcels.length);
  background(120)
  
  gridMap = creategridMap(parcels, cellSize)
  refreshTileOfRemovedParcels()
  redrawParcels();
  routes = [];
}

function destoryParcelsLowProsper(){
  //sort the parcels by prosperity descending
  parcels.sort((a, b) => (a.prosperity > b.prosperity) ? 1 : -1)
  //remove the parcels with low prosperity
  for (let i = 0; i < parcels.length * 0.1; i++) {
      parcels.splice(i, 1);
  }
  background(120)

  redrawParcels()
  gridMap = creategridMap(parcels, cellSize)
  refreshTileOfRemovedParcels()

}
//all parcels' proserity value reduced by 50%
function destoryParcelsHalfProsper(){
  for (let i = 0; i < parcels.length; i++) {
      parcels[i].prosperity = parcels[i].prosperity * 0.5;
  }
  background(120)
  redrawParcels()
  refreshTileOfRemovedParcels()
}

function refreshTileOfRemovedParcels(){
  for(const tile of tiles){
    
    if(!parcels.includes(tile.owner)){
      tile.streetFront = false;
      tile.accessPoint = false;
      tile.owner = openSpace;
      tile.wall = false;
      tile.onFence = false;
      tile.frontageIndex = 0;
      tile.color = color(120);
    }
    if (tile.park ==true){
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