//write a A* pathfinding algorithm in a tile based map.
//the output is a list of coordinates, which is the path from start to end.
//if there is no path, return empty list.
//the start and end are guaranteed to be empty. and are random generated.
//the map dimension is 10*10
//code:
function generateMapNoStartOrEnd(){
    var map = [];
    for(var i=0; i<10; i++){
        map[i] = [];
        for(var j=0; j<10; j++){
            map[i][j] = Math.floor(Math.random()*2);
        }
    }
    return map;
}
function generateMap(){
    var map = generateMapNoStartOrEnd();
    var start = [Math.floor(Math.random()*10), Math.floor(Math.random()*10)];
    var end = [Math.floor(Math.random()*10), Math.floor(Math.random()*10)];
    while(start[0] == end[0] && start[1] == end[1]){
        end = [Math.floor(Math.random()*10), Math.floor(Math.random()*10)];
    }
    map[start[0]][start[1]] = 2;
    map[end[0]][end[1]] = 3;
    return map;
}
// movement is allowed to be diagonal, but when (1, 0) or (0,1) is wall, it is not possible to move from (0,0) to (1,1), it applies to all diagonal direction .and can also do knight move. but wall at (1,0) or (1,1) will block the knight move.
//the map is a 2d array, 0 means empty, 1 means wall, 2 means start, 3 means end.
function defineNeighbors(tile){
    var neighbors = [];
    for(var i=-1; i<=1; i++){
        for(var j=-1; j<=1; j++){
            if(i==0 && j==0){
                continue;
            }
            if(tile[0]+i >= 0 && tile[0]+i < 10 && tile[1]+j >= 0 && tile[1]+j < 10){
                neighbors.push([tile[0]+i, tile[1]+j]);
            }
        }
    }
    //knight move
    if(tile[0]+1 < 10 && tile[1]+2 < 10){
        neighbors.push([tile[0]+1, tile[1]+2]);
    }
    if(tile[0]+1 < 10 && tile[1]-2 >= 0){
        neighbors.push([tile[0]+1, tile[1]-2]);
    }
    if(tile[0]-1 >= 0 && tile[1]+2 < 10){
        neighbors.push([tile[0]-1, tile[1]+2]);
    }
    if(tile[0]-1 >= 0 && tile[1]-2 >= 0){
        neighbors.push([tile[0]-1, tile[1]-2]);
    }
    if(tile[0]+2 < 10 && tile[1]+1 < 10){
        neighbors.push([tile[0]+2, tile[1]+1]);
    }
    if(tile[0]+2 < 10 && tile[1]-1 >= 0){
        neighbors.push([tile[0]+2, tile[1]-1]);
    }
    if(tile[0]-2 >= 0 && tile[1]+1 < 10){
        neighbors.push([tile[0]-2, tile[1]+1]);
    }
    if(tile[0]-2 >= 0 && tile[1]-1 >= 0){
        neighbors.push([tile[0]-2, tile[1]-1]);
    }

    return neighbors;
    

}
//knight move and diagonal move allowed but wall at (1,0) or (1,1) will block the knight move.
function aStar(start, end){
    var map = generateMap();
    var openSet = [];
    var closeSet = [];
    var gScore = [];
    var fScore = [];
    var cameFrom = [];
    var current = start;
    var route = [];
    var neighbors = defineNeighbors(current);
    for(var i=0; i<10; i++){
        gScore[i] = [];
        fScore[i] = [];
        cameFrom[i] = [];
        for(var j=0; j<10; j++){
            gScore[i][j] = Infinity;
            fScore[i][j] = Infinity;
            cameFrom[i][j] = null;
        }
    }
    gScore[start[0]][start[1]] = 0;
    fScore[start[0]][start[1]] = dist(start[0], start[1], end[0], end[1]);
    openSet.push(start);
    while(openSet.length > 0){
        var current = openSet[0];
        for(var i=1; i<openSet.length; i++){
            if(fScore[openSet[i][0]][openSet[i][1]] < fScore[current[0]][current[1]]){
                current = openSet[i];
            }
        }
        if(current[0] == end[0] && current[1] == end[1]){
            var previous = current;
            while(cameFrom[previous[0]][previous[1]] != null){
                route.push(previous);
                previous = cameFrom[previous[0]][previous[1]];
            }
            route.push(start);
            return route;
        }
        openSet.splice(openSet.indexOf(current), 1);
        closeSet.push(current);
        neighbors = defineNeighbors(current);
        for(var i=0; i<neighbors.length; i++){
            if(closeSet.includes(neighbors[i])){
                continue;
            }
            if(map[neighbors[i][0]][neighbors[i][1]] == 1){
                continue;
            }
            var tentativeGScore = gScore[current[0]][current[1]] + dist(current[0], current[1], neighbors[i][0], neighbors[i][1]);
            if(tentativeGScore < gScore[neighbors[i][0]][neighbors[i][1]]){
                cameFrom[neighbors[i][0]][neighbors[i][1]] = current;
                gScore[neighbors[i][0]][neighbors[i][
}

