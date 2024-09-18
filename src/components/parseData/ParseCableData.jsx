import React, { useEffect, useState } from "react";
import loadingIcon from "../../../public/loading.gif";
import NetworkGraph from "../../components/graph/NetworkGraph";

const urlCables = "http://192.168.0.216:8000/api/dcim/cables/?format=json";

const headers = {
  "Content-Type": "application/json",
  Authorization: "Token e7ba8d619dcdf1da2e587918550dbef118dd8adc",
};
const colorRack = "rgba(102, 102, 170)";
const colorNode = "rgba(88, 88, 88)";

export default function ParseData() {
  const [networkData, setNetworkData] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Promise.all([
          fetch(urlCables, { headers: headers }).then((res) => res.json()),
        ]);

        const devices = response.map((dev) => {});

        console.log(response);

        setLoading(false);
      } catch (e) {
        console.log("Ошибка", e);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
        <div>text</div>
        {/* <NetworkGraph data={filterData} /> */}
      </>
    );
  }
}
