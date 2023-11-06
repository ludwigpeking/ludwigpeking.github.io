function weightedRandom(arr, weightAttribute) {
  //weightedRandom
  let sumWeights = arr.reduce((acc, obj) => acc + obj[weightAttribute], 0);
  let randomWeight = Math.random() * sumWeights;
  let currentWeight = 0;

  for (const obj of arr) {
    currentWeight += obj[weightAttribute];
    if (randomWeight <= currentWeight) {
      return obj;
    }
  }
}

let routes = [];
let routesNr = 0;

function sign(x) {
  return (x > 0) - (x < 0);
}

function drawARoute(route){
  colorMode(RGB);
  noFill();
  stroke(255, 50, 0, 100);
  beginShape();
  strokeWeight(res/2);
  vertex(route[0].x, route[0].y);
  for (let step = 0; step < route.length; step++) {
    curveVertex(route[step].x, route[step].y);
  }
  vertex(route[route.length - 1].x, route[route.length - 1].y);
  endShape();
}

function isWallInBetween(tile1, tile2) {
  // If it is a knight move
  if ((Math.abs(tile1.i - tile2.i) === 2 && Math.abs(tile1.j - tile2.j) === 1) ||
      (Math.abs(tile1.i - tile2.i) === 1 && Math.abs(tile1.j - tile2.j) === 2)) {

      // Check for walls in the middle squares that could block the knight move
      const orthogonal1 = grid[tile1.i][tile2.j];
      const orthogonal2 = grid[tile2.i][tile1.j];
      return (orthogonal1?.wall || orthogonal2?.wall) ||
             (grid[tile1.i][Math.floor((tile1.j + tile2.j) / 2)]?.wall ||
              grid[Math.floor((tile1.i + tile2.i) / 2)][tile1.j]?.wall ||
              grid[Math.floor((tile1.i + tile2.i) / 2)][tile2.j]?.wall);
  }

  // If it is a diagonal move
  if (Math.abs(tile1.i - tile2.i) === 1 && Math.abs(tile1.j - tile2.j) === 1) {
      return grid[tile1.i][tile2.j]?.wall || grid[tile2.i][tile1.j]?.wall;
  }

  return false;
}



function isDiagonalMove(tile1, tile2) {
  return Math.abs(tile1.i - tile2.i) === 1 && Math.abs(tile1.j - tile2.j) === 1;
}

function isWallInBetweenDiagonal(tile1, tile2) {
  return grid[tile1.i][tile2.j].wall || grid[tile2.i][tile1.j].wall;
}

function weightedRandom(arr, weightAttribute) {
  //weightedRandom
  let sumWeights = arr.reduce((acc, obj) => acc + obj[weightAttribute], 0);
  let randomWeight = Math.random() * sumWeights;
  let currentWeight = 0;

  for (const obj of arr) {
    currentWeight += obj[weightAttribute];
    if (randomWeight <= currentWeight) {
      return obj;
    }
  }
}


// Utility function to calculate the square of the Euclidean distance between two points
function squaredDistance(p1, p2) {
  const dx = p1.i - p2.i;
  const dy = p1.j - p2.j;
  return dx * dx + dy * dy;
}

// Create a gridMap for spatial partitioning
function creategridMap(parcels, cellSize) {
  gridMap = new Map();

  for (const parcel of parcels) {
    const cellI = Math.floor(parcel.accessPoint.i / cellSize);
    const cellJ = Math.floor(parcel.accessPoint.j / cellSize);
    const cellKey = `${cellI},${cellJ}`;

    if (!gridMap.has(cellKey)) {
      gridMap.set(cellKey, []);
    }

    gridMap.get(cellKey).push(parcel);
  }

  return gridMap;
}

// Find the influenced parcels using the gridMap
function findInfluencedParcels(route, gridMap, influenceDiameter, cellSize) {
  const influencedParcels = new Set();
  const squaredD = influenceDiameter * influenceDiameter;

  for (const tile of route) {
    const minI = Math.floor((tile.i - influenceDiameter) / cellSize);
    const maxI = Math.floor((tile.i + influenceDiameter) / cellSize);
    const minJ = Math.floor((tile.j - influenceDiameter) / cellSize);
    const maxJ = Math.floor((tile.j + influenceDiameter) / cellSize);

    for (let i = minI; i <= maxI; i++) {
      for (let j = minJ; j <= maxJ; j++) {
        const cellKey = `${i},${j}`;

        if (gridMap.has(cellKey)) {
          for (const parcel of gridMap.get(cellKey)) {
            if (!influencedParcels.has(parcel) && squaredDistance(parcel.accessPoint, tile) <= squaredD) {
              influencedParcels.add(parcel);
              parcel.prosperity ++
            }
          }
        }
      }
    }
  }

  return Array.from(influencedParcels);
}


