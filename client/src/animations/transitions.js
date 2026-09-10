// Centralized Animation Transitions for Cozy Crumbs
// Editorial cubic-bezier curves and standard durations

export const transitions = {
  // Primary smooth editorial cubic-bezier
  editorial: {
    duration: 0.85,
    ease: [0.22, 1, 0.36, 1],
  },

  // Snappier micro-interactions for buttons & badges
  micro: {
    duration: 0.25,
    ease: [0.22, 1, 0.36, 1],
  },

  // Button hover / click
  button: {
    duration: 0.3,
    ease: [0.25, 1, 0.5, 1],
  },

  // Card viewport reveal
  card: {
    duration: 0.7,
    ease: [0.22, 1, 0.36, 1],
  },

  // Major section reveal
  section: {
    duration: 0.9,
    ease: [0.22, 1, 0.36, 1],
  },

  // Large hero image entrance
  hero: {
    duration: 1.5,
    ease: [0.16, 1, 0.3, 1],
  },

  // Large image reveal
  imageReveal: {
    duration: 1.1,
    ease: [0.22, 1, 0.36, 1],
  },

  // Stagger timings
  stagger: {
    fast: 0.06,
    default: 0.1,
    slow: 0.16,
  },
};
