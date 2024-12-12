class Ground {
  constructor(ctx, width, height, speed, scaleRatio) {
    this.ctx = ctx;
    // 캔버스 컨텍스트
    this.canvas = ctx.canvas;
    // 켄버스
    this.width = width;
    // 바닥의 가로 크기
    this.height = height;
    // 바닥위 높이
    this.speed = speed;
    // 바닥의 이동속도
    this.scaleRatio = scaleRatio;
    // 스케일 비율

    this.x = 0;
    // x좌표 위치
    this.y = this.canvas.height - this.height;
    // 켄버스 크기로 부터의 y좌표의 하단 위치

    this.groundImage = new Image();
    // 바닥의 이미지 공간 생성
    this.groundImage.src = 'images/ground.png';
    // 바닥의 이미지 지정
  }

  update(gameSpeed, deltaTime) {
    this.x -= gameSpeed * deltaTime * this.speed * this.scaleRatio;
  }
  // 바닥의 위치를 업데이트 하는 기능입니다.
  // 게임의 속도 조정값과 이전 프레임과의 시간차이 와 스케일 비율을 고려하여 속도를 계산하였습니다.
  // 바닥의 x좌료를 왼쪽으로 이동시켜 스크롤 되도록 하였습니다.

  draw() {
    // 바닥을 캔버스에 그리는 기능입니다.
    this.ctx.drawImage(this.groundImage, this.x, this.y, this.width, this.height);
    // 바닥 이미지를 현재 x 위치에 그립니다.

    this.ctx.drawImage(
      this.groundImage,
      // 2개 연결
      this.x + this.width,
      this.y,
      this.width,
      this.height,
    );
    // 바닥이 연결되어 보이도록 바닥의 너비만큼 이동한 위치에 다시 그립니다.

    if (this.x < -this.width) {
      this.x = 0;
    }
    // 바닥이 화면을 벗어났을때 x 값을 0으로 리셋하여 무한 스크롤 형태로 구현되어 있습니다.
  }

  reset() {
    this.x = 0;
  }
  // 바닥의 위치를 초기화 하는 기능입니다.
  // 게임이 리셋될 때 호출됩니다.
}

export default Ground;
