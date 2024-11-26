import React, { useEffect, useRef, useState } from "react";
import styles from "./ReorderProjectsModal.module.css";
import { getProjects, getSiteData } from "../../../utils/api";

export default function ReorderProjectsModal({
  projects,
  activeModal,
  closeModal,
}: {
  activeModal: string;
  closeModal: () => void;
  projects: [];
}) {
  // working with ._id and the ids in the order array

  const [order, setOrder] = useState<string[]>();
  const [isLoading, setLoading] = useState<boolean>();

  const [orderedProjects, setOrderedProjects] = useState<object[]>();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const draggedRef = useRef();

  function handleDragStart(e, index) {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.target.classList.add("opacity-50");
  }

  function handleDragEnd(e) {
    setDraggedIndex(null);
    e.target.classList.remove("opacity-50");
  }

  function handleDragOver(e, index) {
    console.log(`dragged over ${index}`)
    e.preventDefault();
    if (draggedIndex === null) return;

    if (draggedIndex !== index) {
      const newItems = [...orderedProjects];
      const [draggedItem] = newItems.splice(draggedIndex, 1);
      newItems.splice(index, 0, draggedItem);
      setOrderedProjects(newItems);
      setDraggedIndex(index);
    }
  }

  useEffect(() => {
    if (projects.length > 0) {
      setOrderedProjects([...projects]);
    }
  }, [projects]);

  return (
    <div className={styles["rpmodal"]}>
      <div className={styles["rpmodal__content"]}>
        <h1 className={styles["rpmodal__title"]}>re-order work</h1>
        <div className={styles["rpmodal__closebutton"]}></div>
        <div className={styles["rpmodal__itemlist"]}>
          {orderedProjects?.map((project, index) => {
            return (
              <div
                draggable={true}
                onDragStart={(e) => {
                  handleDragStart(e, index);
                }}
                onDragOver={(e) => {
                  handleDragOver(e, index);
                }}
                onDragEnd={(e) => {
                  handleDragEnd(e);
                }}
                key={index}
                className={styles["draggable__project"]}
              >
                <div className={styles["project__drag"]}>≡</div>
                <p className={styles["project__title"]}>{project.title}</p>
              </div>
            );
          })}
        </div>
        <button className={styles["rpmodal__confirm"]}>
          confirm arrangement
        </button>
      </div>
    </div>
  );
}
