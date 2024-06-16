const IntroScene = {
  key: "IntroScene",
  preload: function () {
    this.load.image("introImage", "images/snake.png");
  },
  create: function () {
    // Add background or other elements for the introduction scene
    // Example: add a background image or text
    const introImage = this.add
      .image(400, 300, "introImage")
      .setScale(0.4)
      .setOrigin(0.5, 0.5); // Center the image

    const title = this.add
      .text(400, 150, "Snake Game", {
        fontSize: "68px",
        fill: "#fff",
      })
      .setOrigin(0.5);

    // Instructions text
    const instructions = this.add
      .text(400, 500, "Press Enter to Start", {
        fontSize: "24px",
        fill: "#fff",
      })
      .setOrigin(0.5);

    // Input event for pressing Enter to start the game
    this.input.keyboard.on(
      "keydown-ENTER",
      function () {
        // Switch to the GameScene when Enter is pressed
        this.scene.start("GameScene");
      },
      this
    );
  },
};

const GameScene = {
  key: "GameScene",
  preload: function () {},

  create: function () {
    this.snakeBody = [];
    this.food;
    this.direction = "RIGHT"; // Initial direction
    this.lastMoveTime = 0; // Time of the last move
    this.moveInterval = 200; // Time in ms between moves
    this.gridSize = 25; // Size of each grid cell
    this.lastKeyPressTime = 0; // Time of the last key press
    this.keyPressCooldown = 95; // Time in ms between key presses
    this.isGameOver = false;

    /* DRAW GRID */
    const graphics = this.add.graphics();

    // Set the line style
    graphics.lineStyle(1, 0xffffff, 1);

    // Draw horizontal lines
    for (let y = 0; y < this.game.config.height; y += this.gridSize) {
      graphics.moveTo(0, y);
      graphics.lineTo(this.game.config.width, y);
    }

    // Draw vertical lines
    for (let x = 0; x < this.game.config.width; x += this.gridSize) {
      graphics.moveTo(x, 0);
      graphics.lineTo(x, this.game.config.height);
    }

    // Stroke the lines to make them visible
    graphics.strokePath();

    this.gameOverText = this.add
      .text(400, 230, "Game Over!", {
        fontSize: "68px",
        fill: "#fff",
        align: "center",
      })
      .setOrigin(0.5, 0.5)
      .setVisible(false); // Initially invisible

    // Press Enter to Restart Text
    this.restartText = this.add
      .text(400, 340, "Press Enter to Restart", {
        fontSize: "24px",
        fill: "#fff",
      })
      .setOrigin(0.5, 0.5)
      .setVisible(false); // Initially invisible

    createSnake.call(this);

    // Handle input
    this.input.keyboard.on("keydown", (event) => {
      const currentTime = this.time.now;

      // Check if enough time has passed since the last key press
      if (currentTime - this.lastKeyPressTime >= this.keyPressCooldown) {
        if (event.key === "ArrowUp" && this.direction !== "DOWN") {
          this.direction = "UP";
        } else if (event.key === "ArrowDown" && this.direction !== "UP") {
          this.direction = "DOWN";
        } else if (event.key === "ArrowLeft" && this.direction !== "RIGHT") {
          this.direction = "LEFT";
        } else if (event.key === "ArrowRight" && this.direction !== "LEFT") {
          this.direction = "RIGHT";
        }

        // Update the last key press time
        this.lastKeyPressTime = currentTime;
      }
    });
  },

  update: function (time) {
    if (this.isGameOver) {
      this.gameOverText.setVisible(true);
      this.restartText.setVisible(true);

      if (
        this.input.keyboard.checkDown(
          this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER),
          500
        )
      ) {
        this.scene.restart(); // Restart the game when Enter is pressed
      }
      return;
    }

    if (time - this.lastMoveTime >= this.moveInterval) {
      const ateFood =
        this.snakeBody[0].x === this.food.x &&
        this.snakeBody[0].y === this.food.y;
      moveSnake.call(this, {
        snakeBody: this.snakeBody,
        gridSize: this.gridSize,
        ateFood,
        food: this.food,
      });
      this.lastMoveTime = time;
    }
  },
};
