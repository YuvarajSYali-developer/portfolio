"""Hero film: 'Nature → Neural → Signal'.

One particle system (luminous water) that flows down a night waterfall, then
reorganises into a neural network with travelling synaptic pulses, then
unravels into flowing EEG traces, and returns to water. Seamless 16 s loop.
Writes PNG frames to argv[1].
"""
import math, os, sys
import numpy as np
import cv2

OUT = sys.argv[1]
W, H = 1280, 720
FPS, SECS = 30, 16
NF = FPS * SECS
os.makedirs(OUT, exist_ok=True)
rng = np.random.default_rng(3)

BLUE = np.array([98, 138, 255], np.float32) / 255
CYAN = np.array([50, 214, 229], np.float32) / 255
VIOLET = np.array([139, 122, 255], np.float32) / 255
WHITE = np.array([0.92, 0.96, 1.0], np.float32)

def smooth(x):
    x = np.clip(x, 0, 1)
    return x * x * (3 - 2 * x)

# ───────────── Static landscape ─────────────
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
sky = np.zeros((H, W, 3), np.float32)
g = yy / H
sky[..., 0] = 0.025 + 0.05 * g
sky[..., 1] = 0.03 + 0.045 * g
sky[..., 2] = 0.06 + 0.13 * g
# horizon glow (violet/blue)
hg = np.exp(-((yy - H * 0.55) ** 2) / (2 * (H * 0.16) ** 2))[..., None]
sky += hg * (VIOLET * 0.10 + BLUE * 0.05)

stars_xy = np.stack([rng.uniform(0, W, 420), rng.uniform(0, H * 0.55, 420)], 1)
stars_b = rng.uniform(0.15, 0.9, 420) ** 2
stars_f = rng.integers(1, 4, 420)
stars_p = rng.uniform(0, 2 * np.pi, 420)

def ridge(seed, base, amp, freqs):
    r = np.random.default_rng(seed)
    x = np.arange(W, dtype=np.float32)
    h = np.full(W, base, np.float32)
    for f in freqs:
        h += amp / f * np.sin(x / W * 2 * np.pi * f + r.uniform(0, 6.28))
    return h

far = ridge(1, H * 0.50, 70, [1, 2.3, 5.1, 11.7, 23.3])
mid = ridge(2, H * 0.60, 90, [1.4, 3.1, 7.3, 15.9, 31.1])
# gorge: a cliff whose top edge curves down into the hills on both sides
cx = W * 0.5
xs_ = np.arange(W, dtype=np.float32)
cliff_top = (H * 0.30 + ((xs_ - cx) / W) ** 2 * 90
             + ridge(3, 0, 26, [1.3, 3.1, 8.3, 19.2, 41.9]))
# a gentle V-notch where the water pours over
cliff_top += 10 * np.exp(-((xs_ - cx) ** 2) / (2 * 40 ** 2))

def layer_mask(h, soft=1.5):
    return np.clip((yy - h[None, :]) / soft, 0, 1)

far_m = layer_mask(far)[..., None]
mid_m = layer_mask(mid)[..., None]
rock_m = cv2.GaussianBlur(layer_mask(cliff_top), (0, 0), 1.0)[..., None]
# faint vertical strata texture on the rock face
rim = np.exp(-((yy - cliff_top[None, :] - 1.5) ** 2) / (2 * 1.2 ** 2))[..., None]
strata = (0.85 + 0.15 * np.sin(xx * 0.09 + np.sin(yy * 0.02) * 3))[..., None]

FAR_C = np.array([0.055, 0.07, 0.13], np.float32)
MID_C = np.array([0.035, 0.045, 0.085], np.float32)
ROCK_C = np.array([0.018, 0.022, 0.04], np.float32)

mist = np.exp(-((yy - H * 0.74) ** 2) / (2 * (H * 0.05) ** 2))[..., None] * np.exp(-((xx - cx) ** 2) / (2 * (W * 0.22) ** 2))[..., None]

def landscape(t, k):
    """k = how much 'nature' is visible (1 waterfall scene → 0.35 abstract scenes)."""
    img = sky.copy()
    # stars
    tw = 0.55 + 0.45 * np.sin(2 * np.pi * stars_f * t + stars_p)
    sb = np.zeros((H, W), np.float32)
    xs = stars_xy[:, 0].astype(int); ys = stars_xy[:, 1].astype(int)
    np.add.at(sb, (ys, xs), stars_b * tw)
    sb = cv2.GaussianBlur(sb, (0, 0), 0.7) * 3
    img += sb[..., None] * WHITE
    land = img * (1 - far_m) + FAR_C * far_m
    land = land * (1 - mid_m) + MID_C * mid_m
    land = land * (1 - rock_m) + ROCK_C * strata * rock_m
    land += rim * (BLUE * 0.10 + VIOLET * 0.06)
    land += mist * (CYAN * 0.10 + WHITE * 0.05) * (0.8 + 0.2 * math.sin(2 * math.pi * t))
    return img * (1 - k) * 0.6 + land * (k + (1 - k) * 0.4)

