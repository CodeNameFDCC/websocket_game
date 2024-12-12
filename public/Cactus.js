// 선인장 객체의 생성 위치 업데이트 그리기 충돌 검사 기능을 제공합니다.
// 게임 내에서 선인장이 동적으로 움직이고 다른 객체와의 상호작용을 가능하게 합니다.
// 이 클래스는 CactiController와 함께 사용되어 게임의 요소로 작동됩니다.

class Cactus {
  constructor(ctx, x, y, width, height, image) {
    this.ctx = ctx;
    // 캔버스 컨텍스트
    this.x = x;
    // x좌표
    this.y = y;
    //y 좌표
    this.width = width;
    // 가로 크기
    this.height = height;
    // 새로크기
    this.image = image;
    // 선인장 이미지
  }
  //선인장의 속성

  update(speed, gameSpeed, deltaTime, scaleRatio) {
    this.x -= speed * gameSpeed * deltaTime * scaleRatio;
  }
  // 선인장의 위치를 업데이트 합니다.
  // 선인장의 속도 와 게임의 속도 조정값 이전 프레임과의 시간차이 스케일 비율을 고려하여 계산되었습니다.
  // 선인장은 왼쪽으로 이동하며 이동거리는 속도와 시간에 비례합니다.

  draw() {
    this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  // 선인장을 캔버스에 그립니다.
  // 현재 x 위치와 y위치에 시작해서 whidth와 height 크기만큼 그려집니다.

  collideWith(sprite) {
    // 주어진 스프라이트와의 충돌 여부를 검사합니다.
    const adjustBy = 1.4;
    // 충돌 검사 시 약간의 여유 조정값입니다.

    return (
      this.x < sprite.x + sprite.width / adjustBy &&
      this.x + this.width / adjustBy > sprite.x &&
      this.y < sprite.y + sprite.height / adjustBy &&
      this.y + this.height / adjustBy > sprite.y
    );
    // 선인장과 스프라이트 간의 충돌 여부를 판단합니다.
    // 충돌 계산 방식은 4각형 박스 형태입니다.
  }

  // 충돌검사 기능입니다.
}

export default Cactus;
