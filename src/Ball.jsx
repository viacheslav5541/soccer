import { Stage, Container, Sprite, useTick, useApp, Text } from "@pixi/react";
import background from "./images/background.webp";
import ball from "./images/ball.png";
import ballPlace from "./images/ball-place.png";
import arrow from "./images/arrow-up.png";
import keeper from "./images/keeper.png";
import box from "./images/box.webp";
import { useEffect, useRef, useState } from "react";
import kickSound from "./sounds/kick.mp3";
import { createColoredSprite } from "./AppSprite";
import { Howl, Howler } from "howler";
import playerArrow from "./images/playerarrow.png";
const hitTestRectangle = (r1, r2) => {
  // Проверяем наличие пересечения по осям X и Y
  const hitX = r1.x + r1.width > r2.x && r1.x < r2.x + r2.width;
  const hitY = r1.y + r1.height > r2.y && r1.y < r2.y + r2.height;

  // Возвращаем true, если есть пересечение по обеим осям, иначе false
  return hitX && hitY;
};

const calculateKeeperPosition = (angle) => {
  const maxAngle = 1.5;
  const minAngle = -1.5;
  const maxPosition = 1000;
  const minPosition = 0;

  // Рассчитываем позицию вратаря на основе угла поворота стрелки
  const k = (maxPosition - minPosition) / (maxAngle - minAngle);
  const position = k * (angle - minAngle) + minPosition;

  return position - Math.floor(Math.random() * (200 - -200 + 1)) + -200;
};

const arrowParameters = {
  y: 2200,
  x: 500,
  width: 100,
  height: 250,
};

const ballPlaceParameters = {
  y: 2250,
  x: 350,
  width: 400,
  height: 80,
};

const ballParameters = {
  width: 150,
  height: 150,
  y: 2140,
  x: 475,
};

const gateParameters = {
  width: 1000,
  height: 550,
  x: 100,
  y: 850,
};

const keeperParameters = {
  width: 220,
  height: 360,
  y: 1200,
  x: 550,
};

