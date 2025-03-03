import styles from "./About.module.css";

export default function About() {
  return (
    <div className={styles["page"]}>
      <div className={styles["gap"]} />
      <p className={styles["about__text"]}>
        According to ChatGPT: Michael Rees is a filmmaker recognized for his
        distinctive comedic short films that delve into unconventional scenarios
        and character dynamics. His work often features offbeat premises and
        explores human behavior in unique contexts — characterized by their
        sharp wit and the ability to find humor in the mundane, offering fresh
        perspectives on typical human experiences.
        <br /> <br />
        According to his friends and family: Michael Rees is a film director,
        screenwriter, and editor from just outside New Orleans, Louisiana.
        Although raised entirely disconnected from the entertainment industry,
        there wasn’t a time in which he wasn’t making films and videos. While
        earning a philosophy degree at Loyola University of New Orleans, he
        developed a critical and analytical approach to filmmaking, exploring
        nuanced themes and bridging artistic disciplines to add depth to his
        projects. Before focusing on personal narrative work, Rees gained
        extensive editorial experience, collaborating with some of the biggest
        artists in the world and the teams that surround them. This
        interdisciplinary approach, rooted in his philosophical background,
        allows him to navigate and connect diverse social and creative spheres
        at the crossroads of film, music, and fashion. Currently, Michael splits
        his time between NYC and LA, focusing on narrative films, music videos,
        and the viral online sketch comedy project Veronika_iscool, created with
        best friends and roommates Veronika Slowikowska and Kyle Chase. His most
        recent short films (Guzzle Buddies, Middle Sized Things, Love Machine)
        have all been Vimeo Staff Picks and continue to expand an ever-growing
        audience. These films have been showcased alongside those of his
        contemporaries in an ongoing series called Health Ensurance, a large
        screening event put on by Rees (and crew) that has grown to be at the
        center of a buzzy NYC and LA film and art community. This trajectory
        underscores Rees' dedication to exploring a variety of creative and
        business ventures, and a commitment to staying at the forefront of the
        interconnected worlds of film, music, fashion, and art.
      </p>
      <br />
    </div>
  );
}
