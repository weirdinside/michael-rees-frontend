import React, { useState, useRef, useEffect, ChangeEvent } from "react";
import styles from "./EditProjectModal.module.css";
import { editProject } from "../../../utils/api";
import Project from "../WorkItem/Project";

export default function EditProjectModal({
  projectToEdit,
  closeModal,
  activeModal,
}: {
  projectToEdit: ProjectInfo | undefined;
  closeModal: () => void;
  activeModal: string;
}) {
  const [title, setTitle] = useState<string>("");
  const [showTitle, setShowTitle] = useState<boolean>(false);
  const [thumbnail, setThumbnail] = useState<string | undefined>("");
  const [link, setLink] = useState<string>("");
  const [role, setRole] = useState<string>("");
  
  const [initialData, setInitialData] = useState<ProjectInfo>();

  const [file, setFile] = useState<File>();
  const fileUploadRef = useRef<HTMLInputElement>(null);

  const [isLoading, setLoading] = useState<boolean>(false);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      const newImageUrl = URL.createObjectURL(selectedFile);
      setThumbnail(newImageUrl);
    }
  };

  const data = {
    title: title,
    showTitle: showTitle,
    link: link,
    role: role,
    thumbnail: thumbnail,
  };

  function revertFields(e: React.MouseEvent) {
    e.preventDefault();
    if (initialData) {
      setTitle(initialData.title);
      setShowTitle(initialData.showTitle);
      setThumbnail(initialData.thumbnail);
      setLink(initialData.link);
      setRole(initialData.role);
    }
  }

  async function handleConfirmEdit(e: React.MouseEvent) {
    e.preventDefault();
    if (projectToEdit && projectToEdit._id) {
      try {
        const res = await editProject(projectToEdit._id, title, showTitle, link, role, thumbnail);
        console.log(res);
        closeModal();
      } catch (err) {
        console.error(err);
      }
    }
  }

  useEffect(() => {
    if (projectToEdit) {
      setTitle(projectToEdit.title);
      setShowTitle(projectToEdit.showTitle);
      setThumbnail(projectToEdit.thumbnail);
      setLink(projectToEdit.link);
      setRole(projectToEdit.role);
      setInitialData(projectToEdit);
    }
  }, [projectToEdit]);

  return (
    <div
      className={`${styles["epmodal"]} ${
        activeModal === "edit" && styles["active"]
      }`}
    >
      <div className={styles["epmodal__content"]}>
        <button
          onClick={closeModal}
          className={styles["epmodal__close"]}
        ></button>
        <h1 className={styles["epmodal__heading"]}>edit project</h1>
        <div className={styles["edit__container"]}>
          <div className={styles["edit__fields"]}>
            <label className={styles["edit__label"]}>
              title*
              <input
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
                className={styles["edit__input"]}
              ></input>
            </label>
            <label className={`${styles["edit__label"]} ${styles["checkbox"]}`}>
              display title?*
              <input
                checked={showTitle}
                onChange={(e) => {
                  setShowTitle(e.target.checked);
                }}
                type="checkbox"
                className={styles["edit__checkbox"]}
              ></input>
            </label>
            <label className={styles["edit__label"]}>
              link*
              <input
                value={link}
                onChange={(e) => {
                  setLink(e.target.value);
                }}
                className={styles["edit__input"]}
              ></input>
            </label>
            <label className={styles["edit__label"]}>
              role*
              <input
                value={role}
                onChange={(e) => {
                  setRole(e.target.value);
                }}
                className={styles["edit__input"]}
              ></input>
            </label>
            {thumbnail && (
              <button
                disabled={isLoading}
                onClick={(e) => {
                  e.preventDefault();
                  setThumbnail("");
                  if (fileUploadRef.current) fileUploadRef.current.value = "";
                }}
                className={styles["edit__button"]}
              >
                remove thumbnail
              </button>
            )}
            <label
              style={
                !thumbnail ? { opacity: "1" } : { height: "0px", opacity: "0" }
              }
              className={`${styles["edit__label"]} ${styles["fileupload"]}`}
            >
              click here to upload alternate thumbnail
              <input
                ref={fileUploadRef}
                type="file"
                accept="image/png, image/gif, image/jpeg"
                onChange={(e) => {
                  handleImageChange(e);
                }}
                className={`${styles["edit__input"]} ${styles["fileupload"]}`}
              ></input>
            </label>
            <div className={styles["preview"]}>
              {projectToEdit && <Project projectInfo={data}></Project>}
            </div>
          </div>
          <div className={styles["edit__options"]}>
            <button
              onClick={(e) => {
                revertFields(e);
              }}
              className={`${styles["edit__button"]} ${styles["revert"]}`}
            >
              revert
            </button>
            <button
              onClick={handleConfirmEdit}
              className={styles["edit__button"]}
            >
              confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
