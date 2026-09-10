// Centralized Framer Motion Variants for Cozy Crumbs
import { transitions } from './transitions';

export const fadeUp = {
  hidden: {
    opacity: 0,
    y: 50,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.editorial,
  },
};

export const fadeDown = {
  hidden: {
    opacity: 0,
    y: -40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.editorial,
  },
};

export const fadeLeft = {
  hidden: {
    opacity: 0,
    x: 50,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitions.editorial,
  },
};

export const fadeRight = {
  hidden: {
    opacity: 0,
    x: -50,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitions.editorial,
  },
};

export const scaleIn = {
  hidden: {
    opacity: 0,
    scale: 0.94,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transitions.editorial,
  },
};

export const imageReveal = {
  hidden: {
    scale: 1.08,
    opacity: 0.7,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: transitions.imageReveal,
  },
};

export const heroImageEntrance = {
  hidden: {
    scale: 1.08,
    opacity: 0.85,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: transitions.hero,
  },
};

export const staggerContainer = (staggerChildren = 0.1, delayChildren = 0) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

export const staggerItem = {
  hidden: {
    opacity: 0,
    y: 45,
    scale: 0.97,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: transitions.card,
  },
};

export const productCardVariant = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: transitions.card,
  },
};

export const lineReveal = {
  hidden: {
    opacity: 0,
    y: '100%',
  },
  visible: {
    opacity: 1,
    y: '0%',
    transition: {
      duration: 0.75,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const buttonHover = {
  rest: {
    scale: 1,
  },
  hover: {
    scale: 1.03,
    transition: transitions.button,
  },
  tap: {
    scale: 0.97,
    transition: transitions.micro,
  },
};
