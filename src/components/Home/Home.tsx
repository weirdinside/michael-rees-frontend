import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import styles from "./Home.module.css";

import rees_peek from "../../assets/images/rees.png";
import rocks_nighttime from '../../assets/images/dark_rocks.png'
import rocks_daytime from "../../assets/images/ROCKS.webp";

import { ThemeContext } from "../../contexts/ThemeProvider";

export default function Home() {
  const [isHoveringHeader, setHoveringHeader] = useState<boolean>(false);

  const { isDarkMode } = useContext(ThemeContext);

  return (
    <>
      <div className={`${styles['background']} ${isDarkMode && styles['dark']}`}></div>
      <div
        style={ isDarkMode ? {  backgroundSize: 'cover', backgroundPosition: 'center 0px', backgroundImage: `url(${rocks_nighttime})` } : { backgroundImage: `url(${rocks_daytime})` }}
        className={`${styles["rocks"]} ${isDarkMode && styles['dark']}`}
      ></div>
      <div
      style={isDarkMode ? {backgroundColor: '#0e1521', color: 'white'} : {backgroundColor: 'white', color: 'black'} }
        onMouseEnter={() => {
          setHoveringHeader(true);
        }}
        onMouseLeave={() => {
          setHoveringHeader(false);
        }}
        className={`${styles["header"]} ${isDarkMode ? styles['dark'] : ''}`}
      >
        <p className={`${styles["header__text"]} ${isDarkMode && styles['dark']}`}>
          <span className={styles["michael"]}>Michael</span> is a director and
          editor <br /> based in New York and Los Angeles.
        </p>
      </div>
      <Link to="/work">
        <button className={`${styles["button"]} ${isDarkMode && styles['dark']} ${styles["button__work"]}`}>
          WORK
        </button>
      </Link>
      <Link to="/contact">
        <button className={`${styles["button"]} ${isDarkMode && styles['dark']} ${styles["button__contact"]}`}>
          CONTACT
        </button>
      </Link>
      <div
        className={`${styles["rees__peek"]} ${
          isHoveringHeader ? styles["active"] : ""
        }`}
      >
        <img src={rees_peek} alt="michael rees!"></img>
      </div>
    </>
  );
}
