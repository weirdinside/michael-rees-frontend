import styles from "./App.module.css";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import Work from "./components/Work/Work";

export default function App() {
  return (
    <div className={styles["page"]}>
      <Routes>
        <Route path="/" element={<Home></Home>}></Route>
        <Route path="*" element={<p style={{color: 'black'}}>whoops, not found</p>}></Route>
        <Route path="/work" element={<Work></Work>}></Route>
      </Routes>
    </div>
  );
}
