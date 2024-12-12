import Player from './Player.js';
import Ground from './Ground.js';
import CactiController from './CactiController.js';
import Score from './Score.js';
import ItemController from './ItemController.js';
import './Socket.js';
import { sendEvent } from './Socket.js';

// 플레이어 바닥 선인장 점수 아이템을 모듈로 불러옵니다.
// Socket.js 는 실시간 통신을 위한 소켓 기능입니다.

const canvas = document.getElementById('game');
// 켄버스
const ctx = canvas.getContext('2d');
// 컨텍스트
const GAME_SPEED_START = 1;
// 게임 속도
const GAME_SPEED_INCREMENT = 0.00001;
// 게임속도 증가

const GAME_WIDTH = 800;
const GAME_HEIGHT = 200;
// 게임 크기

const PLAYER_WIDTH = 88 / 1.5; // 58
const PLAYER_HEIGHT = 94 / 1.5; // 62
const MAX_JUMP_HEIGHT = GAME_HEIGHT;
const MIN_JUMP_HEIGHT = 150;
// 플레이어
// 800 * 200 사이즈의 캔버스에서는 이미지의 기본크기가 크기때문에 1.5로 나눈 값을 사용. (비율 유지)
// 점프력의 최소와 최대

const GROUND_WIDTH = 2400;
const GROUND_HEIGHT = 24;
const GROUND_SPEED = 0.5;
// 땅
// 크기 와 속도

const CACTI_CONFIG = [
  { width: 48 / 1.5, height: 100 / 1.5, image: 'images/cactus_1.png' },
  { width: 98 / 1.5, height: 100 / 1.5, image: 'images/cactus_2.png' },
  { width: 68 / 1.5, height: 70 / 1.5, image: 'images/cactus_3.png' },
];
// 선인장 속성

const ITEM_CONFIG = [
  { width: 50 / 1.5, height: 50 / 1.5, id: 1, image: 'images/items/pokeball_red.png' },
  { width: 50 / 1.5, height: 50 / 1.5, id: 2, image: 'images/items/pokeball_yellow.png' },
  { width: 50 / 1.5, height: 50 / 1.5, id: 3, image: 'images/items/pokeball_purple.png' },
  { width: 50 / 1.5, height: 50 / 1.5, id: 4, image: 'images/items/pokeball_cyan.png' },
];
// 아이템 속성

// 비율을 유지하기 위해 1.5로 나누어 크기를 조정합니다.

// 게임 요소들
let player = null;
let ground = null;
let cactiController = null;
let itemController = null;
let score = null;

let scaleRatio = null;
let previousTime = null;
let gameSpeed = GAME_SPEED_START;
let gameover = false;
let hasAddedEventListenersForRestart = false;
let waitingToStart = true;

// 게임에서 사용하는 객체와 상태 변수입니다.
// 각 요소는 게임의 상태를 추적하는데 사용됩니다.

function createSprites() {
  // 비율에 맞는 크기
  // 유저
  const playerWidthInGame = PLAYER_WIDTH * scaleRatio;
  const playerHeightInGame = PLAYER_HEIGHT * scaleRatio;
  const minJumpHeightInGame = MIN_JUMP_HEIGHT * scaleRatio;
  const maxJumpHeightInGame = MAX_JUMP_HEIGHT * scaleRatio;

  // 땅
  const groundWidthInGame = GROUND_WIDTH * scaleRatio;
  const groundHeightInGame = GROUND_HEIGHT * scaleRatio;

  player = new Player(
    ctx,
    playerWidthInGame,
    playerHeightInGame,
    minJumpHeightInGame,
    maxJumpHeightInGame,
    scaleRatio,
  );

  ground = new Ground(ctx, groundWidthInGame, groundHeightInGame, GROUND_SPEED, scaleRatio);

  const cactiImages = CACTI_CONFIG.map((cactus) => {
    const image = new Image();
    image.src = cactus.image;
    return {
      image,
      width: cactus.width * scaleRatio,
      height: cactus.height * scaleRatio,
    };
  });

  cactiController = new CactiController(ctx, cactiImages, scaleRatio, GROUND_SPEED);

  const itemImages = ITEM_CONFIG.map((item) => {
    const image = new Image();
    image.src = item.image;
    return {
      image,
      id: item.id,
      width: item.width * scaleRatio,
      height: item.height * scaleRatio,
    };
  });

  itemController = new ItemController(ctx, itemImages, scaleRatio, GROUND_SPEED);

  score = new Score(ctx, scaleRatio);
}

// 게임 내에서 사용할 객체 플레이어, 바닥, 선인장, 아이템 점수 를 생성합니다.
// 각 객체는 필요한 속성과 이미지를 기반으로 초기화 됩니다.

function getScaleRatio() {
  const screenHeight = Math.min(window.innerHeight, document.documentElement.clientHeight);
  const screenWidth = Math.min(window.innerHeight, document.documentElement.clientWidth);

  // window is wider than the game width
  if (screenWidth / screenHeight < GAME_WIDTH / GAME_HEIGHT) {
    return screenWidth / GAME_WIDTH;
  } else {
    return screenHeight / GAME_HEIGHT;
  }
}
// 화면 크기에 맟춰 게임의 스케일 비율을 계산합니다.
// 다양한 화면 크기에서 게임을 동적으로 조절할 수 있도록 하는 기능입니다.

