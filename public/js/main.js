function selectColor(colorNum, colors) {
  if (colors < 1) colors = 1; // defaults to one color - avoid divide by zero
  return "hsl(" + ((colorNum * (360 / colors)) % 360) + ",100%,50%)";
}
function drawNodeEnergyDissiptionChart(dataset) {
  const old_chart = Chart.getChart("nodeChart");
  if (old_chart) {
    old_chart.destroy();
  }
  const ctx = document.getElementById("nodeChart").getContext("2d");
  const chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: dataset.data.map((n, i) => `F${i}`),
      //datasets: [dataset],
      datasets: [
        {
          label: "hi",
          backgroundColor: "rgb(255,0,0)",
          borderColor: "rgb(255,0,0)",
          data: dataset.data,
          //fill: false,
        },
      ],
    },
  });
}

function generate_chart(datasets, onClickCB) {
  const old_chart = Chart.getChart("simChart");
  if (old_chart) {
    old_chart.destroy();
  }
  let ctx = document.getElementById("simChart").getContext("2d");
  let myChart = new Chart(ctx, {
    type: "scatter",
    data: {
      datasets,
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
  document.getElementById("simChart").addEventListener("click", function (e) {
    let points = myChart.getElementsAtEventForMode(
      e,
      "nearest",
      { intersect: true },
      true
    );
    if (points.length > 0) {
      const node = datasets[points[0].datasetIndex].data[points[0].index];
      onClickCB(node);
    }
  });
}

function fetch_sim_nodes() {
  document.getElementById("loading").style.visibility = "visible";
  var dots = window.setInterval(function () {
    var wait = document.getElementById("dots");
    if (wait.innerHTML.length > 3) wait.innerHTML = "";
    else wait.innerHTML += ".";
  }, 100);
  fetch("/sim")
    .then((data) => data.json())
    .then((data) => {
      console.log(data);
      document.getElementById("userdata").innerHTML = `user is ${JSON.stringify(
        data.user
      )}`;
      data.sim.forEach((round, i) => {
        console.log(i);
        const btn = document.createElement("button");
        btn.innerHTML = `Round ${i + 1}`;
        btn.addEventListener("click", (e) => {
          document.getElementById("frames").innerHTML = "";
          round.frames.forEach((frame, j) => {
            const frameBtn = document.createElement("button");
            frameBtn.innerHTML = `F${j}`;
            frameBtn.addEventListener("click", (e) => {
              const datasets = [];
              round.frames[j].clusters.forEach((cluster) => {
                const dataset = {
                  fill: false,
                  label: `cluster ${cluster.ch.id}`,
                  data: [
                    { ...cluster.ch.pos, ...cluster.ch },
                    ...cluster.nodes.map((cm) => ({
                      ...cm.pos,
                      ...cm,
                    })),
                  ],
                  backgroundColor: selectColor(Math.random() * 10, 10),
                  borderColor: function (ctx, options) {
                    if (ctx.raw && ctx.raw.type === "CH") {
                      return "black";
                    }
                    return "rgba(0,0,0,0)";
                  },
                  radius: function (ctx, options) {
                    if (ctx.raw && ctx.raw.type === "CH") {
                      return 6;
                    }
                    return 4;
                  },
                  pointStyle: function (ctx) {
                    if (ctx.raw && ctx.raw.energy <= 0) {
                      return "cross";
                    } else if (ctx.raw && ctx.raw.type == "CH") {
                      return "rect";
                    }
                    return "circle";
                  },
                };
                datasets.push(dataset);
              });
              datasets.forEach((ds, i) => {
                ds.fill = false;
                order = i + 1;
              });
              function nodeEnergeyDissiption(node) {
                const node_across_frames = round.frames.map((frame) => {
                  let n_in_cluster;

                  frame.clusters.forEach((c) => {
                    if (c.ch.id === node.id) {
                      n_in_cluster = c.ch;
                    }
                    const n_f = c.nodes.filter((n) => n.id == node.id);
                    if (n_f.length !== 0) {
                      n_in_cluster = n_f[0];
                    }
                  });
                  return n_in_cluster;
                });
                drawNodeEnergyDissiptionChart({
                  //data: node_across_frames.map((n, i) => ({ x: i, y: n.energy })),
                  backgroundColor: "#3ff33f",
                  data: node_across_frames.map((n) => n.energy),
                });
              }
              generate_chart(datasets, nodeEnergeyDissiption);
            });
            document.getElementById("frames").appendChild(frameBtn);
          });
        });
        document.getElementById("timeline").appendChild(btn);
      });
      document.getElementById("loading").style.visibility = "hidden";
    })
    .catch((err) => {
      console.log(err);
    });
}

fetch_sim_nodes();
