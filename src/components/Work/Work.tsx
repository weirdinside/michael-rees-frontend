import { useContext, useState } from "react";
import { ThemeContext } from "../../contexts/ThemeProvider";
import styles from "./Work.module.css";
import WorkCategory from "./WorkCategory/WorkCategory";
import { useQueryState } from "nuqs";
import Filter from "./Filter/Filter";

export default function Work() {
  const { theme } = useContext(ThemeContext);
  const [mousedOverHeading, setMousedOverHeading] = useState("");
  const [activeBlock, setActiveBlock] = useQueryState("tab");

  function clickHeading(heading: string) {
    if (activeBlock === heading) setActiveBlock(null);
    else setActiveBlock(heading);
    return;
  }

  const [filters, setFilters] = useState<object>({
    director: false,
    editor: false,
    writer: false,
    producer: false,
  });


  const [searchTerm, setSearchTerm] = useState<string>("");

  function toggleFilter(filter: keyof typeof filters) {
    setFilters((prev) => {
      return { ...prev, [filter]: !filters[filter] };
    });
  }

  return (
    <div className={`${styles["page"]} ${styles[theme]}`}>
      <ul className={styles["list"]}>
        <WorkCategory
          headingName="personal"
          headingText="Personal Work"
          description="Films that I wrote, directed and sometimes shot and edited"
          clickHeading={clickHeading}
          activeBlock={activeBlock}
          mousedOverHeading={mousedOverHeading}
          setMousedOverHeading={setMousedOverHeading}
        >
          <p className={styles["description__text"]}>
            This is work I've written, directed and sometimes shot and edited.
            This is a placeholder description, but can potentially be pretty
            long. Check out some of my work below.
          </p>
          <div className={styles["work__body"]}>
            <div className={styles["work"]}></div>
          </div>
        </WorkCategory>
        <WorkCategory
          headingName="client"
          headingText="Client Work"
          description="Things that I have made for others"
          clickHeading={clickHeading}
          activeBlock={activeBlock}
          mousedOverHeading={mousedOverHeading}
          setMousedOverHeading={setMousedOverHeading}
        >
          this is the stuff in client work
        </WorkCategory>
        <WorkCategory
          headingName="veronika"
          headingText="Veronika_iscool"
          description="Social media content and skits for Veronika Slowikowska and Kyle Chase"
          clickHeading={clickHeading}
          activeBlock={activeBlock}
          mousedOverHeading={mousedOverHeading}
          setMousedOverHeading={setMousedOverHeading}
        >
          this is the stuff in veronika work
        </WorkCategory>
        <WorkCategory
          headingName="health"
          headingText="Health Ensurance"
          description="Film screenings hosted and organized by me"
          clickHeading={clickHeading}
          activeBlock={activeBlock}
          mousedOverHeading={mousedOverHeading}
          setMousedOverHeading={setMousedOverHeading}
        >
          this is the stuff in ensurance work
        </WorkCategory>
      </ul>
    </div>
  );
}
