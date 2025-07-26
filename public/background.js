var canvas;

const STARS_PER_1000 = 100;
let comets = [];
const COMET_COUNT = 100;

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.position(0, 0);
    canvas.style("z-index", "-1");
    for (let i = 0; i < COMET_COUNT; i++) {
        comets.push(new Comet());
    }
    frameRate(60);
}

function draw() {
    background(0,0, 0, 255);
    for (let comet of comets) {
        comet.update();
        comet.draw();
    }
}

class Comet {
    constructor() {
        this.respawn();
    }

    respawn() {
        // 从中心圆环外部生成（如80~160像素）
        this.center = createVector(width / 2, height / 2);
        let angle = random(TWO_PI);
        let r = random(80, 160); // 距离中心80~160像素
        this.pos = p5.Vector.add(this.center, p5.Vector.fromAngle(angle).mult(r));
        // 运动方向为从中心向外
        this.vel = p5.Vector.sub(this.pos, this.center).normalize().mult(random(2, 5));
        // 随机颜色
        if (random() < 0.5) {
            this.color = color(255, 255, 255); // 白色
        } else {
            this.color = color(255, 180, 60); // 橙黄色
        }
        this.tailLength = int(random(70, 120));
        this.history = [];
    }

    update() {
        this.history.push(this.pos.copy());
        if (this.history.length > this.tailLength) {
            this.history.shift();
        }
        this.pos.add(this.vel);
        // 超出画布边界则重生
        if (
            this.pos.x < -150 || this.pos.x > width + 150 ||
            this.pos.y < -500 || this.pos.y > height + 500
        ) {
            this.respawn();
        }
    }

    draw() {
        // 画拖尾
        for (let i = 1; i < this.history.length; i++) {
            let alpha = map(i, 1, this.history.length, 0, 180);
            stroke(red(this.color), green(this.color), blue(this.color), alpha);
            strokeWeight(map(i, 1, this.history.length, 0.5, 2.5));
            let prev = this.history[i - 1];
            let curr = this.history[i];
            line(prev.x, prev.y, curr.x, curr.y);
        }
        // 头部近大远小、近亮远暗
        let d = dist(this.pos.x, this.pos.y, this.center.x, this.center.y);
        let maxD = dist(0, 0, width / 2, height / 2);
        let size = map(d, 0, maxD, 16, 4, true); // 近大远小
        let brightness = map(d, 0, maxD, 255, 60, true); // 近亮远暗
        noStroke();
        for (let r = size; r > 0; r -= 4) {
            fill(red(this.color), green(this.color), blue(this.color), map(r, size, 0, brightness / 4, brightness));
            ellipse(this.pos.x, this.pos.y, r, r);
        }
    }
}