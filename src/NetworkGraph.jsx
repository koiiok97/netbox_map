import React, { useRef, useEffect, useState, useLayoutEffect } from "react";
import * as d3 from "d3";

export default function NetworkGraph({ data }) {
  const svgRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      const svgElement = svgRef.current;
      setDimensions({
        width: svgElement.clientWidth,
        height: svgElement.clientHeight,
      });
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useLayoutEffect(() => {
    const svg = d3
      .select(svgRef.current)
      .attr("width", dimensions.width)
      .attr("height", dimensions.height);

    const simulation = d3
      .forceSimulation(data.nodes)
      .force(
        "link",
        d3.forceLink(data.links).id((d) => d.id)
      )
      .force("charge", d3.forceManyBody().strength(-5))
      .force(
        "center",
        d3.forceCenter(dimensions.width / 2, dimensions.height / 2)
      )
      .force("collision", d3.forceCollide().radius(22))
      .force(
        "collider",
        d3.forceCollide().radius((d) => d.size + 25)
      )
      .force("x", d3.forceX(dimensions.width / 2).strength(0.03))
      .force("y", d3.forceY(dimensions.height / 2).strength(0.03));

    svg.selectAll("line").data(data.links).join("line").attr("stroke", "black");

    svg.selectAll("circle").remove();
    const node = svg
      .selectAll("circle")
      .data(data.nodes)
      .join("circle")
      .attr("r", (d) => (d.size ? d.size * 1.01 : 10))
      .attr("fill", (d) => d.color);

    node.selectAll("title").remove();
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
        .attr("cx", (d) => Math.max(10, Math.min(dimensions.width - 10, d.x)))
        .attr("cy", (d) => Math.max(10, Math.min(dimensions.height - 10, d.y)));
    });
  }, [data, dimensions]);

  return (
    <div id="graph">
      <svg ref={svgRef} style={{ width: "100%", height: "100%" }}></svg>
    </div>
  );
}
