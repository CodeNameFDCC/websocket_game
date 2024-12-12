class Item {
    constructor(ctx, id, x, y, width, height, image) {
        this.ctx = ctx;
        this.id = id;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = image;
    }

    //아이템의 속성

    update(speed, gameSpeed, deltaTime, scaleRatio) {
        this.x -= speed * gameSpeed * deltaTime * scaleRatio;
    }

    // 아이템 속성 업데이트

    draw() {
        this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    // 아이템 그리기

    collideWith = (sprite) => {
        const adjustBy = 1.4;
        const result = (
            this.x < sprite.x + sprite.width / adjustBy &&
            this.x + this.width / adjustBy > sprite.x &&
            this.y < sprite.y + sprite.height / adjustBy &&
            this.y + this.height / adjustBy > sprite.y
        );

        if (result) {
            this.width = 0;
            this.height = 0;
            this.x = 0;
            this.y = 0;
        }

        // 충돌
        return result;
    }

    // 아이템의 충돌 검사
}

export default Item