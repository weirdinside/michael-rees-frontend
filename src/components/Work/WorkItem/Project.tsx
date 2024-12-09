import { Link } from "react-router-dom";
import styles from "./Project.module.css";
import { useCallback, useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../../contexts/ThemeProvider";
import { baseUrl } from "../../../utils/constants";

export default function Project({
  searchTerm,
  activeFilters,
  projectInfo,
  isLoggedIn = false,
  handleDeleteClick,
  handleEditClick,
}: {
  searchTerm?: string;
  activeFilters?: Array<string>;
  isLoggedIn?: boolean;
  projectInfo: ProjectInfo;
  handleDeleteClick?: (projectData: ProjectInfo) => void;
  handleEditClick?: (projectData: ProjectInfo) => void;
}) {
  // -------------------------------- //
  //         STATES / VARIABLES       //
  // -------------------------------- //

  const [data, setData] = useState<ProjectInfo>({
    _id: "",
    title: "",
    showTitle: false,
    role: "",
    link: "",
    thumbnail: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isVisible, setIsVisible] = useState<boolean>(true);

  const [videoMarkup, setVideoMarkup] = useState(<></>);

  const checkFilter = useCallback(() => {
    
    function searchCheck() {
      if (searchTerm) {
        if (
          projectInfo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          projectInfo.role.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    }
    if (!activeFilters && !searchTerm){
      return setIsVisible(true);
    }

    if(activeFilters && (activeFilters.length === 0) && !searchTerm){
      return setIsVisible(true);
    }
    if (!activeFilters && searchTerm) {
      return setIsVisible(searchCheck());
    }

    if(activeFilters){
      if(activeFilters.length > 0){
        const isVisible = activeFilters?.some((filter)=>{
          const roleMatchesFilter = projectInfo.role.toLowerCase().includes(filter)
          return roleMatchesFilter && searchCheck();   
        })
        return setIsVisible(isVisible)
      } else {
        return setIsVisible(searchCheck());
      }
    }
  }, [activeFilters, projectInfo.role, projectInfo.title, searchTerm]);

  // -------------------------------- //
  //               HOOKS              //
  // -------------------------------- //

  useEffect(
    function setProjectInfo() {
      setData(projectInfo);
    },
    [projectInfo],
  );

  useEffect(() => {
    checkFilter();
  }, [checkFilter, activeFilters, searchTerm]);

  const { isDarkMode } = useContext(ThemeContext);

  // -------------------------------- //
  //    CONDITIONAL MARKUP RETURN     //
  // -------------------------------- //

  useEffect(
    function setVideoPlayer() {
      if (data.thumbnail) {
        console.log(`${baseUrl}/${data.thumbnail}`)
        setVideoMarkup(
          <Link
            style={{ textDecoration: "none" }}
            target="_blank"
            to={data.link}
          >
            <div
              className={styles["thumbnail"]}
              style={{
                zIndex: '3',
                opacity: '1',
                backgroundImage: `url(${baseUrl}/${data.thumbnail})`,
              }}
            >
              <div className={styles["thumbnail__title"]}>
                click to watch on{" "}
                {data.link.substring(
                  data.link.indexOf("//") + 2,
                  data.link.indexOf("."),
                )}
              </div>
            </div>
          </Link>,
        );
      } else if (data?.link.toLowerCase().includes("vimeo.com")) {
        const slug = data.link.split("/").pop();
        setVideoMarkup(
          <>
            {isLoading && (
              <div className={styles["thumbnail__loading"]}>⬤⬤⬤</div>
            )}
            <div style={{ padding: "56.25% 0 0 0", position: "relative" }}>
              <iframe
                onLoad={() => {
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
                title={data.title}
              ></iframe>
            </div>
            <script src="https://player.vimeo.com/api/player.js"></script>
          </>,
        );
      } else if (data?.link.toLowerCase().includes("youtu.be")) {
        let slug;
        if (data.link.toLowerCase().includes("youtu.be")) {
          slug = data.link.substring(
            data.link.indexOf(".be/") + 3,
            data.link.indexOf("?"),
          );
          slug = slug + data.link.substring(data.link.indexOf("?si"));
        }

        setVideoMarkup(
          <>
            {isLoading && (
              <div className={styles["thumbnail__loading"]}>⬤⬤⬤</div>
            )}
            <iframe
              style={{ position: "relative" }}
              onLoad={() => {
                setIsLoading(() => {
                  return false;
                });
              }}
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${slug}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen={true}
            ></iframe>
          </>,
        );
      } else {
        setVideoMarkup(<>sorry, this link doesn't work</>);
      }
    },
    [data.title, isLoading, data.link, data.thumbnail],
  );

  // -------------------------------- //
  //         COMPONENT RETURN         //
  // -------------------------------- //

  return (
    <div
      style={
        isVisible
          ? { transition: '1s cubic-bezier(0.075, 0.82, 0.165, 1)', visibility: "visible", opacity: "1" }
          : {
              maxHeight: '0%',
              visibility: "hidden",
              margin: '0',
              padding: '0',
              opacity: "0",
              transition: '0.5s cubic-bezier(0.075, 0.82, 0.165, 1)'
            }
      }
      className={`${styles["project"]} ${isDarkMode && styles["dark"]}`}
    >
      {isLoggedIn && handleEditClick && (
        <div
          onClick={() => {
            handleEditClick(data);
          }}
          className={`${styles["edit__button"]} ${
            isDarkMode && styles["dark"]
          }`}
        ></div>
      )}
      {isLoggedIn && handleDeleteClick && (
        <div
          onClick={() => {
            handleDeleteClick(data);
          }}
          className={`${styles["delete__button"]} ${
            isDarkMode && styles["dark"]
          }`}
        ></div>
      )}
      <div className={styles["project__content"]}>{videoMarkup}</div>
      <div className={styles["project__info"]}>
        <div
          style={
            projectInfo.role.length > 0 ||
            (projectInfo.title.length > 0 && projectInfo.showTitle)
              ? { opacity: "1" }
              : { opacity: "0" }
          }
          className={`${styles["project__info_container"]} ${
            isDarkMode && styles["dark"]
          }`}
        >
          {projectInfo.showTitle ? (
            <span className={styles["project__info_title"]}>
              {projectInfo.title} <br />
            </span>
          ) : null}
          <span className={styles["project__info_role"]}>
            {projectInfo.role}
          </span>
        </div>
      </div>
    </div>
  );
}
