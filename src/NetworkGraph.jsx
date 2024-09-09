import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const headers = {
  "Content-Type": "application/json",
  Authorization: "Token e7ba8d619dcdf1da2e587918550dbef118dd8adc",
};

export default function NetworkGraph() {
  const data = {
    nodes: [{ id: "A", location: "server" }, { id: "B" }, { id: "C" }],
    links: [
      { source: "A", target: "B", color: "red" },
      { source: "B", target: "C" },
      { source: "C", target: "A" },
    ],
  };

  const svgRef = useRef();

  useEffect(() => {
    const svg = d3
      .select(svgRef.current)
      .attr("width", 600)
      .attr("height", 400);

    const simulation = d3
      .forceSimulation(data.nodes)
      .force(
        "link",
        d3
          .forceLink(data.links)
          .id((d) => d.id)
          .distance(200)
      )
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(300, 200));

    svg.selectAll("line").data(data.links).join("line").attr("stroke", "black");

    const node = svg
      .selectAll("circle")
      .data(data.nodes)
      .join("circle")
      .attr("r", 10)
      .attr("fill", "blue")
      .call(drag(simulation));

    node.append("title").text((d) => d.id);

    simulation.on("tick", () => {
      svg
        .selectAll("line")
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      svg
        .selectAll("circle")
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y);
    });

    function drag(simulation) {
      return d3
        .drag()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        });
    }
  }, [data]);

  return <svg ref={svgRef}></svg>;
}
