const customStyles = {
  control: (provided, state) => ({
    ...provided,
    width: 260,
    backgroundColor: state.isFocused ? "#f0f0f0" : "#ddd",
    borderColor: state.isFocused ? "#666" : "#ddd",
    boxShadow: state.isFocused ? "0 0 0 1px #666" : null,
    "&:hover": {
      borderColor: "#ddd",
    },
  }),
  option: (provided, state) => ({
    ...provided,

    backgroundColor: state.isSelected ? "#666" : "#fff",
    color: state.isSelected ? "#fff" : "#000",
    "&:hover": {
      backgroundColor: "#333",
      color: "#fff",
    },
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: "#e0e0e0",
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: "#000",
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: "#666",
    "&:hover": {
      backgroundColor: "#ccc",
      color: "#000",
    },
  }),
};

export default customStyles;
