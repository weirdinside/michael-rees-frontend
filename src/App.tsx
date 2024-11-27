import styles from "./App.module.css";

import { Routes, Route, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";

import Home from "./components/Home/Home";
import Work from "./components/Work/Work";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";

import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

import { signIn, register } from "./utils/auth";

export default function App() {
  const navigate = useNavigate();

  const [isPending, setIsPending] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isPopupActive, setPopupActive] = useState(false);

  let timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (localStorage.token) {
      setLoggedIn(true);
    }
  }, []);

  const setPopup = useCallback(() => {
    if(timer.current){
      clearTimeout(timer.current);
    }
    setPopupActive(true);
    timer.current = setTimeout(() => {
      setPopupActive(false);
    }, 2000);
  }, [isLoggedIn]);

  function handleSignIn(name: string, password: string) {
    setIsPending(true);
    signIn(name, password)
      .then((res) => {
        setLoggedIn(true);
        setPopup();
        navigate("/");
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsPending(false);
      });
  }

  async function handleRegister(
    name: string,
    password: string,
    secret: string,
  ) {
    register(name, password, secret)
      .then((res) => {
        return handleSignIn(res.name, password);
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function handleSignOut(e: React.MouseEvent) {
    e.preventDefault();
    localStorage.removeItem("token");
    console.log(localStorage.getItem("token"));
    setLoggedIn(false);
    setPopup();
    navigate("/login");
  }

  return (
    <div className={styles["page"]}>
      <div
        className={`${styles["login__notification"]} ${
          isPopupActive ? styles["active"] : ""
        }`}
      >
        {isLoggedIn ? "signed in" : "signed out"}
      </div>
      {isLoggedIn ? (
        <>
          <div
            onClick={(e) => {
              handleSignOut(e);
            }}
            className={styles["logout"]}
          >
            ➔
          </div>
        </>
      ) : null}

      <Routes>
        <Route path="/" element={<Home></Home>}></Route>
        <Route
          path="*"
          element={<p style={{ color: "black" }}>whoops, not found</p>}
        ></Route>
        <Route
          path="/work"
          element={<Work isLoggedIn={isLoggedIn}></Work>}
        ></Route>
        <Route
          path="/profile"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <></>
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path='/login'
          element={
            <Login isPending={isPending} handleSignIn={handleSignIn}></Login>
          }
        ></Route>
        <Route
          path="/register"
          element={
            <Register
              isPending={isPending}
              handleRegister={handleRegister}
            ></Register>
          }
        ></Route>
      </Routes>
    </div>
  );
}
