import { useContext, useEffect, useLayoutEffect, useState } from "react";
import styles from "./EditDescriptionModal.module.css";
import { ThemeContext } from "../../../contexts/ThemeProvider";
import { getSiteData, setSiteData } from "../../../utils/api";

export default function EditDescriptionModal({
  activeModal,
  closeModal,
}: {
  activeModal: string;
  closeModal: () => void;
}) {
  const { theme } = useContext(ThemeContext);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [cDesc, setCDesc] = useState<string>("");
  const [pDesc, setPDesc] = useState<string>("");
  const [vDesc, setVDesc] = useState<string>("");
  const [eDesc, setEDesc] = useState<string>("");

  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  useLayoutEffect(() => {
    if (activeModal === "edit-desc") {
      getSiteData()
        .then((res) => {
          if (res) {
            const data = res[0];
            setCDesc(data.clientWorkDescription);
            setPDesc(data.personalWorkDescription);
            setVDesc(data.veronikaWorkDescription);
            setEDesc(data.healthEnsuranceDescription);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [activeModal]);

  function checkFormValidity() {
    if (cDesc.length > 5 && pDesc.length > 5 && vDesc.length > 5 && eDesc.length > 5) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }

  function handleSubmitForm() {
    if (isFormValid) {
      setIsSubmitting(true);
      setSiteData({
        lastEdited: Date.now().toString(),
        veronikaWorkDescription: vDesc,
        clientWorkDescription: cDesc,
        personalWorkDescription: pDesc,
        healthEnsuranceDescription: eDesc,
      })
        .then((res) => {
          if (res.ok) closeModal();
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    }
  }

  useEffect(() => {
    checkFormValidity();
  }, [cDesc, pDesc, vDesc, eDesc]);

  return (
    <div
      className={`${styles["modal"]} ${styles[theme]} ${
        activeModal === "edit-desc" && styles["active"]
      }`}
    >
      <div className={styles["modal__content"]}>
        <div className={`${styles["close"]} `} onClick={closeModal}></div>
        <h1 className={styles["modal__heading"]}>Description Editor</h1>
        {isLoading ? (
          "loading.."
        ) : (
          <form className={styles["form"]}>
            <label className={styles["input-label"]}>
              Personal Work Description
              <textarea
                rows={5}
                onChange={(e) => {
                  setPDesc(e.target.value);
                }}
                value={pDesc}
              />
            </label>
            <label className={styles["input-label"]}>
              Client Work Description
              <textarea
                rows={5}
                onChange={(e) => {
                  setCDesc(e.target.value);
                }}
                value={cDesc}
              />
            </label>
            <label className={styles["input-label"]}>
              Veronika_iscool Work Description
              <textarea
                rows={5}
                onChange={(e) => {
                  setVDesc(e.target.value);
                }}
                value={vDesc}
              />
            </label>
            <label className={styles["input-label"]}>
              Health Ensurance Description
              <textarea
                rows={5}
                onChange={(e) => {
                  setEDesc(e.target.value);
                }}
                value={eDesc}
              />
            </label>
            <button
              disabled={!isFormValid}
              onClick={(e) => {
                e.preventDefault();
                handleSubmitForm();
              }}
              className={styles["button"]}
            >
              {isSubmitting ? "Confirming Changes..." : "Confirm Changes"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
