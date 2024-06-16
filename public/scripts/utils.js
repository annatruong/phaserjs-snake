function createSnake() {
  // Get grid column and row numbers
  const gridColumns = Math.floor(this.game.config.width / this.gridSize);
  const gridRows = Math.floor(this.game.config.height / this.gridSize);

  // Generate random column and row
  let column = Phaser.Math.Between(5, gridColumns - 5);
  let row = Phaser.Math.Between(5, gridRows - 5);

  // Create snake head
  const head = createPart.call(this, {
    column,
    row,
    gridSize: this.gridSize,
  });
  this.snakeBody.push(head);

  // Create snake body
  row--;
  const part1 = createPart.call(this, {
    column,
    row,
    gridSize: this.gridSize,
  });
  this.snakeBody.push(part1);
  row--;
  const part2 = createPart.call(this, {
    column,
    row,
    gridSize: this.gridSize,
  });
  this.snakeBody.push(part2);

  // Add snake to grid
  for (const part of this.snakeBody) {
    this.add.existing(part);
  }

  createFood.call(this, this.snakeBody);
}

function createPart({ column, row, gridSize }) {
  const xPosition = column * gridSize + gridSize / 2;
  const yPosition = row * gridSize + gridSize / 2;
  const part = new Phaser.GameObjects.Rectangle(
    this,
    xPosition,
    yPosition,
    gridSize,
    gridSize,
    0xfcba03
  );
  part.setStrokeStyle(1, 0xffffff);
  return part;
}

function moveSnake({ snakeBody, gridSize, ateFood, food }) {
  if (ateFood) {
    const lastPart = snakeBody[snakeBody.length - 1];
    let newX = lastPart.x;
    let newY = lastPart.y;

    if (this.direction === "UP") {
      newY += gridSize;
    } else if (this.direction === "DOWN") {
      newY -= gridSize;
    } else if (this.direction === "LEFT") {
      newX += gridSize;
    } else if (this.direction === "RIGHT") {
      newX -= gridSize;
    }

    const newPart = new Phaser.GameObjects.Rectangle(
      this,
      newX,
      newY,
      gridSize,
      gridSize,
      0xfcba03
    );
    newPart.setStrokeStyle(1, 0xffffff);
    snakeBody.push(newPart);
    this.add.existing(newPart);

    repositionFood.call(this, { snakeBody, food });
    this.score += 5;
    this.scoreText.setText(`Score: ${this.score}`);
  }

  for (let i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i].x = snakeBody[i - 1].x;
    snakeBody[i].y = snakeBody[i - 1].y;
  }

  const head = snakeBody[0];
  if (this.direction === "UP") {
    head.y -= gridSize;
  } else if (this.direction === "DOWN") {
    head.y += gridSize;
  } else if (this.direction === "LEFT") {
    head.x -= gridSize;
  } else if (this.direction === "RIGHT") {
    head.x += gridSize;
  }

  // Check for collision with walls
  if (
    head.x < 0 ||
    head.x >= this.game.config.width ||
    head.y < 0 ||
    head.y >= this.game.config.height
  ) {
    this.isGameOver = true;
  }

  // Check for collision with itself
  for (let i = 1; i < snakeBody.length; i++) {
    if (head.x === snakeBody[i].x && head.y === snakeBody[i].y) {
      this.isGameOver = true;
      break;
    }
  }
}

function createFood(snakeBody) {
  const gridColumns = Math.floor(this.game.config.width / this.gridSize);
  const gridRows = Math.floor(this.game.config.height / this.gridSize);

  let foodColumn;
  let foodRow;
  let foodPositionIsValid = false;

  // Keep generating food until it's in a valid position
  while (!foodPositionIsValid) {
    foodColumn = Phaser.Math.Between(0, gridColumns - 1);
    foodRow = Phaser.Math.Between(0, gridRows - 1);

    // Check if the food position is not inside the snake's body
    const foodPosition = { column: foodColumn, row: foodRow };
    foodPositionIsValid = !isSnakeAtPosition({
      snakeBody,
      position: foodPosition,
      gridSize: this.gridSize,
    });
  }

  // Create the food
  const xPosition = foodColumn * this.gridSize + this.gridSize / 2;
  const yPosition = foodRow * this.gridSize + this.gridSize / 2;
  const food = new Phaser.GameObjects.Rectangle(
    this,
    xPosition,
    yPosition,
    this.gridSize,
    this.gridSize,
    0xf78383
  );
  food.setStrokeStyle(1, 0xffffff);
  this.food = food;
  this.add.existing(food);
}

function repositionFood({ snakeBody, food }) {
  const gridColumns = Math.floor(this.game.config.width / this.gridSize);
  const gridRows = Math.floor(this.game.config.height / this.gridSize);

  let foodColumn;
  let foodRow;
  let foodPositionIsValid = false;

  // Keep generating food until it's in a valid position
  while (!foodPositionIsValid) {
    foodColumn = Phaser.Math.Between(0, gridColumns - 1);
    foodRow = Phaser.Math.Between(0, gridRows - 1);

    // Check if the food position is not inside the snake's body
    const foodPosition = { column: foodColumn, row: foodRow };
    foodPositionIsValid = !isSnakeAtPosition({
      snakeBody,
      position: foodPosition,
      gridSize: this.gridSize,
    });
  }

  // Set the food position
  const xPosition = foodColumn * this.gridSize + this.gridSize / 2;
  const yPosition = foodRow * this.gridSize + this.gridSize / 2;
  food.x = xPosition;
  food.y = yPosition;
}

function isSnakeAtPosition({ snakeBody, position, gridSize }) {
  // Check if the snake's body contains the given position
  for (const part of snakeBody) {
    if (
      part.x === position.column * gridSize + gridSize / 2 &&
      part.y === position.row * gridSize + gridSize / 2
    ) {
      return true;
    }
  }
  return false;
}
