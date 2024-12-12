import { sendEvent } from "./Socket.js";

class Score {
  score = 0;
  //점수
  HIGH_SCORE_KEY = "highScore";
  // 최대점수 키
  stageChange = true;
  // 스테이지 변경 플레그

  currentStage = 1000;

  constructor(ctx, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
  }

  update(deltaTime) {
    this.score += (deltaTime + Math.floor(deltaTime / 100)) * 0.01;
    if (Math.floor(this.score) === 100 && this.stageChange) {
      this.stageChange = false;
      const targetStage = currentStage + 1;
      sendEvent(11, {
        currentStage: this.currentStage,
        targetStage: targetStage,
      });
      this.currentStage = targetStage;
    }
  }
  // 점수 업데이트
  // 100 점 도달시 스테이지 변경 이벤트
  // sendEvent 함수를 호출해서 소켓을 통해 이벤트를 전송합니다.
  // 시작 스테이지 1000
  // 100 점 도달시 다음 시작 스테이지 증가
  // 전송이후 현재 스테이지 상태 변경

  getItem(itemId) {
    // 아이템 획득시 점수 변화
    this.score += Math.floor(this.score / 2);
  }
  // 아이템 획득시 현재까지 얻은 점수의 절반을 추가로 획득한다.

  reset() {
    this.score = 0;
  }

  // 점수 초기화

  setHighScore() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    if (this.score > highScore) {
      localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score));
    }
  }

  // 현재 하이스코어를 업데이트 합니다.
  // 로컬 스로리지에 스코어를 저장합니다.

  getScore() {
    return this.score;
  }

  //현재 점수를 반환합니다.
  // 점수를 조회할 때 사용합니다.

  draw() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    const y = 20 * this.scaleRatio;

    const fontSize = 20 * this.scaleRatio;
    this.ctx.font = `${fontSize}px serif`;
    this.ctx.fillStyle = "#525250";

    const scoreX = this.canvas.width - 75 * this.scaleRatio;
    const highScoreX = scoreX - 125 * this.scaleRatio;

    const scorePadded = Math.floor(this.score).toString().padStart(6, 0);
    const highScorePadded = highScore.toString().padStart(6, 0);

    this.ctx.fillText(scorePadded, scoreX, y);
    this.ctx.fillText(`HI ${highScorePadded}`, highScoreX, y);
  }

  // 점수를 켄버스에 그려줍니다.
}

export default Score;
