import styles from "./Project.module.css";

export default function Project({ projectInfo }: { projectInfo: ProjectInfo }) {
  //   projectInfo will be an object with the following schema
  // { title: string, block: (this needs either an image or a url), role: string, dateUploaded: date }

  return (
    <div className={styles["project"]}>
      <div className={styles["project__content"]}>
        {/* if we have both content and a link, render an image with a clickthrough to the link
            else, we only have a link, and therefore resolve an embed based on what the link is from */}
        <div style={{ padding: "56.25% 0 0 0", position: "relative" }}>
          <iframe
            src="https://player.vimeo.com/video/1010054668?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
            style={{
              position: "absolute",
              top: "0",
              left: "0",
              width: "100%",
              height: "100%",
            }}
            title="Guzzle Buddies"
          ></iframe>
        </div>
        <script src="https://player.vimeo.com/api/player.js"></script>
      </div>
      <div className={styles["project__info"]}>
        <div className={styles["project__info_container"]}>
          {projectInfo.title ? (
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
