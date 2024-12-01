import { Link } from "react-router-dom";
import styles from "./Work.module.css";
import Project from "./WorkItem/Project";

import { useEffect, useCallback, useState, useContext } from "react";
import { getSiteData, getProjects } from "../../utils/api";

import AddProjectModal from "./AddProjectModal/AddProjectModal";
import ReorderProjectsModal from "./ReorderProjectsModal/ReorderProjectsModal";
import DeleteProjectModal from "./DeleteProjectModal/DeleteProjectModal";
import EditProjectModal from "./EditProjectModal/EditProjectModal";
import { ThemeContext } from "../../contexts/ThemeProvider";

export default function Work({ isLoggedIn }: { isLoggedIn: boolean }) {
  // -------------------------------- //
  //         STATES / VARIABLES       //
  // -------------------------------- //

  const [projects, setProjects] = useState<ProjectInfo[]>([]);
  const [activeModal, setActiveModal] = useState<string>("");
  const [gettingProjects, setLoading] = useState<boolean>(true);

  const [selectedProject, setSelectedProject] = useState<ProjectInfo>();

  // -------------------------------- //
  //           EVENT HANDLERS         //
  // -------------------------------- //

  function closeModal() {
    setActiveModal("");
  }

  function handleDeleteClick(projectData: ProjectInfo) {
    setSelectedProject(projectData);
    setActiveModal("delete");
  }

  function handleEditClick(projectData: ProjectInfo) {
    setSelectedProject(projectData);
    setActiveModal("edit");
  }

  const getAndOrderProjects = useCallback(async () => {
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
  }, [activeModal]);

  // -------------------------------- //
  //               HOOKS              //
  // -------------------------------- //

  useEffect(() => {
    getAndOrderProjects();
  }, [activeModal, getAndOrderProjects]);

  const {isDarkMode} = useContext(ThemeContext)

  // -------------------------------- //
  //         COMPONENT RETURN         //
  // -------------------------------- //

  return (
    <div className={`${styles["work"]} ${isDarkMode && styles['dark']}`}>
      {gettingProjects ? (
        <div className={`${styles["work__loading"]} ${isDarkMode && styles['dark']}`}>
          <p className={styles["loading__text"]}>loading work...</p>
        </div>
      ) : null}
      <div className={`${styles["work__header"]} ${isDarkMode && styles['dark']}`}>
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
            className={`${styles["header__contact"]}  ${styles["button"]} ${isDarkMode && styles['dark']}`}
          >
            CONTACT
          </button>
        </Link>
        <h1 className={`${styles["header__title"]} ${isDarkMode && styles['dark']}`}>PROJECTS</h1>
        <Link
          className={`${styles["header__smallcontact_parent"]} ${isDarkMode && styles['dark']}`}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            textDecoration: "none",
          }}
          to="/contact"
        >
          <button className={`${styles["header__smallcontact"]} ${isDarkMode && styles['dark']}`}></button>
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
          <button className={`${styles["header__home"]} ${styles["button"]} ${isDarkMode && styles['dark']}`}>
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
          className={`${styles["add__project"]} ${isDarkMode && styles['dark']}`}
        >
          +
        </div>
      ) : null}
      {isLoggedIn ? (
        <div
          onClick={() => setActiveModal("order")}
          className={`${styles["reorder__button"]} ${isDarkMode && styles['dark']}`}
        ></div>
      ) : null}

      {/* 
  // -------------------------------- //
  //               MODALS             //
  // -------------------------------- //
  */}

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
