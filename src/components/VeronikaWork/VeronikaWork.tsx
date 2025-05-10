import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../../contexts/ThemeProvider";
import { getSiteData, setSiteData } from "../../utils/api";
import styles from "./VeronikaWork.module.css";

import triopic from '/triopic.png'

// this is just to fix ts2339; Property 'instgrm' does not exist on type 'Window & typeof globalThis'.
declare global {
  interface Window {
    instgrm: any;
  }
}

const InstagramEmbed = ({
  url,
}: {
  deleteProject: ({ url }: { url: string }) => void;
  url: string;
  isLoggedIn: boolean;
}) => {
  return (
    <div style={{ flexShrink: "1", position: "relative" }}>
      <blockquote
        style={{ height: "465px" }}
        className="instagram-media"
        data-instgrm-permalink={`${
          url.split("?")[0]
        }?utm_source=ig_embed&amp;utm_campaign=loading`}
        data-instgrm-version="14"
      />
    </div>
  );
};

export default function VeronikaWork({
  isLoggedIn,
  activeModal,
  setActiveModal,
}: {
  activeModal: string;
  isLoggedIn: boolean;
  setActiveModal: (arg0: string) => void;
}) {
  const [links, setLinks] = useState<string[]>([]);
  const [desc, setDesc] = useState<string>("");

  async function deleteProject({ url }: { url: string }) {
    setSiteData({
      veronikaVideos: links.filter((item) => {
        item != url;
      }),
      lastEdited: Date.now().toString(),
    });

    getSiteData().then((res) => {
      if (res) setLinks(res[0].veronikaVideos);
    });
  }

  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.instagram.com/embed.js";
    script.async = true;
    document.body.appendChild(script);

    getSiteData().then((res) => {
      if (res) {
        setDesc(res[0].veronikaWorkDescription)
        setLinks(res[0].veronikaVideos);
      }
    });

    script.onload = () => {
      if (window.instgrm) window.instgrm.Embeds.process();
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [activeModal]);

  useEffect(() => {
    if (window.instgrm) window.instgrm.Embeds.process();
  }, [links]);

  return (
    <div className={`${styles["vwork"]} ${styles[theme]}`}>
      {isLoggedIn && (
        <div className={styles["options"]}>
          <p className={styles["options__text"]}>
            Hey Michael! Since you're logged in: do you want to...
          </p>
          <div className={styles["options__buttons"]}>
            <button
              onClick={() => {
                setActiveModal("veronika");
              }}
              className={styles["options__button"]}
            >
              Add a post
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
      <div className={styles['block']}>
      <img className={styles['triopic']} src={triopic} alt={'picture of Veronika, Kyle and Michael'}/>
      <p className={styles["description"]}>
        {desc} Follow{" "}
        <Link target="_blank" to={"https://www.instagram.com/veronika_iscool/"}>
          @veronika_iscool on Instagram
        </Link>{" "}
        to keep up with what's going on.
      </p>
      </div>
    
      <div className={styles["other-skits"]}>
        {links.map((link, idx) => {
          return (
            <div key={idx} className={styles["subskit"]}>
              <InstagramEmbed
                deleteProject={deleteProject}
                isLoggedIn={isLoggedIn}
                url={link}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
