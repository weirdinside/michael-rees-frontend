import React, { useState, useEffect } from "react";
import { setSiteData } from "../../../utils/api";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverEvent,
  TouchSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import styles from "./ReorderProjectsModal.module.css";

function SortableItem({
  project,
  index,
}: {
  project: ProjectInfo;
  index: number;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project._id || index });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.9 : 1,
    backgroundColor: isDragging ? "black" : "white",
    color: isDragging ? "white" : "black",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        ${styles["draggable__project"]} 
        ${isDragging ? styles["dragging"] : ""}
      `}
      {...attributes}
      {...listeners}
    >
      <div className={styles["project__drag"]}>≡</div>
      <p className={styles["project__title"]}>{project.title}</p>
    </div>
  );
}

export default function ReorderProjectsModal({
  projects,
  activeModal,
  closeModal,
}: {
  activeModal: string;
  closeModal: () => void;
  projects: ProjectInfo[];
}) {

  // -------------------------------- //
  //         STATES / VARIABLES       //
  // -------------------------------- //

  const [orderedProjects, setOrderedProjects] = useState<ProjectInfo[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // -------------------------------- //
  //          EVENT HANDLERS          //
  // -------------------------------- //

  function handleDragOver(e: DragOverEvent) {
    const { active, over } = e;
    if (active.id !== over?.id) {
      setOrderedProjects((projects) => {
        const oldIndex = projects.findIndex(
          (project) =>
            project._id === active.id ||
            projects.indexOf(project) === active.id,
        );
        const newIndex = projects.findIndex(
          (project) =>
            project._id === over?.id || projects.indexOf(project) === over?.id,
        );
        return arrayMove(projects, oldIndex, newIndex);
      });
    }
  }

  async function handleConfirmOrder(e: React.MouseEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const reversedData: ProjectInfo[] = orderedProjects.reverse();
      const res = await setSiteData(reversedData, String(Date.now()));
      console.log(res)
      closeModal();
    } catch(err) {
      console.error(err)
    } finally {
      setLoading(false);
    }
  }

  // -------------------------------- //
  //               HOOKS              //
  // -------------------------------- //

  useEffect(() => {
    if (projects && projects.length > 0) {
      setOrderedProjects(projects);
    }
  }, [projects]);

  // -------------------------------- //
  //         COMPONENT RETURN         //
  // -------------------------------- //

  if (!projects || projects.length === 0) {
    return (
      <div className={styles["rpmodal"]}>
        <div className={styles["rpmodal__content"]}>
          <p>No projects available</p>
        </div>
      </div>
    );
  }
  return (
    <div className={`${styles["rpmodal"]} ${activeModal === 'order' && styles['active']}`}>
      <div className={styles["rpmodal__content"]}>
        <h1 className={styles["rpmodal__title"]}>re-order work</h1>
        <div
          className={styles["rpmodal__closebutton"]}
          onClick={closeModal}
        ></div>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragOver={handleDragOver}
        >
          <SortableContext
            items={orderedProjects.map((p) => p._id || p.title)}
            strategy={verticalListSortingStrategy}
          >
            <div className={styles["rpmodal__itemlist"]}>
              {orderedProjects.map((project, index) => (
                <SortableItem
                  key={project._id || index}
                  project={project}
                  index={index}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
        <button
          disabled={isLoading}
          className={styles["rpmodal__confirm"]}
          onClick={(e) => {
            handleConfirmOrder(e);
          }}
        >
          {isLoading ? 'confirming...' : 'confirm arrangement'}
        </button>
      </div>
    </div>
  );
}
