import { Link } from "react-router-dom";
import styles from "./Contact.module.css";
import { useState } from "react";

export default function Contact() {
  const [isMailOpen, setIsMailOpen] = useState<boolean>(false);

  return (
    <div className={styles["contact"]}>
      <div className={styles["reachout"]}>
        <div className={styles["reachout__container"]}>
          {
            <div
              className={styles["non-email"]}
              style={
                isMailOpen
                  ? { opacity: "0", pointerEvents: "none", zIndex: "-2" }
                  : {}
              }
            >
              <h1 className={styles["reachout__heading"]}>Reach out to me.</h1>
              <div className={styles["reachout__icons"]}>
                <Link to="/work">
                  <p className={styles["back"]}>⮐</p>
                </Link>
                <div
                  onClick={() => {
                    setIsMailOpen(true);
                  }}
                  className={styles["icons__mail"]}
                ></div>

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
          }
          {
            <div
              style={
                isMailOpen
                  ? { opacity: "1", pointerEvents: "all", zIndex: "4" }
                  : { opacity: "0", pointerEvents: "none", zIndex: "-2" }
              }
            >
              <div className={styles["emails"]}>
                <button onClick={()=>{
                  setIsMailOpen(false)
                }} className={styles["email-back-button"]}>➔</button>
                <div className={styles["email"]}>
                  <h1 className={styles["email__name"]}>Management</h1>
                  <Link
                    className={styles["email__text"]}
                    to="mailto:abrown@avalon-usa.com"
                  >
                    abrown@avalon-usa.com
                  </Link>
                </div>
                <div className={styles["email"]}>
                  <h1 className={styles["email__name"]}>Me</h1>
                  <Link
                    className={styles["email__text"]}
                    to="mailto:michael@benderfilm.com"
                  >
                    michael@benderfilm.com
                  </Link>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  );
}
