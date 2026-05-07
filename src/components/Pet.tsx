"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Site pet — a tiny ink-slab creature that walks along the bottom of the
 * viewport. Lives globally (persists across pages via the layout). Inspired
 * by Megan Yap's site-pet:
 *   - Walks left/right; bumps off the screen edges
 *   - Click to hop, with quips that escalate the more you poke it
 *   - Drag to relocate; release with velocity to throw it
 *   - Shake while dragging to make it dizzy (eyes spin, swirl trails)
 *   - Eye tracking toward the cursor
 *   - Idle blink + page-specific idle chatter
 *   - Speech bubbles in dark translucent ink with cream mono text
 *
 * All animation lives in CSS keyframes triggered by data-* attributes; the
 * one RAF loop only manages position + physics. Position is persisted in
 * localStorage so the pet remembers where you left it.
 */

const PET_W = 44;
const PET_H = 56;
const SPEED = 34; // px/sec

const POSITION_KEY = "sofia.pet.position";
const POKES_KEY = "sofia.pet.pokes";

const PHRASES = {
  bump: ["ow!", "oof", "ouch!", "argh"],
  hover: ["what's up?", "hi!", "oh hey", "howdy", "sup?", "hello"],
  drag: ["where are you\ntaking me?", "put me down!", "wheeee", "careful!", "oh no"],
  drop: ["phew", "back to it", "thanks i guess", "okay okay"],
  dizzy: ["whoaa....", "ugh.", "...stars", "head spinny"],
  clickMild: ["heya!", "hi there", "sup", "yo", "oh hi"],
  clickMeh: ["still here", "again?", "hi again", "yes?", "pspsps"],
  clickAnnoyed: ["why do you keep\npoking me?", "stop that", "okay okay", "quit it", "enough."],
  clickDone: ["rude.", "really?", "ow.", "i'm not a button", "stop!"],
  idleHome: [
    "the sky again",
    "just walking",
    "dum de dum",
    "anyone there?",
    "hmm",
    "psst",
    "sofia hasn't fed me\nin three days",
  ],
  idleWork: [
    "ooh interesting",
    "wow she made this??",
    "this is so cool",
    "i'm learning things",
    "tell me more",
    "fascinating",
  ],
  idleAbout: [
    "pittsburgh huh",
    "she speaks five languages?!",
    "lived in six countries\nthat's wild",
    "oh that's a cute photo",
    "weber lab is doing cool work",
  ],
  idleGallery: [
    "wheee sparkles",
    "click click click",
    "the dots like me",
    "i wanna play",
    "particles everywhere",
  ],
  idleContact: [
    "send a note?",
    "she'd love to hear",
    "drop a stamp on it",
    "the postcard is ready",
  ],
  pageLandWork: ["ooh look at this!"],
  pageLandAbout: ["hi nice to meet you"],
  pageLandGallery: ["wheee sparkles"],
  pageLandContact: ["send it!"],
  pageLandHome: ["the sky ✦"],
};

function clickPool(count: number) {
  if (count <= 2) return PHRASES.clickMild;
  if (count <= 4) return PHRASES.clickMeh;
  if (count <= 7) return PHRASES.clickAnnoyed;
  return PHRASES.clickDone;
}

function idlePoolFor(pathname: string) {
  if (pathname.startsWith("/work")) return PHRASES.idleWork;
  if (pathname.startsWith("/about")) return PHRASES.idleAbout;
  if (pathname.startsWith("/gallery")) return PHRASES.idleGallery;
  if (pathname.startsWith("/contact")) return PHRASES.idleContact;
  return PHRASES.idleHome;
}

function arrivalPoolFor(pathname: string) {
  if (pathname.startsWith("/work")) return PHRASES.pageLandWork;
  if (pathname.startsWith("/about")) return PHRASES.pageLandAbout;
  if (pathname.startsWith("/gallery")) return PHRASES.pageLandGallery;
  if (pathname.startsWith("/contact")) return PHRASES.pageLandContact;
  return PHRASES.pageLandHome;
}

function pick<T>(pool: T[]): T {
  return pool[Math.floor(Math.random() * pool.length)];
}

