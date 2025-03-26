import { getSiteData, setSiteData } from "../../../utils/api";
import styles from "./ManageVeronikaModal.module.css";
import { useEffect, useState } from "react";

export default function ManageVeronikaModal({
  activeModal,
  closeModal,
}: {
  activeModal: string;
  closeModal: () => void;
}) {
  const [links, setLinks] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  async function sendVideoLinks() {
    setIsLoading(true);
    console.log(links.split(", "));
    setSiteData({
      veronikaVideos: links.split(", "),
      lastEdited: Date.now().toString(),
    })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
        closeModal();
      });
  }

  useEffect(() => {
    setIsLoading(true);
    getSiteData()
      .then((res) => {
        if (res) setLinks(res[0].veronikaVideos.join(", "));
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <div
      className={`${styles["modal"]} ${
        activeModal === "veronika" && styles["active"]
      }`}
    >
      <div className={styles["modal__content"]}>
        <button onClick={closeModal} className={`${styles["close"]}`}></button>
        <h1 className={styles["heading"]}>Manage</h1>
        <h2 className={styles["subheading"]}>
          Put the instagram links you'd like to showcase (in order), separated
          by commas. <br /> For example: [link], [link], [link]
        </h2>
        {isLoading ? (
          <>loading links...</>
        ) : (
          <textarea
            value={links}
            onChange={(e) => {
              setLinks(e.target.value.replace(/\n/g, ""));
            }}
            placeholder="instagram links"
            rows={6}
          ></textarea>
        )}

        <button
          onClick={(e) => {
            e.preventDefault();
            sendVideoLinks();
          }}
          className={styles["submit"]}
        >
          Confirm
        </button>
      </div>
    </div>
  );
}
