import styles from "./VeronikaWork.module.css";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../../contexts/ThemeProvider";
import { getSiteData } from "../../utils/api";

// this is just to fix ts2339; Property 'instgrm' does not exist on type 'Window & typeof globalThis'.
declare global {
  interface Window {
    instgrm: any;
  }
}

const InstagramEmbed = ({
  url,
  isLoggedIn,
}: {
  url: string;
  isLoggedIn: boolean;
}) => {
  return (
    <div style={{ flexShrink: "1", position: "relative" }}>
      {isLoggedIn && <div className={styles["delete"]}>✕</div>}
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

  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.instagram.com/embed.js";
    script.async = true;
    document.body.appendChild(script);

    getSiteData().then((res) => {
      console.log(res[0].veronikaVideos);
      if (res) setLinks(res[0].veronikaVideos);
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

      <p className={styles["description"]}>
        These are skits and sketches I've filmed for Veronika Slowikowska and
        Kyle Chase. Below are a couple of my favorite videos we've made
        together. Follow @veronika_iscool on Instagram to keep up with The Lore.
      </p>
      <div className={styles["other-skits"]}>
        {links.map((link, idx) => {
          return (
            <div key={idx} className={styles["subskit"]}>
              <InstagramEmbed isLoggedIn={isLoggedIn} url={link} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
