import classes from "./menu.module.css";
import Select from "react-select";
export default function Menu({ roles, selectedRoles, setSelectedRoles }) {
  const handleRoleChange = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    console.log(selectedOptions);

    setSelectedRoles(selectedOptions);
  };
  return (
    <div className={classes.menu}>
      <label htmlFor="">role</label>
      <select multiple value={selectedRoles} onChange={handleRoleChange}>
        {roles.map((role) => (
          <option key={role} value={role}>
            {role}
          </option>
        ))}
      </select>
    </div>
  );
}
