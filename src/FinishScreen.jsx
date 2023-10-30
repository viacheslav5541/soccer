import background from "./images/menu-background.webp";

import { isMobile } from "react-device-detect";
import keeper from "./images/finishKeeper.png";
import board from "./images/scoreTable.webp";
import "./App.css";
import { Sprite, Stage } from "@pixi/react";
export const FinishScreen = ({ width, height, score, onMain }) => {
  return (
    <div
      style={{
        width: `${width}px`,
        height: isMobile ? "100vh" : `${height}px`,
        maxWidth: `${width}px`,
        maxHeight: isMobile ? "100vh" : `${height}px`,
        backgroundImage: `url(${background})`,
        backgroundSize: `${width}px ${isMobile ? "100vh" : `${height}px`}`,
        position: "relative",
      }}
    >
      <div
        onClick={onMain}
        style={{ position: "absolute", top: 20, right: 20, cursor: "pointer" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="70"
          height="70"
          viewBox="0 0 70 70"
          fill="none"
        >
          <circle cx="35" cy="35" r="35" fill="white" />
          <mask
            id="mask0_1_619"
            maskUnits="userSpaceOnUse"
            x="12"
            y="12"
            width="46"
            height="46"
          >
            <rect
              x="12.6595"
              y="12.6596"
              width="44.6809"
              height="44.6809"
              fill="#D9D9D9"
            />
          </mask>
          <g mask="url(#mask0_1_619)">
            <path
              d="M23.8298 48.032V33.1384H21.252L35 20.7509L42.1604 27.2382V22.9706H45.1678V29.9019L48.748 33.1384H46.1702V48.032H37.2913V38.2939H32.7086V48.032H23.8298ZM25.6915 46.1703H30.8469V36.4322H39.153V46.1703H44.3085V31.649L35 23.2714L25.6915 31.649V46.1703ZM31.6346 31.2875H38.3654C38.3654 30.4139 38.0288 29.6949 37.3557 29.1304C36.6827 28.5659 35.8974 28.2836 35 28.2836C34.1026 28.2836 33.3173 28.5648 32.6442 29.1272C31.9711 29.6895 31.6346 30.4096 31.6346 31.2875Z"
              fill="#192464"
            />
          </g>
        </svg>
      </div>
      <div style={{ marginBottom: "20px" }} className="game-header">
        <span className="game-header-text first">Матч</span>
        <span className="game-header-text second">Окончен</span>
      </div>
      <Stage
        options={{ background: "#141C57" }}
        height={width / 3.5}
        width={width}
      >
        <Sprite
          image={board}
          width={width / 1.5}
          height={width / 3.5}
          position={{ x: width / 6, y: 0 }}
        >
          <Sprite
            width={120}
            height={210}
            position={{ x: 245, y: 250 }}
            image={require(`./images/numbers/${score.player}.png`)}
          ></Sprite>
          <Sprite
            width={120}
            height={210}
            position={{ x: 980, y: 250 }}
            image={require(`./images/numbers/${score.keeper}.png`)}
          ></Sprite>
        </Sprite>
      </Stage>
      <div
        style={{
          width: "100%",

          position: "absolute",
          bottom: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        {" "}
        <img height={height / 2.5} src={keeper}></img>{" "}
      </div>
    </div>
  );
};