# ───────────── Particle states ─────────────
N = 14000
u0 = rng.random(N).astype(np.float32)           # flow phase
lane = rng.normal(0, 1, N).astype(np.float32)   # lateral offset
speed = rng.uniform(0.8, 1.25, N).astype(np.float32)
spd_k = np.round(speed * 2).astype(np.float32)  # integer cycles per loop (seamless)
spd_k[spd_k < 1] = 1
bright = rng.uniform(0.35, 1.0, N).astype(np.float32) ** 1.5

def state_water(t):
    u = (u0 + spd_k * t) % 1.0
    x = np.empty(N, np.float32); y = np.empty(N, np.float32)
    fall = u < 0.5
    f = u[fall] / 0.5
    top, bottom = H * 0.315, H * 0.74
    x[fall] = cx + lane[fall] * (26 + 34 * f) + np.sin(f * 7 + lane[fall] * 3) * 4
    y[fall] = top + (f ** 1.7) * (bottom - top)
    r = ~fall
    v = (u[r] - 0.5) / 0.5
    meander = np.sin(v * 3.4 + 0.6) * W * 0.12 * v
    width = 30 + v * 260
    x[r] = cx + meander + lane[r] * width * 0.45
    y[r] = bottom + 6 + (v ** 1.15) * (H - bottom + 40)
    col = np.where(fall[:, None], WHITE * 0.6 + CYAN * 0.4, CYAN * 0.7 + BLUE * 0.3)
    b = bright * np.where(fall, 0.35 + 0.65 * np.clip(u / 0.5, 0, 1) ** 0.6, 0.8 * (1 - 0.4 * np.clip((u - 0.5) * 2, 0, 1)))
    return x, y, col, b

# neural network: 3D layered graph, slowly rotating
layers = [7, 11, 13, 11, 7]
nodes = []
for li, n in enumerate(layers):
    for i in range(n):
        a = (i / n) * 2 * np.pi
        rad = 0.55 + 0.25 * rng.random()
        nodes.append([(li - 2) * 0.62, math.sin(a) * rad, math.cos(a) * rad, li])
nodes = np.array(nodes, np.float32)
edges = []
for a in range(len(nodes)):
    for b in range(len(nodes)):
        if nodes[b, 3] == nodes[a, 3] + 1 and rng.random() < 0.30:
            edges.append((a, b))
edges = np.array(edges)
edge_of = rng.integers(0, len(edges), N)
node_share = rng.random(N) < 0.28  # particles that cluster on nodes
node_of = rng.integers(0, len(nodes), N)
jitter = rng.normal(0, 1, (N, 3)).astype(np.float32)

def project(p, t):
    ang = 2 * np.pi * t  # one full turn per loop
    ca, sa = math.cos(ang), math.sin(ang)
    x = p[:, 0] * ca + p[:, 2] * sa
    z = -p[:, 0] * sa + p[:, 2] * ca
    y = p[:, 1]
    tilt = 0.25
    y2 = y * math.cos(tilt) - z * math.sin(tilt)
    z2 = y * math.sin(tilt) + z * math.cos(tilt)
    s = 520 / (z2 + 3.4)
    return W / 2 + x * s, H * 0.47 + y2 * s, z2

def state_neural(t):
    e = edges[edge_of]
    pa = nodes[e[:, 0], :3]; pb = nodes[e[:, 1], :3]
    ph = (u0 * 3 + spd_k * 2 * t) % 1.0  # signals travel along edges
    p = pa + (pb - pa) * ph[:, None]
    nd = nodes[node_of, :3] + jitter * 0.035
    p = np.where(node_share[:, None], nd, p)
    x, y, z = project(p, t * 0.5 % 1 if False else t)
    depth = np.clip((1.4 - z) / 2.8, 0.15, 1)
    # pulse: brighter near the head of a signal
    pulse = np.where(node_share, 0.9, 0.35 + 0.65 * np.exp(-((ph - 0.85) ** 2) / 0.01))
    col = np.where(node_share[:, None], WHITE * 0.5 + VIOLET * 0.5, BLUE * 0.6 + VIOLET * 0.4)
    col = np.where((pulse > 0.8)[:, None] & ~node_share[:, None], CYAN, col)
    return x, y, col, bright * depth * pulse * 1.15

N_CH = 9
ch = (np.arange(N) % N_CH)
ch_freq = [(3, 7, 13), (2, 9, 17), (4, 6, 19), (3, 8, 23), (5, 7, 11), (2, 11, 29), (3, 5, 17), (4, 9, 21), (2, 7, 15)]
ch_col = [CYAN, BLUE, VIOLET]

