import styles from "./App.module.css";

import { Routes, Route, useNavigate } from "react-router-dom";
import { useCallback, useContext, useEffect, useRef, useState } from "react";

import Home from "./components/Home/Home";
import Work from "./components/Work/Work";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";

import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

import { signIn, register } from "./utils/auth";
import Contact from "./components/Contact/Contact";

import { ThemeContext, ThemeProvider } from "./contexts/ThemeProvider";

export default function App() {
  // -------------------------------- //
  //         STATES / VARIABLES       //
  // -------------------------------- //

  const [isPending, setIsPending] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isPopupActive, setPopupActive] = useState(false);

  const [popupMessage, setPopupMessage] = useState("");

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // -------------------------------- //
  //          EVENT HANDLERS          //
  // -------------------------------- //

  const setPopup = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    setPopupActive(true);
    timer.current = setTimeout(() => {
      setPopupActive(false);
      setPopupMessage("");
    }, 2000);
  }, [isLoggedIn]);

  const handleSignIn = async (name: string, password: string) => {
    setIsPending(true);
    try {
      await signIn(name, password);
      setLoggedIn(true);
      setPopupMessage("signed in");
      setPopup();
      navigate("/");
    } catch (err) {
      console.error(err);
    } finally {
      setIsPending(false);
    }
  };

  const handleRegister = async (
    name: string,
    password: string,
    secret: string,
  ) => {
    try {
      const signedUpUser = await register(name, password, secret);
      const signedInUser = await handleSignIn(signedUpUser.name, password);
      console.log(signedInUser);
    } catch (err) {
      console.error(err);
    }
  };

  function handleSignOut(e: React.MouseEvent) {
    e.preventDefault();
    localStorage.removeItem("token");
    setPopupMessage("signed out");
    console.log(localStorage.getItem("token"));
    setLoggedIn(false);
    setPopup();
    navigate("/login");
  }

  // -------------------------------- //
  //               HOOKS              //
  // -------------------------------- //

  const navigate = useNavigate();
  const {isDarkMode, toggleColorMode} = useContext(ThemeContext)

  useEffect(() => {
    if (localStorage.token) {
      setLoggedIn(true);
    }
  }, []);

  return (
      <div className={styles["page"]}>
        <div onClick={()=>{
          toggleColorMode();
        }} className={`${styles['theme__toggle']} ${isDarkMode && styles['dark']}`}></div>
        <div
          className={`${styles["login__notification"]} ${
            isPopupActive ? styles["active"] : ""
          }`}
        >
          {popupMessage}
        </div>
        {isLoggedIn ? (
          <>
            <div
              onClick={(e) => {
                handleSignOut(e);
              }}
              className={`${styles["logout"]} ${isDarkMode && styles['dark']}`}
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
          <Route path="/contact" element={<Contact></Contact>}></Route>
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
            path="/login"
            element={
              <Login isLoggedIn={isLoggedIn} isPending={isPending} handleSignIn={handleSignIn}></Login>
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
