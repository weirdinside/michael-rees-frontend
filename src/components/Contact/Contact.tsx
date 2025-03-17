import styles from "./Contact.module.css";

export default function Contact() {
  return (
    <div className={styles["page"]}>
      <p className={styles["contact_text"]}>instagram</p>

      <p className={styles["contact_text"]}>email</p>
      <p className={styles["contact_text"]}>vimeo</p>
    </div>
  );
}
