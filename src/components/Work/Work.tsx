import { Link } from "react-router-dom";
import styles from "./Work.module.css";
import Project from "./WorkItem/Project";

import { useEffect, useState } from "react";
import { getSiteData, getProjects } from "../../utils/api";

import AddProjectModal from "./AddProjectModal/AddProjectModal";
import ReorderProjectsModal from "./ReorderProjectsModal/ReorderProjectsModal";
import DeleteProjectModal from "./DeleteProjectModal/DeleteProjectModal";
import EditProjectModal from "./EditProjectModal/EditProjectModal";

export default function Work({ isLoggedIn }: { isLoggedIn: boolean }) {
  // logic here for displaying Projects from the schema as below:
  // { title: string, block: (this needs either an image or a url), role: string, dateUploaded: date }

  // projectorganizer: a modal that allows michael to order projects by index.
  // possibly experiment with draggable divs, but this will need to be stored in an array in the db
  // and therefore is going to need its own set of requests.
  // the data structure needed for this is a linked list

  const [projects, setProjects] = useState<ProjectInfo[]>([]);
  const [activeModal, setActiveModal] = useState<string>("");
  const [gettingProjects, setLoading] = useState<boolean>(true);

  const [selectedProject, setSelectedProject] = useState<ProjectInfo>();

  function closeModal() {
    setActiveModal("");
  }

  function handleDeleteClick(projectData: ProjectInfo) {
    setSelectedProject(projectData);
    setActiveModal("delete");
  }

  function handleEditClick(projectData: ProjectInfo){
    setSelectedProject(projectData);
    setActiveModal('edit');
  }

  async function getAndOrderProjects() {
    if (!activeModal) {
      setLoading(true);
      try {
        const siteData = await getSiteData();
        const order = siteData[0].order.reverse(); // .reverse for chronology - top to bottom
        const projects = await getProjects();
        const sortedProjects = projects.sort(
          (a: ProjectInfo, b: ProjectInfo) => {
            return order.indexOf(a._id) - order.indexOf(b._id);
          },
        );
        setProjects(sortedProjects);
      } catch (err) {
        console.error(err);
      } finally {
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
        className={styles['header__smallcontact_parent']}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            textDecoration: "none",
          }}
          to="/contact"
        >
          <button className={styles["header__smallcontact"]}></button>
        </Link>
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
          return (
            <Project
              key={projectInfo._id}
              handleEditClick={handleEditClick}
              handleDeleteClick={handleDeleteClick}
              isLoggedIn={isLoggedIn}
              projectInfo={projectInfo}
            ></Project>
          );
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
          onClick={() => setActiveModal("order")}
          className={styles["reorder__button"]}
        ></div>
      ) : null}
      <AddProjectModal
        closeModal={closeModal}
        activeModal={activeModal}
      ></AddProjectModal>
      <EditProjectModal
        projectToEdit={selectedProject}
        closeModal={closeModal}
        activeModal={activeModal}
      ></EditProjectModal>
      <DeleteProjectModal
        activeModal={activeModal}
        projectToDelete={selectedProject}
        closeModal={closeModal}
      ></DeleteProjectModal>
      <ReorderProjectsModal
        projects={projects}
        closeModal={closeModal}
        activeModal={activeModal}
      ></ReorderProjectsModal>
    </div>
  );
}
