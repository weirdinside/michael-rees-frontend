import { Link } from "react-router-dom";
import styles from "./Work.module.css";
import Project from "./WorkItem/Project";
import AddProjectModal from "./AddProjectModal/AddProjectModal";
import { useEffect, useState } from "react";
import { getProjects } from "../../utils/api";

export default function Work({isLoggedIn}) {
  // logic here for displaying Projects from the schema as below:
  // { title: string, block: (this needs either an image or a url), role: string, dateUploaded: date }

  const [projects, setProjects] = useState([])
  const [activeModal, setActiveModal] = useState<string>('');

  function closeModal(){
    setActiveModal('')
  }

  useEffect(()=>{
    getProjects().then((res)=>{
      setProjects(res);
    })
  }, [activeModal])

  return (
    <div className={styles["work"]}>
      <div className={styles["work__header"]}>
        <h1 className={styles["header__title"]}>PROJECTS</h1>
        <Link
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
          to="/contact"
        >
          <button
            className={`${styles["header__contact"]} ${styles["button"]}`}
          >
            CONTACT
          </button>
        </Link>

        <Link
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
          to="/"
        >
          <button className={`${styles["header__home"]} ${styles["button"]}`}>
            HOME
          </button>
        </Link>
      </div>
      <main className={styles["work__main"]}>
        {projects.map((projectInfo)=>{
          return (<Project projectInfo={projectInfo}></Project>)
        })}
      </main>
      {isLoggedIn ?   <div onClick={()=>setActiveModal('add')} className={styles['add__project']}>+</div> : null}
      <AddProjectModal closeModal={closeModal} activeModal={activeModal}></AddProjectModal>
    </div>
  );
}
