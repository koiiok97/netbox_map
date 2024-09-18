import React, { useRef, useEffect, useState, useLayoutEffect } from "react";
import * as d3 from "d3";

export default function NetworkGraph({ data }) {
  const svgRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const iconSize = 32;
  const icons = {
    null: "../public/iconsNetwork/mainframe.svg",
    "Power supply": "../public/iconsNetwork/ups.svg",
    switching: "../public/iconsNetwork/switch.svg",
    "Cable management": "../public/iconsNetwork/switch.svg",
    cabling: "../public/iconsNetwork/patch-panel.svg",
    default: "../public/iconsNetwork/default.svg",
  };

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
        d3
          .forceLink(data.links)
          .id((d) => d.id)
          .distance(22)
      )
      .force("charge", d3.forceManyBody().strength(-100))
      .force(
        "center",
        d3.forceCenter(dimensions.width / 2, dimensions.height / 2)
      )
      .force("collision", d3.forceCollide().radius(iconSize * 1.2))
      .force(
        "collider",
        d3.forceCollide().radius((d) => d.size + iconSize * 1.2)
      )
      .force("x", d3.forceX(dimensions.width / 2).strength(0.09))
      .force("y", d3.forceY(dimensions.height / 2).strength(0.09));

    svg.selectAll("line").remove();
    svg.selectAll("line").data(data.links).join("line").attr("stroke", "black");

    svg.selectAll("image").remove();
    const node = svg
      .selectAll("image")
      .data(data.nodes)
      .join("image")
      .attr("xlink:href", (d) => {
        return icons[d.role] || icons["default"];
      })
      .attr("width", iconSize)
      .attr("height", iconSize)
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y);

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
        .selectAll("image")
        .attr("x", (d) =>
          Math.max(
            iconSize,
            Math.min(dimensions.width - iconSize, d.x - iconSize / 2)
          )
        )
        .attr("y", (d) =>
          Math.max(
            iconSize,
            Math.min(dimensions.height - iconSize, d.y - iconSize / 2)
          )
        );
    });
  }, [data, dimensions]);

  return (
    <div id="graph">
      <svg ref={svgRef} style={{ width: "100%", height: "100%" }}></svg>
    </div>
  );
}
