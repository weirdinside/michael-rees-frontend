import { useContext, useRef, useState } from "react";
import styles from "./About.module.css";
import { ThemeContext } from "../../contexts/ThemeProvider";

export default function About() {
  const [scrolledPercentage, setScrolledPercentage] = useState<number>(0);
  const scrolledBlock = useRef<HTMLDivElement>(null);

  const { theme } = useContext(ThemeContext);

  function updateScrollPosition() {
    if (scrolledBlock.current) {
      setScrolledPercentage(
        (scrolledBlock.current.scrollTop /
          (scrolledBlock.current.scrollHeight -
            scrolledBlock.current.offsetHeight)) *
          100
      );
    }
  }

  return (
    <div
      onScroll={updateScrollPosition}
      ref={scrolledBlock}
      className={styles["page"]}
    >
      <div className={styles["gap"]} />
      <p className={styles["about__text"]}>
        According to ChatGPT: Michael Rees is a filmmaker recognized for his
        distinctive comedic short films that delve into unconventional scenarios
        and character dynamics. His work often features offbeat premises and
        explores human behavior in unique contexts. Rees's films are
        characterized by their sharp wit and the ability to find humor in the
        mundane, offering fresh perspectives on typical human experiences.
        <br /> <br />
        According to his friends and family: Michael Rees is a film director,
        screenwriter, and editor from Louisiana. Armed with a philosophy degree
        from Loyola University of New Orleans, Rees gained extensive editorial
        experience at the start of his career, collaborating with some of the
        biggest artists in the world and the teams that surround them.
        Currently, Michael splits his time between NYC and LA, focusing on
        off-kilter narrative films, the occasional music video, and the viral
        online sketch comedy project Veronika_iscool, created with best friends
        and roommates Veronika Slowikowska and Kyle Chase. Their short form
        sketch channel has amassed over 600 million views and built an audience
        of 1.3 million+ followers in under two years. Michael’s most recent
        short films (Guzzle Buddies, Middle Sized Things, Love Machine) have all
        been Vimeo Staff Picks and continue to expand an ever-growing audience,
        and earned him a 2024 Vimeo Breakout Creator Award. These films have
        been showcased alongside those of his contemporaries in an ongoing
        series called Health Ensurance, a large screening event put on by Rees
        (and crew) that has grown to be at the center of a buzzy NYC and LA film
        and art community. This trajectory underscores Rees' dedication to
        exploring a variety of creative and business ventures, and a commitment
        to staying at the forefront of the interconnected worlds of film and
        music.
      </p>
      <div className={styles["gap2"]} />
      <div
        style={{ height: `${scrolledPercentage / 5}vh` }}
        className={styles["rocks__container"]}
      >
        <div className={styles["rocks"]} />
        <div className={`${styles["fadegradient"]} ${styles[theme]}`} />
      </div>
    </div>
  );
}
