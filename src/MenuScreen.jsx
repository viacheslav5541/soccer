import background from "./images/menu-background.webp";

import { isMobile } from "react-device-detect";

import "./App.css";
import { useState } from "react";
import { players } from "./players";
export const MenuScreen = ({ width, height, onPlay }) => {
  const [choosePlayerScreen, setChooseScreen] = useState(false);
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
      <div className="game-header">
        <span className="game-header-text first">
          {" "}
          {choosePlayerScreen ? "Выберите" : "«ДИНАМО»"}
        </span>
        <span className="game-header-text second">
          {choosePlayerScreen ? "Вратаря" : "Матч"}
        </span>
        {choosePlayerScreen ? (
          players.map((item) => {
            return (
              <button
                style={{
                  marginBottom: "10px",
                  paddingLeft: "10px",
                  paddingRight: "10px",
                  justifyContent: "space-between",
                }}
                onClick={onPlay.bind(this, item)}
                className="gbutton"
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "30px" }}
                >
                  <img
                    style={{
                      border: "5px solid #070f4b",
                      borderRadius: "100px",
                      margin: "0",
                    }}
                    src={item.image}
                    className="player-image"
                  ></img>
                  <span className="player-name">{item.name}</span>
                </div>
                <PlayIcon></PlayIcon>
              </button>
            );
          })
        ) : (
          <button
            onClick={setChooseScreen.bind(this, true)}
            className="gbutton"
          >
            <span className="game-header-text header-button-text">Играть</span>
            <PlayIcon />
          </button>
        )}
      </div>
    </div>
  );
};

const PlayIcon = () => (
  <svg
    width="83"
    height="83"
    viewBox="0 0 83 83"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="41.5" cy="41.5" r="41.5" fill="#080F4B" />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M43.3564 55.4L61.0621 44.8144C61.5667 44.5151 61.9833 44.0879 62.2697 43.5759C62.5561 43.0639 62.7021 42.4853 62.6931 41.8988C62.684 41.3122 62.5202 40.7384 62.2182 40.2355C61.9161 39.7326 61.4866 39.3184 60.973 39.0349L32.9526 23.4221C32.4422 23.1373 31.8659 22.9918 31.2815 23.0004C30.6971 23.0089 30.1253 23.171 29.6234 23.4706C29.1215 23.7701 28.7073 24.1964 28.4224 24.7067C28.1375 25.2171 27.992 25.7934 28.0003 26.3778L28.4353 54.8117C28.4353 54.8117 28.4353 54.8117 28.4354 54.8117L28.4888 58.4662C28.4974 59.0508 28.6598 59.6228 28.9595 60.1247C29.2593 60.6266 29.6859 61.0408 30.1965 61.3255C30.7071 61.6103 31.2837 61.7556 31.8683 61.7468C32.4529 61.7381 33.0248 61.5756 33.5267 61.2757L43.3564 55.4ZM43.349 55.4C39.4008 55.3998 35.5169 55.2862 31.7171 55.0491C35.5169 55.2912 39.4008 55.4109 43.349 55.4Z"
      fill="#E5E3DB"
    />
  </svg>
);
