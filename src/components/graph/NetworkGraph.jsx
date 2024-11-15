import React, { useRef, useEffect, useState, useLayoutEffect } from "react";
import * as d3 from "d3";

const iconSize = 52;
const icons = {
  null: "../public/iconsNetwork/mainframe.svg",
  default: "../public/iconsNetwork/default.svg",
  "Power supply": "../public/iconsNetwork/ups.svg",
  switching: "../public/iconsNetwork/switch.svg",
  "Cable management": "../public/iconsNetwork/cable.svg",
  cabling: "../public/iconsNetwork/patch-panel.svg",
  voip: "../public/iconsNetwork/voip-phone.svg",
  Server: "../public/iconsNetwork/server-2.svg",
};

export default function NetworkGraph({ data }) {
  const svgRef = useRef();
  const gRef = useRef();
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
      .force("charge", d3.forceManyBody().strength(-150))
      .force(
        "center",
        d3.forceCenter(dimensions.width / 2, dimensions.height / 2)
      )
      .force("collision", d3.forceCollide().radius(iconSize * 1.5))
      .force("x", d3.forceX(dimensions.width / 2).strength(0.15))
      .force("y", d3.forceY(dimensions.height / 2).strength(0.15))
      .alphaDecay(0.05);

    g.selectAll("*").remove();

    const link = g
      .selectAll("path")
      .data(data.links, (d) => `${d.source}-${d.target}`)
      .join("path")
      .attr("stroke", "#999")
      .attr("stroke-width", 2)
      .attr("fill", "none");

    const node = g
      .selectAll("g")
      .data(data.nodes, (d) => d.id)
      .join("g");

    node
      .append("image")
      .attr("xlink:href", (d) => icons[d.role] || icons.default)
      .attr("width", iconSize)
      .attr("height", iconSize)
      .attr("x", -iconSize / 2)
      .attr("y", -iconSize / 2);

    node.append("title").text((d) => d.id);

    node
      .append("text")
      .attr("fill", "red")
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("dy", iconSize / 1.5)
      .text((d) => d.id);

    simulation.on("tick", () => {
      link.attr("d", (d) => {
        const dx = d.target.x - d.source.x;
        const dy = d.target.y - d.source.y;
        const dr = Math.sqrt(dx * dx + dy * dy);
        return `
          M${d.source.x},${d.source.y} 
          A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}
        `;
      });

      node.attr("transform", (d) => `translate(${d.x}, ${d.y})`);
    });

    svg.call(
      d3
        .zoom()
        .scaleExtent([0.5, 10])
        .on("zoom", (event) => {
          g.attr("transform", event.transform);
        })
    );
  }, [data, dimensions]);

  return (
    <div id="graph">
      <svg ref={svgRef} style={{ width: "100%", height: "100%" }}>
        <g ref={gRef}></g>
      </svg>
    </div>
  );
}
