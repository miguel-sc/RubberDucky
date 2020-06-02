// Strength of gravity
export const gravity = new Box2D.b2Vec2(0, 9.81);

// Pixel to Meter ratio
export const PTM = 200;

// ParticleSystem
export const maxParticleCount = 5000;
export const particleRadius = 0.02;

// Colors
export const backgroundColor = 0x04052e;
export const spriteColor = 0xffffff;

// World Step function
export const timeStep = 1 / 60;
export const velocityIterations = 8;
export const positionIterations = 3;
export const particleIterations = 3;

// LiquidfunRenderer
export const blurRadius = 3.2;
export const blurThreshold = 0.85;

// Strength of clicks on the screen
export const clickImpulse = 0.015;

// Breakpoint for Mobile / Desktop
export const widthBreakpoint = 768;
export const heightBreakpoint = 500;
