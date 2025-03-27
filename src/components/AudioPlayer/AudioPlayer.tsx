import { useState, useEffect, useRef, useContext } from "react";
import { Howl } from "howler";
import { MdPause, MdPlayArrow } from "react-icons/md";
import { VscLoading } from "react-icons/vsc";
import styles from "./AudioPlayer.module.css";
import { ThemeContext } from "../../contexts/ThemeProvider";

export default function AudioPlayer({
  activeModal,
  closeModal,
}: {
  activeModal: string;
  closeModal: () => void;
}) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [audioFile, setAudioFile] = useState<string>("");
  const webAudioSound = useRef<Howl>(null);
  const { theme } = useContext(ThemeContext);

  const [volume, setVolume] = useState<number>(0.5);

  useEffect(
    function initializeHowl() {
      webAudioSound.current = new Howl({
        src: [`audio/${audioFile}.mp3`],
        autoplay: true,
        onplay: () => {
          setIsPlaying(true);
        },
        onload: () => {
          setIsLoading(false);
        },
        onloaderror: () => {
          setIsLoading(false);
        },
        onpause: () => {
          setIsPlaying(false);
        },
        loop: true,
        preload: true,
      });
      return () => {
        setIsPlaying(false);
        if (webAudioSound.current) {
          Howler.unload();
          webAudioSound.current = null;
        }
      };
    },
    [audioFile, webAudioSound]
  );

  useEffect(() => {
    if (webAudioSound.current) webAudioSound.current.volume(volume);
  }, [volume, webAudioSound]);

  return (
    <div
      className={`${styles["audio-player"]} ${
        activeModal === "audio" && styles["active"]
      } ${styles[theme]}`}
    >
      <div className={styles["audio-player__content"]}>
        <div
          style={isLoading ? { display: "flex" } : { display: "none" }}
          className={styles["audio-player__loading"]}
        >
          <VscLoading className={styles["loading"]} color="white" />
          <VscLoading size={40} className={styles["loading2"]} color="white" />
          <VscLoading size={60} className={styles["loading3"]} color="white" />
        </div>
        <div className={`${styles["close"]} `} onClick={closeModal}></div>
        <h1 className={styles["audio-player__heading"]}>Ambiance</h1>
        <div className={styles["audio-player__settings"]}>
          <div className={styles["audio-player__select"]}>
            <p className={styles["select__title"]}>
              where would you like to be?
            </p>
            <select
              defaultValue={"default"}
              onChange={(e) => {
                setIsLoading(true);
                setAudioFile(e.target.value);
              }}
              className={styles["select__picker"]}
            >
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
              <option className={styles["select__option"]} value={"cafe"}>
                Cafe
              </option>
              <option className={styles["select__option"]} value={"highway"}>
                Highway
              </option>
              <option className={styles["select__option"]} value={"tundra"}>
                Tundra
              </option>
            </select>
            <label className={styles["volume__label"]}>
              Volume
              <input
                style={{
                  background: `linear-gradient(90deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 1) ${
                    volume * 100
                  }%, rgb(0, 0, 0) ${volume * 100}%)`,
                }}
                step={0.01}
                min={0}
                max={1}
                value={volume}
                onChange={(e) => {
                  setVolume(parseFloat(e.target.value));
                }}
                className={styles["volume"]}
                type="range"
              />
            </label>
          </div>
          <div
            onClick={() => {
              if (!isPlaying) webAudioSound.current!.play();
              if (isPlaying) webAudioSound.current!.pause();
            }}
            className={styles["play"]}
          >
            {isPlaying ? <MdPause size={30} /> : <MdPlayArrow size={30} />}
          </div>
        </div>
      </div>
    </div>
  );
}