def state_signal(t):
    xu = (u0 + spd_k * t * 0.5) % 1.0  # left → right flow
    x = -40 + xu * (W + 80)
    base = H * 0.22 + ch * (H * 0.62 / (N_CH - 1))
    y = np.zeros(N, np.float32)
    for c in range(N_CH):
        m = ch == c
        f1, f2, f3 = ch_freq[c]
        ph = 2 * np.pi * t
        xx_ = xu[m] * 2 * np.pi
        v = (np.sin(xx_ * f1 + ph * 1 + c) * 0.55 + np.sin(xx_ * f2 - ph * 2 + c * 2) * 0.3 + np.sin(xx_ * f3 + ph * 3) * 0.15)
        env = 0.6 + 0.4 * np.sin(xx_ * 1 + ph + c)
        y[m] = base[m] + v * 22 * env + lane[m] * 1.6
    col = np.stack([ch_col[c % 3] for c in range(N_CH)])[ch]
    edge = np.clip(np.minimum(xu, 1 - xu) * 8, 0, 1)
    return x, y, col, bright * 0.85 * edge

# ───────────── Timeline (seconds) ─────────────
#  0–4 water | 4–6 → neural | 6–9.5 neural | 9.5–11.5 → signal | 11.5–14 signal | 14–16 → water
def weights(sec):
    a = smooth((sec - 4) / 2)       # water→neural
    b = smooth((sec - 9.5) / 2)     # neural→signal
    c = smooth((sec - 14) / 2)      # signal→water
    w_water = (1 - a) + c
    w_neural = a * (1 - b)
    w_signal = b * (1 - c)
    return w_water, w_neural, w_signal, a, b, c

order = rng.permutation(N).astype(np.float32) / N  # staggered morph per particle

for f in range(NF):
    t = f / NF
    sec = t * SECS
    ww, wn, ws, a, b, c = weights(sec)
    # per-particle staggered blend for organic transitions
    def stag(k):
        return smooth(np.clip((k * 1.6 - order * 0.6), 0, 1))
    sa, sb_, sc = stag(a), stag(b), stag(c)
    xw, yw, cw, bw = state_water(t)
    xn, yn, cn, bn = state_neural(t)
    xs, ys, cs, bs = state_signal(t)
    # chain the blends: water→neural→signal→water
    x = xw * (1 - sa) + xn * sa
    y = yw * (1 - sa) + yn * sa
    col = cw * (1 - sa)[:, None] + cn * sa[:, None]
    br = bw * (1 - sa) + bn * sa
    x = x * (1 - sb_) + xs * sb_
    y = y * (1 - sb_) + ys * sb_
    col = col * (1 - sb_)[:, None] + cs * sb_[:, None]
    br = br * (1 - sb_) + bs * sb_
    x = x * (1 - sc) + xw * sc
    y = y * (1 - sc) + yw * sc
    col = col * (1 - sc)[:, None] + cw * sc[:, None]
    br = br * (1 - sc) + bw * sc
    # swirl during transitions (curl-ish displacement)
    turb = 4 * (sa * (1 - sa) + sb_ * (1 - sb_) + sc * (1 - sc))
    x = x + turb * 26 * np.sin(y * 0.012 + sec * 1.3 + lane)
    y = y + turb * 18 * np.cos(x * 0.010 - sec * 1.1 + lane)

    nature = float(ww)
    img = landscape(t, 0.35 + 0.65 * nature)

    buf = np.zeros((H, W, 3), np.float32)
    xi = np.round(x).astype(int); yi = np.round(y).astype(int)
    ok = (xi >= 0) & (xi < W) & (yi >= 0) & (yi < H)
    for k in range(3):
        np.add.at(buf[..., k], (yi[ok], xi[ok]), (col[ok, k] * br[ok]) * 0.55)
    core = cv2.GaussianBlur(buf, (0, 0), 0.8) * 2.2
    glow = cv2.GaussianBlur(buf, (0, 0), 6) * 6.0
    halo = cv2.GaussianBlur(buf, (0, 0), 22) * 10.0
    img = img + core + glow + halo

    # vignette + gentle tone map
    v = 1 - 0.45 * (((xx - W / 2) / (W * 0.75)) ** 2 + ((yy - H / 2) / (H * 0.85)) ** 2)
    img *= np.clip(v, 0.3, 1)[..., None]
    img = 1 - np.exp(-img * 1.6)
    out = np.clip(img * 255, 0, 255).astype(np.uint8)
    cv2.imwrite(f"{OUT}/f{f:04d}.png", cv2.cvtColor(out, cv2.COLOR_RGB2BGR), [cv2.IMWRITE_PNG_COMPRESSION, 1])
    if f % 60 == 0:
        print("frame", f, flush=True)
print("done")
