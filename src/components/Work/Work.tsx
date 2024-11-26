import { Link } from "react-router-dom";
import styles from "./Work.module.css";
import Project from "./WorkItem/Project";
import AddProjectModal from "./AddProjectModal/AddProjectModal";
import { useEffect, useState } from "react";
import { getSiteData, getProjects } from "../../utils/api";

import ReorderProjectsModal from "./ReorderProjectsModal/ReorderProjectsModal";

export default function Work({ isLoggedIn }: { isLoggedIn: boolean }) {
  // logic here for displaying Projects from the schema as below:
  // { title: string, block: (this needs either an image or a url), role: string, dateUploaded: date }

  // projectorganizer: a modal that allows michael to order projects by index.
  // possibly experiment with draggable divs, but this will need to be stored in an array in the db
  // and therefore is going to need its own set of requests.
  // the data structure needed for this is a linked list

  const [projects, setProjects] = useState<string[]>([]);
  const [activeModal, setActiveModal] = useState<string>("");
  const [gettingProjects, setLoading] = useState<boolean>(true);

  function closeModal() {
    setActiveModal("");
  }

  async function getAndOrderProjects(){
    if (!activeModal) {
      setLoading(true);
      try {
        const siteData = await getSiteData();
        const order = siteData[0].order.reverse(); // .reverse for chronology - top to bottom
        const projects = await getProjects();
        const sortedProjects = projects.sort((a, b)=>{
          return order.indexOf(a._id) - order.indexOf(b._id);
        })
        setProjects(sortedProjects);
      }
      catch(err) {
        console.error(err);
      }
      finally {
        setLoading(false);
      }
    } else {
      return;
    }
  }

  useEffect(() => {
    getAndOrderProjects();
  }, [activeModal]);

  return (
    <div className={styles["work"]}>
      {gettingProjects ? (
        <div className={styles["work__loading"]}>
          <p className={styles["loading__text"]}>loading work...</p>
        </div>
      ) : null}
      <div className={styles["work__header"]}>
        <Link
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            textDecoration: "none",
          }}
          to="/contact"
        >
          <button
            className={`${styles["header__contact"]} ${styles["button"]}`}
          >
            CONTACT
          </button>
        </Link>
        <h1 className={styles["header__title"]}>PROJECTS</h1>
        <Link
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            textDecoration: "none",
          }}
          to="/"
        >
          <button className={`${styles["header__home"]} ${styles["button"]}`}>
            HOME
          </button>
        </Link>
      </div>
      <main className={styles["work__main"]}>
        {projects.map((projectInfo) => {
          return <Project key={projectInfo._id} isLoggedIn={isLoggedIn} projectInfo={projectInfo}></Project>;
        })}
      </main>
      {isLoggedIn ? (
        <div
          onClick={() => setActiveModal("add")}
          className={styles["add__project"]}
        >
          +
        </div>
      ) : null}
      {isLoggedIn ? (
        <div
          onClick={() => setActiveModal("reorder")}
          className={styles["reorder__button"]}
        ></div>
      ) : null}
      <AddProjectModal
        closeModal={closeModal}
        activeModal={activeModal}
      ></AddProjectModal>
      <ReorderProjectsModal projects={projects} closeModal={closeModal} activeModal={activeModal}></ReorderProjectsModal>
    </div>
  );
}
