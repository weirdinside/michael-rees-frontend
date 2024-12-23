import React, { useCallback, useContext, useEffect, useState } from "react";
import styles from "./Login.module.css";
import { Link } from "react-router-dom";
import { ThemeContext } from "../../contexts/ThemeProvider";

export default function Login({
  isLoggedIn,
  isPending,
  handleSignIn,
}: {
  isLoggedIn: boolean;
  isPending: boolean;
  handleSignIn: (name: string, password: string) => void;
}) {
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isFormValid, setFormValidity] = useState<boolean>(false);

  function handleSubmit(e: React.MouseEvent) {
    e.preventDefault();
    handleSignIn(name, password);
  }

  const checkFormValidity = useCallback(() => {
    if (name.length > 2 && password.length > 2) {
      return setFormValidity(true);
    }
    return setFormValidity(false);
  }, [name.length, password.length]);

  useEffect(() => {
    checkFormValidity();
  }, [checkFormValidity, password, name]);

  const { isDarkMode } = useContext(ThemeContext);

  return (
    <div
      style={isPending ? { opacity: "0.5" } : { opacity: "1" }}
      className={`${styles["login"]} ${isDarkMode && styles["dark"]}`}
    >
      <Link style={{ color: "black", textDecoration: "none" }} to="/">
        <div className={styles["back"]}>⬅</div>
      </Link>
      <form className={styles["login__form"]}>
        <h1 className={styles["login__heading"]}>
          welcome back, <span style={{ fontWeight: "700" }}>michael</span>
        </h1>
        {!isLoggedIn && (
          <>
            <label className={styles["login__field"]}>
              <input
                disabled={isPending}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                placeholder="name"
                type="text"
                className={`${styles["login__input"]} ${
                  isDarkMode && styles["dark"]
                }`}
              ></input>
            </label>
            <label className={styles["login__field"]}>
              <input
                disabled={isPending}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                type={showPassword ? "text" : "password"}
                placeholder="******"
                className={`${styles["login__input"]} ${
                  isDarkMode && styles["dark"]
                }`}
              ></input>
            </label>
            <label>
              show password
              <input
                disabled={isPending}
                checked={showPassword}
                onChange={(e) => {
                  setShowPassword(e.target.checked);
                }}
                type="checkbox"
              ></input>
            </label>
            <button
              disabled={!isFormValid && isPending}
              className={styles["form__button"]}
              onClick={handleSubmit}
            >
              {isPending ? "logging in..." : "log in"}
            </button>
          </>
        )}
        {isLoggedIn && (
          <Link style={{ textDecoration: "none", color: "black" }} to="/work">
            <button className={styles["form__button"]}>work page</button>
          </Link>
        )}
      </form>
      <Link style={{ textDecoration: "none", color: "black" }} to="/register">
        <p className={styles["register"]}>*</p>
      </Link>
    </div>
  );
}
