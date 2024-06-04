const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const unit = 20;
const row = canvas.height / unit; //共有幾橫列
const column = canvas.width / unit; //共有幾直行

let snake = []; //array中每個元素都是一個物件
//物件的工作:儲存身體的X, Y座標
function creatSnake() {
  snake[0] = {
    x: 80,
    y: 0,
  };
  snake[1] = {
    x: 60,
    y: 0,
  };
  snake[2] = {
    x: 40,
    y: 0,
  };
  snake[3] = {
    x: 20,
    y: 0,
  };
}

//水果
class Fruit {
  constructor() {
    //隨機出現x,y座標
    this.x = Math.floor(Math.random() * column) * unit;
    this.y = Math.floor(Math.random() * row) * unit;
  }
  drawFruit() {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, unit, unit);
  }

  pickALocation() {
    let overlapping = false;
    let new_x;
    let new_y;

    //檢查水果座標，若和蛇重疊就return true
    function checkOverlap(new_x, new_y) {
      for (let i = 0; i < snake.length; i++) {
        if (new_x == snake[i].x && new_y == snake[i].y) {
          overlapping = true;
          return;
        } else {
          overlapping = false;
        }
      }
    }

    do {
      new_x = Math.floor(Math.random() * column) * unit;
      new_y = Math.floor(Math.random() * row) * unit;
      checkOverlap(new_x, new_y);
    } while (overlapping); //如果重疊(true)就重新設定水果的座標
    //得到的new座標
    this.x = new_x;
    this.y = new_y;
  }
}
//初始設定
creatSnake();
let myFruit = new Fruit();

//控制蛇的移動方向
window.addEventListener("keydown", changeDirection);

function changeDirection(e) {
  if (e.key == "ArrowLeft" && d !== "Right") {
    d = "Left";
  } else if (e.key == "ArrowUp" && d !== "Down") {
    d = "Up";
  } else if (e.key == "ArrowRight" && d !== "Left") {
    d = "Right";
  } else if (e.key == "ArrowDown" && d !== "Up") {
    d = "Down";
  }
  //在下次draw之前不接受任何keydown事件，防止180度迴轉
  window.removeEventListener("keydown", changeDirection);
}

//顯示分數與最高分數

let score = 0;
let highestScore;
loadHighestScore();
document.getElementById("myScore").innerHTML = "遊戲分數 : " + score;
document.getElementById("myScore2").innerHTML = "最高分數 : " + highestScore;

let d = "Right";

function draw() {
  //確認蛇有沒有咬到自己
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
      clearInterval(myGame);
      alert("遊戲結束");
      return;
    }
  }
  //每次draw都把背景填滿黑色
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  //劃出水果
  myFruit.drawFruit();
  // console.log(myFruit.x);

  //畫出蛇
  for (let i = 0; i < snake.length; i++) {
    if (i == 0) {
      ctx.fillStyle = "lightgreen";
    } else {
      ctx.fillStyle = "lightblue";
    }
    ctx.strokeStyle = "white"; //外框樣式

    //畫出蛇之前先把X, Y座標定位正確
    if (snake[i].x >= canvas.width) {
      snake[i].x = 0;
    }
    if (snake[i].x < 0) {
      snake[i].x = canvas.width - unit;
    }
    if (snake[i].y >= canvas.height) {
      snake[i].y = 0;
    }
    if (snake[i].y < 0) {
      snake[i].y = canvas.height - unit;
    }

    //畫出蛇(一個實心長方形(x, y, 長, 寬))
    ctx.fillRect(snake[i].x, snake[i].y, unit, unit);
    ctx.strokeRect(snake[i].x, snake[i].y, unit, unit);
  }
  //以目前的d變數方向來決定蛇的下一幀
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;
  if (d == "Left") {
    snakeX -= unit;
  } else if (d == "Up") {
    snakeY -= unit;
  } else if (d == "Right") {
    snakeX += unit;
  } else if (d == "Down") {
    snakeY += unit;
  }

  let newHead = {
    x: snakeX,
    y: snakeY,
  };
  //確認是否吃到果實
  if (snake[0].x == myFruit.x && snake[0].y == myFruit.y) {
    myFruit.pickALocation();
    score++;
    setHighestScore(score);
    document.getElementById("myScore").innerHTML = "遊戲分數 : " + score;
    document.getElementById("myScore2").innerHTML =
      "最高分數 : " + highestScore;
  } else {
    snake.pop();
  }
  snake.unshift(newHead);
  //unshift後確認蛇頭位置正確，可以接受keydown事件
  window.addEventListener("keydown", changeDirection);
}

//每100毫秒執行draw一次
let myGame = setInterval(draw, 100);

function loadHighestScore() {
  if (localStorage.getItem("highestScore") == null) {
    highestScore = 0;
  } else {
    highestScore = Number(localStorage.getItem("highestScore")); //localStorage拿出來的是string
  }
}

function setHighestScore(score) {
  if (score > highestScore) {
    localStorage.setItem("highestScore", score); //遊戲結束後更新最高分數
    highestScore = score; //即時更新最高分數
  }
}
