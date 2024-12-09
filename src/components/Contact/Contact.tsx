import styles from "./Contact.module.css";
import { Link } from "react-router-dom";

export default function Contact() {
  return (
    <div className={styles["contact"]}>
      <div className={styles["reachout"]}>
        <div className={styles["reachout__container"]}>
          <h1 className={styles["reachout__heading"]}>Reach out to me.</h1>
          <div className={styles["reachout__icons"]}>
            <Link to="/work">
              <p className={styles["back"]}>⮐</p>
            </Link>
            <Link
              style={{ color: "white", textDecoration: "none" }}
              target="_blank"
              to="mailto:michaelrees123@me.com"
            >
              <div className={styles["icons__mail"]}></div>
            </Link>
            <Link
              target="_blank"
              to="https://www.instagram.com/leadprotagonist/"
            >
              <div className={styles["icons__instagram"]}></div>
            </Link>
            <Link target="_blank" to="https://vimeo.com/michaelrees">
              <div className={styles["icons__vimeo"]}></div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
