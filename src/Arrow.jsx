import { Stage, Container, Sprite, useTick } from "@pixi/react";
import background from "./images/background.webp";
import arrow from "./images/arrow-up.png";
import { useState } from "react";

export const Arrow = () => {
  const [rotate, setRotation] = useState(0);
  // right=1 left=-1
  const [direction, setDirection] = useState(1);

  useTick((delta) => {
    let rotation = rotate;
    // Изменение угла вращения на каждом кадре

    if (direction === 1) rotation += (delta * Math.PI) / 180;
    else rotation -= (delta * Math.PI) / 180;

    // Ограничение угла вращения до максимума в 90 градусов вправо и влево
    if (rotation > Math.PI / 2) {
      rotation = Math.PI / 2;
    } else if (rotation < -Math.PI / 2) {
      rotation = -Math.PI / 2;
    }

    // Переключение направления вращения при достижении максимального угла
    if (rotation >= Math.PI / 2 || rotation <= -Math.PI / 2) {
      setDirection((direction) => (direction === 1 ? -1 : 1));
    }
    setRotation(rotation);
  });

  return (
    <Sprite
      anchor={0.5}
      rotation={rotate}
      position={{ y: 1800, x: 550 }}
      width={150}
      height={150}
      image={arrow}
    ></Sprite>
  );
};
