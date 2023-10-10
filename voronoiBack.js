var points = [];
var colors = [];
let voronoi, svg, pathGroup, circleGroup;
// Make 50 random points
restart();

function restart() {
    for (let i = 0; i < 100; i++) {
        points.push([Math.random() * 2540, Math.random() * 3200]);
        colors.push(randomColor());
    }

    svg = d3.select("#voronoi-container").append("svg")
        .attr("width", 2540)
        .attr("height", 3200);

    voronoi = d3.voronoi().extent([[-1, -1], [2540 + 1, 3200 + 1]]);
    pathGroup = svg.append("g");
    circleGroup = svg.append("g"); // Added group for points
}

function update() {
    //if points are more than 1000, empty points array and colors array using restart function
    if (points.length > 1000) {
        points = [];
        colors = [];
        svg.remove();
        restart();
    }
    var diagram = voronoi(points);
    var polygons = diagram.polygons();

    var paths = pathGroup.selectAll("path")
        .data(polygons);

    paths.enter().append("path")
        .merge(paths) // Merge with existing paths
        .attr("d", function(d) { return d ? "M" + d.join("L") + "Z" : null; })
        .attr("fill", function(d, i) {
            if (!colors[i]) { // Check if color is not already assigned
                if (d) {
                    var area = d3.polygonArea(d);
                    if (area < 5000 && Math.random() < 0.4) { // 10% chance
                        colors[i] = randomBrightColor(); // Assign a bright color
                    } else {
                        colors[i] = randomColor(); // Assign a random color
                    }
                }
            }
            return colors[i]; 
        })
        .attr("fill-opacity", 1)
        .attr("stroke", "black")
        .attr("stroke-width", 0);

    paths.exit().remove();

    // Draw the points
    var circles = circleGroup.selectAll("circle").data(points);
    circles.enter().append("circle")
        .merge(circles) // Merge with existing circles
        .attr("cx", function(d) { return d[0]; })
        .attr("cy", function(d) { return d[1]; })
        .attr("r", 3) // Radius of the dots
        // .attr("fill", function(d, i) { return colors[i]; })
        .attr("fill", 'white')

        .attr("fill-opacity", 0.2); // Transparency of the dots

    circles.exit().remove();
}

function randomColor() {
    let randomColor = Math.floor(Math.random()*30 + 16).toString(16);
    var color  = '#' + randomColor + randomColor + randomColor;
    return color;
}

function randomBrightColor() {
    var r = Math.floor(Math.random() * 56) + 100; // R value between 200 and 255
    var g = Math.floor(Math.random() * 56) + 50; // G value between 200 and 255
    var b = Math.floor(Math.random() * 56) + 100; // B value between 200 and 255
    return `rgb(${r},${g},${b})`;
}

function onMouseMove(event) {
    var x = event.clientX;
    var y = event.clientY;

    points.push([x, y]);
    update();
}

document.addEventListener('mousemove', _.throttle(onMouseMove, 100));

update();
