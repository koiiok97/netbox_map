export function filterNodesByRoles(networkData, selectedRoles) {
  const filteredNodes = selectedRoles.length
    ? networkData.nodes.filter((node) => {
        if (node.role === null && node.deviceCount) {
          return true;
        }

        return selectedRoles.includes(node.role);
      })
    : networkData.nodes;

  const filteredLinks = networkData.links
    .filter(
      (link) =>
        filteredNodes.some((node) => node.id === link.source) &&
        filteredNodes.some((node) => node.id === link.target)
    )
    .map((link) => ({
      source: link.source,
      target: link.target,
    }));

  return {
    nodes: filteredNodes,
    links: filteredLinks,
  };
}
