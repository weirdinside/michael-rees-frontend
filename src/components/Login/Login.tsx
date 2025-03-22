import { useCallback, useContext, useState, useEffect } from "react";
import { ThemeContext } from "../../contexts/ThemeProvider";
import styles from "./Login.module.css";

export default function Login({
  handleSignOut,
  handleSignIn,
  isLoggedIn,
  isPending,
}: {
  handleSignOut: (e: React.MouseEvent) => void;
  handleSignIn: (name: string, password: string) => void;
  isPending: boolean;
  isLoggedIn: boolean;
}) {
  const { theme } = useContext(ThemeContext);
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isFormValid, setFormValidity] = useState<boolean>(false);

  function handleSubmit({ e }: { e?: React.MouseEvent }) {
    if (e) {
      e.preventDefault();
    }

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

  return (
    <div className={`${styles["page"]} ${styles[theme]}`}>
      {!isLoggedIn ? (
        <>
          <h1 className={styles["login__heading"]}>
            welcome back, <span style={{ fontWeight: "600" }}>michael</span>
          </h1>
          <form
            onSubmit={(e) => {
              handleSubmit(e);
            }}
            className={styles["login__form"]}
          >
            <input
              className={styles["login__input"]}
              type="text"
              value={name}
              placeholder="username"
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <input
              className={styles["login__input"]}
              type={showPassword ? "text" : "password"}
              placeholder="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <button
              className={styles["login__button"]}
              type="button"
              onClick={() => {
                setShowPassword((prev) => !prev);
              }}
            >
              {showPassword ? "hide" : "show"} password
            </button>
            <button
              disabled={!isFormValid || isPending}
              style={!isFormValid || isPending ? { opacity: "0.5" } : {}}
              className={styles["login__button"]}
              type="submit"
              onClick={(e) => {
                handleSubmit({ e });
              }}
            >
              {isPending ? "logging in.." : "login"}
            </button>
          </form>
        </>
      ) : (
        <>
          you're logged in. log out?
          <button onClick={handleSignOut} className={styles["login__button"]}>
            {isPending ? "logging out.." : "log out"}
          </button>
        </>
      )}
    </div>
  );
}
