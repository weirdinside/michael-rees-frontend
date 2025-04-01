import { getSiteData, setSiteData } from "../../utils/api";
import styles from "./EditClientsModal.module.css";
import { useState, useEffect, useLayoutEffect } from "react";

export default function EditClientsModal({
  activeModal,
  closeModal,
}: {
  activeModal: string;
  closeModal: () => void;
}) {
  const [clientList, setClientList] = useState<string>("");
  const [initialClientList, setInitialClientList] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  function sendClientsToServer() {
    setIsLoading(true);
    setSiteData({
      homeClientList: clientList.split(", "),
      lastEdited: Date.now().toString(),
    })
      .then(() => {
        closeModal();
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  useEffect(
    function handleEscClose() {
      window.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          closeModal();
        }
      });

      return window.removeEventListener("keydown", () => {
        closeModal();
      });
    },
    [closeModal]
  );

  useEffect(() => {
    if (
      initialClientList === clientList ||
      !clientList.includes(",") ||
      !(clientList.split(", ").length > 2)
    ) {
      setIsFormValid(false);
    } else {
      setIsFormValid(true);
    }
  }, [clientList, initialClientList]);

  useLayoutEffect(() => {
    getSiteData()
      .then((res) => {
        const clients = res[0].homeClientList.join(", ");
        setClientList(clients);
        setInitialClientList(clients);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <div
      className={`${styles["ec-modal"]} ${
        activeModal === "client-edit" && styles["active"]
      }`}
    >
      <div className={styles["ec-modal__content"]}>
        <div onClick={closeModal} className={`${styles["modal__close"]}`}></div>
        <h1 className={styles["heading"]}>Edit Client List</h1>
        <p className={styles["description"]}>
          Enter clients you want to see on the homepage, separated by a single
          comma and a single space. <br /> For example: Mercedes Benz, Drake,
          Kanye West, Charli XCX, Ritt Momney, Cage The Elephant, Billie Eilish,
          Cardi B, Mulherin
        </p>
        <textarea
          className={styles["text-input"]}
          rows={5}
          value={clientList}
          onChange={(e) => {
            setClientList(e.target.value);
          }}
          placeholder="Make a list of clients separated by commas"
        />
        <button
          disabled={!isFormValid}
          onClick={() => {
            sendClientsToServer();
          }}
          className={styles["submit"]}
          type="button"
        >
          {isLoading ? "Sending..." : "Confirm"}
        </button>
      </div>
    </div>
  );
}