export default function Pet() {
  const reduced = useReducedMotion();
  const pathname = usePathname();

  const petRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const emotesRef = useRef<HTMLDivElement>(null);
  const eyesRef = useRef<SVGGElement>(null);
  const hitRef = useRef<HTMLButtonElement>(null);

  // Animation state — refs so we don't re-render every frame.
  const xRef = useRef(40);
  const yRef = useRef(0);
  const xVelRef = useRef(0);
  const yVelRef = useRef(0);
  const dirRef = useRef<1 | -1>(1);
  const lastTRef = useRef(performance.now());
  const lastBumpAtRef = useRef(0);

  const hoveredRef = useRef(false);
  const draggingRef = useRef(false);
  const pressActiveRef = useRef(false);
  const pressStartRef = useRef<{ x: number; y: number; t: number } | null>(null);
  const dragPointerIdRef = useRef<number | null>(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const wasDraggedRef = useRef(false);

  const dizzyRef = useRef(false);
  const dizzyUntilRef = useRef(0);
  const clickCountRef = useRef(0);
  const lastClickAtRef = useRef(0);

  const lastPointerRef = useRef({ x: -9999, y: -9999 });
  const ptrHistoryRef = useRef<{ t: number; x: number; y: number }[]>([]);
  const shakeSamplesRef = useRef<number[]>([]);
  const lastShakeDxRef = useRef(0);
  const bumpedLeftRef = useRef(false);
  const bumpedRightRef = useRef(false);

  const bubbleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const blinkTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathRef = useRef(pathname);

  // Keep latest pathname accessible inside the long-lived RAF loop / timers.
  useEffect(() => {
    pathRef.current = pathname;
  }, [pathname]);

  /* -------- Speech helpers -------- */

  const say = (pool: string[], ms = 1800) => {
    const bubble = bubbleRef.current;
    if (!bubble) return;
    const phrase = pick(pool);
    bubble.innerHTML = phrase.replace(/\n/g, "<br>");
    bubble.setAttribute("data-show", "");
    if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current);
    bubbleTimerRef.current = setTimeout(
      () => bubble.removeAttribute("data-show"),
      ms
    );
  };

  /* -------- Init: load saved position -------- */

  useEffect(() => {
    try {
      const saved = localStorage.getItem(POSITION_KEY);
      if (saved) {
        const p = JSON.parse(saved);
        if (typeof p?.x === "number") {
          xRef.current = Math.max(
            8,
            Math.min(window.innerWidth - PET_W - 8, p.x)
          );
        }
      } else {
        xRef.current = Math.max(20, window.innerWidth - 120);
      }
    } catch {
      // ignore
    }
  }, []);

  /* -------- RAF loop: walking + physics + eye tracking -------- */

  useEffect(() => {
    let rafId = 0;

    function bump(direction: 1 | -1) {
      const pet = petRef.current;
      if (!pet) return;
      const now = performance.now();
      if (now - lastBumpAtRef.current < 600) return;
      lastBumpAtRef.current = now;
      pet.style.setProperty("--pet-bump-dir", direction === 1 ? "1" : "-1");
      pet.setAttribute("data-bump", "");
      setTimeout(() => pet.removeAttribute("data-bump"), 420);

      const side = direction === 1 ? "left" : "right";
      const firstTime =
        side === "left" ? !bumpedLeftRef.current : !bumpedRightRef.current;
      if (firstTime) {
        if (side === "left") bumpedLeftRef.current = true;
        else bumpedRightRef.current = true;
      }
      if (firstTime || Math.random() < 0.15) {
        say(PHRASES.bump, 1400);
      }
    }

    function tick(now: number) {
      const dt = Math.min(48, now - lastTRef.current);
      lastTRef.current = now;
      const pet = petRef.current;
      if (!pet) {
        rafId = requestAnimationFrame(tick);
        return;
      }

      // Dizzy timeout
      const inDizzy = dizzyRef.current && now < dizzyUntilRef.current;
      if (dizzyRef.current && now >= dizzyUntilRef.current) {
        dizzyRef.current = false;
        pet.removeAttribute("data-dizzy");
        emotesRef.current
          ?.querySelectorAll(".site-pet-spin-star")
          .forEach((s) => s.remove());
      }

      // Walking
      const wL = 8;
      const wR = window.innerWidth - PET_W - 8;
      if (!hoveredRef.current && !draggingRef.current && !reduced && !inDizzy) {
        const step = SPEED * (dt / 1000);
        if (Math.abs(xVelRef.current) > 8) {
          xRef.current += xVelRef.current * (dt / 1000);
          xVelRef.current *= Math.pow(0.04, dt / 1000);
          dirRef.current = xVelRef.current >= 0 ? 1 : -1;
        } else {
          xVelRef.current = 0;
          xRef.current += dirRef.current * step;
        }
        if (xRef.current <= wL) {
          xRef.current = wL;
          if (dirRef.current === -1) bump(1);
          dirRef.current = 1;
        } else if (xRef.current >= wR) {
          xRef.current = wR;
          if (dirRef.current === 1) bump(-1);
          dirRef.current = -1;
        }
      }

      // Vertical physics — gravity, with a small bounce on hard landings
      if (!draggingRef.current) {
        const dtSec = dt / 1000;
        const g = yVelRef.current > 0 ? 2000 : 3200;
        yVelRef.current -= g * dtSec;
        yRef.current += yVelRef.current * dtSec;
        if (yRef.current <= 0) {
          yRef.current = 0;
          if (yVelRef.current < -160) yVelRef.current = -yVelRef.current * 0.1;
          else yVelRef.current = 0;
        }
      }

      pet.style.setProperty("--pet-x", `${xRef.current}px`);
      pet.style.setProperty("--pet-y", `${yRef.current}px`);
      pet.style.setProperty("--pet-flip", dirRef.current === 1 ? "1" : "-1");

      // Eye tracking — eyes glance toward cursor
      const eyes = eyesRef.current;
      if (eyes && lastPointerRef.current.x > -9999) {
        const cx = xRef.current + PET_W / 2;
        const cy = window.innerHeight - yRef.current - PET_H / 2;
        const dx = lastPointerRef.current.x - cx;
        const dy = lastPointerRef.current.y - cy;
        const d = Math.hypot(dx, dy) || 1;
        const ex = Math.max(-1.4, Math.min(1.4, (dx / d) * 1.4));
        const ey = Math.max(-1, Math.min(1, (dy / d) * 1));
        eyes.style.transform = `translate(${ex.toFixed(2)}px, ${ey.toFixed(2)}px)`;
      }

      rafId = requestAnimationFrame(tick);
    }
    rafId = requestAnimationFrame(tick);

    const onPointerMove = (e: PointerEvent) => {
      lastPointerRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    // Scroll jolt — pet hops a little when you scroll, on the ground only
    let lastScrollY = window.scrollY;
    const onScroll = () => {
      if (reduced || draggingRef.current) {
        lastScrollY = window.scrollY;
        return;
      }
      const dy = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;
      const mag = Math.min(400, Math.abs(dy));
      if (mag < 2 || yRef.current > 6) return;
      const impulse = Math.min(520, Math.sqrt(mag) * 26);
      yVelRef.current = Math.min(560, Math.max(yVelRef.current, impulse));
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const onVis = () => {
      if (document.hidden) {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = 0;
      } else if (!rafId) {
        lastTRef.current = performance.now();
        rafId = requestAnimationFrame(tick);
      }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [reduced]);

  /* -------- Drag + click handlers -------- */

  useEffect(() => {
    const pet = petRef.current;
    const hit = hitRef.current;
    const emotes = emotesRef.current;
    if (!pet || !hit) return;

    const DRAG_THRESHOLD = 6;

    function triggerDizzy() {
      if (dizzyRef.current) return;
      dizzyRef.current = true;
      dizzyUntilRef.current = performance.now() + 2200;
      pet!.setAttribute("data-dizzy", "");
      say(PHRASES.dizzy, 2000);
      if (emotes) {
        for (let i = 0; i < 3; i++) {
          const star = document.createElement("span");
          star.className = "site-pet-spin-star";
          star.style.animationDelay = `${-i * 0.3}s`;
          emotes.appendChild(star);
        }
      }
    }

    function spawnSwirl() {
      if (!emotes || reduced) return;
      const swirl = document.createElement("span");
      swirl.className = "site-pet-swirl";
      swirl.style.setProperty(
        "--swirl-dx",
        `${(Math.random() - 0.5) * 32}px`
      );
      emotes.appendChild(swirl);
      setTimeout(() => swirl.remove(), 1000);
    }

    const onEnter = () => {
      if (draggingRef.current) return;
      hoveredRef.current = true;
      pet!.setAttribute("data-paused", "");
      // Face the cursor on hover
      const r = pet!.getBoundingClientRect();
      dirRef.current =
        lastPointerRef.current.x < r.left + r.width / 2 ? -1 : 1;
      setTimeout(() => {
        if (hoveredRef.current && !draggingRef.current && !dizzyRef.current) {
          say(PHRASES.hover, 1600);
        }
      }, 260);
    };
    const onLeave = () => {
      if (draggingRef.current) return;
      hoveredRef.current = false;
      pet!.removeAttribute("data-paused");
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      pressActiveRef.current = true;
      wasDraggedRef.current = false;
      pressStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        t: performance.now(),
      };
      dragPointerIdRef.current = e.pointerId;
      hit!.setPointerCapture(e.pointerId);
      ptrHistoryRef.current = [
        { t: performance.now(), x: e.clientX, y: e.clientY },
      ];
      shakeSamplesRef.current = [];
      lastShakeDxRef.current = 0;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!pressActiveRef.current || e.pointerId !== dragPointerIdRef.current)
        return;
      const nowT = performance.now();
      ptrHistoryRef.current.push({ t: nowT, x: e.clientX, y: e.clientY });
      while (
        ptrHistoryRef.current.length > 2 &&
        nowT - ptrHistoryRef.current[0].t > 140
      ) {
        ptrHistoryRef.current.shift();
      }

      if (!draggingRef.current) {
        const ds = pressStartRef.current!;
        const dx = e.clientX - ds.x;
        const dy = e.clientY - ds.y;
        if (dy < -DRAG_THRESHOLD || Math.abs(dx) > DRAG_THRESHOLD * 2) {
          draggingRef.current = true;
          wasDraggedRef.current = true;
          const r = pet!.getBoundingClientRect();
          dragOffsetRef.current = {
            x: ds.x - r.left,
            y: ds.y - r.top,
          };
          pet!.setAttribute("data-dragging", "");
          pet!.setAttribute("data-paused", "");
          say(PHRASES.drag, 2200);
        } else {
          return;
        }
      }

      // Update position to follow cursor
      const newLeft = e.clientX - dragOffsetRef.current.x;
      const newTop = e.clientY - dragOffsetRef.current.y;
      xRef.current = Math.max(4, Math.min(window.innerWidth - PET_W - 4, newLeft));
      const yFromGround = window.innerHeight - newTop - PET_H;
      yRef.current = Math.max(
        0,
        Math.min(window.innerHeight - PET_H - 4, yFromGround)
      );

      // Shake detection
      const rawDx = e.movementX ?? 0;
      const dirNow = Math.sign(rawDx);
      if (Math.abs(rawDx) > 2 && dirNow !== 0) {
        if (
          lastShakeDxRef.current !== 0 &&
          dirNow !== lastShakeDxRef.current
        ) {
          shakeSamplesRef.current.push(nowT);
          while (
            shakeSamplesRef.current.length &&
            nowT - shakeSamplesRef.current[0] > 600
          ) {
            shakeSamplesRef.current.shift();
          }
          if (!dizzyRef.current) spawnSwirl();
          if (shakeSamplesRef.current.length >= 4) {
            triggerDizzy();
            shakeSamplesRef.current = [];
          }
        }
        lastShakeDxRef.current = dirNow;
      }
    };

    const endPress = (e: PointerEvent) => {
      if (!pressActiveRef.current || e.pointerId !== dragPointerIdRef.current)
        return;
      pressActiveRef.current = false;
      dragPointerIdRef.current = null;

      if (draggingRef.current) {
        draggingRef.current = false;
        pet!.removeAttribute("data-dragging");
        pet!.removeAttribute("data-paused");

        // Compute throw velocity from the last ~140ms of pointer history
        if (ptrHistoryRef.current.length >= 2) {
          const first = ptrHistoryRef.current[0];
          const last = ptrHistoryRef.current[ptrHistoryRef.current.length - 1];
          const dtMs = Math.max(8, last.t - first.t);
          const vx = ((last.x - first.x) / dtMs) * 1000 * 0.55;
          const vy = ((last.y - first.y) / dtMs) * 1000 * 0.55;
          xVelRef.current = Math.max(-500, Math.min(500, vx));
          yVelRef.current = Math.max(-420, Math.min(420, -vy));
        }

        // Save position
        try {
          localStorage.setItem(
            POSITION_KEY,
            JSON.stringify({ x: xRef.current })
          );
        } catch {
          // ignore
        }

        say(PHRASES.drop, 1400);
      } else {
        // Plain click — hop + escalating quip
        const now = performance.now();
        if (now - lastClickAtRef.current > 5000) clickCountRef.current = 0;
        clickCountRef.current += 1;
        lastClickAtRef.current = now;

        if (!reduced) {
          pet!.setAttribute("data-hopping", "");
          pet!.setAttribute("data-blink", "");
          setTimeout(() => pet!.removeAttribute("data-hopping"), 520);
          setTimeout(() => pet!.removeAttribute("data-blink"), 180);
        }

        say(clickPool(clickCountRef.current), 1400);

        // Track total pokes locally for fun
        try {
          const p = parseInt(localStorage.getItem(POKES_KEY) ?? "0", 10);
          localStorage.setItem(POKES_KEY, String(p + 1));
        } catch {
          // ignore
        }
      }
      pressStartRef.current = null;
    };

    hit.addEventListener("pointerenter", onEnter);
    hit.addEventListener("pointerleave", onLeave);
    hit.addEventListener("pointerdown", onPointerDown);
    hit.addEventListener("pointermove", onPointerMove);
    hit.addEventListener("pointerup", endPress);
    hit.addEventListener("pointercancel", endPress);

    // Safety net — release drag if pointerup happens off the pet
    const onWindowPointerUp = (e: PointerEvent) => {
      if (!pressActiveRef.current && !draggingRef.current) return;
      pressActiveRef.current = false;
      dragPointerIdRef.current = null;
      if (draggingRef.current) {
        draggingRef.current = false;
        pet!.removeAttribute("data-dragging");
        pet!.removeAttribute("data-paused");
        yVelRef.current = 0;
        say(PHRASES.drop, 1200);
      }
    };
    window.addEventListener("pointerup", onWindowPointerUp);

    return () => {
      hit.removeEventListener("pointerenter", onEnter);
      hit.removeEventListener("pointerleave", onLeave);
      hit.removeEventListener("pointerdown", onPointerDown);
      hit.removeEventListener("pointermove", onPointerMove);
      hit.removeEventListener("pointerup", endPress);
      hit.removeEventListener("pointercancel", endPress);
      window.removeEventListener("pointerup", onWindowPointerUp);
    };
  }, [reduced]);

  /* -------- Idle blink scheduler -------- */

  useEffect(() => {
    const pet = petRef.current;
    if (!pet) return;

    function schedule() {
      const delay = 3000 + Math.random() * 4000;
      blinkTimerRef.current = setTimeout(() => {
        if (!dizzyRef.current && !pet!.hasAttribute("data-blink")) {
          pet!.setAttribute("data-blink", "");
          setTimeout(() => pet!.removeAttribute("data-blink"), 160);
        }
        schedule();
      }, delay);
    }
    schedule();
    return () => {
      if (blinkTimerRef.current) clearTimeout(blinkTimerRef.current);
    };
  }, []);

  /* -------- Idle quip scheduler -------- */

  useEffect(() => {
    function schedule() {
      const delay = 18000 + Math.random() * 16000;
      idleTimerRef.current = setTimeout(() => {
        if (
          !hoveredRef.current &&
          !draggingRef.current &&
          !dizzyRef.current
        ) {
          say(idlePoolFor(pathRef.current), 2200);
        }
        schedule();
      }, delay);
    }
    // Seed first quip 12s after mount so the behavior is discoverable
    const firstTimer = setTimeout(() => {
      if (!hoveredRef.current && !draggingRef.current && !dizzyRef.current) {
        say(idlePoolFor(pathRef.current), 2200);
      }
      schedule();
    }, 12000);
    return () => {
      clearTimeout(firstTimer);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, []);

  /* -------- Page-arrival quip -------- */

  useEffect(() => {
    const t = setTimeout(() => {
      if (!dizzyRef.current && !draggingRef.current) {
        say(arrivalPoolFor(pathname), 2200);
      }
    }, 600);
    return () => clearTimeout(t);
  }, [pathname]);

  return (
    <div ref={petRef} className="site-pet" aria-hidden>
      <div ref={bubbleRef} className="site-pet__bubble" aria-hidden />
      <div ref={emotesRef} className="site-pet__emotes" aria-hidden />
      <button
        ref={hitRef}
        type="button"
        className="site-pet__hit cursor-target"
        aria-label="Pet"
      >
        <span className="site-pet__bob">
          <svg
            width="44"
            height="56"
            viewBox="0 0 44 56"
            className="site-pet__svg"
            fill="none"
          >
            <ellipse
              className="site-pet__shadow"
              cx="22"
              cy="53.5"
              rx="14"
              ry="1.8"
              fill="#2C3E50"
              opacity="0.18"
            />
            <rect x="4" y="6" width="36" height="38" rx="5" fill="#2C3E50" />
            <rect x="4" y="6" width="36" height="2" rx="1" fill="#FBF6EC" opacity="0.12" />
            <g ref={eyesRef} className="site-pet__eyes">
              <rect className="site-pet__eye" x="14" y="22" width="4" height="5" rx="1" fill="#FBF6EC" />
              <rect className="site-pet__eye" x="26" y="22" width="4" height="5" rx="1" fill="#FBF6EC" />
            </g>
            <rect
              className="site-pet__leg site-pet__leg--left"
              x="10"
              y="42"
              width="8"
              height="10"
              rx="1.5"
              fill="#2C3E50"
            />
            <rect
              className="site-pet__leg site-pet__leg--right"
              x="26"
              y="42"
              width="8"
              height="10"
              rx="1.5"
              fill="#2C3E50"
            />
          </svg>
        </span>
      </button>
    </div>
  );
}
