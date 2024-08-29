import { Vec2 } from "./components/vec2";

export const WIDTH = 200;
export const HEIGHT = WIDTH;
export const GIZMO_MARGIN = 40;
export const GIZMO_SCREEN_WIDTH = WIDTH - GIZMO_MARGIN * 2;
export const GIZMO_SCREEN_HEIGHT = HEIGHT - GIZMO_MARGIN * 2;
export const GIZMO_EARS_SIZE = Vec2.new(20, 30);
export const BUTTON_WIDTH = 20;
export const BUTTON_HEIGHT = 20;

export const SPRITE_SPEED = 700;

export const DAY_DURATION = 60. / 2.;
export const HUNGRY_TIME_MAX = DAY_DURATION * 2.;
export const TIRED_TIME_MAX = DAY_DURATION;
export const PLAYFUL_TIME_MAX = DAY_DURATION / 2.;
export const DIRTY_TIME_MAX = DAY_DURATION * 3.;
