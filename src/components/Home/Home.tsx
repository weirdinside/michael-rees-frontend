import { useState } from "react";
import rees_peek from "../../assets/images/rees.png";
import rocks_bg from "../../assets/images/ROCKS.webp";
import styles from "./Home.module.css";
import { Link } from "react-router-dom";

export default function Home() {
  const [isHoveringHeader, setHoveringHeader] = useState<boolean>(false);

  return (
    <>
      <div
        style={{ backgroundImage: `url(${rocks_bg})` }}
        className={styles["rocks"]}
      ></div>
      <div
        onMouseEnter={() => {
          setHoveringHeader(true);
        }}
        onMouseLeave={() => {
          setHoveringHeader(false);
        }}
        className={styles["header"]}
      >
        <p className={styles["header__text"]}>
          <span className={styles["michael"]}>Michael</span> is a director and
          editor <br /> based in New York and Los Angeles.
        </p>
      </div>
      <Link to="/work">
        <button className={`${styles["button"]} ${styles["button__work"]}`}>
          WORK
        </button>
      </Link>
      <Link to="/contact">
        <button className={`${styles["button"]} ${styles["button__contact"]}`}>
          CONTACT
        </button>
      </Link>
      <div
        style={isHoveringHeader ? { bottom: "30%" } : {}}
        className={styles["rees__peek"]}
      >
        <img src={rees_peek} alt="michael rees!"></img>
      </div>
    </>
  );
}
