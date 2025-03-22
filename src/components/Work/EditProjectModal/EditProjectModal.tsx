import React, {
  ChangeEvent,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ThemeContext } from "../../../contexts/ThemeProvider";
import {
  deleteThumbnail,
  editProject,
  uploadThumbnail,
} from "../../../utils/api";
import Project from "../Project/Project";
import styles from "./EditProjectModal.module.css";

export default function EditProjectModal({
  projectToEdit,
  closeModal,
  activeModal,
}: {
  projectToEdit: ProjectInfo | undefined;
  closeModal: () => void;
  activeModal: string;
}) {
  // -------------------------------- //
  //         STATES / VARIABLES       //
  // -------------------------------- //

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<"personal" | "client" | "">("");
  const [thumbnail, setThumbnail] = useState<string | undefined>("");
  const [link, setLink] = useState<string>("");
  const [role, setRole] = useState<string>("");

  const [initialData, setInitialData] = useState<ProjectInfo>();

  const [file, setFile] = useState<File>();
  const fileUploadRef = useRef<HTMLInputElement>(null);

  const [isLoading, setLoading] = useState<boolean>(false);

  // -------------------------------- //
  //          EVENT HANDLERS          //
  // -------------------------------- //

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      const newImageUrl = URL.createObjectURL(selectedFile);
      setThumbnail(newImageUrl);
    }
  };

  const data = useMemo(
    () => ({
      category,
      description,
      title,
      link,
      role,
      thumbnail,
    }),
    [category, description, title, link, role, thumbnail]
  );

  function revertFields(e: React.MouseEvent) {
    e.preventDefault();
    if (initialData) {
      if (initialData.description) setDescription(initialData.description);
      setCategory(initialData.category);
      setTitle(initialData.title);
      setThumbnail(initialData.thumbnail);
      setLink(initialData.link);
      setRole(initialData.role);
    }
  }

  async function handleConfirmEdit(e: React.MouseEvent) {
    e.preventDefault();
    setLoading(true);
    if (projectToEdit && projectToEdit._id) {
      try {
        let newThumbnail = thumbnail;
        if (
          initialData &&
          initialData.thumbnail &&
          thumbnail !== initialData.thumbnail
        ) {
          const deletedThumb = await deleteThumbnail(initialData.thumbnail);
          console.log("file deleted", deletedThumb);
        }
        if (file) {
          const customThumbnail = await uploadThumbnail(file);
          newThumbnail = customThumbnail;
        }
        if (!category) return;
        const res = await editProject({
          category: category,
          description: description,
          _id: projectToEdit._id,
          title: title,
          link: link,
          role: role,
          thumbnail: newThumbnail,
        });
        console.log(res);
        closeModal();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  }

  // -------------------------------- //
  //               HOOKS              //
  // -------------------------------- //

  useEffect(
    function setInitialDataOnOpen() {
      if (projectToEdit) {
        setTitle(projectToEdit.title);
        if (projectToEdit.description)
          setDescription(projectToEdit.description);
        setCategory(projectToEdit.category);
        setThumbnail(projectToEdit.thumbnail);
        setLink(projectToEdit.link);
        setRole(projectToEdit.role);
        setInitialData(projectToEdit);
      }
    },
    [projectToEdit]
  );

  const { theme } = useContext(ThemeContext);

  // -------------------------------- //
  //         COMPONENT RETURN         //
  // -------------------------------- //

  return (
    <div
      className={`${styles["epmodal"]} ${
        activeModal === "edit" && styles["active"]
      } ${styles[theme]}`}
    >
      <div className={`${styles["epmodal__content"]}`}>
        <button
          onClick={closeModal}
          className={`${styles["epmodal__close"]}`}
        ></button>
        <h1 className={styles["epmodal__heading"]}>edit project</h1>
        <div className={styles["edit__container"]}>
          <div className={styles["edit__fields"]}>
            <label className={styles["edit__label"]}>
              title*
              <input
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value.toUpperCase());
                }}
                className={`${styles["edit__input"]} `}
              ></input>
            </label>

            <label className={styles["edit__label"]}>
              description
              <input
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
                className={`${styles["edit__input"]} `}
              ></input>
            </label>

            <label className={styles["edit__label"]}>
              category?*
              <select
                onChange={(e) => {
                  console.log(e.target.value as "personal" | "client" | "");
                  setCategory(e.target.value as "personal" | "client" | "");
                }}
                className={styles["edit__select"]}
              >
                <option selected disabled value={""}>
                  Select a category...
                </option>
                <option value={"personal"}>Personal</option>
                <option value={"client"}>Client</option>
              </select>
            </label>

            <label className={styles["edit__label"]}>
              link*
              <input
                value={link}
                onChange={(e) => {
                  setLink(e.target.value);
                }}
                className={`${styles["edit__input"]} `}
              ></input>
            </label>
            <label className={styles["edit__label"]}>
              role*
              <input
                value={role}
                onChange={(e) => {
                  setRole(e.target.value.toUpperCase());
                }}
                className={`${styles["edit__input"]} `}
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
              {projectToEdit && <Project isPreview project={data}></Project>}
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
