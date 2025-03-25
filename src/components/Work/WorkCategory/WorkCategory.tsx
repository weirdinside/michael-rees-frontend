import { useContext } from "react";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { ThemeContext } from "../../../contexts/ThemeProvider";
import AutoscrollText from "../../AutoscrollText";
import styles from "./WorkCategory.module.css";

export default function WorkCategory({
  headingName,
  headingText,
  description,
  setMousedOverHeading,
  clickHeading,
  mousedOverHeading,
  activeBlock,
  children,
}: {
  headingName: string;
  headingText: string;
  description: string;
  setMousedOverHeading: (arg0: string) => void;
  clickHeading: (arg0: string) => void;
  mousedOverHeading: string;
  activeBlock: string | null;
  children?: React.ReactNode[] | React.ReactNode | string | undefined;
}) {
  const { theme } = useContext(ThemeContext);

  return (
    <div className={styles['category']}>
      <li
        style={
          activeBlock === headingName || activeBlock === null
            ? { maxHeight: "100px" }
            : {
                minHeight: '0px',
                maxHeight: "0px",
                padding: "0",
                border: "none",
                pointerEvents: "none",
              }
        }
        onMouseEnter={() => {
          setMousedOverHeading(headingName);
        }}
        onClick={() => {
          clickHeading(headingName);
        }}
        onMouseLeave={() => {
          setMousedOverHeading("");
        }}
        className={`${styles["list__item"]} ${styles[theme]} ${
          activeBlock === headingName && styles["active"]
        }`}
      >
        <p className={styles["title"]}>{headingText}</p>
        <div className={styles["description"]}>
          {activeBlock === null && (
            <AutoscrollText
              scrollSpeed={2}
              trigger={mousedOverHeading === headingName}
            >
              {description}
            </AutoscrollText>
          )}
          {activeBlock === headingName && (
            <IoArrowBackCircleOutline size={50} />
          )}
        </div>
        <p
          style={activeBlock === headingName ? { rotate: "90deg" } : {}}
          className={styles["arrow"]}
        >
          ▶
        </p>
      </li>
      <div
        style={
          activeBlock === headingName
            ? { maxHeight: "min-content", opacity: "1" }
            : { maxHeight: "0px", margin: "0", opacity: "0" }
        }
        className={styles["content"]}
      >
        {activeBlock === headingName && children}
      </div>
    </div>
  );
}
