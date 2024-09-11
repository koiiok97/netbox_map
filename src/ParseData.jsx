import React, { useEffect, useState } from "react";
import NetworkGraph from "./NetworkGraph";
import Menu from "./components/menu/Menu";
import responseRacks from "./data/racks.json";
import responseDevices from "./data/devices.json";

// const urlDevices = "http://192.168.0.216:8000/api/dcim/devices/?format=json";
// const urlRacks = "http://192.168.0.216:8000/api/dcim/racks/?format=json";

// const headers = {
//   "Content-Type": "application/json",
//   Authorization: "Token e7ba8d619dcdf1da2e587918550dbef118dd8adc",
// };
const colorRack = "rgba(102, 102, 170)";
const colorNode = "rgba(88, 88, 88)";

export default function ParseData() {
  const [networkData, setNetworkData] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [allRoles, setAllRoles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const [responseRacks, responseDevices] = await Promise.all([
        //   fetch(urlRacks, { headers: headers }).then((res) => res.json()),
        //   fetch(urlDevices, { headers: headers }).then((res) => res.json()),
        // ]);
        const nodeRacks = responseRacks.results.map((rack) => ({
          id: rack.name,
          color: colorRack,
          size: rack.device_count + 10,
          role: null,
          location: rack.location.name,
        }));

        const nodeDevices = responseDevices.results
          .filter((dev) => dev.name !== null)
          .map((dev) => ({
            id: dev.name,
            role: dev.role.name,
            color: colorNode,
          }));

        const linkDevices = responseDevices.results
          .filter((dev) => dev.name !== null)
          .map((dev) => ({
            source: dev.rack.name,
            target: dev.name,
          }));
        const roles = [
          ...new Set(responseDevices.results.map((dev) => dev.role.name)),
        ];
        setAllRoles(roles);

        setNetworkData({
          nodes: [...nodeRacks, ...nodeDevices],
          links: linkDevices,
        });
        setLoading(false);
      } catch (e) {
        console.log("Ошибка", e);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filterNodes = selectedRoles.length
    ? networkData.nodes.filter((node) => {
        if (node.role === null) return true;
        return selectedRoles.includes(node.role);
      })
    : networkData.nodes;

  // const filterDataTest = {
  //   nodes: filterNodes.filter((node) => {
  //     filterNodes.some((node) => node.size > 0) &&
  //       filterNodes.some((node) => node.size === undefined);
  //   }),
  // };
  // console.log(filterDataTest);

  const filterData = {
    nodes: filterNodes,
    links: networkData.links
      .filter(
        (link) =>
          filterNodes.some((node) => node.id === link.source) &&
          filterNodes.some((node) => node.id === link.target)
      )
      .map((link) => ({
        source: link.source,
        target: link.target,
      })),
  };

  loading ? <div>Loading....</div> : "123";
  // console.log(networkData);

  return (
    <>
      <Menu
        roles={allRoles}
        selectedRoles={selectedRoles}
        setSelectedRoles={setSelectedRoles}
      />
      <NetworkGraph data={filterData} />{" "}
    </>
  );
}
