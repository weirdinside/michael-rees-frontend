import { useQueryState } from "nuqs";
import { useCallback, useContext, useState } from "react";
import { ThemeContext } from "../../contexts/ThemeProvider";
import { getProjects, getSiteData } from "../../utils/api";
import VeronikaWork from "../VeronikaWork/VeronikaWork";
import AddProjectModal from "./AddProjectModal/AddProjectModal";
import ClientWork from "./ClientWork/ClientWork";
import DeleteProjectModal from "./DeleteProjectModal/DeleteProjectModal";
import EditProjectModal from "./EditProjectModal/EditProjectModal";
import HealthEnsurance from "./HealthEnsurance/HealthEnsurance";
import ManageVeronikaModal from "./ManageVeronikaModal/ManageVeronikaModal";
import PersonalWork from "./PersonalWork/PersonalWork";
import ReorderProjectsModal from "./ReorderProjectsModal/ReorderProjectsModal";
import styles from "./Work.module.css";
import WorkCategory from "./WorkCategory/WorkCategory";

export default function Work({
  isLoggedIn,
  activeModal,
  setActiveModal,
  closeModal,
}: {
  isLoggedIn: boolean;
  activeModal: string;
  setActiveModal: (modal: string) => void;
  closeModal: () => void;
}) {
  const { theme } = useContext(ThemeContext);
  const [mousedOverHeading, setMousedOverHeading] = useState("");
  const [activeBlock, setActiveBlock] = useQueryState("tab");
  const [category, setCategory] = useState<"personal" | "client" | undefined>();
  const [selectedProject, setSelectedProject] = useState<ProjectInfo>();

  function clickHeading(heading: string) {
    if (activeBlock === heading) setActiveBlock(null);
    else setActiveBlock(heading);
    return;
  }

  const getAndOrderProjects = useCallback(
    async ({ category }: { category: "personal" | "client" }) => {
      try {
        const siteData = await getSiteData();
        const order = siteData[0][`${category}WorkOrder`].reverse();
        const projects = await getProjects();
        const filteredProjects = projects.filter((project: ProjectInfo) => {
          return project.category === category;
        });
        const sortedProjects = filteredProjects.sort(
          (a: ProjectInfo, b: ProjectInfo) => {
            return order.indexOf(a._id) - order.indexOf(b._id);
          }
        );
        return sortedProjects;
      } catch (err) {
        console.error(err);
      }
    },
    []
  );

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
          <PersonalWork
            setCategory={setCategory}
            setSelectedProject={setSelectedProject}
            activeModal={activeModal}
            setActiveModal={setActiveModal}
            getAndOrderProjects={getAndOrderProjects}
            isLoggedIn={isLoggedIn}
          />
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
          <ClientWork
            setCategory={setCategory}
            setSelectedProject={setSelectedProject}
            activeModal={activeModal}
            setActiveModal={setActiveModal}
            getAndOrderProjects={getAndOrderProjects}
            isLoggedIn={isLoggedIn}
          />
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
          <VeronikaWork
            activeModal={activeModal}
            setActiveModal={setActiveModal}
            isLoggedIn={isLoggedIn}
          />
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
          <HealthEnsurance setActiveModal={setActiveModal} isLoggedIn={isLoggedIn} />
        </WorkCategory>
        {/* {activeBlock === "" ||
          (activeBlock === null && (
            <div className={styles["cta"]}>
              want to make something cool?{" "}
              <Link to="/contact">
                <button className={styles["cta-button"]}>contact me</button>
              </Link>
            </div>
          ))} */}
      </ul>
      <ReorderProjectsModal
        getAndOrderProjects={getAndOrderProjects}
        category={category}
        activeModal={activeModal}
        closeModal={closeModal}
      />
      <AddProjectModal activeModal={activeModal} closeModal={closeModal} />
      <EditProjectModal
        projectToEdit={selectedProject}
        activeModal={activeModal}
        closeModal={closeModal}
      />
      <DeleteProjectModal
        projectToDelete={selectedProject}
        activeModal={activeModal}
        closeModal={closeModal}
      />
      <ManageVeronikaModal activeModal={activeModal} closeModal={closeModal} />
    </div>
  );
}
