const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: "#a0d9b0",
  scene: [IntroScene, GameScene],
};

const game = new Phaser.Game(config);
