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
import EditClientsModal from "./components/EditClientsModal/EditClientsModal";
import Login from "./components/Login/Login";
import Work from "./components/Work/Work";
import { ThemeContext } from "./contexts/ThemeProvider";
import { getSiteData } from "./utils/api";
import { signIn } from "./utils/auth";
// import Register from "./components/Register/Register";
import { LuAudioLines } from "react-icons/lu";
import AudioPlayer from "./components/AudioPlayer/AudioPlayer";
import EditDescriptionModal from "./components/Work/EditDescriptionModal/EditDescriptionModal";

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

  const [lastEdited, setLastEdited] = useState<string>("");

  function closeModal() {
    setActiveModal("");
  }

  // const handleRegister = async (
  //   name: string,
  //   password: string,
  //   secret: string
  // ) => {
  //   try {
  //     const signedUpUser = await register(name, password, secret);
  //     const signedInUser = await handleSignIn(signedUpUser.name, password);
  //     console.log(signedInUser);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

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

    setLoggedIn(false);
    closeModal();

    navigate("/login");
  }

  useLayoutEffect(() => {
    getSiteData().then((res) => {
      const timestamp = res[0].lastEdited / 1000;
      const date = new Date(timestamp * 1000);

      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      const getOrdinalSuffix = (day: number): string => {
        if (day >= 11 && day <= 13) return "th";
        switch (day % 10) {
          case 1:
            return "st";
          case 2:
            return "nd";
          case 3:
            return "rd";
          default:
            return "th";
        }
      };

      const month = months[date.getUTCMonth()];
      const day = date.getUTCDate();
      const year = date.getUTCFullYear();
      const formattedDate = `${month} ${day}${getOrdinalSuffix(day)}, ${year}`;
      setLastEdited(formattedDate);
    });

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
              ? { bottom: "20px", visibility: `visible`, pointerEvents: "all" }
              : { bottom: "20px", visibility: `hidden`, pointerEvents: "none" }
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
            setMenuOpen(false);
            setActiveModal("audio");
          }}
          style={
            menuOpen
              ? { visibility: `visible`, pointerEvents: "all" }
              : { visibility: `hidden`, pointerEvents: "none" }
          }
          className={styles["audio-sandwich"]}
        >
          <LuAudioLines size={20} />
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
              <button
                className={`${styles["button"]} ${
                  location.pathname === "/work" && styles["active"]
                }`}
              >
                Work
              </button>
            </Link>
            <Link to="/about">
              <button
                className={`${styles["button"]} ${
                  location.pathname === "/about" && styles["active"]
                }`}
              >
                {" "}
                About
              </button>
            </Link>
            <Link to="/contact">
              <button
                className={`${styles["button"]} ${
                  location.pathname === "/contact" && styles["active"]
                }`}
              >
                {" "}
                Contact
              </button>
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
          />
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
                 <Link to="/about">Michael Rees</Link> is{" "}
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
                  He has worked with many artists and brands, including{" "}
                  <TextTransition inline springConfig={presets.slow}>
                    {clients[cliIndex % clients.length]}
                  </TextTransition>
                </div>
                <div className={styles["body__cta"]}>
                  Click{" "}
                  <Link
                      onClick={() => {
                        setMenuOpen(false);
                      }}
                      to="/work"
                    >
                  <span className={`${styles["button"]} ${styles["cta"]}`}>

                      here
  
                  </span>{" "}
                  </Link>
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
            {Array(7)
              .fill(`Michael Rees 2025 © Last Edited: ${lastEdited} ◑ `)
              .join(" ")}
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
        <div
          onClick={() => {
            setActiveModal("audio");
          }}
          className={styles["audio-button"]}
        >
          <LuAudioLines size={50} />
        </div>
        {/* <Link to="/login">
          <div className={styles["login"]}>
            {isLoggedIn ? "Log out" : "Log in"}
          </div>
        </Link> */}
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
        <EditClientsModal activeModal={activeModal} closeModal={closeModal} />
      </div>
      <AudioPlayer activeModal={activeModal} closeModal={closeModal} />
      <EditDescriptionModal activeModal={activeModal} closeModal={closeModal} />
    </div>
  );
}
