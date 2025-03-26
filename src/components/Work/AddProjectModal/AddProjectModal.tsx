import {
  ChangeEvent,
  useRef,
  useEffect,
  useState,
  useContext,
  useMemo,
} from "react";
import styles from "./AddProjectModal.module.css";
import Project from "../Project/Project";
import {
  addProject,
  getSiteData,
  setSiteData,
  uploadThumbnail,
} from "../../../utils/api";
import { ThemeContext } from "../../../contexts/ThemeProvider";

export default function AddProjectModal({
  activeModal,
  closeModal,
}: {
  activeModal: string;
  closeModal: () => void;
}) {
  // -------------------------------- //
  //         STATES / VARIABLES       //
  // -------------------------------- //

  // use a hook to minimize these instead

  const [category, setCategory] = useState<"personal" | "client" | "">("");
  const [description, setDescription] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [thumbnail, setThumbnail] = useState<string>("");
  const [link, setLink] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [file, setFile] = useState<File>();
  const fileUploadRef = useRef<HTMLInputElement>(null);
  const [isLoading, setLoading] = useState<boolean>(false);

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

  // -------------------------------- //
  //          EVENT HANDLERS          //
  // -------------------------------- //

  function clearFields() {
    setCategory("");
    setDescription("");
    setTitle("");
    setThumbnail("");
    setLink("");
    setRole("");
    setFile(undefined);
    if (fileUploadRef.current) fileUploadRef.current.value = "";
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      const newImageUrl = URL.createObjectURL(selectedFile);
      setThumbnail(newImageUrl);
    }
  };

  async function handleSubmitProject(e: React.MouseEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      let newThumbnail = thumbnail;

      if (file) {
        const customThumbnail = await uploadThumbnail(file);
        console.log(customThumbnail);
        newThumbnail = customThumbnail;
      }

      const projectAdded = await addProject({
        category: category,
        description: description,
        title: title,
        link: link,
        role: role,
        thumbnail: newThumbnail,
      });

      console.log(projectAdded);
      const idToAdd = projectAdded.data._id;
      const oldSiteData = await getSiteData();
      const order = oldSiteData[0].order;
      order.push(idToAdd);
      let res;
      if (category === "") return;
      if (category === "personal")
        res = await setSiteData({
          personalWorkOrder: order,
          lastEdited: String(Date.now()),
        });
      if (category === "client")
        res = await setSiteData({
          clientWorkOrder: order,
          lastEdited: String(Date.now()),
        });
      console.log(res);
      closeModal();
      clearFields();
    } catch (error) {
      console.error("an error happened in handleSubmitProject", error);
    } finally {
      setLoading(false);
    }
  }

  // -------------------------------- //
  //               HOOKS              //
  // -------------------------------- //

  useEffect(function handleEscClose() {
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeModal();
      }
    });

    return window.removeEventListener("keydown", () => {
      closeModal();
    });
  }, [closeModal]);

  const { theme } = useContext(ThemeContext);

  // -------------------------------- //
  //         COMPONENT RETURN         //
  // -------------------------------- //

  return (
    <div
      className={`${styles["modal"]} ${
        activeModal === "add" ? styles["active"] : ""
      } ${styles[theme]}`}
    >
      <div className={`${styles["modal__content"]} ${styles[theme]}`}>
        <div
          onClick={closeModal}
          className={`${styles["modal__close"]} ${styles[theme]}`}
        ></div>
        <h1 className={styles["modal__heading"]}>add an item</h1>
        <div className={styles["edit__container"]}>
          <form className={styles["additem__form"]}>
            <label className={styles["additem__label"]}>
              title*
              <input
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value.toUpperCase());
                }}
                className={`${styles["additem__input"]} ${styles[theme]}`}
              ></input>
            </label>
            <label className={styles["additem__label"]}>
              description
              <input
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
                className={`${styles["additem__input"]} ${styles[theme]}`}
              ></input>
            </label>

            <label className={styles["additem__label"]}>
              category?*
              <select
                onChange={(e) => {
                  console.log(e.target.value as "personal" | "client" | "");
                  setCategory(e.target.value as "personal" | "client" | "");
                }}
                className={styles["additem__select"]}
              >
                <option selected disabled value={""}>
                  Select a category...
                </option>
                <option value={"personal"}>Personal</option>
                <option value={"client"}>Client</option>
              </select>
            </label>
            <label className={styles["additem__label"]}>
              video link*
              <input
                value={link}
                onChange={(e) => {
                  setLink(e.target.value);
                }}
                className={`${styles["additem__input"]} ${styles[theme]}`}
              ></input>
            </label>
            <label className={styles["additem__label"]}>
              role*
              <input
                value={role}
                onChange={(e) => {
                  setRole(e.target.value.toUpperCase());
                }}
                className={`${styles["additem__input"]} ${styles[theme]}`}
              ></input>
            </label>
            <label
              className={`${styles["additem__label"]} ${styles["fileupload"]}`}
            >
              click here to upload alternate thumbnail
              <input
                ref={fileUploadRef}
                type="file"
                accept="image/png, image/gif, image/jpeg"
                onChange={(e) => {
                  handleImageChange(e);
                }}
                className={`${styles["additem__input"]} ${styles["fileupload"]}`}
              ></input>
            </label>
            {thumbnail ? (
              <button
                disabled={isLoading}
                onClick={(e) => {
                  e.preventDefault();
                  setThumbnail("");
                  if (fileUploadRef.current) fileUploadRef.current.value = "";
                }}
                className={styles["form__button"]}
              >
                remove thumbnail
              </button>
            ) : null}
          </form>
          {activeModal === "add" && (
            <div className={styles["preview"]}>
              <Project
                isPreview={true}
                project={data}
              ></Project>
            </div>
          )}
        </div>
        <div className={styles["add__options"]}>
          <button
            disabled={isLoading}
            onClick={(e) => {
              e.preventDefault();
              clearFields();
            }}
            className={`${styles["add__button"]} ${styles[theme]} ${styles["revert"]}`}
          >
            clear fields
          </button>
          <button
            onClick={handleSubmitProject}
            disabled={isLoading}
            className={`${styles["add__button"]} ${styles[theme]}`}
          >
            {isLoading ? "adding.." : "add"}
          </button>
        </div>
      </div>
    </div>
  );
}
