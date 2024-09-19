import React, { useEffect, useState } from "react";
import loadingIcon from "../../../public/loading.gif";
import NetworkGraph from "../graph/NetworkGraph";
import Menu from "../menu/Menu";
import { filterNodesByRoles } from "./filterNodesByRoles";

const urlDevices =
  "http://192.168.0.216:8000/api/dcim/devices/?format=json&limit=1000";
const urlRacks =
  "http://192.168.0.216:8000/api/dcim/racks/?format=json&limit=1000";

const headers = {
  "Content-Type": "application/json",
  Authorization: "Token e7ba8d619dcdf1da2e587918550dbef118dd8adc",
};
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
        const [responseRacks, responseDevices] = await Promise.all([
          fetch(urlRacks, { headers: headers }).then((res) => res.json()),
          fetch(urlDevices, { headers: headers }).then((res) => res.json()),
        ]);
        const nodeRacks = responseRacks.results.map((rack) => ({
          id: rack.name,
          color: colorRack,
          deviceCount: rack.device_count,
          role: null,
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
    setSelectedRoles(["switching", "cabling"]);
  }, []);

  const filterData = filterNodesByRoles(networkData, selectedRoles);

  if (loading) {
    return (
      <>
        <img
          src={loadingIcon}
          alt="Loading..."
          style={{ width: "100px", height: "100px" }}
        />
      </>
    );
  } else {
    return (
      <>
        <Menu
          roles={allRoles}
          selectedRoles={selectedRoles}
          setSelectedRoles={setSelectedRoles}
        />
        <NetworkGraph data={filterData} />
      </>
    );
  }
}
