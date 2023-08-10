var points = [];
var colors = [];
// Make 50 random points
for (var i = 0; i < 50; i++) {
    points.push([Math.random() * window.innerWidth, Math.random() * window.innerHeight]);
    colors.push(randomColor());
}

var svg = d3.select("#voronoi-container").append("svg")
    .attr("width", window.innerWidth)
    .attr("height", window.innerHeight);

var voronoi = d3.voronoi().extent([[-1, -1], [window.innerWidth + 1, window.innerHeight + 1]]);
var pathGroup = svg.append("g");
var circleGroup = svg.append("g"); // Added group for points

function update() {
    var diagram = voronoi(points);
    var polygons = diagram.polygons();

    var paths = pathGroup.selectAll("path")
        .data(polygons);

    paths.enter().append("path")
        .merge(paths) // Merge with existing paths
        .attr("d", function(d) { return d ? "M" + d.join("L") + "Z" : null; })
        .attr("fill", function(d, i) { return colors[i]; })
        .attr("fill-opacity", 0.1)
        // .attr("stroke", "black")
        // .attr("stroke-width", 2);

    paths.exit().remove();

    // Draw the points
    var circles = circleGroup.selectAll("circle").data(points);
    circles.enter().append("circle")
        .merge(circles) // Merge with existing circles
        .attr("cx", function(d) { return d[0]; })
        .attr("cy", function(d) { return d[1]; })
        .attr("r", 4) // Radius of the dots
        .attr("fill", function(d, i) { return colors[i]; })
        .attr("fill-opacity", 0.3); // Transparency of the dots

    circles.exit().remove();
}

function randomColor() {
    let randomColor = Math.floor(Math.random()*100 + 16).toString(16);
    var color  = '#' + randomColor + randomColor + randomColor;
    return color;
}

function onMouseMove(event) {
    var x = event.clientX;
    var y = event.clientY;

    points.push([x, y]);
    colors.push(randomColor());
    update();
}

document.addEventListener('mousemove', _.throttle(onMouseMove, 100));

update();
