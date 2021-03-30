document.addEventListener("DOMContentLoaded", () => {
  const left = document.querySelector(".left");
  const right = document.querySelector(".right");
  const up = document.querySelector(".up");
  const down = document.querySelector(".down");
  const menu = document.querySelector(".menu");
  const closemenu = document.querySelector(".closemenu");
  const levelmenu = document.querySelector(".levelmenu");

  const showLevel = () => {
    levelmenu.classList.toggle("show");
  };
  menu.addEventListener("click", showLevel);
  closemenu.addEventListener("click", showLevel);

  document.addEventListener("keydown", (e) => {
    if (e.code == "Escape") {
      if (levelmenu.classList.contains("show")) {
        levelmenu.classList.remove("show");
      }
    }
  });
  const levelInput = document.querySelector("#levelinput");
  const leveOutput = document.querySelector(".leveloutput");
  levelInput.value = 3;
  leveOutput.textContent = 3;
  let speed = 400;

  levelInput.addEventListener("input", () => {
    leveOutput.textContent = levelInput.value;

    switch (levelInput.value) {
      case "1":
        speed = 800;
        break;
      case "2":
        speed = 600;
        break;
      case "3":
        speed = 400;
        break;
      case "4":
        speed = 250;
        break;
      case "5":
        speed = 100;
        break;
    }
  });
  const gameovercard = document.querySelector(".gameovercard");

  const cardScore = document.querySelector(".card-score");
  const cardClose = document.querySelector(".card-close");
  const cardRestart = document.querySelector(".card-restart");

  const pause = document.querySelector(".pause");
  const play = document.querySelector(".play");
  let gameStart;

  const restart = document.querySelector(".restart");
  const grid = document.querySelector(".grid");
  const scorecontent = document.querySelector(".scorecontent");
  let textInterval;
  const width = 20;
  const height = 20;
  let foods = [];
  let foodsCount = 2;
  let direction = "right";
  let newSquare;
  let timer;
  let oldHead;
  let valid = true;
  //original player
  let player = [0, 1, 2];

  let eaten = false;
  let score = 0;

  const colors = ["light", "dark"];
  //   draw ground
  for (let i = 0; i < width * height; i++) {
    const div = document.createElement("div");
    grid.appendChild(div);
  }

  const squares = Array.from(document.querySelectorAll(".grid div"));

  //draw ground color
  let startColorIndex;

  const drawGroundColor = () => {
    for (let i = 0; i < width; i++) {
      //row
      if (i % 2 == 0) {
        startColorIndex = 0;
      } else {
        startColorIndex = 1;
      }
      for (let j = 0; j < height; j++) {
        //column
        startColorIndex += 1;
        squares[i * width + j].classList.add(colors[(startColorIndex + 1) % 2]);
        //color = (startColor + 1 )%2
      }
    }
  };

  drawGroundColor();

  //add foods
  const addFoods = (count) => {
    let food;

    for (let i = 0; i < count; i++) {
      food = createFood();
      //draw foods
      squares[food].classList.add("food");
      foods.push(food);
    }
  };

  const createFood = () => {
    let food;
    do {
      food = Math.floor(Math.random(0, 1) * width * height);
    } while (player.includes(food) || foods.includes(food));
    return food;
  };

  const newplayer = () => {
    //if food eaten, not shift
    // else remove leftmost square
    if (!eaten) {
      const tail = player.shift();
      //undraw old player
      squares[tail].classList.remove("player");
    }

    player.push(newSquare); //add new square

    //draw new player
    squares[newSquare].classList.add("player");
    eaten = false;
  };

  const drawPlayer = () => {
    player.forEach((p) => squares[p].classList.add("player"));
  };

  left.addEventListener("click", () => {
    direction = "left";
  });
  right.addEventListener("click", () => {
    direction = "right";
  });
  up.addEventListener("click", () => {
    direction = "up";
  });
  down.addEventListener("click", () => {
    direction = "down";
  });
  //listen direction from keyboard input
  document.addEventListener("keydown", (e) => {
    if (!timer) return;
    switch (e.code) {
      case "ArrowUp":
        direction = "up";

        break;
      case "ArrowDown":
        direction = "down";

        break;
      case "ArrowLeft":
        direction = "left";

        break;
      case "ArrowRight":
        direction = "right";
        break;
    }
  });

  const gameOver = () => {
    gameStart = false;
    clearInterval(timer);
    timer = null;
    pause.style.display = "none";
    play.style.display = "block";

    cardScore.textContent = score;
    //show gameover card
    gameovercard.classList.add("show");
  };

  const check = () => {
    //if move to self
    if (player.includes(newSquare)) {
      gameOver();
      return false;
    }
    //if move to left edge:
    if (oldHead % width == 0 && newSquare % width == width - 1) {
      gameOver();
      return false;
    }

    //if move to right edge
    if (oldHead % width == width - 1 && newSquare % width == 0) {
      gameOver();
      return false;
    }

    //if move to top edge
    if (newSquare < 0) {
      gameOver();
      return false;
    }

    //if move to bottom edge
    if (newSquare >= width * height) {
      gameOver();
      return false;
    }

    //check if foods are eaten
    if (squares[newSquare].classList.contains("food")) {
      eaten = true;
      score += 10;

      if (textInterval) {
        clearInterval(textInterval);
        textInterval = null;
      }
      scorecontent.classList.add("transformtext");
      textInterval = setInterval(
        () => scorecontent.classList.remove("transformtext"),
        500
      );

      scorecontent.textContent = score;
      //remove old food

      squares[newSquare].classList.remove("food"); //
      let removeIndex = foods.indexOf(newSquare);
      foods.splice(removeIndex, 1);
      //create new food
      let newFood = createFood();
      squares[newFood].classList.add("food"); //
      foods.push(newFood);

      if (score % 100 == 0) {
        addFoods(1);
      }
    }

    return true;
  };

  const move = () => {
    oldHead = player[player.length - 1];

    //newSquare
    switch (direction) {
      case "up":
        newSquare = oldHead - width;
        break;
      case "down":
        newSquare = oldHead + width;
        break;
      case "left":
        newSquare = oldHead - 1;
        break;
      case "right":
        newSquare = oldHead + 1;
        break;
    }

    //check if lost and food eaten
    valid = check();
    if (!valid) return;

    newplayer(); //draw new player
  };

  const startPlay = () => {
    //if not gameStart
    if (!gameStart) {
      checkCardOpen();
    } else {
      //if gameStart
      if (timer) {
        //pause
        pause.style.display = "none";
        play.style.display = "block";
        clearInterval(timer);
        timer = null;
      } else {
        //play
        pause.style.display = "block";
        play.style.display = "none";
        timer = setInterval(move, speed);
      }
    }
  };
  play.addEventListener("click", startPlay);
  pause.addEventListener("click", startPlay);

  document.addEventListener("keydown", (e) => {
    if (e.code == "Space") {
      startPlay();
    }
  });

  const checkCardOpen = () => {
    if (
      gameovercard.classList.contains("show") ||
      levelmenu.classList.contains("show")
    ) {
      gameovercard.classList.remove("show");
      levelmenu.classList.remove("show");
      setTimeout(restartPlay, 500);
    } else {
      restartPlay();
    }
  };
  const restartPlay = () => {
    clearInterval(timer);
    timer = null;

    //clear ground
    squares.forEach((square) => square.classList.remove(...square.classList));

    //draw ground color
    drawGroundColor();

    gameStart = true;
    //initial value
    direction = "right";
    valid = true;
    player = [0, 1, 2];
    foods = [];
    foodsCount = 2;
    eaten = false;
    score = 0;
    scorecontent.textContent = score;
    addFoods(foodsCount); //draw original foods
    drawPlayer(); //draw original player
    pause.style.display = "block";
    play.style.display = "none";
    timer = setInterval(move, speed); //start new game
  };
  restart.addEventListener("click", () => {
    //end last game
    checkCardOpen();
  });

  cardClose.addEventListener("click", () => {
    gameovercard.classList.remove("show");
  });

  cardRestart.addEventListener("click", checkCardOpen);
});
