var width = 960;
var height = 500;
var tree;

var force = d3.layout.force()
  .charge(-800)
  .size([width, height]);

var svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height);

d3.json("data.json", function(error, data) {
  if (error) throw error;

  tree = {
    nodes: data,
    links: getLinks(data)
  };

  updateForce();
});

function updateForce(focusNode) {
  var link = svg.selectAll(".link").data(tree.links);
  var node = svg.selectAll(".node").data(tree.nodes);
  var nodeGroup;

  focusNode = focusNode || _.find(tree.nodes, {
    depth: 0
  });

  console.log("Update with focus on node " + focusNode.id);

  force
    .nodes(tree.nodes)
    .links(tree.links)
    .start();

  link.enter()
    .append("line")
    .attr("class", "link");

  nodeGroup = node.enter()
    .append("g")
    .attr("class", "node")
    .call(force.drag);

  nodeGroup.append("circle")
    .attr("r", 6)
    .on("click", function(d) {
      updateForce(d);
    });

  nodeGroup.append("text")
    .text(function(d) {
      return d.id;
    })
    .attr("y", 18)
    .on("click", function(d) {
      updateForce(d);
    });

  force.on("tick", function() {
    link
      .attr("x1", function(d) {
        return d.source.x;
      })
      .attr("y1", function(d) {
        return d.source.y;
      })
      .attr("x2", function(d) {
        return d.target.x;
      })
      .attr("y2", function(d) {
        return d.target.y;
      });
    node
      .attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
      });
  });

}

function getLinks(data) { // Gets links from nodes data
  return _.flatten(_.map(_.filter(data, "children"), function(source, i) {
    return _.map(source.children, function(target) {
      return {
        "source": i,
        "target": _.findIndex(data, {
          id: target
        })
      };
    });
  }));
}