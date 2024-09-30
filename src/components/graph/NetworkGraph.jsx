import React, { useRef, useEffect, useState, useLayoutEffect } from "react";
import * as d3 from "d3";

export default function NetworkGraph({ data }) {
  const svgRef = useRef();
  const gRef = useRef();
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
    const g = d3.select(gRef.current);
    const simulation = d3
      .forceSimulation(data.nodes)
      .force(
        "link",
        d3
          .forceLink(data.links)
          .id((d) => d.id)
          .distance(50)
      )
      .force("charge", d3.forceManyBody().strength(-0.5))
      .force(
        "center",
        d3.forceCenter(dimensions.width / 2, dimensions.height / 2)
      )
      .force("collision", d3.forceCollide().radius(iconSize * 1.1))
      .force("collider", d3.forceCollide().radius(50))
      .force("x", d3.forceX(dimensions.width / 2).strength(0.1))
      .force("y", d3.forceY(dimensions.height / 2).strength(0.1));

    g.selectAll("line").remove();
    g.selectAll("line")
      .data(data.links)
      .join("line")
      .attr("stroke", "black")
      .attr("stroke-width", 2);

    g.selectAll("image").remove();
    const node = g
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
        .attr("x", (d) => d.x - iconSize / 2)
        .attr("y", (d) => d.y - iconSize / 2);
    });

    const zoom = d3
      .zoom()
      .scaleExtent([0.5, 10])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);
  }, [data, dimensions]);

  return (
    <div id="graph">
      <svg ref={svgRef} style={{ width: "100%", height: "100%" }}>
        <g ref={gRef}></g>
      </svg>
    </div>
  );
}
