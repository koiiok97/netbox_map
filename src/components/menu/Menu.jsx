import React from "react";
import Select from "react-select";
import customStyles from "./reactSelectStyles";
import classes from "./menu.module.css";

export default function Menu({ roles, selectedRoles, setSelectedRoles }) {
  const roleOptions = roles.map((role) => ({ value: role, label: role }));

  const handleRoleChange = (selectedOptions) => {
    const selectedValues = selectedOptions
      ? selectedOptions.map((option) => option.value)
      : [];
    console.log(selectedValues);
    setSelectedRoles(selectedValues);
  };

  return (
    <div className={classes.menu}>
      <label htmlFor="roles">Role</label>
      <Select
        id="roles"
        isMulti
        styles={customStyles}
        value={roleOptions.filter((option) =>
          selectedRoles.includes(option.value)
        )}
        options={roleOptions}
        onChange={handleRoleChange}
      />
    </div>
  );
}
