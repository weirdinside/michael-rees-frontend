import React, { useContext, useState } from "react";
import styles from "./Filter.module.css";
import { ThemeContext } from "../../../contexts/ThemeProvider";

export default function Filter({
  name,
  toggleFilter,
  filters,
}: {
  filters: object,
  toggleFilter: (filter: keyof typeof filters)=>void
  name: keyof typeof filters
}) {

  const { isDarkMode } = useContext(ThemeContext);

  return (
    <label
      className={`${styles["filter__option"]} ${
        filters[name] && styles["checked"]
      } ${isDarkMode && styles["dark"]}`}
    >
      {String(name).toUpperCase()}
      <input
        onChange={(e) => {
          toggleFilter(name)
        }}
        checked={filters[name]}
        type="checkbox"
        className={styles["filter__input"]}
      ></input>
    </label>
  );
}
