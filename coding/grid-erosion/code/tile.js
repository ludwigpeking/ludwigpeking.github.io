const openSpace = {};
const park = {};

class Tile {
  constructor(i, j, park = false) {
    this.i = i;
    this.j = j;
    this.x = i *res + res/2;
    this.y = j *res + res/2;
    this.streetFront = false;
    this.accessPoint = false;
    this.owner = openSpace;
    this.onFence = false;
    
    this.wall = false;
    this.traffic = 0;
    this.park = park;
    
    this.frontageIndex = 0;
    
    this.f = 0;
    this.g = 99999;
    this.h = 0;
    this.from = null;
    this.neighbors = [];
  }
  accessrize() {
    this.streetFront = true;
    this.wall = false;
  }
  addNeighbors() {
    this.neighbors = [];
    if (this.i < cols - 1) 
      this.neighbors.push(grid[this.i + 1][this.j]);
    
    if (this.i > 0) 
      this.neighbors.push(grid[this.i - 1][this.j]);
    
    if (this.j < rows - 1) 
      this.neighbors.push(grid[this.i][this.j + 1]);
    
    if (this.j > 0) 
      this.neighbors.push(grid[this.i][this.j - 1]);
    
    if (this.i > 0 && this.j > 0 ) 
      this.neighbors.push(grid[this.i - 1][this.j - 1]);
    
    if (this.i < cols - 1 && this.j > 0) 
      this.neighbors.push(grid[this.i + 1][this.j - 1]);
    
    if (this.i > 0 && this.j < rows - 1) 
      this.neighbors.push(grid[this.i - 1][this.j + 1]);
    
    if (this.i < cols - 1 && this.j < rows - 1) 
      this.neighbors.push(grid[this.i + 1][this.j + 1]);
  }
  testSurroundingTraffic() {
    let sum = 0;
    for (let neighbor of this.neighbors) {
      sum += neighbor.traffic;
    }
    this.surroundingTraffic = sum- this.traffic;
  }

  isAdjacentToAccessPoint() {
    for (let neighbor of this.neighbors) {
      if (neighbor.accessPoint) {
        return true;
      }
    }
    return false;
  }
  

  deWall() {
    this.previousOwner = this.owner; // store current owner first
    //remove the tile from the owner's tiles array
    if (this.owner.tiles) {
      let index = this.owner.tiles.indexOf(this);
      if (index > -1) {
        this.owner.tiles.splice(index, 1);
      }
    }
    this.wall = false; 
    this.owner = openSpace; // then change the owner to openSpace
    // console.log("previous", this.previousOwner);
    if (this.previousOwner.update) { // check if the update function exists
        this.previousOwner.update();
        // console.log("update");
    }
    this.show();
}


  show() {
    if (this.park){
      this.color = color(120, 255, 180);
    } else {
      this.color = this.owner.color;
    }
    noStroke();
    fill(this.color);
    rect(this.i * res, this.j * res, res, res);

    //     if(this.frontageIndex >2 && this.owner != openSpace) {
    //       fill(255,0,0);
    //       noStroke()
    //       rect(this.i * res, this.j* res, res, res)
    //     }
  }
}

function checkNeighbors(tile) {
  tile.frontageIndex = 0;
  for (let neighbor of tile.neighbors) {
    if (neighbor.owner === openSpace) {
      tile.frontageIndex++;
      tile.streetFront = true;
      if ( tile.owner.frontageTiles && !tile.owner.frontageTiles.includes(tile))
      {
        tile.owner.frontageTiles.push(tile);
      }
    }
  }
}

function tileReset() {
  for (let i = 0; i < cols ; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].f = 0;
      grid[i][j].g = 99999;
      grid[i][j].h = 99999;
      grid[i][j].from = null;
      // grid[i][j].addNeighbors();
    }
  }
}

function redrawPark() {
  for (let tile of tiles) {
    if (tile.park) {
      tile.owner = openSpace;
      tile.show();
    }
  }
}

function getHighTrafficTiles(numberToSpawn) {
  let allTiles = [];

  // Get all tiles that are openSpace, calculate their surrounding traffic, and are not adjacent to access point
  for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
          let tile = grid[i][j];
          tile.testSurroundingTraffic(); // Update surrounding traffic value
          
          if (tile.owner === openSpace && !tile.isAdjacentToAccessPoint()) {
              allTiles.push(tile);
          }
      }
  }

  // Sort the tiles based on surroundingTraffic in descending order
  allTiles.sort((a, b) => b.surroundingTraffic - a.surroundingTraffic);

  // Return top numberToSpawn tiles
  return allTiles.slice(0, numberToSpawn);
}
