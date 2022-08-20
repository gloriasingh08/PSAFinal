const graph = {
    //defining the vertices here

    vertices: ["A", "B", "C", "D", "E"],
    //defining the weights from one node to another
    edges: [
      { u: "A", v: "B", w: 4 },
      { u: "A", v: "C", w: 2 },
      { u: "B", v: "C", w: 3 },
      { u: "B", v: "D", w: 2 },
      { u: "B", v: "E", w: 3 },
      { u: "C", v: "B", w: 1 },
      { u: "C", v: "D", w: 4 },
      { u: "C", v: "E", w: 5 },
      { u: "E", v: "D", w: -5 }
    ],

    //defining the position here
    poses: {
      A: { x: 60, y: 180 },
      B: { x: 240, y: 60 },
      C: { x: 240, y: 300 },
      D: { x: 420, y: 60 },
      E: { x: 420, y: 300 }
    }
  };
  //applying the bellman ford algorithm

  function BellmanAlgo(vertices, edges, source) {
    let distToNode = {};
    let predecessor = {};
  
    vertices.map(v => {
      distToNode[v] = Infinity;
      predecessor[v] = null;
    });
  
    distToNode[source] = 0;
  //loop to iterate  through all the vertices
    for (let i = 1; i < vertices.length; i++) {
      for (let { u, v, w } of edges) {
        if (distToNode[u] + w < distToNode[v]) {
          distToNode[v] = distToNode[u] + w;
          predecessor[v] = u;
        }
      }
    }
  //condition to check the negatice cycle if it was already visited
    for (let { u, v, w } of edges) {
      if (distToNode[u] + w < distToNode[v]) {
        throw "Graph contains a negative-weight cycle";
      }
    }
  
    return { distToNode, predecessor };
  }
  
  let timeOutReference;
  let nodeOrder = [];
  let i = 0;
  function display() {
    const res = BellmanAlgo(graph.vertices, graph.edges, "A");

  //order of node traversal
    if (i === 0) {
      nodeOrder.push("A");
    } else {
      for (let p in res.predecessor) {
        if (res.predecessor[p] === nodeOrder[nodeOrder.length - 1]) {
          nodeOrder.push(p);
          break;
        }
      }
    }
  
    if (i < graph.vertices.length) {
      i++;
      timeOutReference = setTimeout(display, 1000);
    }
  }
  
  var displayBtn = document.getElementById("displayBtn");
  displayBtn.onclick = () => {
    if (timeOutReference) clearTimeout(timeOutReference);
  
    nodeOrder = [];
    i = 0;
    display();
  };
  
  var canvasDes = document.getElementById("bellmanCanvas");
  var ct = canvasDes.getContext("2d");
  
  canvasDes.width = 480;
  canvasDes.height = 360;
  const radius = 20;
  const margin = 10;
  
  function drawGraph() {
    ct.clearRect(0, 0, canvasDes.width, canvasDes.height);
    
    for (let { u, v, w } of graph.edges) {
      var position = graph.poses[u];
      var toPosition = graph.poses[v];
      var vectorX = toPosition.x - position.x;
      var vectorY = toPosition.y - position.y;
      var magnitude = Math.sqrt(vectorX * vectorX + vectorY * vectorY);
      var magnitudeX = vectorX / magnitude;
      var magnitudeY = vectorY / magnitude;
      var marginedX = (radius + margin) * magnitudeX;
      var marginedY = (radius + margin) * magnitudeY;
      var x = position.x + marginedX;
      var y = position.y + marginedY;
      x = x - 5 * magnitudeY;
      y = y + 5 * magnitudeX;
      var toX = toPosition.x - marginedX;
      var toY = toPosition.y - marginedY;
      toX = toX - 5 * magnitudeY;
      toY = toY + 5 * magnitudeX;
      var arrowX = toX - marginedX;
      var arrowY = toY - marginedY;
      arrowX = arrowX - 10 * magnitudeY;
      arrowY = arrowY + 10 * magnitudeX;
  
      var widthEdge = 2;
      var colorEdge = "steelblue";
      var weightColor = "gray";
  
      for (let n = 0; n < nodeOrder.length - 1; n++) {
        if (nodeOrder[n + 1] === v && nodeOrder[n] === u) {
          widthEdge = 5;
          colorEdge = "royalblue";
          weightColor = "black";
          break;
        }
      }
  
      ct.beginPath();
      ct.moveTo(x, y);
      ct.lineTo(toX, toY);
      ct.lineTo(arrowX, arrowY);
      ct.strokeStyle = colorEdge;
      ct.lineWidth = widthEdge;
      ct.lineJoin = "bevel";
      ct.stroke();
  
      var wX = arrowX - marginedX;
      var wY = arrowY - marginedY;
      ct.fillStyle = weightColor;
      ct.font = "24px monospace";
      ct.textAlign = "center";
      ct.textBaseline = "middle";
      ct.fillText(w, wX, wY);
    }
  
    for (let v in graph.poses) {
      const { x, y } = graph.poses[v];
  
      let nodeColor = "white";
      if (nodeOrder.includes(v)) {
        nodeColor = "palegreen";
      }
  
      ct.beginPath();
      ct.arc(x, y, 20, 0, 2 * Math.PI);
      ct.fillStyle = nodeColor;
      ct.fill();
      ct.lineWidth = 2;
      ct.strokeStyle = "tomato";
      ct.stroke();
  
      ct.fillStyle = "black";
      ct.font = "20px monospace";
      ct.fillText(v, x, y);
    }
  
    setTimeout(drawGraph, 1000);
  }
  
  drawGraph();
  