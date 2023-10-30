import { Sprite, Graphics } from "pixi.js-legacy";

export const createColoredSprite = (width, height, color) => {
  const graphics = new Graphics();
  graphics.beginFill(color);
  graphics.drawRect(0, 0, width, height);
  graphics.endFill();

  const texture = graphics.generateCanvasTexture();
  const sprite = new Sprite(texture);

  return sprite;
};
