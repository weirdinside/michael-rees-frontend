import { Link } from "react-router-dom";
import styles from "./Project.module.css";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../../contexts/ThemeProvider";

export default function Project({
  projectInfo,
  isLoggedIn = false,
  handleDeleteClick,
  handleEditClick,
}: {
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

  const [videoMarkup, setVideoMarkup] = useState(<></>);

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
    console.log();
  }, [isLoading]);

  const { isDarkMode } = useContext(ThemeContext);

  // -------------------------------- //
  //    CONDITIONAL MARKUP RETURN     //
  // -------------------------------- //

  useEffect(
    function setVideoPlayer() {
      if (data.thumbnail) {
        setVideoMarkup(
          <Link
            style={{ textDecoration: "none" }}
            target="_blank"
            to={data.link}
          >
            {isLoading && (
              <div className={styles["thumbnail__loading"]}>⬤⬤⬤</div>
            )}
            <div
              onLoad={() => {
                setIsLoading(false);
              }}
              className={styles["thumbnail"]}
              style={{
                backgroundImage: `url(http://localhost:3001/${data.thumbnail})`,
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
              onLoad={(e) => {
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
        setVideoMarkup(<></>);
      }
    },
    [data.link, data.thumbnail],
  );

  // -------------------------------- //
  //         COMPONENT RETURN         //
  // -------------------------------- //

  return (
    <div className={`${styles["project"]} ${isDarkMode && styles["dark"]}`}>
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
