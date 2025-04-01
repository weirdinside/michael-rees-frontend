import { useState, useEffect, useContext, useCallback } from "react";
import { Link } from "react-router-dom";
import styles from "./Register.module.css";
import { ThemeContext } from "../../contexts/ThemeProvider";

export default function Register({
  handleRegister,
  isPending,
}: {
  handleRegister: (name: string, password: string, secret: string) => void;
  isPending: boolean;
}) {
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [verifyPassword, setVerifyPassword] = useState<string>("");
  const [secret, setSecret] = useState<string>("");

  const [showPasswords, setShowPasswords] = useState<boolean>(false);

  const [isFormValid, setFormValid] = useState<boolean>(false);



  function handleSubmit(e: React.MouseEvent) {
    e.preventDefault();
    return handleRegister(name, password, secret);
  }

  const checkFormValidity = useCallback(() => {
    if (name.length > 2 && password.length > 2 && secret.length > 2) {
      if (password === verifyPassword && password !== "") {
        return setFormValid(true);
      }
    }
    return setFormValid(false);
  }, [password, verifyPassword, name.length, secret.length]);

  useEffect(
    function checkValidityOnChange() {
      checkFormValidity();
    },
    [checkFormValidity, name, password, verifyPassword, secret]
  );

  const { theme } = useContext(ThemeContext);

  return (
    <div
      style={isPending ? { opacity: "0.5" } : { opacity: "1" }}
      className={`${styles["register"]} ${styles[theme]}`}
    >
      <form className={styles["register__form"]}>
        <h1 className={styles["register__heading"]}>
          who the fuck're <span style={{ fontWeight: "800" }}>Yew?</span>
        </h1>
        <label className={styles["register__field"]}>
          <input
            disabled={isPending}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            placeholder="name"
            type="text"
            className={`${styles["register__input"]}`}
          ></input>
        </label>
        <label className={styles["register__field"]}>
          <input
            disabled={isPending}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            type={showPasswords ? "text" : "password"}
            placeholder="password"
            className={`${styles["register__input"]} `}
          ></input>
        </label>
        <label className={styles["register__field"]}>
          <input
            disabled={isPending}
            value={verifyPassword}
            onChange={(e) => {
              setVerifyPassword(e.target.value);
            }}
            type={showPasswords ? "text" : "password"}
            placeholder="verify password"
            className={`${styles["register__input"]}`}
          ></input>
        </label>
        <label className={styles["register__field"]}>
          <input
            disabled={isPending}
            value={secret}
            onChange={(e) => {
              setSecret(e.target.value);
            }}
            type={showPasswords ? "text" : "password"}
            placeholder="secret phrase"
            className={`${styles["register__input"]} `}
          ></input>
        </label>
        <label>
          show password
          <input
            disabled={isPending}
            checked={showPasswords}
            onChange={() => {
              setShowPasswords((prev) => !prev);
            }}
            type="checkbox"
          ></input>
        </label>
        <button
          disabled={!isFormValid && isPending}
          className={`${styles["form__button"]} ${
            !isFormValid ? styles["disabled"] : ""
          }`}
          onClick={handleSubmit}
        >
          {isPending ? "registering..." : "register"}
        </button>
      </form>
      <Link style={{ textDecoration: "none", color: "black" }} to="/login">
        <p className={styles["login"]}>*</p>
      </Link>
    </div>
  );
}
