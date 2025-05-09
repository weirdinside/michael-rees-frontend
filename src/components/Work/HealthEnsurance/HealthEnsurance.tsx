import styles from "./HealthEnsurance.module.css";

import HE1 from "../../../assets/health-ensurance-posters/HE1.png";
import HE2 from "../../../assets/health-ensurance-posters/HE2.jpeg";
import HE3 from "../../../assets/health-ensurance-posters/HE3.png";
import HE4 from "../../../assets/health-ensurance-posters/HE4.jpeg";
import HE5 from "../../../assets/health-ensurance-posters/HE5.png";
import HE6 from "../../../assets/health-ensurance-posters/HE6.png";
import HE7 from "../../../assets/health-ensurance-posters/HE7.png";
import HE7_1 from "../../../assets/health-ensurance-posters/HE7_1.png";
import {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { getSiteData } from "../../../utils/api";
import { ThemeContext } from "../../../contexts/ThemeProvider";

export default function HealthEnsurance({
  isLoggedIn,
  setActiveModal,
}: {
  isLoggedIn: boolean;
  setActiveModal: (arg0: string) => void;
}) {
  const events = [
    {
      title: "Health Ensurance Vol. 1",
      date: "February 22nd, 2022",
      poster: HE1,
      photos: [],
    },
    {
      title: "Health Ensurance Vol. 2",
      date: "September 8th, 2022",
      poster: HE2,
      photos: [],
    },
    {
      title: "Health Ensurance Vol. 3",
      date: "April 27th, 2023",
      poster: HE3,
      photos: [],
    },
    {
      title: "Health Ensurance Vol. 4",
      date: "November 1st, 2023",
      poster: HE4,
      photos: [],
    },
    {
      title: "Health Ensurance Vol. 5 (New York)",
      date: "March 28th, 2024",
      poster: HE5,
      photos: [],
    },
    // {
    //   title: "Health Ensurance Vol. 5 (LA)",
    //   date: "May 16th, 2024",
    //   poster: HE5_1,
    //   photos: [],
    // },
    {
      title: "Health Ensurance Vol. 6",
      date: "September 11th, 2024",
      poster: HE6,
      photos: [],
    },
    {
      title: "Health Ensurance Vol. 7",
      date: "March 20th, 2025",
      poster: HE7,
      photos: [],
    },
    {
      poster: HE7_1,
      date: "March 20th, 2025",
      photos: [],
    },
  ];

  const marqueeRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>(null);
  const [description, setDescription] = useState<string>("");

  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [initialMousePos, setInitialMousePos] = useState<number>(0);

  const { theme } = useContext(ThemeContext);

  const [marqueeXPos, setMarqueeXPos] = useState<number>(0);

  function calculateXPos() {
    if (!marqueeRef.current) return;
    const initialXPos = marqueeRef.current.offsetWidth / 3;
    setMarqueeXPos(initialXPos);
    return initialXPos;
  }

  function calculateMovedAmount(e: React.PointerEvent<HTMLDivElement>) {
    setInitialMousePos(e.clientX);
    setMarqueeXPos((prev) => prev - (e.clientX - initialMousePos));
  }

  useLayoutEffect(() => {
    calculateXPos();
    getSiteData().then((res) => {
      if (res) setDescription(res[0].healthEnsuranceDescription);
    });
  }, []);

  useEffect(() => {
    if (!marqueeRef.current) return;

    const animate = () => {
      if (!marqueeRef.current || isClicked) return;

      const width = marqueeRef.current.offsetWidth;
      const trueMiddle = width / 2;
      const firstMiddle = width / 6;

      setMarqueeXPos((prev) => {
        if (prev >= trueMiddle) {
          return firstMiddle;
        } else {
          return prev + 0.5;
        }
      });
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isClicked, window.innerWidth]);

  return (
    <div className={`${styles["health-ensurance"]} ${styles[theme]}`}>
      {isLoggedIn && (
        <div className={styles["options"]}>
          <p className={styles["options__text"]}>
            Hey Michael! Since you're logged in: do you want to...
          </p>
          <div className={styles["options__buttons"]}>
            <button
              onClick={() => {
                setActiveModal("edit-desc");
              }}
              className={styles["options__button"]}
            >
              Edit Description
            </button>
          </div>
        </div>
      )}
      <p className={styles["description"]}>{description}</p>
      <div className={styles["draggable-marquee"]}>
        <div
          style={{ transform: `translateX(-${marqueeXPos}px)` }}
          ref={marqueeRef}
          className={styles["marquee-content"]}
          onPointerDown={(e) => {
            setIsClicked(true);
            setInitialMousePos(e.clientX);
          }}
          onPointerUp={() => {
            setIsClicked(false);
          }}
          onPointerMove={(e) => {
            if (isClicked) {
              calculateMovedAmount(e);
            }
          }}
        >
          {[...Array(3)].map((_, i) =>
            events.map((event, index) => (
              <div
                key={`${i}-${index}`}
                style={{ backgroundImage: `url(${event.poster})` }}
                className={styles["poster"]}
              />
            ))
          )}
        </div>
      </div>
      {/* {events.reverse().map((event, idx) => {
        if (event.title)
          return (
            <div key={idx} className={styles["event"]}>
              <h1 className={styles["event__title"]}>
                {event.title?.toUpperCase()}
              </h1>
              <h3 className={styles["event__date"]}>{event.date}</h3>
            </div>
          );
      })} */}
    </div>
  );
}
