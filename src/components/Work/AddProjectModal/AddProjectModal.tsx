import { ChangeEvent, useRef, useEffect, useState } from "react";
import styles from "./AddProjectModal.module.css";
import Project from "../WorkItem/Project";
import { addProject, getSiteData, setSiteData, uploadThumbnail } from "../../../utils/api";

export default function AddProjectModal({ activeModal, closeModal }: {activeModal: string, closeModal: ()=>void}) {

  // -------------------------------- //
  //         STATES / VARIABLES       //
  // -------------------------------- //
  
  // the following can be minimized with useReducer
  const [title, setTitle] = useState<string>("");
  const [showTitle, setShowTitle] = useState<boolean>(false);
  const [thumbnail, setThumbnail] = useState<string>("");
  const [link, setLink] = useState<string>("");
  const [role, setRole] = useState<string>("");

  const [file, setFile] = useState<File>();
  const fileUploadRef = useRef<HTMLInputElement>(null);

  const [isLoading, setLoading] = useState<boolean>(false);

  const data = {
    title: title,
    showTitle: showTitle,
    link: link,
    role: role,
    thumbnail: thumbnail,
  };

  // -------------------------------- //
  //          EVENT HANDLERS          //
  // -------------------------------- //

  function clearFields(e: React.MouseEvent) {
    e.preventDefault();
    setTitle("");
    setShowTitle(false);
    setThumbnail("");
    setLink("");
    setRole("");
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


  async function handleSubmitProject(e: React.MouseEvent){
    e.preventDefault();
    setLoading(true)
    
    try {
      let newThumbnail = thumbnail;

      if(file){
        const customThumbnail = await uploadThumbnail(file);
        console.log(customThumbnail);
        newThumbnail = customThumbnail;
      }

      const projectAdded = await addProject(title, showTitle, link, role, newThumbnail)
      console.log(projectAdded);
      const idToAdd = projectAdded.data._id;
      const oldSiteData = await getSiteData();
      const order = oldSiteData[0].order;
      order.push(idToAdd);
      const res = await setSiteData(order, String(Date.now()));
      console.log(res);
      closeModal();
    } catch (error) {
      console.error('an error happened in handleSubmitProject', error)
    } finally {
      setLoading(false)
    }
  }

  // -------------------------------- //
  //               HOOKS              //
  // -------------------------------- //

  useEffect(function handleEscClose(){
    window.addEventListener('keydown', (e)=>{
      if(e.key === 'Escape'){
        closeModal();
      }
    })

    return window.removeEventListener('keydown', ()=>{
      closeModal();
    })
  }, [])

  // -------------------------------- //
  //         COMPONENT RETURN         //
  // -------------------------------- //

  return (
    <div
      className={`${styles["modal"]} ${
        activeModal === "add" ? styles["active"] : ""
      }`}
    >
      <div className={styles["modal__content"]}>
        <div onClick={closeModal} className={styles["modal__close"]}></div>
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
                className={styles["additem__input"]}
              ></input>
            </label>
            <label
              className={`${styles["additem__label"]} ${styles["checkbox"]}`}
            >
              display title?*
              <input
                checked={showTitle}
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    return setShowTitle(true);
                  }
                  return setShowTitle(false);
                }}
                className={styles["additem__checkbox"]}
              ></input>
            </label>
            <label className={styles["additem__label"]}>
              video link*
              <input
                value={link}
                onChange={(e) => {
                  setLink(e.target.value);
                }}
                className={styles["additem__input"]}
              ></input>
            </label>
            <label className={styles["additem__label"]}>
              role*
              <input
                value={role}
                onChange={(e) => {
                  setRole(e.target.value.toUpperCase());
                }}
                className={styles["additem__input"]}
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
          <div className={styles["preview"]}>
            <Project projectInfo={data}></Project>
          </div>
        </div>
        <div className={styles['add__options']}>
        
            <button
              disabled={isLoading}
              onClick={clearFields}
              className={`${styles["add__button"]} ${styles['revert']}`}
            >
              clear fields
            </button>
            <button
              onClick={handleSubmitProject}
              disabled={isLoading}
              className={styles["add__button"]}
            >
              {isLoading ? "adding.." : "add"}
            </button>
        </div>
      </div>
    </div>
  );
}
