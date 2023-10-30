import "./App.css";
import { Stage, Sprite, Text } from "@pixi/react";
import background from "./images/background.webp";
import { Howl, Howler } from "howler";
import { Ball } from "./Ball";
import { useRef, useEffect, useState } from "react";
import React from "react";
import cloud from "./images/Cloud.png";
import board from "./images/scoreTable.webp";
import ReactHowler from "react-howler";
import gameMusic from "./sounds/game.mp3";
import goalSound from "./sounds/goal.mp3";
import goalPeople from "./sounds/goal-people.mp3";
import missSound from "./sounds/miss.mp3";
import { isMobile } from "react-device-detect";

export const GameScreen = ({
  width,
  height,
  onFinish,
  score,
  setScore,
  player,
}) => {
  // Гол! or Промах
  const [pause, setPause] = useState(false);
  const [key, setKey] = useState(0);
  const gameSoundRef = useRef();

  useEffect(() => {
    const gameSound = new Howl({
      src: [gameMusic],
      onplayerror: function () {
        gameSound.once("unlock", function () {
          gameSound.play();
        });
      },
      loop: true,
    });
    gameSoundRef.current = gameSound;
    gameSound.play();

    return () => {
      gameSound.stop();
    };
  }, []);

  const onGoal = () => {
    gameSoundRef.current.pause();
    const sound = new Howl({
      src: [goalPeople],
      volume: 0.5,
      onplayerror: function () {
        sound.once("unlock", function () {
          sound.play();
        });
      },
    });
    sound.play();
    setScore({ player: score.player + 1, keeper: score.keeper });

    setPause("Гол!");
  };

  const onMiss = () => {
    gameSoundRef.current.pause();
    const sound = new Howl({
      src: [missSound],
      sprite: {
        sound1: [500, 3000], // начало и длительность первого звука
        sound2: [4000, 2000], // начало и длительность второго звука
        sound3: [7000, 1000], // начало и длительность третьего звука
      },
      onplayerror: function () {
        sound.once("unlock", function () {
          sound.play("sound1");
        });
      },
    });
    sound.play("sound1");
    setScore({ player: score.player, keeper: score.keeper + 1 });

    setPause("Промах");
  };
  console.log(score);

  const generateKey = () => {
    setKey(
      score.keeper + Math.random() * 1000 + score.player + Math.random() * 1000
    );
    if (score.keeper === 5 || score.player === 5) {
      onFinish();
    }
    gameSoundRef.current.play();
    setPause(false);
  };

  return (
    <>
      <Stage
        onClick={!!pause ? generateKey : undefined}
        width={width}
        options={{ background: "#17771B" }}
        height={height + (isMobile ? 60 : 0)}
      >
        <Sprite
          position={{ y: 0 }}
          width={width}
          height={height}
          image={background}
        >
          <Sprite
            image={board}
            position={{ x: 300, y: 300 }}
            width={600}
            height={300}
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
          <Ball
            player={player}
            onGoal={onGoal}
            onMiss={onMiss}
            key={key}
            difficult={score.player + 1}
          ></Ball>
          {!!pause && (
            <Sprite
              image={cloud}
              position={{ x: 0, y: 1200 }}
              width={1200}
              height={800}
            >
              <Text
                anchor={0.5}
                position={{ x: 250, y: 180 }}
                style={{
                  fill: ["#192464"], // gradient
                  wordWrapWidth: 2231,
                  fontSize: 78,
                  fontFamily: "SofiaSansBold",
                  align: "right",
                }}
                text={pause}
              ></Text>
            </Sprite>
          )}
        </Sprite>
      </Stage>
    </>
  );
};
