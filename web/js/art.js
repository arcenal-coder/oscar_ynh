// Original vector artwork. No downloaded sprites, fonts or remote assets.
const C = {
  ink: "#193b48",
  yellow: "#f1c342",
  orange: "#ee8041",
  steel: "#71909b",
  dark: "#234855",
};
export function rect(ctx, x, y, w, h, color, radius = 0) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, radius);
  ctx.fill();
}
function line(ctx, points, color, width = 2) {
  ctx.beginPath();
  ctx.moveTo(...points[0]);
  points.slice(1).forEach((p) => ctx.lineTo(...p));
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.stroke();
}
function ellipse(ctx, x, y, rx, ry, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}
function pipe(ctx, x, y, h, width = 32) {
  rect(ctx, x + 7, y, width, h, "#486b78", 4);
  rect(ctx, x, y, width - 1, h, "#adc0c4", 4);
  rect(ctx, x + 4, y, 6, h, "#dce6df");
  for (let yy = y + 20; yy < y + h; yy += 85) {
    rect(ctx, x - 5, yy, width + 11, 9, "#526f7a", 2);
    rect(ctx, x - 3, yy, width + 7, 3, "#cbd6d0");
  }
}
function tank(ctx, x, y, w, h, factory) {
  rect(ctx, x, y, w, h, "#9eb2b7");
  rect(ctx, x + 10, y, w * 0.4, h, "#baccce");
  ellipse(ctx, x + w / 2, y, w / 2, 18, "#d2ddd6");
  rect(ctx, x, y + h * 0.46, w, 19, factory ? "#698e94" : "#d7a38c");
  rect(ctx, x + w - 28, y, 18, h, "#89a3aa");
  for (let yy = y + 10; yy < y + h; yy += 24)
    line(
      ctx,
      [
        [x + w - 27, yy],
        [x + w - 11, yy],
      ],
      "#cedbd7",
      3,
    );
  line(
    ctx,
    [
      [x + w - 30, y],
      [x + w - 30, y + h],
    ],
    "#627f87",
    3,
  );
}
export function background(ctx, camera, factory = false, time = 0) {
  const sky = ctx.createLinearGradient(0, 0, 0, 560);
  sky.addColorStop(0, factory ? "#c0d4d4" : "#9fcdd5");
  sky.addColorStop(1, "#eff0d8");
  rect(ctx, 0, 0, 1280, 720, sky);
  ellipse(ctx, 1050 - camera * 0.015, 100, 65, 65, "#fbf4cf");
  for (let i = -1; i < 8; i++) {
    const x = i * 340 - ((camera * 0.1) % 340);
    ellipse(ctx, x, 110 + (i % 3) * 28, 90, 13, "#ecf3e6");
  }
  ctx.save();
  ctx.translate(-((camera * 0.22) % 1400), 0);
  for (let i = -1; i < 6; i++) {
    const x = i * 360;
    rect(ctx, x + 25, 240, 200, 285, "#bacbc4");
    if (factory) {
      line(
        ctx,
        [
          [x, 250],
          [x + 80, 200],
          [x + 80, 250],
          [x + 160, 200],
          [x + 160, 250],
          [x + 240, 200],
          [x + 240, 440],
        ],
        "#93b0b2",
        18,
      );
      for (let j = 0; j < 4; j++) rect(ctx, x + j * 50, 285, 32, 78, "#a5bec0");
    } else {
      rect(ctx, x + 70, 70, 35, 400, "#9eb6b7");
      ellipse(ctx, x + 87, 70, 18, 12, "#c3d1c9");
      for (let yy = 125; yy < 450; yy += 90)
        rect(ctx, x + 51, yy, 75, 8, "#d9c16e");
    }
  }
  ctx.restore();
  ctx.save();
  ctx.translate(-((camera * 0.45) % 1600), 0);
  for (let i = -1; i < 5; i++) {
    const x = i * 540;
    if (factory) {
      rect(ctx, x, 180, 400, 350, "#819fa7", 3);
      rect(ctx, x + 12, 195, 375, 45, "#e3e9d7");
      for (let j = 0; j < 5; j++) {
        rect(ctx, x + 26 + j * 75, 265, 50, 65, "#476b79", 3);
        rect(ctx, x + 30 + j * 75, 269, 17, 55, "#b3d4ce");
      }
      rect(ctx, x + 90, 385, 190, 140, "#456b78", 5);
      for (let yy = 395; yy < 520; yy += 20)
        line(
          ctx,
          [
            [x + 95, yy],
            [x + 275, yy],
          ],
          "#6d909a",
          3,
        );
      rect(ctx, x + 210, 100, 32, 80, "#6f939d");
    } else {
      tank(ctx, x + 210, 280, 235, 250, false);
      pipe(ctx, x + 40, 140, 390, 40);
      pipe(ctx, x + 112, 200, 330, 24);
      for (let yy = 170; yy < 500; yy += 105) {
        rect(ctx, x + 15, yy, 165, 10, "#6c8994");
        line(
          ctx,
          [
            [x + 16, yy - 25],
            [x + 180, yy - 25],
            [x + 180, yy],
          ],
          "#d9b83a",
          4,
        );
      }
    }
  }
  ctx.restore();
  // Elevated pipework and yellow collective protection behind the walkway.
  rect(ctx, 0, 450, 1280, 14, "#637e86");
  rect(ctx, 0, 451, 1280, 4, "#c3d0c6");
  for (let i = -1; i < 14; i++) {
    const x = i * 150 - (camera % 150);
    line(
      ctx,
      [
        [x, 537],
        [x, 420],
        [x + 150, 420],
        [x + 150, 537],
      ],
      "#b58c21",
      9,
    );
    line(
      ctx,
      [
        [x, 419],
        [x + 150, 419],
      ],
      "#f4d265",
      5,
    );
    line(
      ctx,
      [
        [x, 477],
        [x + 150, 477],
      ],
      "#e6b839",
      5,
    );
  }
  // Ground is drawn separately for gaps.
  rect(ctx, 0, 620, 1280, 100, "#254956");
  for (let i = -1; i < 9; i++) {
    const x = i * 200 - (camera % 200);
    line(
      ctx,
      [
        [x, 620],
        [x + 100, 720],
        [x + 200, 620],
      ],
      "#3e6270",
      12,
    );
  }
  rect(ctx, 0, 664, 1280, 16, "#d6a72e");
  line(
    ctx,
    [
      [0, 662],
      [1280, 662],
    ],
    "#f2cc58",
    4,
  );
  if (!factory) {
    ctx.save();
    ctx.globalAlpha = 0.15;
    ellipse(ctx, 1165, 125 - Math.sin(time * 0.4) * 6, 38, 7, "#ffffff");
    ctx.restore();
  }
}
export function ground(ctx, x, y, w, h = 100) {
  rect(ctx, x, y, w, h, "#71848a");
  rect(ctx, x, y, w, 15, "#d1d6c8");
  rect(ctx, x, y + 15, w, 7, "#93a49d");
  for (let xx = x; xx < x + w; xx += 180) {
    line(
      ctx,
      [
        [xx + 2, y + 2],
        [xx + 2, y + 75],
      ],
      "#536f77",
      2,
    );
    rect(ctx, xx + 18, y + 36, 16, 10, "#b9c6c0", 2);
    ellipse(ctx, xx + 23, y + 41, 2, 2, "#526c77");
  }
  rect(ctx, x, y + h - 10, w, 10, "#193c4c");
}
export function oscar(
  ctx,
  x,
  y,
  { scale = 1, direction = 1, walking = false, time = 0, jumping = false } = {},
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale * direction, scale);
  const step = walking ? Math.sin(time * 11) * 0.5 : 0;
  const bob = walking
    ? Math.abs(Math.sin(time * 11)) * 2
    : Math.sin(time * 2) * 0.6;
  ctx.translate(0, -bob);
  ellipse(ctx, 0, 0, 25, 5, "#173a4b25");
  function limb(px, py, length, angle, width, color, stripe = false) {
    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(angle);
    rect(ctx, -width / 2, 0, width, length, color, 6);
    if (stripe) rect(ctx, -width / 2, length * 0.65, width, 6, "#d5e3cf");
    ctx.restore();
  }
  limb(-8, -44, 38, step + (jumping ? -0.5 : 0), 17, "#294b5c", true);
  limb(9, -44, 38, -step + (jumping ? 0.4 : 0), 17, "#213f50", true);
  ctx.save();
  ctx.translate(-8 - Math.sin(step) * 30, -8);
  ctx.rotate(step * 0.3);
  rect(ctx, -10, -4, 25, 11, "#19313d", 4);
  rect(ctx, -11, 4, 28, 4, "#112b35", 2);
  ctx.restore();
  ctx.save();
  ctx.translate(10 + Math.sin(step) * 30, -8);
  ctx.rotate(-step * 0.3);
  rect(ctx, -9, -4, 27, 11, "#19313d", 4);
  rect(ctx, -10, 4, 30, 4, "#112b35", 2);
  ctx.restore();
  limb(-18, -84, 34, -0.28 - step, 15, "#d76c33", true);
  ellipse(ctx, -22 - Math.sin(-step) * 20, -51, 8, 9, "#244553");
  rect(ctx, -20, -89, 42, 49, "#eb7a38", 10);
  rect(ctx, -18, -63, 38, 8, "#dce6cd");
  rect(ctx, -12, -87, 7, 44, "#f3f1cb");
  rect(ctx, 10, -87, 7, 44, "#f3f1cb");
  line(
    ctx,
    [
      [3, -85],
      [3, -43],
    ],
    "#ab5929",
    2,
  );
  rect(ctx, -20, -44, 42, 6, "#314956", 2);
  rect(ctx, 0, -44, 8, 6, "#d5b64c", 1);
  limb(21, -82, 30, 0.28 + step, 15, "#f08b48", true);
  ellipse(ctx, 21 - Math.sin(step) * 23, -51, 8, 9, "#244553");
  rect(ctx, -3, -100, 15, 17, "#d1946c", 4);
  ellipse(ctx, 4, -113, 23, 26, "#efba88");
  ellipse(ctx, -15, -113, 6, 8, "#dca375");
  // Hair, friendly beard, nose and a deliberately readable smiling face.
  rect(ctx, -16, -129, 10, 20, "#654b3a", 4);
  ctx.fillStyle = "#6b4934";
  ctx.beginPath();
  ctx.moveTo(-12, -108);
  ctx.quadraticCurveTo(2, -89, 20, -107);
  ctx.lineTo(20, -98);
  ctx.quadraticCurveTo(3, -82, -12, -99);
  ctx.fill();
  ellipse(ctx, 22, -112, 7, 5, "#efba88");
  ellipse(ctx, 11, -117, 4, 5, "#fff9e6");
  ellipse(ctx, 13, -117, 2, 3, "#153746");
  line(
    ctx,
    [
      [7, -125],
      [15, -126],
    ],
    "#644831",
    3,
  );
  ctx.fillStyle = "#fff7e7";
  ctx.beginPath();
  ctx.moveTo(3, -104);
  ctx.quadraticCurveTo(12, -98, 20, -105);
  ctx.quadraticCurveTo(10, -92, 3, -104);
  ctx.fill();
  // Helmet sits on the head in every pose.
  ctx.fillStyle = C.yellow;
  ctx.beginPath();
  ctx.moveTo(-23, -127);
  ctx.quadraticCurveTo(-25, -155, 3, -157);
  ctx.quadraticCurveTo(27, -157, 27, -129);
  ctx.fill();
  line(
    ctx,
    [
      [-22, -127],
      [28, -129],
      [35, -126],
    ],
    "#ac7c20",
    5,
  );
  line(
    ctx,
    [
      [-22, -129],
      [30, -131],
    ],
    "#ffe47a",
    4,
  );
  line(
    ctx,
    [
      [0, -152],
      [0, -134],
    ],
    "#d69d27",
    5,
  );
  line(
    ctx,
    [
      [-13, -145],
      [-17, -135],
    ],
    "#ffe98b",
    3,
  );
  ctx.restore();
}
function cone(ctx, x, y) {
  rect(ctx, x - 20, y - 4, 40, 7, "#ba592b", 3);
  ctx.fillStyle = "#eb7c38";
  ctx.beginPath();
  ctx.moveTo(x - 15, y - 3);
  ctx.lineTo(x - 4, y - 51);
  ctx.lineTo(x + 4, y - 51);
  ctx.lineTo(x + 15, y - 3);
  ctx.fill();
  line(
    ctx,
    [
      [x - 8, y - 30],
      [x + 8, y - 30],
    ],
    "#f7f0d9",
    8,
  );
}
function warning(ctx, x, y, size = 25) {
  ctx.fillStyle = "#f5ce54";
  ctx.strokeStyle = "#233e48";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x, y - size);
  ctx.lineTo(x - size, y + size * 0.8);
  ctx.lineTo(x + size, y + size * 0.8);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  line(
    ctx,
    [
      [x, y - size * 0.35],
      [x, y + size * 0.18],
    ],
    "#233e48",
    4,
  );
  ellipse(ctx, x, y + size * 0.48, 2.3, 2.3, "#233e48");
}
function barricade(ctx, x, y) {
  rect(ctx, x - 65, y - 72, 130, 24, "#f4c543", 3);
  for (let i = 0; i < 5; i++)
    line(
      ctx,
      [
        [x - 58 + i * 27, y - 69],
        [x - 45 + i * 27, y - 51],
      ],
      "#2b4350",
      9,
    );
  line(
    ctx,
    [
      [x - 48, y - 47],
      [x - 48, y],
      [x - 60, y],
    ],
    "#d77e34",
    5,
  );
  line(
    ctx,
    [
      [x + 48, y - 47],
      [x + 48, y],
      [x + 60, y],
    ],
    "#d77e34",
    5,
  );
}
export function hazard(ctx, h, time, y = 550) {
  const x = h.x,
    done = h.secured;
  if (!done) {
    ellipse(ctx, x, y + 1, 85, 8, "#cd8b2822");
    ctx.save();
    ctx.globalAlpha = 0.65 + Math.sin(time * 2) * 0.15;
    warning(ctx, x, y - 142, 18);
    ctx.restore();
  }
  switch (h.type) {
    case "sol":
      ellipse(ctx, x, y - 2, 64, 8, "#5a9cab");
      ellipse(ctx, x - 12, y - 4, 25, 3, "#a7d3ce");
      if (done) {
        cone(ctx, x - 74, y);
        cone(ctx, x + 74, y);
      }
      break;
    case "fuite":
      pipe(ctx, x - 56, y - 92, 89, 48);
      line(
        ctx,
        [
          [x - 26, y - 72],
          [x + 20, y - 72],
        ],
        "#8ba9b2",
        22,
      );
      ellipse(ctx, x + 20, y - 72, 8, 12, "#385d6b");
      for (let i = 0; i < 4; i++) {
        const d = (time * 1.2 + i / 4) % 1;
        ellipse(ctx, x + 25 + d * 16, y - 68 + d * 65, 3, 6, "#7fc1cd");
      }
      ellipse(ctx, x + 40, y - 2, 35, 5, "#6eabb5");
      if (done) barricade(ctx, x + 15, y);
      break;
    case "zone":
      rect(ctx, x - 57, y - 6, 114, 6, "#e4b243");
      cone(ctx, x - 65, y);
      cone(ctx, x + 65, y);
      if (done) barricade(ctx, x, y);
      else
        line(
          ctx,
          [
            [x - 62, y - 40],
            [x - 22, y - 23],
          ],
          "#f2c54d",
          5,
        );
      break;
    case "caisse": {
      const xx = done ? x + 70 : x;
      rect(ctx, xx - 29, y - 42, 58, 42, "#bc8f56", 3);
      line(
        ctx,
        [
          [xx - 25, y - 37],
          [xx + 25, y - 6],
        ],
        "#8d693e",
        4,
      );
      line(
        ctx,
        [
          [xx + 25, y - 37],
          [xx - 25, y - 6],
        ],
        "#8d693e",
        4,
      );
      if (done)
        line(
          ctx,
          [
            [x + 36, y + 2],
            [x + 110, y + 2],
          ],
          "#e5bf45",
          4,
        );
      break;
    }
    case "lunettes":
      rect(ctx, x - 40, y - 85, 80, 80, "#d4ded7", 4);
      rect(ctx, x - 36, y - 80, 72, 20, "#678d9a", 3);
      ctx.fillStyle = "#fffbed";
      ctx.font = "bold 10px Arial";
      ctx.textAlign = "center";
      ctx.fillText("EPI DU POSTE", x, y - 66);
      if (done) {
        line(
          ctx,
          [
            [x - 27, y - 40],
            [x + 27, y - 40],
          ],
          "#244757",
          4,
        );
        rect(ctx, x - 25, y - 43, 21, 15, "#a8dbe0", 5);
        rect(ctx, x + 4, y - 43, 21, 15, "#a8dbe0", 5);
      } else {
        ctx.strokeStyle = "#9cafad";
        ctx.setLineDash([5, 4]);
        ctx.strokeRect(x - 27, y - 45, 54, 22);
        ctx.setLineDash([]);
      }
      break;
    case "machine":
      rect(ctx, x - 70, y - 101, 140, 100, "#71959f", 6);
      rect(ctx, x - 55, y - 90, 76, 72, "#274b5a", 4);
      ellipse(ctx, x - 20, y - 55, 24, 24, "#b7c6bb");
      ellipse(ctx, x - 20, y - 55, 11, 11, "#526e77");
      rect(ctx, x + 32, y - 80, 24, 32, "#d4ded0", 3);
      ellipse(ctx, x + 44, y - 67, 5, 5, "#dba839");
      if (done) barricade(ctx, x, y);
      break;
    case "stock":
      for (const side of [-1, 1])
        rect(ctx, x + side * 58, y - 116, 7, 116, "#627f87");
      for (let i = 0; i < 2; i++)
        rect(ctx, x - 62, y - 43 - i * 65, 130, 7, "#c59c40");
      ctx.save();
      ctx.translate(x, y - 75);
      ctx.rotate(0.16);
      rect(ctx, -40, -32, 60, 38, "#d29265", 4);
      rect(ctx, -30, -20, 30, 5, "#ecd3aa");
      ctx.restore();
      if (done) barricade(ctx, x, y);
      break;
    case "chariot": {
      const xx = done ? x + 80 : x;
      rect(ctx, xx - 43, y - 26, 86, 12, "#69909a", 3);
      line(
        ctx,
        [
          [xx + 35, y - 25],
          [xx + 35, y - 74],
          [xx + 18, y - 74],
        ],
        "#456976",
        5,
      );
      ellipse(ctx, xx - 25, y - 8, 9, 9, "#274651");
      ellipse(ctx, xx + 25, y - 8, 9, 9, "#274651");
      if (done)
        line(
          ctx,
          [
            [xx - 50, y + 2],
            [xx + 50, y + 2],
          ],
          "#e4bd41",
          4,
        );
      break;
    }
    case "panneau":
      line(
        ctx,
        [
          [x, y],
          [x, y - 100],
        ],
        "#6b8790",
        7,
      );
      if (done) {
        rect(ctx, x - 35, y - 109, 70, 48, "#316e93", 4);
        line(
          ctx,
          [
            [x - 20, y - 85],
            [x + 20, y - 85],
            [x + 10, y - 95],
          ],
          "#eef2dd",
          6,
        );
      } else {
        ctx.strokeStyle = "#8da5a8";
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(x - 35, y - 109, 70, 48);
        ctx.setLineDash([]);
      }
      break;
    case "bruit":
      rect(ctx, x - 65, y - 58, 110, 51, "#8ea29c", 20);
      ellipse(ctx, x + 40, y - 33, 18, 25, "#607d88");
      for (let i = 0; i < 3; i++)
        line(
          ctx,
          [
            [x + 63 + i * 12, y - 50 - i * 5],
            [x + 67 + i * 12, y - 33],
            [x + 63 + i * 12, y - 17 + i * 5],
          ],
          "#ae8e42",
          3,
        );
      if (done) {
        rect(ctx, x - 45, y - 126, 90, 46, "#397d9d", 5);
        ctx.strokeStyle = "#fff6d9";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(x, y - 102, 13, Math.PI, 0);
        ctx.stroke();
        rect(ctx, x - 16, y - 105, 7, 16, "#fff6d9", 3);
        rect(ctx, x + 9, y - 105, 7, 16, "#fff6d9", 3);
      }
      break;
  }
  if (done) {
    ellipse(ctx, x, y - 141, 17, 17, "#318269");
    line(
      ctx,
      [
        [x - 8, y - 141],
        [x - 2, y - 135],
        [x + 9, y - 147],
      ],
      "#f9f7dc",
      4,
    );
  }
}
export function drawHero(canvas) {
  const ctx = canvas.getContext("2d");
  ctx.save();
  ctx.scale(canvas.width / 850, canvas.height / 780);
  ctx.save();
  ctx.scale(850 / 1280, 780 / 720);
  background(ctx, 350, false, 0);
  ground(ctx, 0, 550, 1280);
  ctx.restore();
  // Graphic accents make this illustration feel like an editorial cover.
  ellipse(ctx, 445, 495, 180, 25, "#173b4b20");
  oscar(ctx, 447, 555, { scale: 2.8, direction: 1, walking: true, time: 0.09 });
  cone(ctx, 654, 566);
  warning(ctx, 665, 485, 30);
  rect(ctx, 53, 85, 150, 31, "#f8f7e9", 5);
  ctx.fillStyle = C.ink;
  ctx.font = "bold 12px Arial";
  ctx.textAlign = "center";
  ctx.fillText("MISSION ZÉRO ACCIDENT", 128, 105);
  line(
    ctx,
    [
      [725, 150],
      [725, 206],
    ],
    "#faf5d3",
    3,
  );
  line(
    ctx,
    [
      [697, 178],
      [753, 178],
    ],
    "#faf5d3",
    3,
  );
  ctx.restore();
}
