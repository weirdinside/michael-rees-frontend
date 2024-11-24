import { Link } from "react-router-dom";
import styles from "./Project.module.css";
import { useEffect, useState } from "react";

export default function Project({ projectInfo }: { projectInfo: ProjectInfo }) {
  //   projectInfo will be an object with the following schema
  // { title: string, block: (this needs either an image or a url), role: string, dateUploaded: date }

  const [data, setData] = useState<ProjectInfo>({
    title: "",
    showTitle: false,
    role: "",
    link: "",
    thumbnail: ""
  });

  const [videoMarkup, setVideoMarkup] = useState(<></>);

  useEffect(function setProjectInfo() {
    setData(projectInfo)
  }, [projectInfo]);

  useEffect(function setVideoPlayer() {
    if (data.thumbnail) {
      setVideoMarkup (
        <Link target="_blank" to={data.link}>
          <div
            className={styles["thumbnail"]}
            style={{ backgroundImage: `url(http://localhost:3001/${data.thumbnail})` }}
          ></div>
        </Link>
      );
    } else if (data?.link.toLowerCase().includes("vimeo.com")) {
      const slug = data.link.split("/").pop();
      setVideoMarkup (
        <>
          <div style={{ padding: "56.25% 0 0 0", position: "relative" }}>
            <iframe
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
        </>
      );
    } else if (data?.link.toLowerCase().includes("youtube.com")) {
      const slug = data.link.substring(
        data.link.indexOf("=") + 1,
        data.link.indexOf("&"),
      );
      setVideoMarkup (
        <iframe
          width="100%"
          height="400px"
          src={`https://www.youtube.com/embed/${slug}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen={true}
        ></iframe>
      );
    } else {
      setVideoMarkup(<></>);
    }
  }, [data.link, data.thumbnail]);

  return (
    <div className={styles["project"]}>
      <div className={styles["project__content"]}>
        {videoMarkup}
      </div>
      <div className={styles["project__info"]}>
        <div className={styles["project__info_container"]}>
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
