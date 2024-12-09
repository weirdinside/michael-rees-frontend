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

import bearPNG from "../../assets/images/bear.png";
import Filter from "./Filter/Filter";

export default function Work({ isLoggedIn }: { isLoggedIn: boolean }) {
  // -------------------------------- //
  //         STATES / VARIABLES       //
  // -------------------------------- //

  const [projects, setProjects] = useState<ProjectInfo[]>([]);
  const [activeModal, setActiveModal] = useState<string>("");
  const [gettingProjects, setLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [selectedProject, setSelectedProject] = useState<ProjectInfo>();
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const [searchTerm, setSearchTerm] = useState<string>("");

  const [filters, setFilters] = useState<object>({
    director: false,
    editor: false,
    writer: false,
    producer: false,
  });

  // -------------------------------- //
  //           EVENT HANDLERS         //
  // -------------------------------- //

  function closeModal() {
    setActiveModal("");
    setSelectedProject(undefined);
  }

  function toggleFilter(filter: keyof typeof filters) {
    setFilters((prev) => {
      return { ...prev, [filter]: !filters[filter] };
    });
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
        setIsError(true);
        console.log(err);
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

  const { isDarkMode } = useContext(ThemeContext);

  useEffect(()=>{
    const newActiveFilters = (
      Object.keys(filters) as Array<keyof typeof filters>
    ).filter((key: keyof typeof filters) => {
      if (filters[key] === true) {
        return String(key).toUpperCase();
      }
    });

    setActiveFilters(newActiveFilters);
  }, [filters])

  // -------------------------------- //
  //         COMPONENT RETURN         //
  // -------------------------------- //

  return (
    <div className={`${styles["work"]} ${isDarkMode && styles["dark"]}`}>
      {gettingProjects ? (
        <div
          className={`${styles["work__loading"]} ${
            isDarkMode && styles["dark"]
          }`}
        >
          <p className={styles["loading__text"]}>loading work...</p>
        </div>
      ) : null}
      <div
        className={`${styles["work__header"]} ${isDarkMode && styles["dark"]}`}
      >
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
            className={`${styles["header__contact"]}  ${styles["button"]} ${
              isDarkMode && styles["dark"]
            }`}
          >
            CONTACT
          </button>
        </Link>
        <h1
          onClick={()=>{setShowFilters(prev=>!prev)}}
          className={`${styles["header__title"]} ${
            isDarkMode && styles["dark"]
          }`}
        >
          PROJECTS
          <span className={`${styles['show']} ${showFilters && styles['hide']}`}>⌄</span>
        </h1>
        <Link
          className={`${styles["header__smallcontact_parent"]} ${
            isDarkMode && styles["dark"]
          }`}
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
            className={`${styles["header__smallcontact"]} ${
              isDarkMode && styles["dark"]
            }`}
          ></button>
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
          <button
            className={`${styles["header__home"]} ${styles["button"]} ${
              isDarkMode && styles["dark"]
            }`}
          >
            HOME
          </button>
        </Link>
      </div>
      <div style={showFilters ? {opacity: '1', visibility: 'visible', maxHeight: '100%'} : {opacity: '0', visibility: 'hidden', maxHeight: '0%'}} className={styles["filters"]}>
        <h1 className={styles['filters__heading']}>LOOKING FOR SOMETHING IN PARTICULAR?</h1>
        <div className={styles['filter__options']}>
        {(Object.keys(filters) as Array<keyof typeof filters>).map(
          (filter: keyof typeof filters) => (
            <Filter
              key={filter}
              filters={filters}
              toggleFilter={toggleFilter}
              name={filter}
            />
          ),
        )}
        </div>
       
        <input
          placeholder="search"
          type="text"
          className={`${styles["search"]} ${isDarkMode && styles["dark"]}`}
          onChange={(e) => {
            e.preventDefault();
            const sanitizedInput = e.target.value.replace(
              /[^a-zA-Z0-9() ]/g,
              "",
            );
            setSearchTerm(sanitizedInput);
          }}
        ></input>
      </div>
      <main className={styles["work__main"]}>
        {isError && (
          <div className={styles["error"]}>
            <p className={styles["error__heading"]}>
              we're sorry, something went wrong
            </p>
            <p className={styles["error__subheading"]}>
              try again later, or{" "}
              <Link
                style={isDarkMode ? { color: "white" } : { color: "black" }}
                to="/contact"
              >
                <span
                  className={styles["error__contactme"]}
                  style={{ fontWeight: "800" }}
                >
                  contact me
                </span>
              </Link>
            </p>
            <img style={{ width: "100%", height: "30%" }} src={bearPNG}></img>
          </div>
        )}
        {projects.map((projectInfo) => {
          return (
            <Project
              searchTerm={searchTerm}
              activeFilters={activeFilters}
              key={projectInfo._id}
              handleEditClick={handleEditClick}
              handleDeleteClick={handleDeleteClick}
              isLoggedIn={isLoggedIn}
              projectInfo={projectInfo}
            ></Project>
          );
        })}
      </main>
      {isLoggedIn && (
        <div
          onClick={() => setActiveModal("add")}
          className={`${styles["add__project"]} ${
            isDarkMode && styles["dark"]
          }`}
        >
          +
        </div>
      )}
      {isLoggedIn && (
        <div
          onClick={() => setActiveModal("order")}
          className={`${styles["reorder__button"]} ${
            isDarkMode && styles["dark"]
          }`}
        ></div>
      )}

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