function pathfinding(start, end) { //WallBreaking
  let closeSet = [];
  tileReset();
  start.g = 0;
  let openSet = [start];
  let current = start;
  let route = [];

  const WALL_COST = 6;

  while (current != end) {
      if (openSet.length === 0) {
          console.log("No valid path found");
          return;
      }
      openSet.sort((a, b) => (a.f > b.f ? 1 : -1));
      current = openSet[0];
      closeSet.push(current);
      openSet.splice(0, 1);
      let neighbors = current.neighbors.slice();
      let knightMoves = [
          {i: 2, j: 1},
          {i: 1, j: 2},
          {i: -2, j: -1},
          {i: -1, j: -2},
          {i: 2, j: -1},
          {i: 1, j: -2},
          {i: -2, j: 1},
          {i: -1, j: 2},
      ];

      for (let move of knightMoves) {
        let ni = current.i + move.i;
        let nj = current.j + move.j;
  
        if (ni >= 0 && nj >= 0 && ni < cols && nj < rows) {
          neighbors.push(grid[ni][nj]);
        }
      }

      for (let neighbor of neighbors) {
        if (!closeSet.includes(neighbor) && !isWallInBetween(current, neighbor)) {
            neighbor.h = dist(neighbor.i, neighbor.j, end.i, end.j);
    
            let cost = dist(neighbor.i, neighbor.j, current.i, current.j);
            
            // If the neighbor is a wall, but not the start or end tile, then apply the WALL_COST
            if (neighbor.wall && neighbor !== start && neighbor !== end || isWallInBetween(current, neighbor)) {
                cost *= WALL_COST;
            }
    
            let g = current.g + cost;
    
            if (g < neighbor.g) {
                neighbor.from = current;
                neighbor.g = g;
                neighbor.f = neighbor.g + neighbor.h;
            }
    
            if (!openSet.includes(neighbor)) {
                openSet.push(neighbor);
            }
        }
    }
    
    }
    if (current == end) {
      let previous = end;
  
      while (previous.from != null) {
          route.push(previous);
          // check if knight move
          if (abs(previous.i - previous.from.i) + abs(previous.j - previous.from.j) === 3) {
              // the two tiles in between's traffic also increases 0.5
              let di = previous.i - previous.from.i;
              let dj = previous.j - previous.from.j;
              
              let midTile1, midTile2;
              
              if (abs(di) == 2) { // Moved 2 tiles in i direction
                  midTile1 = grid[previous.from.i + sign(di)][previous.from.j];
                  midTile2 = grid[previous.from.i + 2*sign(di)][previous.from.j + sign(dj)];
              } else { // Moved 2 tiles in j direction
                  midTile1 = grid[previous.from.i][previous.from.j + sign(dj)];
                  midTile2 = grid[previous.from.i + sign(di)][previous.from.j + 2*sign(dj)];
              }
              
              midTile1.traffic += 0.5;
              midTile2.traffic += 0.5;
              midTile1.deWall();
              midTile2.deWall();
          } else if (abs(previous.i - previous.from.i) + abs(previous.j - previous.from.j) === 2){
              // diagonal tile traffic increases 0.3
              let di = previous.i - previous.from.i;
              let dj = previous.j - previous.from.j;
              let midTile = grid[previous.from.i + sign(di)][previous.from.j + sign(dj)];
              midTile.traffic += 0.3;
              midTile.deWall();
          }
  
          previous = previous.from;
  
          // Only increase traffic and dewall tiles that are not start or end
          if (previous !== start && previous !== end) {
              previous.traffic++;
              previous.deWall();
          }
      }
  
      route.push(start);
      routes.push(route);
      drawARoute(route);
  }
  
  routesNr++;

  gridMap = creategridMap(parcels, cellSize);
  const influencedParcels = findInfluencedParcels(route, gridMap, influenceDiameter, cellSize);
}