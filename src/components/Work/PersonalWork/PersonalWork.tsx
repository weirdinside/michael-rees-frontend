import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../../../contexts/ThemeProvider";
import Project from "../Project/Project";
import styles from "./PersonalWork.module.css";

export default function PersonalWork({
  setCategory,
  setSelectedProject,
  activeModal,
  setActiveModal,
  isLoggedIn,
  getAndOrderProjects,
}: {
  setCategory: (arg0: "personal" | "client") => void;

  setSelectedProject: (arg0: ProjectInfo) => void;
  activeModal: string;
  setActiveModal: (modal: string) => void;
  isLoggedIn: boolean;
  getAndOrderProjects: ({
    category,
  }: {
    category: "personal" | "client";
  }) => Promise<ProjectInfo[] | undefined>;
}) {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [projects, setProjects] = useState<ProjectInfo[]>([]);
  const [isError, setIsError] = useState<boolean>(false);

  function handleDeleteClick(projectData: ProjectInfo) {
    setSelectedProject(projectData);
    setActiveModal("delete");
  }

  function handleEditClick(projectData: ProjectInfo) {
    setSelectedProject(projectData);
    setActiveModal("edit");
  }

  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    getAndOrderProjects({ category: "personal" })
      .then((data) => {
        if (data) setProjects(data);
      })
      .catch((err) => {
        console.error(err);
        setIsError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [activeModal]);

  return (
    <div className={`${styles["personal-work"]} ${styles[theme]}`}>
      {isLoggedIn && (
        <div className={styles["options"]}>
          <p className={styles["options__text"]}>
            Hey Michael! Since you're logged in: do you want to...
          </p>
          <div className={styles["options__buttons"]}>
            <button
              onClick={() => {
                setCategory("personal");
                setActiveModal("order");
              }}
              className={styles["options__button"]}
            >
              Reorder your projects
            </button>
            <button
              onClick={() => {
                setActiveModal("add");
              }}
              className={styles["options__button"]}
            >
              Add a project
            </button>
            <Link
              style={{ width: "100%" }}
              target="_blank"
              to="https://breathedreamgo.com/wp-content/uploads/2023/05/iStock-1064552606-2.jpg"
            >
              <button className={styles["options__button"]}>Feel Loved!</button>
            </Link>
          </div>
        </div>
      )}
      <p className={styles["description__text"]}>
        This is work I've written, directed and sometimes shot and edited. This
        is a placeholder description, but can potentially be pretty long. Check
        out some of my work below.
      </p>
      {!isError ? (
        <div className={styles["work__body"]}>
          {isLoading ? (
            <>loading...</>
          ) : (
            <ul className={styles["work"]}>
              {projects.map((project, idx) => {
                return (
                  <Project
                    handleDeleteClick={handleDeleteClick}
                    handleEditClick={handleEditClick}
                    isLoggedIn={isLoggedIn}
                    idx={idx}
                    project={project}
                  />
                );
              })}
            </ul>
          )}
        </div>
      ) : (
        <div className={styles["error"]}>
          sorry, there was an error in the database. contact me!
        </div>
      )}
    </div>
  );
}
