class Parcel {
  constructor(i, j) {
    //as in manhattan, TODO: aves east to west, streets south to north,
    //south is boolean, false is north,
    //number from east to west, starts from 1
    this.tiles = [];
    this.frontageTiles = [];
    this.accessPoint = null;
    //in p5js context (i,j)is the top left tile of the parcel
    this.i = i;
    this.j = j;
    this.color = color(200);
    this.claimed = false;
    this.prosperity = 0;
  }
  
  layParcel(){
    for (let i = 0; i < parcelWidth; i++) {
      for (let j = 0; j < parcelDepth; j++) {
        this.tiles.push(grid[this.i + i][this.j + j]);
        
        grid[this.i + i][this.j + j].owner = this;
        grid[this.i + i][this.j + j].wall = true;
      }
    }
  }
  originalClaim(){
    for (let i = 0; i < parcelWidth; i++) {
      for (let j = 0; j < parcelDepth; j++) {
        this.tiles.push(grid[this.i + i][this.j + j]);
        this.color = color(random(100, 255), random(200, 255), random(200, 255));
        grid[this.i + i][this.j + j].owner = this;
        grid[this.i + i][this.j + j].wall = true;
      }
    }
    this.claimed = true;
    this.prosperity +=2 ;
  }

  checkCenter() {
    let sumI = 0;
    let sumJ = 0;
    for (let tile of this.tiles) {
      sumI += tile.i;
      sumJ += tile.j;
    }
    let centerI = round(sumI / this.tiles.length);
    let centerJ = round(sumJ / this.tiles.length);
    this.center = grid[centerI][centerJ];
  }
  
  showCenter() {
    fill(0, 0, 255);
    noStroke();
    rect(this.center.i * res, this.center.j * res, res, res);
  }
  
  checkFrontage() { 
    for (let tile of this.tiles) {
      checkNeighbors(tile);
    }
  }

  checkAccessPoint() {
    let nearest = 9999;
    for (let tile of this.frontageTiles) {
      let d = dist(this.center.i, this.center.j, tile.i, tile.j);
      if (d < nearest) {
        this.accessPoint = tile;
        nearest = d;
      }
    }
    // this.accessPoint.wall = false;
    this.accessPoint.accessPoint = true;
    fill(0, 0, 255);
    noStroke();
    rect(this.accessPoint.i * res, this.accessPoint.j * res, res, res);
  }

  show() {
    for (let tile of this.tiles) {
      fill(this.color);
      noStroke();
      rect(tile.i * res, tile.j * res, res, res);
    }
    this.checkCenter();
    this.checkFrontage();
    this.checkAccessPoint();
  }

  update(){
    this.checkCenter();
    this.checkFrontage();
    this.checkAccessPoint();
  }

//a parcel claims a vacant tile adjacent to the parcel and of low traffic value smaller than 2. put the tile into the parcel's tiles array, and change the tile's owner to the parcel. draw the tile with the parcel's color. recalculates the parcel's center and access point.
  claimOneTile() { //TODO:this claim has not considered prosperity is therefore not polished
    let vacantTiles = [];
    for (let tile of this.tiles) {
      for (let neighbor of tile.neighbors) {
        if (neighbor.owner == openSpace && neighbor.traffic * random() < 1 && (tile.i == neighbor.i || tile.j == neighbor.j)) {
          vacantTiles.push(neighbor);
        }
      }
    }
    if(!vacantTiles.length ==0){
      let randomTile = vacantTiles[Math.floor(random(vacantTiles.length))];
      randomTile.owner = this;
      randomTile.wall = true;
      // fill(0)
      // rect( randomTile.i * res, randomTile.j * res, res, res);
      this.tiles.push(randomTile);

      for (let tile of this.tiles){
        checkNeighbors(tile);
        tile.show();
      }
      this.update();
    }
  }
}

