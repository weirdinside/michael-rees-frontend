import { Link } from "react-router-dom";
import styles from "./Work.module.css";
import Project from "./WorkItem/Project";

export default function Work() {
  // logic here for displaying Projects from the schema as below:
  // { title: string, block: (this needs either an image or a url), role: string, dateUploaded: date }

  const projectInfo: ProjectInfo = {
    title: "KANYE WEST x AKEEM SMITH",
    role: "DONDA LISTENING PARTY VISUALS EDITOR",
    content:
      "https://static.wixstatic.com/media/04f237_b961bdb686cb4fecb884fe4d62b05c1c~mv2.png",
    dateUploaded: Date.now(),
  };

  return (
    <div className={styles["work"]}>
      <div className={styles["work__header"]}>
        <h1 className={styles["header__title"]}>PROJECTS</h1>
        <Link
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
          to="/contact"
        >
          <button
            className={`${styles["header__contact"]} ${styles["button"]}`}
          >
            CONTACT
          </button>
        </Link>

        <Link
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
          to="/"
        >
          <button className={`${styles["header__home"]} ${styles["button"]}`}>
            HOME
          </button>
        </Link>
      </div>
      <main className={styles["work__main"]}>
        <Project projectInfo={projectInfo}></Project>
        <Project projectInfo={projectInfo}></Project>
        <Project projectInfo={projectInfo}></Project>
        <Project projectInfo={projectInfo}></Project>
      </main>
    </div>
  );
}