export const Ball = ({ onGoal, onMiss, player, score }) => {
  const [isRunning, setIsRunning] = useState(false);

  const [arrowRotate, setArrowRotation] = useState(Math.random() * 3 - 1.5);
  const [velosity, setVelosity] = useState({ vx: 0, vy: 0 });
  const [ballPostiton, setBallPosition] = useState({
    y: ballParameters.y,
    x: ballParameters.x,
  });

  const [keeperPosition, setKeeperPosition] = useState(
    calculateKeeperPosition(arrowRotate)
  ); // начальная позиция вратаря

  // right=1 left=-1
  const [keeperDirection, setKeeperDirection] = useState(1); // начальное направление движения
  const [arrowDirection, setArrowDirection] = useState(1);

  const difficult = score.player + 1;
  const arrowSpeed = 1.6 + difficult / 5;

  const calculateBallScale = () => {
    // рассчитываем масштаб мяча на основе его позиции относительно ворот
    const scaleFactor =
      1.8 -
      (ballParameters.y - ballPostiton.y) /
        (ballParameters.y - gateParameters.y);
    return scaleFactor > 0 ? scaleFactor : 0; // масштаб не может быть отрицательным
  };

  useEffect(() => {
    setTimeout(() => setIsRunning(true), 100);
  }, []);

  function launchBall(event) {
    if (velosity.vx !== 0 || velosity.vy !== 0) {
      return;
    }
    if (!isRunning) return;

    const sound = new Howl({
      src: [kickSound],
      onplayerror: function () {
        sound.once("unlock", function () {
          sound.play();
        });
      },
    });
    sound.play();
    // Проверяем, что нажата клавиша пробел
    // Получаем угол наклона стрелки
    const arrowAngle = arrowRotate;

    // Вычисляем горизонтальную и вертикальную скорость мяча на основе угла наклона
    const speed = 30; // Задайте желаемую скорость мяча
    const velocityX = Math.sin(arrowAngle) * speed;
    const velocityY = -Math.cos(arrowAngle) * speed;

    // Запускаем мяч, устанавливая его скорость
    setVelosity({ vx: velocityX, vy: velocityY });
  }

  // useEffect(() => {
  //   function launchBall(event) {
  //     if (!isRunning) return;

  //     const sound = new Howl({
  //       src: [kickSound],
  //       onplayerror: function () {
  //         sound.once("unlock", function () {
  //           sound.play();
  //         });
  //       },
  //     });
  //     sound.play();
  //     // Проверяем, что нажата клавиша пробел
  //     // Получаем угол наклона стрелки
  //     const arrowAngle = arrowRotate;

  //     // Вычисляем горизонтальную и вертикальную скорость мяча на основе угла наклона
  //     const speed = 30; // Задайте желаемую скорость мяча
  //     const velocityX = Math.sin(arrowAngle) * speed;
  //     const velocityY = -Math.cos(arrowAngle) * speed;

  //     // Запускаем мяч, устанавливая его скорость
  //     setVelosity({ vx: velocityX, vy: velocityY });
  //   }

  //   window.addEventListener("click", launchBall);

  //   return () => window.removeEventListener("click", launchBall);
  // }, [arrowRotate]);

  const calculateBall = (delta) => {
    if (velosity.vx || velosity.vy) {
      ballPostiton.x += velosity.vx * delta;
      ballPostiton.y += velosity.vy * delta;
      setBallPosition(ballPostiton);
    }
  };

  const calculateArrow = (delta) => {
    let rotation = arrowRotate;
    // Изменение угла вращения на каждом кадре
    const speed = arrowSpeed;
    if (arrowDirection === 1) rotation += ((delta * Math.PI) / 180) * speed;
    else rotation -= ((delta * Math.PI) / 180) * speed;

    // Ограничение угла вращения до максимума в 70 градусов вправо и влево
    if (rotation > (Math.PI / 180) * 60) {
      rotation = (Math.PI / 180) * 60;
    } else if (rotation < -(Math.PI / 180) * 60) {
      rotation = -(Math.PI / 180) * 60;
    }

    // Переключение направления вращения при достижении максимального угла
    if (rotation >= (Math.PI / 180) * 60 || rotation <= -(Math.PI / 180) * 60) {
      setArrowDirection((direction) => (direction === 1 ? -1 : 1));
    }
    setArrowRotation(rotation);
  };

  const calculateKeeper = (delta) => {
    const speed = arrowSpeed * 8;
    if (keeperDirection === 1) {
      if (keeperPosition >= 1000) {
        setKeeperDirection(-1);
      } else {
        setKeeperPosition(keeperPosition + delta * speed);
      }
    } else {
      if (keeperPosition <= 0) {
        setKeeperDirection(1);
      } else {
        setKeeperPosition(keeperPosition - delta * speed);
      }
    }
  };

  // const calculateKeeper = (delta) => {
  //   const speed = 8;
  //   if (arrowDirection === 1) {
  //     setKeeperDirection(-1);
  //     if (keeperPosition >= 1000) {
  //       setKeeperDirection(-1);
  //     } else {
  //       setKeeperPosition(keeperPosition + delta * speed);
  //     }
  //   } else {
  //     setKeeperDirection(1);
  //     if (keeperPosition <= 0) {
  //       setKeeperDirection(1);
  //     } else {
  //       setKeeperPosition(keeperPosition - delta * speed);
  //     }
  //   }
  // };

  const checkMiss = () => {
    return (
      hitTestRectangle(
        { ...ballParameters, ...ballPostiton },
        { ...keeperParameters, x: keeperPosition }
      ) ||
      ballPostiton.x < -200 ||
      ballPostiton.x > 1400
    );
  };

  const checkGoal = () => {
    return hitTestRectangle(gateParameters, {
      ...ballParameters,
      ...ballPostiton,
    });
  };

  useTick((delta) => {
    if (checkMiss()) {
      setIsRunning(false);
      onMiss();
      console.log("fail");
    } else if (checkGoal()) {
      setTimeout(() => setIsRunning(false), 0);

      // чтобы мячик пролетел подальше после гола
      for (let i = 1; i <= 5; i++) {
        calculateBall(delta * i);
      }
      onGoal();
      console.log("success");
    }
    calculateKeeper(delta);
    // Перемещение мяча на каждом кадре
    calculateBall(delta);
    //Изменение Позиции стрелки
    calculateArrow(delta);
  }, isRunning);

  return (
    <>
      {/* <Sprite
        x={gateParameters.x}
        y={gateParameters.y}
        image={box}
        width={gateParameters.width}
        height={gateParameters.height}
      /> */}
      <Sprite
        y={344}
        image={box}
        width={1200}
        height={2000}
        onpointerdown={launchBall}
        alpha={0}
        interactive={true}
      />
      <Sprite
        position={{ y: keeperParameters.y - 180, x: keeperPosition + 25 }}
        width={125}
        height={165}
        image={playerArrow}
      >
        <Sprite
          width={60}
          height={60}
          position={{ x: 5, y: 5 }}
          image={player.image}
        ></Sprite>
      </Sprite>
      <Sprite
        position={{ y: keeperParameters.y + difficult * 20, x: keeperPosition }}
        width={keeperParameters.width}
        height={keeperParameters.height}
        image={keeper}
      ></Sprite>
      <Sprite
        anchor={{ x: 0, y: 2 }}
        rotation={arrowRotate}
        position={{ y: arrowParameters.y, x: arrowParameters.x }}
        width={arrowParameters.width}
        height={arrowParameters.height}
        image={arrow}
      ></Sprite>
      {score.player + score.keeper < 1 && (
        <Text
          anchor={0.5}
          position={{
            x: ballPlaceParameters.x + 250,
            y: arrowParameters.y - 130,
          }}
          style={{
            fill: ["#fff"], // gradient
            wordWrapWidth: 2231,
            fontSize: 66,
            fontFamily: "SofiaSansBold",
            align: "right",
          }}
          text={"НАЖМИТЕ ЧТОБЫ УДАРИТЬ"}
        ></Text>
      )}
      <Sprite
        position={{ y: ballPlaceParameters.y, x: ballPlaceParameters.x }}
        width={ballPlaceParameters.width}
        height={ballPlaceParameters.height}
        image={ballPlace}
      ></Sprite>
      <Sprite
        position={{ x: ballPostiton.x, y: ballPostiton.y }}
        width={ballParameters.width}
        height={ballParameters.height}
        image={ball}
        vx={velosity.vx}
        vy={velosity.vy}
        scale={{ x: calculateBallScale(), y: calculateBallScale() }}
      ></Sprite>
    </>
  );
};
