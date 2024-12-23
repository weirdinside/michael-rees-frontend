import React, { useCallback, useContext, useEffect, useState } from "react";
import styles from "./DeleteProjectModal.module.css";
import { getSiteData, setSiteData, deleteProject, deleteThumbnail } from "../../../utils/api";
import { ThemeContext } from "../../../contexts/ThemeProvider";

export default function DeleteProjectModal({
  projectToDelete,
  activeModal,
  closeModal,
}: {
  activeModal: string;
  projectToDelete: ProjectInfo | undefined;
  closeModal: () => void;
}) {

  // -------------------------------- //
  //         STATES / VARIABLES       //
  // -------------------------------- //

  const [isDeleting, setDeleting] = useState<boolean>(false);

  // -------------------------------- //
  //          EVENT HANDLERS          //
  // -------------------------------- //

  const handleEscClose = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      closeModal();
    }
  }, [closeModal])

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    setDeleting(true);
    try {
      if (!projectToDelete || !projectToDelete._id) throw new Error("There is no project to delete!");
      const deletedProject = await deleteProject(projectToDelete._id);
      const siteData = await getSiteData();
      const newOrder = siteData[0].order.filter((id: string) => {
        return id !== deletedProject._id;
      });
      const response = await setSiteData(newOrder, String(Date.now()));
      if(deletedProject.thumbnail){
        const res = deleteThumbnail(deletedProject.thumbnail);
        console.log(res);
      } else {
        console.log('There was no thumbnail to delete')
      }
      console.log(response);
      closeModal();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  }

  // -------------------------------- //
  //              HOOKS               //
  // -------------------------------- //

  useEffect(function closeModalOnEsc(){
    if (activeModal !== "") {
      window.addEventListener("keydown", handleEscClose);
    }

    return window.removeEventListener("keydown", handleEscClose);
  }, [handleEscClose, activeModal]);

  const {isDarkMode} = useContext(ThemeContext);

  // -------------------------------- //
  //         COMPONENT RETURN         //
  // -------------------------------- //

  return (
    <div
      className={`${styles["deletemodal"]} ${
        activeModal === "delete" ? styles["active"] : ""
      }`}
    >
      <div className={`${styles["deletemodal__content"]} ${isDarkMode && styles['dark']}`}>
        <h1 className={styles["deletemodal__heading"]}>
          hold up. are you sure?
        </h1>
        <p className={styles["deletemodal__subheading"]}>
          you're going to delete {projectToDelete ? projectToDelete.title : ""}
        </p>
        <div className={styles["deletemodal__options"]}>
          <button
            disabled={isDeleting}
            onClick={closeModal}
            className={`${styles["deletemodal__button"]} ${styles["no"]}`}
          >
            no, i didn't mean to
          </button>
          <button
            disabled={projectToDelete === null}
            onClick={(e) => {
              handleDelete(e);
            }}
            className={`${styles["deletemodal__button"]} ${styles["yes"]}`}
          >
            {isDeleting ? "deleting it..." : "yep, delete it"}
          </button>
        </div>
      </div>
    </div>
  );
}
