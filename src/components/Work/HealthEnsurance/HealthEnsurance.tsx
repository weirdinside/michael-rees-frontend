import styles from "./HealthEnsurance.module.css";

import HE1 from "../../../assets/health-ensurance-posters/HE1.png";
import HE2 from "../../../assets/health-ensurance-posters/HE2.jpeg";
import HE3 from "../../../assets/health-ensurance-posters/HE3.png";
import HE4 from "../../../assets/health-ensurance-posters/HE4.jpeg";
import HE5 from "../../../assets/health-ensurance-posters/HE5.png";
import HE5_1 from "../../../assets/health-ensurance-posters/HE5_1.png";
import HE6 from "../../../assets/health-ensurance-posters/HE6.png";
import HE7 from "../../../assets/health-ensurance-posters/HE7.png";
import HE7_1 from "../../../assets/health-ensurance-posters/HE7_1.png";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

export default function HealthEnsurance() {
  const events = [
    {
      title: "Health Ensurance Vol. 1",
      date: "February 22nd, 2022",
      poster: HE1,
      description:
        "Health Ensurance 1 was a good ass time bro. All my friends were there and it was so fuckin crazy! Here's a list of people that were there: Big Krit, Ja Rule, and Lord Alfred Tennyson",
      photos: [],
    },
    {
      title: "Health Ensurance Vol. 2",
      date: "September 8th, 2022",
      poster: HE2,
      description:
        "Health Ensurance 2 was a good ass time bro. All my friends were there and it was so fuckin crazy!",
      photos: [],
    },
    {
      title: "Health Ensurance Vol. 3",
      date: "April 27th, 2023",
      poster: HE3,
      description:
        "Health Ensurance 3 was a good ass time bro. All my friends were there and it was so fuckin crazy!",
      photos: [],
    },
    {
      title: "Health Ensurance Vol. 4",
      date: "November 1st, 2023",
      poster: HE4,
      description:
        "Health Ensurance 4 was a good ass time bro. All my friends were there and it was so fuckin crazy!",
      photos: [],
    },
    {
      title: "Health Ensurance Vol. 5 (New York)",
      date: "March 28th, 2024",
      poster: HE5,
      description:
        "Health Ensurance 5 was a good ass time bro. All my friends were there and it was so fuckin crazy!",
      photos: [],
    },
    {
      title: "Health Ensurance Vol. 5 (LA)",
      date: "May 16th, 2024",
      poster: HE5_1,
      description:
        "Health Ensurance 5.1 was a good ass time bro. All my friends were there and it was so fuckin crazy!",
      photos: [],
    },
    {
      title: "Health Ensurance Vol. 6",
      date: "September 11th, 2024",
      poster: HE6,
      description:
        "Health Ensurance 6 was a good ass time bro. All my friends were there and it was so fuckin crazy!",
      photos: [],
    },
    {
      title: "Health Ensurance Vol. 7",
      date: "March 20th, 2025",
      poster: HE7,
      description:
        "Health Ensurance 7 was a good ass time bro. All my friends were there and it was so fuckin crazy! Here's a list of people that were there: Big Krit, Ja Rule, and Lord Alfred Tennyson",
      photos: [],
    },
    {
      poster: HE7_1,
      date: "March 20th, 2025",
      description:
        "Health Ensurance 7 was a good ass time bro. All my friends were there and it was so fuckin crazy!",
      photos: [],
    },
  ];

  const marqueeRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>(null);

  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [initialMousePos, setInitialMousePos] = useState<number>(0);

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
    <div className={styles["health-ensurance"]}>
      <p className={styles["description"]}>
        Health Ensurance is a series of film screenings organized and
        orchestrated by Michael Rees. They have taken place in Los Angeles and
        New York at a variety of locations, and have featured the work of a
        variety of filmmakers and friends. This description could probably
        afford to be longer.
      </p>
      <div className={styles["draggable-marquee"]}>
        <div
          style={{ transform: `translateX(-${marqueeXPos}px)` }}
          ref={marqueeRef}
          className={styles["marquee-content"]}
          onPointerDown={(e) => {
            setIsClicked(true);
            setInitialMousePos(e.clientX);
            console.log("pointer down");
          }}
          onPointerUp={() => {
            setIsClicked(false);
            console.log("pointer up");
          }}
          onPointerMove={(e) => {
            if (isClicked) {
              calculateMovedAmount(e);
              console.log("pointer moved");
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
      {events.reverse().map((event, idx) => {
        if (event.title)
          return (
            <div key={idx} className={styles["event"]}>
              <h1 className={styles["event__title"]}>
                {event.title?.toUpperCase()}
              </h1>
              <h3 className={styles["event__date"]}>{event.date}</h3>
              <p className={styles["event__description"]}>
                {event.description}
              </p>
            </div>
          );
      })}
    </div>
  );
}
