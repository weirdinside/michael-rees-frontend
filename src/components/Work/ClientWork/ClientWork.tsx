import {
  useContext,
  useEffect,
  useLayoutEffect,
  useCallback,
  useState,
} from "react";
import { ThemeContext } from "../../../contexts/ThemeProvider";
import { getSiteData } from "../../../utils/api";
import Filter from "../Filter/Filter";
import Project from "../Project/Project";
import styles from "./ClientWork.module.css";

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
    category: "client" | "personal";
  }) => Promise<ProjectInfo[] | undefined>;
}) {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [projects, setProjects] = useState<ProjectInfo[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<ProjectInfo[]>([]);
  const [isError, setIsError] = useState<boolean>(false);
  const [description, setDescription] = useState<string>("");

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

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      const sanitizedInput = e.target.value.replace(/[^a-zA-Z0-9() ]/g, "");
      setSearchTerm(sanitizedInput);
    },
    []
  );

  const { theme } = useContext(ThemeContext);

  useLayoutEffect(() => {
    getSiteData().then((res) => {
      if (res) setDescription(res[0].clientWorkDescription);
    });
  }, [activeModal]);

  useEffect(() => {
    const activeFilters = (
      Object.keys(filters) as Array<keyof typeof filters>
    ).filter((key: keyof typeof filters) => {
      if (filters[key] === true) {
        return String(key).toUpperCase();
      }
    });

    const matchesSearch: (project: ProjectInfo) => boolean = (project) => {
      return (
        !searchTerm ||
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
    };

    const matchesFilters: (project: ProjectInfo) => boolean = (project) => {
      return (
        !activeFilters ||
        activeFilters.length === 0 ||
        activeFilters.some((filter: string) =>
          project.role.toLowerCase().includes(filter.toLowerCase())
        )
      );
    };

    const newFilteredProjects = projects.filter((project) => {
      return matchesFilters(project) && matchesSearch(project);
    });

    setFilteredProjects(newFilteredProjects);
  }, [filters, searchTerm]);

  useEffect(() => {
    getAndOrderProjects({ category: "client" })
      .then((data) => {
        if (data) 
          {
            setProjects(data);
            setFilteredProjects(data)
          }

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
      <div className={styles["description__modal"]}></div>
      <p className={styles["description__text"]}>{description}</p>
      <h1 className={styles["filters__heading"]}></h1>
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
          onChange={handleSearchChange}
        />
      </div>
      {!isError ? (
        <div className={styles["work__body"]}>
          {isLoading ? (
            <>loading...</>
          ) : (
            <ul className={styles["work"]}>
              {filteredProjects.map((project, idx) => {
                return (
                  <Project
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