function layParcels() {
  const parks = [];
  const parkAvenueStart = Math.floor(avenueCount * parkEdges[0]) + parkEdges[1];
  const parkAvenueEnd = Math.floor(avenueCount * parkEdges[2]) + parkEdges[3];
  const parkStreetStart = Math.floor(streetCount * parkEdges[4]) + parkEdges[5];
  const parkStreetEnd = Math.floor(streetCount * parkEdges[6]) + parkEdges[7];
  const squareStart = Math.floor(avenueCount * squareEdges[0]) + squareEdges[1];
  const squareEnd = Math.floor(avenueCount * squareEdges[2]) + squareEdges[3];
  const squareNorth = Math.floor(streetCount * squareEdges[4]) + squareEdges[5];
  const squareSouth = Math.floor(streetCount * squareEdges[6]) + squareEdges[7];
  const broadwayProps = getBroadwayProperties();
  console.log("broadwayProps", broadwayProps)

  console.log("parameters", currentParams)
  console.log(parkAvenueStart, parkAvenueEnd, parkStreetStart, parkStreetEnd)
  console.log(squareStart, squareEnd, squareNorth, squareSouth)
  //park boundary calculation
  if (parkContinue){
    let parkWest = parkAvenueStart * streetWidth + (parkAvenueStart - 1) * blockParcelCount * parcelWidth;
    let parkEast = parkAvenueEnd * streetWidth - streetWidth + (parkAvenueEnd - 1) * blockParcelCount * parcelWidth;
    let parkNorth = parkStreetStart * streetWidth + (parkStreetStart - 1) * 2 * parcelDepth;
    let parkSouth = parkStreetEnd * streetWidth - streetWidth + (parkStreetEnd - 1) * 2 * parcelDepth;
    
    for (let i = parkWest; i < parkEast; i++) {
      for (let j = parkNorth; j < parkSouth; j++) {
        grid[i][j].park = true;
        grid[i][j].wall = true;
      }
    }
  } 
  
  for (let i = 1; i < avenueCount; i++) {
    for (let j = 1; j < streetCount; j++) {
      // Check if the current blocks should be a park, based on the conditions
      if (i >= parkAvenueStart && i < parkAvenueEnd && j >= parkStreetStart && j < parkStreetEnd) {
        // If it is a park, add the tiles to the parks array;
        for (let n = 0; n < 2; n++) {
          for (let k = 1; k <= blockParcelCount; k++) {
            for ( let m = 0; m < parcelWidth; m++){
              for ( let l = 0; l < parcelDepth; l++){
              let parkTile = grid[
                i * streetWidth +
                (i - 1) * blockParcelCount * parcelWidth +
                (k - 1) * parcelWidth +m
              ][
                j * streetWidth +
                (j - 1) * 2 * parcelDepth +
                n * parcelDepth +l
              ];
              parks.push(parkTile);
            parkTile.park = true;
            parkTile.owner = park;
            parkTile.wall = true;}}
          }
        }
      } else if ( i >= squareStart && i < squareEnd && j >= squareNorth && j < squareSouth) {      
        continue;
      } else {
        
        for (let n = 0; n < 2; n++) {
          for (let k = 1; k <= blockParcelCount; k++) {
            const parcelX = i * streetWidth + (i - 1) * blockParcelCount * parcelWidth + (k - 1) * parcelWidth;
            const parcelY = j * streetWidth +(j - 1) * 2 * parcelDepth + n * parcelDepth;

            //test if the parcel is intersected by broadway
            if (!broadwayProps || (broadwayProps && abs(parcelY - (parcelX * broadwayProps.bSlope + broadwayProps.bBias)) > parcelDepth + 1)) {

              let parcel = new Parcel(parcelX, parcelY);
          
              parcels.push(parcel);
              parcel.originalClaim();
              // parcel.layParcel();
          }
        }
        }
      }
    }
  }
}

//extend class parcel that is not created by the args,but by (i, j), also do not add the 2D array of tiles to its tiles property. only add tiles[i][j]

class SpawnedParcel extends Parcel {
  constructor(i, j) {
    super();
    this.i = i;
    this.j = j;
    this.tiles = [];
    this.tiles.push(grid[i][j]);
    grid[i][j].owner = this;
    grid[i][j].wall = true;
    
  }
}



function redrawParcels(){
  console.log(parcels.length)
  for (let parcel of parcels){
    parcel.show();
  }
  for (let tile of tiles){
    if (tile.park){
      tile.show();
    }
  //   if (tile.owner == openSpace){
  //     tile.color = color(120);
  //     tile.show();
  //   }
  }
}

function getBroadwayProperties() {
  if (!broadway) return null;

  const broadwayStartX = Math.floor(avenueCount * broadway[0]) + broadway[1];
  const broadwayEndX = Math.floor(avenueCount * broadway[2]) + broadway[3];
  const broadwayStartY = Math.floor(streetCount * broadway[4]) + broadway[5];
  const broadwayEndY = Math.floor(streetCount * broadway[6]) + broadway[7];

  const bStartX = streetWidth * (broadwayStartX - 0.5) + (broadwayStartX - 1) * blockParcelCount * parcelWidth;
  const bStartY = streetWidth * (broadwayStartY - 0.5) + (broadwayStartY - 1) * 2 * parcelDepth;
  const bEndX = streetWidth * (broadwayEndX - 0.5) + (broadwayEndX - 1) * blockParcelCount * parcelWidth;
  const bEndY = streetWidth * (broadwayEndY - 0.5) + (broadwayEndY - 1) * 2 * parcelDepth;

  const bSlope = (bEndY - bStartY) / (bEndX - bStartX);
  const bBias = bStartY - bSlope * bStartX;

  return { bSlope, bBias };
}