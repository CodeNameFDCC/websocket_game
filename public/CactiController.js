import Cactus from './Cactus.js';

// 선인장을 생성하고 관리하는 기능을 제공합니다.
// 게임의 속도에 따라 선인장을 업데이트 하고 그려주며 충돌을 처리하는데 필요한 메소드를 포함하고 있습니다.
// 게임에서 동적으로 처리할 수 있도록 클레스로 구성되어 있습니다.

class CactiController {
  CACTUS_INTERVAL_MIN = 500;
  CACTUS_INTERVAL_MAX = 2000;
  // 선인장의 생성 주기
  nextCactusInterval = null;
  // 선인장이 다음에 생성될 시간
  cacti = [];
  // 현존하는 선인장

  constructor(ctx, cactiImages, scaleRatio, speed) {
    this.ctx = ctx;
    // 컨텍스트
    this.canvas = ctx.canvas;
    //켄버스
    this.cactiImages = cactiImages;
    //이미지
    this.scaleRatio = scaleRatio;
    //크기 비율
    this.speed = speed;
    //속도

    this.setNextCactusTime();
    //다음 생성시간
  }

  setNextCactusTime() {
    this.nextCactusInterval = this.getRandomNumber(
      this.CACTUS_INTERVAL_MIN,
      this.CACTUS_INTERVAL_MAX,
    );
    //랜덤 시간 가져오기
  }

  getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  // 랜덤 시간 최소 부터 최대 사이 값 도출

  createCactus() {
    const index = this.getRandomNumber(0, this.cactiImages.length - 1);
    const cactusImage = this.cactiImages[index];
    const x = this.canvas.width * 1.5;
    const y = this.canvas.height - cactusImage.height;

    const cactus = new Cactus(
      this.ctx,
      x,
      y,
      cactusImage.width,
      cactusImage.height,
      cactusImage.image,
    );

    this.cacti.push(cactus);
  }

  // 랜덤하게 선인장을 선택하여 화면 오른쪽에 위치하게 생성하여 선인장 배열에 추가합니다.

  update(gameSpeed, deltaTime) {
    if (this.nextCactusInterval <= 0) {
      // 선인장 생성
      this.createCactus();
      this.setNextCactusTime();
    }


    this.nextCactusInterval -= deltaTime;

    this.cacti.forEach((cactus) => {
      cactus.update(this.speed, gameSpeed, deltaTime, this.scaleRatio);
    });

    // 지나간 선인장 삭제
    this.cacti = this.cacti.filter((cactus) => cactus.x > -cactus.width);
  }

  // 게임의 속도와 델타 타임을 기반으로 선인장을 생성하고 위치를 업데이트 합니다.
  // 지나간 선인자을 삭제합니다.

  draw() {
    this.cacti.forEach((cactus) => cactus.draw());
  }
  //현재 존재하는 선인장들을 화면에 그립니다.

  collideWith(sprite) {
    return this.cacti.some((cactus) => cactus.collideWith(sprite));
  }
  // 주어진 스프라이트와 충돌하는 선인장이 있는지 검사합니다.

  reset() {
    this.cacti = [];
  }
  // 모든 선인장을 제거하여 초기 상태로 되돌립니다.
}

export default CactiController;
