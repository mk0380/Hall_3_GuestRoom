const { hec_hall3 } = require("@/important_data/important_data");

const findHec = (id, key) => {
  if (!id || !key) {
    console.error("Invalid arguments: id and key are required.");
    return null;
  }

  const hecData = hec_hall3.find((data) => data.id === id);

  if (!hecData) {
    console.error(`No HEC data found for id: ${id}`);
    return null;
  }

  return hecData[key] !== undefined ? hecData[key] : null;
};

module.exports = findHec;
