import { useEffect, useRef, useState } from "react";

/**
 * PortalLoader - original full-screen circular portal entry transition.
 *
 * Timeline (motion allowed):
 *   0ms      dark overlay appears; portal forms (scale 0.55 -> 1)
 *   ~150ms   portal visible; canvas swirl + particles active
 *   300-850  fully active living portal
 *   ~1000ms  exit: portal contracts/brightens, tiny flash, overlay fades
 *   ~1570ms  component unmounts completely - no overlay left behind
 *
 * Reduced motion: static portal, quick fade, ~500ms total.
 *
 * No AudioContext. No document scroll locking (Lenis untouched).
 * No per-frame React state; refs + canvas only. DPR capped at 2.
 */

const HOLD_MS = 880; // portal fully active phase
const EXIT_MS = 500; // contract + flash + overlay fade
const REDUCED_TOTAL_MS = 560;

type Phase = "hold" | "exit";

export default function PortalLoader() {
  const [phase, setPhase] = useState<Phase>("hold");
  const [gone, setGone] = useState(false);
  const portalRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const mobile =
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(max-width: 480px)").matches;

    const exitAt = reduced ? REDUCED_TOTAL_MS - 260 : HOLD_MS;
    const goneAt = reduced ? REDUCED_TOTAL_MS : HOLD_MS + EXIT_MS + 40;

    const exitTimer = window.setTimeout(() => setPhase("exit"), exitAt);
    const goneTimer = window.setTimeout(() => setGone(true), goneAt);

    const portal = portalRef.current;
    const canvas = canvasRef.current;

    let rafId = 0;
    let lastTs = 0;
    let elapsed = 0;
    let disposed = false;
    let stopped = false;
    let size = 280;

    const TAU = Math.PI * 2;

    /* Particle field - inner streaks + outer orbit (fewer on mobile) */
    const innerCount = mobile ? 5 : reduced ? 6 : 9;
    const outerCount = mobile ? 6 : reduced ? 8 : 13;

    const particles = Array.from(
      { length: innerCount + outerCount },
      (_, i) => {
        const outer = i >= innerCount;
        const j = outer ? i - innerCount : i;
        return {
          outer,
          radiusFrac: outer
            ? 0.6 + ((j * 29) % 40) / 140
            : 0.11 + ((j * 23) % 42) / 140,
          angle: (i / (innerCount + outerCount)) * TAU,
          speed: outer
            ? 0.2 + ((j * 13) % 8) / 40
            : 0.85 + ((j * 11) % 7) / 9,
          size: 0.9 + ((i * 5) % 4) / 2.2,
          teal: i % 3 === 0,
        };
      }
    );

    /* Layered swirl arcs - the living fluid field */
    const arcs = Array.from({ length: mobile ? 3 : 4 }, (_, i) => ({
      radiusFrac: 0.13 + i * 0.07,
      span: 2.4 + ((i * 17) % 5) / 3,
      speed: 0.5 + ((i * 7) % 6) / 12,
      dir: i % 2 === 0 ? 1 : -0.7,
      width: 5 + ((i * 3) % 5),
      teal: i % 2 === 1,
    }));

    /* Measure the portal so the canvas renders at native resolution */
    const measure = () => {
      if (!portal) return;
      const rect = portal.getBoundingClientRect();
      if (rect.width >= 150) size = Math.round(rect.width);
    };
    const ro =
      portal && typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(measure)
        : null;
    if (portal) ro?.observe(portal);
    measure();

    const drawFrame = (t: number) => {
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (canvas.width !== size * dpr) {
        canvas.width = size * dpr;
        canvas.height = size * dpr;
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, size, size);

      const cx = size / 2;
      const cy = size / 2;
      const R = size / 2;
      const pulse = 0.5 + 0.5 * Math.sin(t * 1.6);

      /* 1. Living internal fluid core - slowly rotating radial field */
      ctx.globalCompositeOperation = "lighter";
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(t * (reduced ? 0.22 : 0.35));
      const coreR = R * 0.64;
      const core = ctx.createRadialGradient(0, 0, coreR * 0.06, 0, 0, coreR);
      core.addColorStop(
        0,
        `rgba(25, 184, 154, ${(0.36 + pulse * 0.14).toFixed(3)})`
      );
      core.addColorStop(
        0.45,
        `rgba(11, 74, 58, ${(0.2 + pulse * 0.06).toFixed(3)})`
      );
      core.addColorStop(
        0.78,
        `rgba(10, 70, 80, ${(0.12 + pulse * 0.05).toFixed(3)})`
      );
      core.addColorStop(1, "rgba(7, 28, 43, 0)");
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(0, 0, coreR, 0, TAU);
      ctx.fill();
      ctx.restore();

      /* 1b. Counter-rotating blue depth field */
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-t * (reduced ? 0.32 : 0.55));
      const deepR = R * 0.8;
      const deep = ctx.createRadialGradient(0, 0, deepR * 0.2, 0, 0, deepR);
      deep.addColorStop(
        0,
        `rgba(10, 70, 80, ${(0.14 + pulse * 0.05).toFixed(3)})`
      );
      deep.addColorStop(
        0.7,
        `rgba(7, 28, 43, ${(0.08 + pulse * 0.03).toFixed(3)})`
      );
      deep.addColorStop(1, "rgba(7, 28, 43, 0)");
      ctx.fillStyle = deep;
      ctx.beginPath();
      ctx.arc(0, 0, deepR, 0, TAU);
      ctx.fill();
      ctx.restore();

      /* 2. Dark fluid blobs drifting inside the glow */
      ctx.globalCompositeOperation = "source-over";
      for (let b = 0; b < 2; b++) {
        const ba = t * (0.4 + b * 0.3) * (b === 0 ? 1 : -0.75) + b * 2.4;
        const br = R * (0.18 + b * 0.08);
        const bx = cx + Math.cos(ba) * R * 0.2;
        const by = cy + Math.sin(ba) * R * 0.2;
        const blob = ctx.createRadialGradient(bx, by, 0, bx, by, br);
        blob.addColorStop(
          0,
          `rgba(6, 37, 29, ${(0.4 + pulse * 0.15).toFixed(3)})`
        );
        blob.addColorStop(1, "rgba(6, 37, 29, 0)");
        ctx.fillStyle = blob;
        ctx.beginPath();
        ctx.arc(bx, by, br, 0, TAU);
        ctx.fill();
      }

      /* 3. Swirl arcs - layered rotating energy ribbons */
      ctx.globalCompositeOperation = "lighter";
      ctx.lineCap = "round";
      for (const arc of arcs) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(t * arc.speed * arc.dir);
        ctx.strokeStyle = arc.teal
          ? `rgba(79, 209, 197, ${(0.22 + pulse * 0.08).toFixed(3)})`
          : `rgba(25, 184, 154, ${(0.26 + pulse * 0.09).toFixed(3)})`;
        ctx.lineWidth = arc.width;
        ctx.beginPath();
        ctx.arc(0, 0, arc.radiusFrac * R, 0, arc.span);
        ctx.stroke();
        ctx.restore();
      }

      /* 4. Counter-rotating dashed rings */
      for (let r = 0; r < 2; r++) {
        const dir = r === 0 ? 1 : -0.65;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(t * 0.5 * dir + r * 1.3);
        ctx.strokeStyle =
          r === 0 ? "rgba(25, 184, 154, 0.5)" : "rgba(79, 209, 197, 0.3)";
        ctx.lineWidth = 1;
        ctx.setLineDash(r === 0 ? [10, 14] : [4, 22]);
        ctx.beginPath();
        ctx.arc(0, 0, R * (r === 0 ? 0.82 : 0.95), 0, TAU);
        ctx.stroke();
        ctx.restore();
      }
      ctx.setLineDash([]);

      /* 5b. Bright teal rim just inside the portal edge */
      ctx.strokeStyle = `rgba(79, 209, 197, ${(0.3 + pulse * 0.15).toFixed(3)})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 0.96, 0, TAU);
      ctx.stroke();

      /* 5. Orbiting particle field with soft radial wobble */
      for (const p of particles) {
        const wobble = p.outer
          ? 1 + 0.05 * Math.sin(t * 1.3 + p.angle * 3)
          : 1;
        const rr = p.radiusFrac * R * wobble;
        const x = cx + Math.cos(p.angle + t * p.speed) * rr;
        const y = cy + Math.sin(p.angle + t * p.speed) * rr * 0.94;
        ctx.fillStyle = p.teal
          ? "rgba(79, 209, 197, 0.75)"
          : "rgba(25, 184, 154, 0.55)";
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, TAU);
        ctx.fill();
      }

      /* 6. Sweeping highlight arc */
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(t * (reduced ? 0.55 : 0.9));
      const sweep = ctx.createLinearGradient(0, -R, 0, R);
      sweep.addColorStop(0, "rgba(79, 209, 197, 0)");
      sweep.addColorStop(0.5, "rgba(79, 209, 197, 0.24)");
      sweep.addColorStop(1, "rgba(79, 209, 197, 0)");
      ctx.strokeStyle = sweep;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(0, 0, R * 0.78, -0.5, 0.5);
      ctx.stroke();
      ctx.restore();

      ctx.globalCompositeOperation = "source-over";
    };

    const frame = (now: number) => {
      if (disposed || stopped) return;

      if (lastTs === 0) {
        lastTs = now;
      }

      const delta = Math.min(0.05, (now - lastTs) / 1000);
      lastTs = now;
      elapsed += delta;

      drawFrame(elapsed);
      rafId = requestAnimationFrame(frame);
    };

    // Keep the short entry motion alive even when OS reduce-motion is enabled;
    // reduced mode still uses fewer particles and no extra DOM animation layers.
    rafId = requestAnimationFrame(frame);

    /* Stop the loop shortly after the exit transition begins; CSS owns
       the exit (contract + brightness + fade). One static final frame
       keeps the portal visible while it fades out. */
    const stopTimer = window.setTimeout(
      () => {
        stopped = true;
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = 0;
        }
        drawFrame(4.2);
      },
      Math.max(120, exitAt + 140)
    );

    return () => {
      stopped = true;
      if (rafId) cancelAnimationFrame(rafId);
      window.clearTimeout(exitTimer);
      window.clearTimeout(goneTimer);
      window.clearTimeout(stopTimer);
      ro?.disconnect();
      if (canvas) {
        canvas.width = 0;
        canvas.height = 0;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (gone) return null;

  return (
    <div
      className={`portal-loader${phase === "exit" ? " is-exiting" : ""}`}
      role="status"
      aria-live="polite"
      aria-label="Loading portfolio"
    >
      <div className="portal-loader__atmosphere" aria-hidden="true" />

      <div ref={portalRef} className="portal-loader__portal">
        <canvas
          ref={canvasRef}
          className="portal-loader__canvas"
          aria-hidden="true"
        />
      </div>

      <div className="portal-loader__label">ARYAN SHARMA</div>

      <div className="portal-loader__flash" aria-hidden="true" />
    </div>
  );
}
