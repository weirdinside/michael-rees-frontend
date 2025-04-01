import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { ThemeContext } from "../../../contexts/ThemeProvider";
import { getSiteData } from "../../../utils/api";
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
  const [description, setDescription] = useState<string>("");

  function handleDeleteClick(projectData: ProjectInfo) {
    setSelectedProject(projectData);
    setActiveModal("delete");
  }

  function handleEditClick(projectData: ProjectInfo) {
    setSelectedProject(projectData);
    setActiveModal("edit");
  }

  const { theme } = useContext(ThemeContext);

  useLayoutEffect(() => {
    getSiteData().then((res) => {
      if (res) setDescription(res[0].personalWorkDescription);
    });
  }, [activeModal]);

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
  }, [activeModal, getAndOrderProjects]);

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

            <button
              onClick={() => {
                setActiveModal("edit-desc");
              }}
              className={styles["options__button"]}
            >
              Edit Description
            </button>
          </div>
        </div>
      )}

      <p className={styles["description__text"]}>{description}</p>
      {!isError ? (
        <div className={styles["work__body"]}>
          {isLoading ? (
            <>loading...</>
          ) : (
            <ul className={styles["work"]}>
              {projects.map((project, idx) => {
                return (
                  <Project
                    key={`parent${idx}`}
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
