import { useContext, useEffect, useLayoutEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import {
  Link,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import TextTransition, { presets } from "react-text-transition";
import styles from "./App.module.css";
import About from "./components/About/About";
import Contact from "./components/Contact/Contact";
import Login from "./components/Login/Login";
import Work from "./components/Work/Work";
import { ThemeContext } from "./contexts/ThemeProvider";
import { signIn } from "./utils/auth";
import EditClientsModal from "./components/EditClientsModal/EditClientsModal";
import { getSiteData } from "./utils/api";
// import Register from "./components/Register/Register";
import { register } from "./utils/auth";

export default function App() {
  const { theme, toggleColorMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  const [backgroundColor, setBackgroundColor] = useState<string>("");

  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const [isPending, setIsPending] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(false);

  const [activeModal, setActiveModal] = useState<string>("");

  const occupations = ["a director", "an editor", "a filmmaker", "a writer"];
  // const locations = ["New York", "Los Angeles"];

  const [clients, setClients] = useState<string[]>([
    "Mercedes Benz",
    "Drake",
    "Kanye West",
    "Charli XCX",
    "Ritt Momney",
    "Cage The Elephant",
    "Billie Eilish",
    "Cardi B",
    "Mulherin",
  ]);

  const [occIndex, setOccIndex] = useState(0);
  // const [locIndex, setLocIndex] = useState(0);
  const [cliIndex, setCliIndex] = useState(0);

  function closeModal() {
    setActiveModal("");
  }

  const handleRegister = async (
    name: string,
    password: string,
    secret: string
  ) => {
    try {
      const signedUpUser = await register(name, password, secret);
      const signedInUser = await handleSignIn(signedUpUser.name, password);
      console.log(signedInUser);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSignIn = async (name: string, password: string) => {
    setIsPending(true);
    try {
      await signIn(name, password);
      setLoggedIn(true);
      navigate("/");
    } catch (err) {
      console.error(err);
    } finally {
      setIsPending(false);
    }
  };

  function handleSignOut(e: React.MouseEvent) {
    e.preventDefault();
    localStorage.removeItem("token");

    console.log(localStorage.getItem("token"));
    setLoggedIn(false);
    closeModal();

    navigate("/login");
  }

  useLayoutEffect(() => {
    if (localStorage.token) {
      setLoggedIn(true);
    }
    getSiteData().then((res) => {
      setClients(res[0].homeClientList);
    });
  }, []);

  useEffect(() => {
    if (theme === "light") setBackgroundColor("white");
    if (theme === "blue") setBackgroundColor("#002db3");
    if (theme === "dark") setBackgroundColor("#101010");
  }, [theme]);

  useEffect(function initialize() {
    const occInterval = setInterval(
      () => setOccIndex((index) => index + 1),
      3000
    );

    const cliIndex = setInterval(() => setCliIndex((index) => index + 1), 2400);

    // const locInterval = setInterval(
    //   () => setLocIndex((index) => index + 1),
    //   4000
    // );

    return () => {
      clearTimeout(occInterval);
      // clearTimeout(locInterval);
      clearTimeout(cliIndex);
    };
  }, []);

  return (
    <div className={`${styles["page"]} ${styles[theme]}`}>
      <div className={styles["page__content"]}>
        <div
          style={
            menuOpen
              ? { visibility: `visible`, pointerEvents: "all" }
              : { visibility: `hidden`, pointerEvents: "none" }
          }
          onClick={toggleColorMode}
          className={styles["theme-picker"]}
        >
          Theme
        </div>
        <div
          onClick={(e) => {
            handleSignOut(e);
            setMenuOpen(false);
          }}
          style={
            menuOpen && isLoggedIn
              ? { visibility: `visible`, pointerEvents: "all" }
              : { visibility: `hidden`, pointerEvents: "none" }
          }
          className={styles["logout-sandwich"]}
        >
          Log out
        </div>
        <div
          onClick={() => {
            setActiveModal("client-edit");
            setMenuOpen(false);
          }}
          style={
            menuOpen && isLoggedIn
              ? { visibility: `visible`, pointerEvents: "all" }
              : { visibility: `hidden`, pointerEvents: "none" }
          }
          className={styles["clients-sandwich"]}
        >
          Edit Clients
        </div>
        <div
          onClick={(e) => {
            const target = e.target as HTMLElement;
            if (
              target.classList.contains(styles["menu"]) &&
              target.classList.contains(styles["open"])
            ) {
              setMenuOpen(false);
            }
          }}
          className={`${styles["menu"]} ${menuOpen && styles["open"]}`}
        >
          <h2
            style={
              location.pathname === "/" ? { textDecoration: "underline" } : {}
            }
            className={styles["menu__option"]}
          >
            <Link
              onClick={() => {
                setMenuOpen(false);
              }}
              to="/"
            >
              Home
            </Link>
          </h2>
          <h2
            style={
              location.pathname === "/work"
                ? { textDecoration: "underline" }
                : {}
            }
            className={styles["menu__option"]}
          >
            <Link
              onClick={() => {
                setMenuOpen(false);
              }}
              to="/work"
            >
              Work
            </Link>
          </h2>
          <h2
            style={
              location.pathname === "/about"
                ? { textDecoration: "underline" }
                : {}
            }
            className={styles["menu__option"]}
          >
            <Link
              onClick={() => {
                setMenuOpen(false);
              }}
              to="/about"
            >
              About
            </Link>
          </h2>
          <h2
            style={
              location.pathname === "/contact"
                ? { textDecoration: "underline" }
                : {}
            }
            className={styles["menu__option"]}
          >
            <Link
              onClick={() => {
                setMenuOpen(false);
              }}
              to="/contact"
            >
              Contact
            </Link>
          </h2>
        </div>
        <header className={styles["header"]}>
          <h1 className={styles["header__main"]}>
            <Link to="/">Michael Rees</Link>
          </h1>
          <div
            onClick={() => {
              setMenuOpen((prev) => !prev);
            }}
            className={styles["hamburger"]}
          >
            <div
              className={`${styles["ham"]} ${styles["one"]} ${
                menuOpen && styles["open"]
              }`}
            />
            <div
              className={`${styles["ham"]} ${styles["two"]} ${
                menuOpen && styles["open"]
              }`}
            />
            <div
              className={`${styles["ham"]} ${styles["three"]} ${
                menuOpen && styles["open"]
              }`}
            />
          </div>
          <div className={styles["buttons"]}>
            <Link to="/work">
              <button className={styles["button"]}>Work</button>
            </Link>
            <Link to="/about">
              <button className={styles["button"]}> About</button>
            </Link>
            <Link to="/contact">
              <button className={styles["button"]}> Contact</button>
            </Link>
          </div>
        </header>
        <Routes>
          <Route
            path="/login"
            element={
              <Login
                handleSignOut={handleSignOut}
                isLoggedIn={isLoggedIn}
                isPending={isPending}
                handleSignIn={handleSignIn}
              />
            }
          ></Route>
          {/* <Route
            path="/register"
            element={
              <Register handleRegister={handleRegister} isPending={isPending} />
            }
          ></Route> */}
          <Route path="*" element={<>not found</>}></Route>
          <Route
            path="/"
            element={
              <main className={styles["body"]}>
                <div className={styles["body__about"]}>
                  Michael Rees is{" "}
                  <TextTransition inline springConfig={presets.slow}>
                    {occupations[occIndex % occupations.length]}
                  </TextTransition>
                  <br />
                  living in New York.
                  {/* <TextTransition inline springConfig={presets.slow}>
                    {locations[locIndex % locations.length]}
                  </TextTransition> */}
                </div>
                <div className={styles["body__work"]}>
                  He has worked with many artists and companies, including{" "}
                  <TextTransition inline springConfig={presets.slow}>
                    {clients[cliIndex % clients.length]}
                  </TextTransition>
                </div>
                <div className={styles["body__cta"]}>
                  Click{" "}
                  <span className={`${styles["button"]} ${styles["cta"]}`}>
                    <Link
                      onClick={() => {
                        setMenuOpen(false);
                      }}
                      to="/work"
                    >
                      here
                    </Link>
                  </span>{" "}
                  to see his work.
                </div>
              </main>
            }
          />
          <Route
            path="/work"
            element={
              <Work
                activeModal={activeModal}
                closeModal={closeModal}
                setActiveModal={setActiveModal}
                isLoggedIn={isLoggedIn}
              />
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>

        <footer className={styles["footer"]}>
          <Marquee
            className={styles["footer-copyright-slider"]}
            gradient
            gradientWidth={20}
            gradientColor={backgroundColor}
            autoFill
            speed={20}
            pauseOnHover
          >
            {Array(7).fill("Michael Rees 2025 ©").join(" ")}
          </Marquee>
        </footer>
        {isLoggedIn ? (
          <>
            <div
              onClick={(e) => {
                handleSignOut(e);
              }}
              className={`${styles["logout"]}`}
            >
              ➔
            </div>
          </>
        ) : null}
        <div onClick={toggleColorMode} className={styles["theme-picker"]}>
          Theme
        </div>
        <Link to="/login">
          <div className={styles["login"]}>Log In</div>
        </Link>
        {isLoggedIn && (
          <div
            onClick={() => {
              setActiveModal("client-edit");
            }}
            className={styles["edit-clients"]}
          >
            Edit clients
          </div>
        )}
        <div className={styles["audio-button"]} />
        <EditClientsModal activeModal={activeModal} closeModal={closeModal} />
        <div className={styles["audio-player"]}>
          <h1 className={styles["audio-player__heading"]}>Ambiance</h1>
          <div className={styles["audio-player__settings"]}>
            <div className={styles["audio-player__select"]}>
              <p className={styles["select__title"]}>
                where would you like to be?
              </p>
              <select className={styles["select__picker"]}>
                <option
                  className={styles["select__option"]}
                  disabled
                  value={"default"}
                >
                  select an ambiance...
                </option>
                <option className={styles["select__option"]} value={"forest"}>
                  Forest
                </option>
                <option className={styles["select__option"]} value={"campfire"}>
                  Campfire
                </option>
                <option className={styles["select__option"]} value={"forest"}>
                  Cafe
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
