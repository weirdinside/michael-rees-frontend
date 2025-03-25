import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../../../contexts/ThemeProvider";
import Project from "../Project/Project";
import styles from "./ClientWork.module.css";
import Filter from "../Filter/Filter";

export default function ClientWork({
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
    category: "client" | "client";
  }) => Promise<ProjectInfo[] | undefined>;
}) {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [projects, setProjects] = useState<ProjectInfo[]>([]);
  const [isError, setIsError] = useState<boolean>(false);

  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const [searchTerm, setSearchTerm] = useState<string>("");

  const [filters, setFilters] = useState<object>({
    director: false,
    editor: false,
    producer: false,
    VFX: false,
  });

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

  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    const newActiveFilters = (
      Object.keys(filters) as Array<keyof typeof filters>
    ).filter((key: keyof typeof filters) => {
      if (filters[key] === true) {
        return String(key).toUpperCase();
      }
    });

    setActiveFilters(newActiveFilters);
  }, [filters]);

  useEffect(() => {
    getAndOrderProjects({ category: "client" })
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
    <div className={`${styles["client-work"]} ${styles[theme]}`}>
      {isLoggedIn && (
        <div className={styles["options"]}>
          <p className={styles["options__text"]}>
            Hey Michael! Since you're logged in: do you want to...
          </p>
          <div className={styles["options__buttons"]}>
            <button
              onClick={() => {
                setCategory("client");
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
        This is work I've done for others.
      </p>
      <h1 className={styles["filters__heading"]}>
      </h1>
      <div className={styles["filters"]}>
        <div className={styles["filter__options"]}>
          {(Object.keys(filters) as Array<keyof typeof filters>).map(
            (filter: keyof typeof filters) => (
              <Filter
                key={filter}
                filters={filters}
                toggleFilter={toggleFilter}
                name={filter}
              />
            )
          )}
        </div>

        <input
          placeholder="or search for a specific term"
          type="text"
          className={`${styles["search"]} ${styles[theme]}`}
          onChange={(e) => {
            e.preventDefault();
            const sanitizedInput = e.target.value.replace(
              /[^a-zA-Z0-9() ]/g,
              ""
            );
            setSearchTerm(sanitizedInput);
          }}
        ></input>
      </div>
      {!isError ? (
        <div className={styles["work__body"]}>
          {isLoading ? (
            <>loading...</>
          ) : (
            <ul className={styles["work"]}>
              {projects.map((project, idx) => {
                return (
                  <Project
                    activeFilters={activeFilters}
                    searchTerm={searchTerm}
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
