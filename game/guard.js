const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const angleTo = (a, b) => Math.atan2(b.y - a.y, b.x - a.x);
const wrapAngle = a => Math.atan2(Math.sin(a), Math.cos(a));

export function createGuard(def) {
  return { ...def, waypoint: 0, angle: angleTo(def, def.waypoints[0]), suspicion: 0, state: 'patrol', investigate: null, investigateTime: 0, lostTime: 0, spotted: 0 };
}

export function createCamera(def) { return { ...def, time: Math.random() * 5, spotted: 0 }; }

function blocked(a, b, obstacles) {
  const dx = b.x - a.x, dy = b.y - a.y, steps = Math.ceil(Math.hypot(dx, dy) / 9);
  for (let i = 1; i < steps; i++) {
    const x = a.x + dx * i / steps, y = a.y + dy * i / steps;
    if (obstacles.some(r => x > r.x && x < r.x + r.w && y > r.y && y < r.y + r.h)) return true;
  }
  return false;
}

export function sees(source, target, range, fov, obstacles, halfRange = false) {
  const d = dist(source, target);
  if (d > range * (halfRange ? 0.5 : 1)) return false;
  if (Math.abs(wrapAngle(angleTo(source, target) - source.angle)) > fov / 2) return false;
  return !blocked(source, target, obstacles);
}

function walkToward(actor, target, speed, dt) {
  const dx = target.x - actor.x, dy = target.y - actor.y, d = Math.hypot(dx, dy);
  if (d > 1) { actor.angle = Math.atan2(dy, dx); const step = Math.min(d, speed * dt); actor.x += dx / d * step; actor.y += dy / d * step; }
  return d;
}

export function updateGuard(g, dt, player, obstacles, sneaking, noise) {
  g.spotted = Math.max(0, g.spotted - dt);
  if (noise && dist(g, noise) < noise.radius) {
    g.investigate = { x: noise.x, y: noise.y }; g.investigateTime = 4.2;
    if (g.state === 'patrol') g.state = 'investigate';
  }
  const visible = sees(g, player, 245, 0.92, obstacles, sneaking);
  if (visible) { g.suspicion = clamp(g.suspicion + dt * 0.48, 0, 1); g.lostTime = 0; g.spotted = 0.24; }
  else { g.suspicion = clamp(g.suspicion - dt * (g.state === 'chase' ? 0.055 : 0.18), 0, 1); g.lostTime += dt; }
  if (g.suspicion >= 1) g.state = 'chase';
  if (g.state === 'chase' && g.lostTime > 3.1) g.state = 'search';
  if (g.state === 'search' && g.suspicion < 0.15) g.state = 'patrol';
  if (g.state === 'chase') walkToward(g, player, 112, dt);
  else if (g.state === 'investigate' && g.investigate) {
    if (walkToward(g, g.investigate, 84, dt) < 9 || (g.investigateTime -= dt) <= 0) { g.state = 'patrol'; g.investigate = null; }
  } else if (g.state === 'search') {
    const home = g.waypoints[g.waypoint]; if (walkToward(g, home, 58, dt) < 8) g.state = 'patrol';
  } else {
    const target = g.waypoints[g.waypoint];
    if (walkToward(g, target, g.speed, dt) < 8) g.waypoint = (g.waypoint + 1) % g.waypoints.length;
  }
  return { visible, caught: dist(g, player) < 20 && g.state === 'chase' };
}

export function updateCamera(cam, dt, player, obstacles, sneaking) {
  cam.time += dt; cam.angle = cam.base + Math.sin(cam.time * 0.56) * cam.sweep;
  const visible = sees(cam, player, cam.range, cam.fov, obstacles, sneaking);
  cam.spotted = visible ? 0.22 : Math.max(0, cam.spotted - dt);
  return visible;
}
