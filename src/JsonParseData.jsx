import NetworkGraph from "./NetworkGraph";
import racks from "./data/racks.json";
import devices from "./data/devices.json";

const urlDevices = "http://192.168.0.216:8000/api/dcim/devices/?format=json";
const urlRacks = "http://192.168.0.216:8000/api/dcim/racks/?format=json";

const networkData = {
  nodes: [],
  links: [],
};

const headers = {
  "Content-Type": "application/json",
  Authorization: "Token e7ba8d619dcdf1da2e587918550dbef118dd8adc",
};

const colorRack = "rgba(102, 102, 170)";
const colorNode = "rgba(88, 88, 88)";

function setNetworkData() {
  racks.results.forEach((el) => {
    networkData.nodes.push({
      id: el.name,
      color: colorRack,
      size: el.device_count,
      location: el.location.name,
    });
  });

  devices.results.forEach((el) => {
    if (el.name) {
      networkData.nodes.push({ id: el.name, color: colorNode });
      networkData.links.push({ source: el.rack.name, target: el.name });
    }
  });

  //   fetch(urlRacks, {
  //     headers: headers,
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       data.results.forEach((el) => {
  //         networkData.nodes.push({
  //           id: el.name,
  //           color: colorRack,
  //           size: el.device_count,
  //           location: el.location.name,
  //         });
  //       });
  //     });
  //   fetch(urlDevices, {
  //     headers: headers,
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       data.results.forEach((el) => {
  //         if (el.name) {
  //           networkData.nodes.push({ id: el.name, color: colorNode });
  //           networkData.links.push({ source: el.rack.name, target: el.name });
  //         }
  //       });
  //     });
}

export default function JsonParseData() {
  setNetworkData();
  console.log(networkData);

  return <NetworkGraph data={networkData}></NetworkGraph>;
}
