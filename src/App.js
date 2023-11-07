import "./App.css";
import { Stage, Sprite } from "@pixi/react";
import background from "./images/background.webp";

import { Ball } from "./Ball";
import { useRef, useEffect, useState } from "react";
import { GameScreen } from "./GameScreen";
import { MenuScreen } from "./MenuScreen";
import { FinishScreen } from "./FinishScreen";
import { RatingScreen } from "./RatingScreen";

const defaultSize = {
  width: 600,
  height: 1200,
};

function App() {
  const [height, setHeight] = useState(defaultSize.height);
  const [width, setWidth] = useState(defaultSize.width);
  const [player, setPlayer] = useState();
  // menu or game or finish or rating
  const [screen, setScreen] = useState("menu");

  const [score, setScore] = useState({ player: 0, keeper: 0 });

  useEffect(() => {
    const handleResize = () => {
      const { innerWidth: width, innerHeight } = window;

      let height = innerHeight;
      if (width < defaultSize.width && height < defaultSize.height) {
        setHeight(height);
        setWidth(width < height * (9 / 16) ? width : height * (9 / 16));
      } else if (width < defaultSize.width) {
        setWidth(width);
        setHeight(width * (16 / 9));
      } else if (height < defaultSize.height) {
        setHeight(height);
        setWidth(height / (16 / 9));
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // вызываем функцию при первой загрузке страницы

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const changeScreen = (screen) => {
    if (screen === "game") {
      setScore({ keeper: 0, player: 0 });
    }
    setScreen(screen);
  };

  const onChoosePlayer = (player) => {
    setPlayer(player);
    changeScreen("game");
  };

  return (
    <div className="game-container">
      {screen === "menu" ? (
        <MenuScreen
          onPlay={onChoosePlayer}
          width={width}
          height={height}
        ></MenuScreen>
      ) : screen === "finish" ? (
        <FinishScreen
          player={player}
          onMain={changeScreen.bind(this, "menu")}
          score={score}
          width={width}
          height={height}
          onRating={changeScreen.bind(this, "rating")}
        />
      ) : screen === "rating" ? (
        <RatingScreen
          onMain={changeScreen.bind(this, "menu")}
          width={width}
          height={height}
        />
      ) : (
        <GameScreen
          player={player}
          score={score}
          setScore={setScore}
          onFinish={changeScreen.bind(this, "finish")}
          width={width}
          height={height}
          onHome={changeScreen.bind(this, "menu")}
        />
      )}
    </div>
  );
}

export default App;
