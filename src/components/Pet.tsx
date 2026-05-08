"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Site pet — a round periwinkle creature that walks along the bottom of
 * the viewport. Tamagotchi-style gameplay:
 *   - Walks autonomously, bumps off screen edges
 *   - Click to hop, with quips that escalate the more you poke it
 *   - Drag → release with velocity to throw it
 *   - Shake to make it dizzy
 *   - Eye tracking + idle blinks
 *   - Per-page chatter
 *   - Drop onto perchable DOM elements (`.index-card`, `[data-pet-perch]`)
 *     and the pet stands and walks on top of them
 */

const PET_W = 44;
const PET_H = 56;
const SPEED = 34; // px/sec

const POSITION_KEY = "sofia.pet.position";
const POKES_KEY = "sofia.pet.pokes";

const PERCH_SELECTOR = ".index-card, [data-pet-perch]";

const TREAT_SELECTOR = "[data-pet-treat]";

const PHRASES = {
  bump: ["ow!", "oof", "ouch!", "argh"],
  eat: ["yummy!", "thanks!", "more please!", "om nom", "delicious", "tasty!", "nom"],
  hover: ["what's up?", "hi!", "oh hey", "howdy", "sup?", "hello"],
  drag: ["where are you\ntaking me?", "put me down!", "wheeee", "careful!", "oh no"],
  drop: ["phew", "back to it", "thanks i guess", "okay okay"],
  perchLand: [
    "ooh a ledge",
    "nice spot",
    "cozy up here",
    "i live here now",
    "high ground",
    "better view",
  ],
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
    "have you tried picking\nme up?",
  ],
  idleWork: [
    "ooh interesting",
    "wow she made this??",
    "this is so cool",
    "i'm learning things",
    "tell me more",
    "fascinating",
    "i bet i could stand\non one of those...",
  ],
  idleAbout: [
    "pittsburgh huh",
    "she speaks five languages?!",
    "lived in six countries\nthat's wild",
    "oh that's a cute photo",
    "weber lab is doing\ncool work",
    "drop me on a polaroid!",
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
    "stand me on the postcard?",
  ],
  idlePerch: [
    "this view is great",
    "kinda high up huh",
    "i'm supervising",
    "overseeing operations",
    "king of this card",
    "don't look down",
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

function idlePoolFor(pathname: string, onPerch: boolean) {
  if (onPerch) return PHRASES.idlePerch;
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

  // Hide on landing — keep the welcome screen clean.
  if (pathname === "/") return null;

  return <PetBody pathname={pathname} reduced={reduced} />;
}

function PetBody({
  pathname,
  reduced,
}: {
  pathname: string;
  reduced: boolean;
}) {
  const petRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const emotesRef = useRef<HTMLDivElement>(null);
  const eyesRef = useRef<SVGGElement>(null);
  const hitRef = useRef<HTMLButtonElement>(null);

  // Animation state — refs to avoid per-frame re-renders.
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

  // Perch state — when set, pet walks on top of this DOM element.
  const perchRef = useRef<HTMLElement | null>(null);
  const groundOffsetRef = useRef(0);

  const bubbleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const blinkTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathRef = useRef(pathname);

  useEffect(() => {
    pathRef.current = pathname;
  }, [pathname]);

  /* -------- Helpers -------- */

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

  /** Find a perchable element directly beneath the pet's feet. */
  const findPerchAt = (petCenterX: number, petFeetY: number): HTMLElement | null => {
    // elementsFromPoint returns topmost-first, so we honor stacking order.
    const probes = document.elementsFromPoint(petCenterX, petFeetY + 4);
    for (const el of probes) {
      if (!(el instanceof HTMLElement)) continue;
      if (el.closest(".site-pet")) continue; // ignore the pet itself
      const perch = el.closest(PERCH_SELECTOR);
      if (perch instanceof HTMLElement) {
        const r = perch.getBoundingClientRect();
        // Only count it as a perch if the pet's feet are near its top edge
        if (Math.abs(petFeetY - r.top) < 32) {
          return perch;
        }
      }
    }
    return null;
  };

  const mountPerch = (el: HTMLElement) => {
    perchRef.current = el;
    bumpedLeftRef.current = false;
    bumpedRightRef.current = false;
  };

  const dismountPerch = () => {
    if (!perchRef.current) return;
    // Carry our current altitude over to ground-relative coords so gravity
    // takes us down from where we were.
    yRef.current = Math.max(0, yRef.current + groundOffsetRef.current);
    perchRef.current = null;
    groundOffsetRef.current = 0;
    bumpedLeftRef.current = false;
    bumpedRightRef.current = false;
  };

  /* -------- Init position -------- */

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

  /* -------- RAF: walking + physics + eye tracking + perch tracking -------- */

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

      // Resolve current perch + ground offset + walking bounds
      let groundOffset = 0;
      let leftWall = 8;
      let rightWall = window.innerWidth - PET_W - 8;
      const perch = perchRef.current;
      if (perch) {
        if (!document.contains(perch)) {
          // Perch element was removed (e.g. nav to a different page)
          dismountPerch();
        } else {
          const r = perch.getBoundingClientRect();
          if (
            r.width === 0 ||
            r.top > window.innerHeight + 10 ||
            r.bottom < -10
          ) {
            // Off screen — drop the pet
            dismountPerch();
          } else {
            groundOffset = window.innerHeight - r.top;
            leftWall = Math.max(8, r.left + 4);
            rightWall = Math.max(
              leftWall + 4,
              r.right - PET_W - 4
            );
          }
        }
      }
      groundOffsetRef.current = groundOffset;

      // Treat chasing — only on the floor (not perched), and only for
      // treats that have settled near the ground.
      let chaseTarget: HTMLElement | null = null;
      if (
        !perch &&
        !hoveredRef.current &&
        !draggingRef.current &&
        !reduced &&
        !inDizzy
      ) {
        const treats = document.querySelectorAll<HTMLElement>(TREAT_SELECTOR);
        if (treats.length > 0) {
          const petCenter = xRef.current + PET_W / 2;
          let minDist = Infinity;
          for (const t of treats) {
            const r = t.getBoundingClientRect();
            // Treat must be near the floor — skip ones still falling
            if (r.bottom < window.innerHeight - 50) continue;
            const tx = r.left + r.width / 2;
            const d = Math.abs(tx - petCenter);
            if (d < minDist) {
              minDist = d;
              chaseTarget = t;
            }
          }
        }
      }

      // Walking
      if (!hoveredRef.current && !draggingRef.current && !reduced && !inDizzy) {
        if (chaseTarget) {
          // Chase the closest treat
          const r = chaseTarget.getBoundingClientRect();
          const targetCenter = r.left + r.width / 2;
          const petCenter = xRef.current + PET_W / 2;
          const dx = targetCenter - petCenter;

          if (Math.abs(dx) < 18) {
            // Reached the treat — eat it
            const id = chaseTarget.dataset.treatId;
            window.dispatchEvent(
              new CustomEvent("pet:ate-treat", { detail: { id } })
            );
            say(PHRASES.eat, 1400);
            if (!reduced) {
              pet.setAttribute("data-hopping", "");
              setTimeout(() => pet.removeAttribute("data-hopping"), 520);
            }
            xVelRef.current = 0;
          } else {
            // Walk faster than usual when chasing
            const step = SPEED * (dt / 1000) * 1.7;
            xRef.current += Math.sign(dx) * step;
            dirRef.current = dx > 0 ? 1 : -1;
            xRef.current = Math.max(leftWall, Math.min(rightWall, xRef.current));
            xVelRef.current = 0;
          }
        } else {
          const step = SPEED * (dt / 1000);
          if (xRef.current < leftWall) {
            xRef.current = Math.min(leftWall, xRef.current + step);
            dirRef.current = 1;
          } else if (xRef.current > rightWall) {
            xRef.current = Math.max(rightWall, xRef.current - step);
            dirRef.current = -1;
          } else if (Math.abs(xVelRef.current) > 8) {
            xRef.current += xVelRef.current * (dt / 1000);
            xVelRef.current *= Math.pow(0.04, dt / 1000);
            dirRef.current = xVelRef.current >= 0 ? 1 : -1;
            if (xRef.current < leftWall) {
              xRef.current = leftWall;
              xVelRef.current = 0;
            } else if (xRef.current > rightWall) {
              xRef.current = rightWall;
              xVelRef.current = 0;
            }
          } else {
            xVelRef.current = 0;
            xRef.current += dirRef.current * step;
            if (xRef.current <= leftWall) {
              xRef.current = leftWall;
              if (dirRef.current === -1) bump(1);
              dirRef.current = 1;
            } else if (xRef.current >= rightWall) {
              xRef.current = rightWall;
              if (dirRef.current === 1) bump(-1);
              dirRef.current = -1;
            }
          }
        }
      }

      // Vertical physics — gravity + small bounce
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
      pet.style.setProperty("--pet-ground", `${groundOffset}px`);
      pet.style.setProperty("--pet-flip", dirRef.current === 1 ? "1" : "-1");

      // Eye tracking
      const eyes = eyesRef.current;
      if (eyes && lastPointerRef.current.x > -9999) {
        const cx = xRef.current + PET_W / 2;
        const cy =
          window.innerHeight - groundOffset - yRef.current - PET_H / 2;
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

    let lastScrollY = window.scrollY;
    const onScroll = () => {
      if (reduced || draggingRef.current) {
        lastScrollY = window.scrollY;
        return;
      }
      const dy = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;
      const mag = Math.min(400, Math.abs(dy));
      // Don't apply scroll jolt when perched — would slide the pet around
      if (mag < 2 || yRef.current > 6 || perchRef.current) return;
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
          // Dismount perch on drag — preserve absolute screen position
          if (perchRef.current) dismountPerch();
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

      const newLeft = e.clientX - dragOffsetRef.current.x;
      const newTop = e.clientY - dragOffsetRef.current.y;
      xRef.current = Math.max(4, Math.min(window.innerWidth - PET_W - 4, newLeft));
      const yFromGround = window.innerHeight - newTop - PET_H;
      yRef.current = Math.max(
        0,
        Math.min(window.innerHeight - PET_H - 4, yFromGround)
      );

      // Shake → dizzy
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

        // Throw velocity from last ~140ms of pointer history
        if (ptrHistoryRef.current.length >= 2) {
          const first = ptrHistoryRef.current[0];
          const last = ptrHistoryRef.current[ptrHistoryRef.current.length - 1];
          const dtMs = Math.max(8, last.t - first.t);
          const vx = ((last.x - first.x) / dtMs) * 1000 * 0.55;
          const vy = ((last.y - first.y) / dtMs) * 1000 * 0.55;
          xVelRef.current = Math.max(-500, Math.min(500, vx));
          yVelRef.current = Math.max(-420, Math.min(420, -vy));
        }

        // Check if dropped onto a perch
        const petCenterX = xRef.current + PET_W / 2;
        const petFeetY = window.innerHeight - yRef.current;
        const perch = findPerchAt(petCenterX, petFeetY);
        if (perch && !dizzyRef.current) {
          xVelRef.current = 0;
          yVelRef.current = 0;
          mountPerch(perch);
          yRef.current = 0;
          say(PHRASES.perchLand, 2200);
        } else {
          say(PHRASES.drop, 1400);
        }

        try {
          localStorage.setItem(
            POSITION_KEY,
            JSON.stringify({ x: xRef.current })
          );
        } catch {
          // ignore
        }
      } else {
        // Plain click → hop + escalating quip
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
          say(idlePoolFor(pathRef.current, !!perchRef.current), 2200);
        }
        schedule();
      }, delay);
    }
    const firstTimer = setTimeout(() => {
      if (!hoveredRef.current && !draggingRef.current && !dizzyRef.current) {
        say(idlePoolFor(pathRef.current, !!perchRef.current), 2200);
      }
      schedule();
    }, 12000);
    return () => {
      clearTimeout(firstTimer);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, []);

  /* -------- External "make the pet say something" hook -------- */

  useEffect(() => {
    const onSay = (e: Event) => {
      const detail = (e as CustomEvent<{ text?: string; ms?: number }>).detail;
      if (!detail?.text) return;
      const bubble = bubbleRef.current;
      if (!bubble) return;
      bubble.innerHTML = detail.text.replace(/\n/g, "<br>");
      bubble.setAttribute("data-show", "");
      if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current);
      bubbleTimerRef.current = setTimeout(
        () => bubble.removeAttribute("data-show"),
        detail.ms ?? 1800
      );
    };
    window.addEventListener("pet:say", onSay as EventListener);
    return () => window.removeEventListener("pet:say", onSay as EventListener);
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
            {/* Soft contact shadow */}
            <ellipse
              className="site-pet__shadow"
              cx="22"
              cy="53.5"
              rx="14"
              ry="1.8"
              fill="#2C3E50"
              opacity="0.2"
            />

            {/* Ears */}
            <circle cx="11" cy="13" r="5" fill="#7E91C0" />
            <circle cx="33" cy="13" r="5" fill="#7E91C0" />
            <circle cx="11" cy="14" r="2.4" fill="#A88FA8" opacity="0.65" />
            <circle cx="33" cy="14" r="2.4" fill="#A88FA8" opacity="0.65" />

            {/* Body */}
            <ellipse cx="22" cy="28" rx="17" ry="20" fill="#7E91C0" />

            {/* Belly highlight */}
            <ellipse cx="22" cy="35" rx="11" ry="11" fill="#A8B7D6" opacity="0.55" />

            {/* Top body shine */}
            <ellipse cx="14" cy="18" rx="5" ry="3" fill="#FBF6EC" opacity="0.22" />

            {/* Eyes — wrapped in groups so each can blink from its own center */}
            <g ref={eyesRef} className="site-pet__eyes">
              <g className="site-pet__eye site-pet__eye--left">
                <circle cx="15" cy="27" r="4" fill="#FBF6EC" />
                <circle cx="15.5" cy="27.5" r="2.5" fill="#1A1A2E" />
                <circle cx="16" cy="26.5" r="0.9" fill="#FBF6EC" />
              </g>
              <g className="site-pet__eye site-pet__eye--right">
                <circle cx="29" cy="27" r="4" fill="#FBF6EC" />
                <circle cx="29.5" cy="27.5" r="2.5" fill="#1A1A2E" />
                <circle cx="30" cy="26.5" r="0.9" fill="#FBF6EC" />
              </g>
            </g>

            {/* Cheeks */}
            <ellipse cx="9" cy="33" rx="2.4" ry="1.5" fill="#E5849C" opacity="0.55" />
            <ellipse cx="35" cy="33" rx="2.4" ry="1.5" fill="#E5849C" opacity="0.55" />

            {/* Mouth */}
            <path
              d="M19 36 Q22 38.5 25 36"
              stroke="#1A1A2E"
              strokeWidth="1"
              fill="none"
              strokeLinecap="round"
            />

            {/* Legs */}
            <rect
              className="site-pet__leg site-pet__leg--left"
              x="14"
              y="46"
              width="7"
              height="8"
              rx="2.5"
              fill="#7E91C0"
            />
            <rect
              className="site-pet__leg site-pet__leg--right"
              x="23"
              y="46"
              width="7"
              height="8"
              rx="2.5"
              fill="#7E91C0"
            />
          </svg>
        </span>
      </button>
    </div>
  );
}
