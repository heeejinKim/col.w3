// var graph = {
//     nodes: [
//         {name: "John", age:36},
//         {name: "Mafe", age:34},
//         {name: "Edwin", age:39},
//         {name: "Santi", age:8},
//         {name: "David", age:3},
//         {name: "Yuri", age:30},
//     ],
//     links : [
//         {source: "John", target:"Mafe"},
//         {source: "John", target:"Edwin"},
//         {source: "Edwin", target:"Santi"},
//         {source: "Edwin", target:"David"},
//         {source: "Santi", target:"David"},
//         {source: "Edwin", target:"Yuri"},
//     ]
// };

var canvas = d3.select("#network"),
  width = canvas.attr("width"),
  height = canvas.attr("height"),
  ctx = canvas.node().getContext("2d"),
  r = 4,
  color = d3.scaleOrdinal(d3.schemeCategory20),
  simulation = d3.forceSimulation()
    .force("x", d3.forceX(width/2))
    .force("y", d3.forceY(height/4))
    .force("collide", d3.forceCollide(r+10))
    .force("charge", d3.forceManyBody()
        .strength(-100))
    .force("link", d3.forceLink()
        .id(function(d) {return d.name;}));

d3.json("graph.json", function (err, graph) {
    if (err) throw err;

    simulation
        .nodes(graph.nodes)
        .on("tick", update)
        .force("link")
        .links(graph.links);

    canvas
      .call(d3.drag()
          .container(canvas.node())
          .subject(dragsubject)
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));


    function update(){
        ctx.clearRect(0, 0, width, height);

        ctx.beginPath();
        ctx.globalAlpha = 0.3;
        ctx.strokeStyle = "#ced4da";
        ctx.lineWidth = 10;
        graph.links.forEach(drawLink);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.globalAlpha = 0.3;
        ctx.strokeStyle = "#FFF";
        ctx.lineWidth = 2;
        graph.links.forEach(drawLink);
        ctx.stroke();

        ctx.globalAlpha = 1.0;
        ctx.strokeStype = "#ced4da";
        graph.nodes.forEach(drawNode);
        ctx.fillStyle ="rgba(255, 255, 255, 0.5)";
        graph.nodes.forEach(drawtext);
        // graph.nodes.forEach(drawArc);

        }

        function dragsubject() {
            return simulation.find(d3.event.x, d3.event.y);
        }

});

function drawNode (d) {
    ctx.beginPath();
    ctx.fillStyle = "#f8f9fa";
    ctx.shadowColor ="#FFF";
    ctx.shadowBlur = "10";
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsety = 0;
    ctx.moveTo(d.x, d.y);
    ctx.arc(d.x, d.y, r, 0, 2* Math.PI);
    ctx.arc(d.x+3, d.y+3, r/2, 1, 2* Math.PI);
    ctx.arc(d.x-3, d.y-3, r/2, 1, 2* Math.PI);
    ctx.arc(d.x+3, d.y-3, r/2, 1, 2* Math.PI);
    ctx.arc(d.x-3, d.y+3, r/2, 1, 2* Math.PI);
    ctx.fill();
}

function drawLink (l) {
    ctx.moveTo(l.source.x, l.source.y);
    ctx.lineTo(l.target.x, l.target.y);
}

// function drawArc (p) {
//     ctx.beginPath();
//     // ctx.moveTo(10, 90);
//     ctx.moveTo(p.x, p.y);
//     // control=(60,10) goal=(90,90)
//     ctx.quadraticCurveTo(width/2, height/2, p.x, p.y);
//     // ctx.lineTo(60, 10);
//     ctx.lineTo(p.x, p.y);
//     ctx.closePath();
//     ctx.stroke();
// }

function drawtext (h) {
    ctx.font = "0.5rem serif";
    ctx.fillText(h.name,h.x-10,h.y+10);
}

function dragstarted() {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d3.event.subject.fx = d3.event.subject.x;
    d3.event.subject.fy = d3.event.subject.y;
    console.log(d3.event.subject);
  }
  
  function dragged() {
    d3.event.subject.fx = d3.event.x;
    d3.event.subject.fy = d3.event.y;
  }
  
  function dragended() {
    if (!d3.event.active) simulation.alphaTarget(0);
    d3.event.subject.fx = null;
    d3.event.subject.fy = null;
  }