function setScreen() {
  scaleRatio = getScaleRatio();
  canvas.width = GAME_WIDTH * scaleRatio;
  canvas.height = GAME_HEIGHT * scaleRatio;
  createSprites();
}
// 스케일 비율을 설정하고 캔버스 크기를 조정한 이후에 스프라이트를 생성합니다.

setScreen();
window.addEventListener('resize', setScreen);

if (screen.orientation) {
  screen.orientation.addEventListener('change', setScreen);
}

// 화면 크기가 변경될 때마다 호출됩니다.

function showGameOver() {
  const fontSize = 70 * scaleRatio;
  ctx.font = `${fontSize}px Verdana`;
  ctx.fillStyle = 'grey';
  const x = canvas.width / 4.5;
  const y = canvas.height / 2;
  ctx.fillText('GAME OVER', x, y);
}

function showStartGameText() {
  const fontSize = 40 * scaleRatio;
  ctx.font = `${fontSize}px Verdana`;
  ctx.fillStyle = 'grey';
  const x = canvas.width / 14;
  const y = canvas.height / 2;
  ctx.fillText('Tap Screen or Press Space To Start', x, y);
}
// 게임 오버와 게임 시작 메시지를 화면에 표시합니다.
// 글꼴 크기와 색상을 설정하고 위치를 계산하여 텍스트를 표시합니다.

function updateGameSpeed(deltaTime) {
  gameSpeed += deltaTime * GAME_SPEED_INCREMENT;
}
// 게임의 속도를 점진적으로 증가시키는 함수입니다.

function reset() {
  hasAddedEventListenersForRestart = false;
  gameover = false;
  waitingToStart = false;

  ground.reset();
  cactiController.reset();
  score.reset();
  gameSpeed = GAME_SPEED_START;
  sendEvent(2, { timestamp: Date.now() });
}
// 게임을 초기 상태로 리셋하는 함수입니다.
// 모든 요소를 초기화하고 소켓 이벤트를 통해 리셋을 알립니다.

function setupGameReset() {
  if (!hasAddedEventListenersForRestart) {
    hasAddedEventListenersForRestart = true;

    setTimeout(() => {
      window.addEventListener('keyup', reset, { once: true });
    }, 1000);
  }
}

// 게임을 재시작 하기위한 함수입니다.
// 이미 리스너가 추가되었는지 체크합니다.
// 1초 후에 키보드의 keyup 이벤트에 대해 reset 함수를 실행하도록 리스너를 추가합니다.
// once 옵션을 통해 게임 오버 이후에 사용자가 한번만 리셋할 수 있도록 되어있습니다.

function clearScreen() {
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// 현재 캔버스를 흰색으로 지웁니다.

function gameLoop(currentTime) {
  // 게임의 메인루프 함수입니다.
  // 매 프레임마다 호출되어 게임의 상태를 업데이트 하고 화면을 그립니다.
  if (previousTime === null) {
    previousTime = currentTime;
    requestAnimationFrame(gameLoop);
    return;
  }
  // 현재 시간을 저장하고 다음프레임을 요청합니다.

  const deltaTime = currentTime - previousTime;
  previousTime = currentTime;
  // 모든 환경에서 같은 게임 속도를 유지하기 위해 구하는 값
  // 프레임 렌더링 속도

  clearScreen();
  // 화면을 지웁니다.

  if (!gameover && !waitingToStart) {
    // update
    // 땅이 움직임
    ground.update(gameSpeed, deltaTime);
    // 선인장
    cactiController.update(gameSpeed, deltaTime);
    itemController.update(gameSpeed, deltaTime);
    // 달리기
    player.update(gameSpeed, deltaTime);
    updateGameSpeed(deltaTime);

    score.update(deltaTime);
  }
  // 게임 오버 상태가 아니고 대기상태가 아니라면 게임 플레이 중입니다.

  if (!gameover && cactiController.collideWith(player)) {
    gameover = true;
    score.setHighScore();
    setupGameReset();
  }
  // 게임 플레이 중일때 선인장과 충돌하면 게임 오버 상태로 변경됩니다.

  const collideWithItem = itemController.collideWith(player);
  if (collideWithItem && collideWithItem.itemId) {
    score.getItem(collideWithItem.itemId);
  }
  // 플레이어가 아이템과 충돌하면 해당 아이템을 획득합니다.

  // draw
  player.draw();
  cactiController.draw();
  ground.draw();
  score.draw();
  itemController.draw();

  // 모든 객체를 그려줍니다.

  if (gameover) {
    showGameOver();
  }

  // 게임 오버 화면을 표시합니다.

  if (waitingToStart) {
    showStartGameText();
  }
  //시작텍스트를 표시합니다.

  requestAnimationFrame(gameLoop);
  // 재귀 호출 (무한반복)
}

requestAnimationFrame(gameLoop);
// 게임 프레임을 다시 그리는 메서드

window.addEventListener('keyup', reset, { once: true });
// keyup 이벤트에 reset함수를 실행하는 이벤트 리스너를 추가합니다.
// once옵션으로 한번만 실행합니다.
