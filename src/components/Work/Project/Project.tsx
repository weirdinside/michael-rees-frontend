import { useContext, useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { baseUrl } from "../../../utils/constants";
import styles from "./Project.module.css";
import { ThemeContext } from "../../../contexts/ThemeProvider";

export default function Project({
  searchTerm,
  activeFilters,
  handleEditClick,
  handleDeleteClick,
  idx,
  isLoggedIn = false,
  isPreview = false,
  project,
}: {
  searchTerm?: string;
  activeFilters?: Array<string>;
  handleDeleteClick?: (arg0: ProjectInfo) => void;
  handleEditClick?: (arg0: ProjectInfo) => void;
  isLoggedIn?: boolean;
  idx?: number;
  isPreview?: boolean;
  project: ProjectInfo;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [videoMarkup, setVideoMarkup] = useState(<></>);
  const [isVisible, setIsVisible] = useState<boolean>(true);

  const { theme } = useContext(ThemeContext);

  const checkFilter = useCallback(() => {
    if (!searchTerm && (!activeFilters || activeFilters.length === 0)) {
      return setIsVisible(true);
    }

    const matchesSearch =
      !searchTerm ||
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.role.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilters =
      !activeFilters ||
      activeFilters.length === 0 ||
      activeFilters.some((filter) =>
        project.role.toLowerCase().includes(filter.toLowerCase())
      );

    setIsVisible(matchesSearch && matchesFilters);
  }, [activeFilters, project.role, project.title, searchTerm]);
  useEffect(() => {
    checkFilter();
  }, [checkFilter, activeFilters, searchTerm]);

  useEffect(
    function setVideoPlayer() {
      if (project.thumbnail) {
        setVideoMarkup(
          <Link
            style={{ textDecoration: "none" }}
            target="_blank"
            to={project.link}
          >
            <div
              className={styles["thumbnail"]}
              style={{
                position: "relative",
                zIndex: "2",
                opacity: "1",
                backgroundImage: `url(${baseUrl}/${project.thumbnail})`,
              }}
            >
              <div className={styles["thumbnail__title"]}>click to watch</div>
            </div>
          </Link>
        );
      } else if (project?.link.toLowerCase().includes("vimeo.com")) {
        const slug = project.link.split("/").pop();
        setVideoMarkup(
          <>
            <div style={{ padding: "56.25% 0 0 0", position: "relative" }}>
              <iframe
                onLoad={() => {
                  setIsLoading(false);
                }}
                onLoadedData={() => {
                  setIsLoading(false);
                }}
                src={`https://player.vimeo.com/video/${slug}?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479`}
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
                style={{
                  position: "absolute",
                  top: "0",
                  left: "0",
                  width: "100%",
                  height: "100%",
                }}
                title={project.title}
              ></iframe>
            </div>
            <script src="https://player.vimeo.com/api/player.js"></script>
          </>
        );
      } else if (project?.link.toLowerCase().includes("youtu.be")) {
        let slug;
        if (project.link.toLowerCase().includes("youtu.be")) {
          slug = project.link.substring(
            project.link.indexOf(".be/") + 3,
            project.link.indexOf("?")
          );
          slug = slug + "?si=nulltracker";
        }

        setVideoMarkup(
          <>
            {isLoading && (
              <div className={styles["thumbnail__loading"]}>⬤⬤⬤</div>
            )}
            <div style={{ padding: "56.25% 0 0 0", position: "relative" }}>
              <iframe
                style={{
                  position: "absolute",
                  top: "0",
                  left: "0",
                  width: "100%",
                  height: "100%",
                }}
                onLoad={() => {
                  setIsLoading(false);
                }}
                onLoadedData={() => {
                  setIsLoading(false);
                }}
                src={`https://www.youtube.com/embed/${slug}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen={true}
              />
            </div>
          </>
        );
      } else {
        setVideoMarkup(<>sorry, this link doesn't work</>);
      }
    },
    [project]
  );

  return (
    <li
      key={idx}
      style={
        isVisible
          ? { transition: '1s cubic-bezier(0.075, 0.82, 0.165, 1)', visibility: "visible", opacity: "1" }
          : {
              maxHeight: '0%',
              display: 'none',
              visibility: "hidden",
              margin: '0',
              padding: '0',
              opacity: "0",
              transition: '0.5s cubic-bezier(0.075, 0.82, 0.165, 1)'
            }
      }
      className={`${styles["work__item"]} ${styles[theme]} ${isPreview && styles['preview']}`}
    >
      <h1 className={styles["item__title"]}>{project.title}</h1>
      <h3 className={styles["item__roles"]}>{project.role}</h3>
      {videoMarkup}
      <div className={styles["description"]}>
        {project.description ? project.description : ""}
      </div>
      {isLoggedIn && !isPreview && handleDeleteClick && handleEditClick && (
        <div className={styles["title__box"]}>
          <div className={styles["options"]}>
            <button
              onClick={() => {
                handleEditClick(project);
              }}
              className={styles["option"]}
            >
              edit
            </button>
            <button
              onClick={() => {
                handleDeleteClick(project);
              }}
              className={styles["option"]}
            >
              delete
            </button>
          </div>
        </div>
      )}
    </li>
  );
}
