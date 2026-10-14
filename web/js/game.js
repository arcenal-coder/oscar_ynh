import { LEVELS, formatTime } from "./content.js";
import { background, ground, oscar, hazard, rect } from "./art.js";

export class Game {
  constructor(canvas, events) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.events = events;
    this.keys = new Set();
    this.running = false;
    this.paused = true;
    this.levelIndex = 0;
    this.totalTime = 0;
    this.trace = [];
    this.animationTime = 0;
    this.last = null;
    this.reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.frame = this.frame.bind(this);
    requestAnimationFrame(this.frame);
  }
  start() {
    this.totalTime = 0;
    this.trace = [];
    this.results = [];
    this.levelIndex = 0;
    this.running = true;
    this.loadLevel(0);
  }
  loadLevel(index) {
    this.levelIndex = index;
    this.level = LEVELS[index];
    this.time = 0;
    this.hazards = this.level.hazards.map((h) => ({
      ...h,
      identified: false,
      secured: false,
      flash: 0,
    }));
    this.player = {
      x: 170,
      y: 550,
      vx: 0,
      vy: 0,
      direction: 1,
      grounded: true,
    };
    this.camera = 0;
    this.checkpoint = 170;
    this.near = null;
    this.jumpHeld = false;
    // Raised safe walkways offer optional jumping; a single clearly marked gap
    // demonstrates the recovery mechanic without requiring a dangerous action.
    this.gaps = [[2850, 2940]];
    this.platforms = [
      { x: 1800, y: 475, width: 190 },
      { x: 4250, y: 470, width: 210 },
    ];
    this.events.level(this.level, index);
    this.setPaused(true);
  }
  setPaused(value) {
    this.paused = value;
    this.needsDraw = true;
    this.keys.clear();
    this.last = null;
  }
  setControl(key, value) {
    if (value) this.keys.add(key);
    else this.keys.delete(key);
  }
  interact() {
    if (!this.running || this.paused || !this.near || this.near.secured)
      return false;
    const h = this.near;
    h.secured = true;
    h.flash = 1;
    this.trace.push({ id: h.id, at: Math.round(this.totalTime * 1000) });
    this.setPaused(true);
    this.near = null;
    this.events.progress(this.hazards);
    this.events.near(null);
    this.events.secured(h);
    return true;
  }
  update(dt) {
    if (!this.running || this.paused) return;
    this.time += dt;
    this.totalTime += dt;
    const p = this.player,
      oldY = p.y;
    p.vx =
      (Number(this.keys.has("right")) - Number(this.keys.has("left"))) * 180;
    if (p.vx) p.direction = Math.sign(p.vx);
    const jumping = this.keys.has("jump");
    if (jumping && !this.jumpHeld && p.grounded) {
      p.vy = -650;
      p.grounded = false;
    }
    this.jumpHeld = jumping;
    p.vy += 1450 * dt;
    p.x = Math.max(45, Math.min(this.level.length - 40, p.x + p.vx * dt));
    p.y += p.vy * dt;
    p.grounded = false;
    const inGap = this.gaps.some(([a, b]) => p.x > a && p.x < b);
    if (!inGap && p.vy >= 0 && oldY <= 552 && p.y >= 550) {
      p.y = 550;
      p.vy = 0;
      p.grounded = true;
    }
    for (const platform of this.platforms) {
      if (
        p.vy >= 0 &&
        p.x > platform.x - 12 &&
        p.x < platform.x + platform.width + 12 &&
        oldY <= platform.y + 2 &&
        p.y >= platform.y
      ) {
        p.y = platform.y;
        p.vy = 0;
        p.grounded = true;
      }
    }
    if (p.y > 790) {
      p.x = this.checkpoint;
      p.y = 550;
      p.vy = 0;
      this.events.recovered();
    }
    if (
      p.grounded &&
      !inGap &&
      !this.gaps.some(([a]) => Math.abs(p.x - a) < 150)
    )
      this.checkpoint = p.x;
    this.camera = Math.max(0, Math.min(this.level.length - 1280, p.x - 420));
    let near = null;
    for (const h of this.hazards) {
      h.flash = Math.max(0, h.flash - dt * 0.65);
      if (
        Math.abs(p.x - h.x) < 155 &&
        Math.abs(p.y - 550) < 120 &&
        !h.secured
      ) {
        if (!h.identified) {
          h.identified = true;
          this.events.progress(this.hazards);
        }
        near = h;
      }
    }
    if (this.near?.id !== near?.id) {
      this.near = near;
      this.events.near(near);
    }
    if (p.x > this.level.length - 200) {
      if (this.hazards.every((h) => h.secured)) {
        this.results.push({
          identified: this.hazards.filter((h) => h.identified).length,
          secured: 5,
          time: this.time,
        });
        this.setPaused(true);
        this.events.finished(this.levelIndex, this.results);
      } else this.events.exitBlocked(this.hazards.find((h) => !h.secured));
    }
    this.events.clock(formatTime(this.totalTime));
  }
  frame(timestamp) {
    const dt =
      this.last === null ? 0 : Math.min((timestamp - this.last) / 1000, 0.04);
    this.last = timestamp;
    if (!this.paused) this.animationTime += dt;
    this.update(dt);
    if (this.running && (!this.paused || this.needsDraw)) {
      this.draw();
      this.needsDraw = false;
    }
    requestAnimationFrame(this.frame);
  }
  draw() {
    const ctx = this.ctx,
      cam = this.camera;
    ctx.clearRect(0, 0, 1280, 720);
    background(
      ctx,
      cam,
      this.levelIndex === 1,
      this.reducedMotion ? 0 : this.animationTime,
    );
    ctx.save();
    ctx.translate(-cam, 0);
    let edge = 0;
    for (const [a, b] of this.gaps) {
      ground(ctx, edge, 550, a - edge);
      edge = b;
    }
    ground(ctx, edge, 550, this.level.length - edge);
    for (const platform of this.platforms) {
      ground(ctx, platform.x, platform.y, platform.width, 30);
      rect(
        ctx,
        platform.x + 20,
        platform.y + 30,
        12,
        550 - platform.y - 30,
        "#4a6971",
      );
      rect(
        ctx,
        platform.x + platform.width - 32,
        platform.y + 30,
        12,
        550 - platform.y - 30,
        "#4a6971",
      );
    }
    for (const [a, b] of this.gaps) {
      rect(ctx, a - 11, 550, 11, 60, "#e8bc3b");
      rect(ctx, b, 550, 11, 60, "#e8bc3b");
      ctx.fillStyle = "#153746";
      ctx.font = "bold 14px Arial";
      ctx.textAlign = "center";
      ctx.fillText("ZONE DE JEU · SAUT ↗", a - 130, 510);
    }
    // Route markings and industrial wayfinding replace collectibles or rewards.
    for (let x = 450; x < this.level.length; x += 700) {
      ctx.fillStyle = "#e5bb3a";
      ctx.beginPath();
      ctx.moveTo(x, 586);
      ctx.lineTo(x + 35, 586);
      ctx.lineTo(x + 25, 575);
      ctx.lineTo(x + 48, 589);
      ctx.lineTo(x + 25, 603);
      ctx.lineTo(x + 35, 592);
      ctx.lineTo(x, 592);
      ctx.fill();
      if (x % 1400 === 450) {
        rect(ctx, x, 343, 110, 37, "#eef0d9", 3);
        ctx.fillStyle = "#335965";
        ctx.font = "bold 10px Arial";
        ctx.textAlign = "center";
        ctx.fillText(
          this.levelIndex === 0 ? "PRÉVENTION →" : "ATELIER →",
          x + 55,
          366,
        );
      }
    }
    for (const h of this.hazards) {
      if (h.x - cam < -200 || h.x - cam > 1480) continue;
      hazard(ctx, h, this.reducedMotion ? 0 : this.animationTime);
      if (h.flash > 0) {
        ctx.save();
        ctx.globalAlpha = h.flash * 0.5;
        ctx.strokeStyle = "#3d9c78";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(h.x, 490, 40 + (1 - h.flash) * 80, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    }
    const exit = this.level.length - 170;
    rect(ctx, exit - 45, 380, 110, 170, "#457566", 6);
    rect(ctx, exit - 32, 393, 84, 150, "#a7bd9d", 4);
    rect(ctx, exit - 39, 358, 98, 30, "#f0f0dc", 4);
    ctx.fillStyle = "#325b4f";
    ctx.font = "bold 15px Arial";
    ctx.textAlign = "center";
    ctx.fillText("SORTIE →", exit + 10, 379);
    oscar(ctx, this.player.x, this.player.y, {
      direction: this.player.direction,
      walking: !!this.player.vx && !this.paused,
      time: this.reducedMotion ? 0 : this.animationTime,
      jumping: !this.player.grounded,
      scale: 0.77,
    });
    ctx.restore();
  }
}
