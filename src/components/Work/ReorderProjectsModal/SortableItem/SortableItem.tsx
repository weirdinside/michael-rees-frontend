import React from "react";

import styles from "./SortableItem.module.css";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function SortableItem({ project }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: project._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      draggable
      ref={setNodeRef}
      style={style}
      className={styles["draggable__project"]}
      {...attributes}
      {...listeners}
    >
      <div className={styles["project__drag"]}>≡</div>
      <p className={styles["project__title"]}>{project.title}</p>
    </div>
  );
}
