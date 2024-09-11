import React, { useEffect, useState } from "react";
import NetworkGraph from "./NetworkGraph";

const urlDevices = "http://192.168.0.216:8000/api/dcim/devices/?format=json";
const urlRacks = "http://192.168.0.216:8000/api/dcim/racks/?format=json";

const headers = {
  "Content-Type": "application/json",
  Authorization: "Token e7ba8d619dcdf1da2e587918550dbef118dd8adc",
};
const colorRack = "rgba(102, 102, 170)";
const colorNode = "rgba(88, 88, 88)";

export default function ParseData() {
  const [networkData, setNetworkData] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(false);
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
          size: rack.device_count + 10,
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
    console.log(networkData);
  }, []);

  loading && <div>Loading...</div>;

  return <NetworkGraph data={networkData} />;
}
