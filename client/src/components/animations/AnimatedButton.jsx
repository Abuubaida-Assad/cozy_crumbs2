import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { transitions } from '../../animations/transitions';

export default function AnimatedButton({
  children,
  className = '',
  onClick,
  type = 'button',
  disabled = false,
  as = 'button',
  href,
  target,
  rel,
  scaleHover = 1.03,
  scaleTap = 0.97,
  ...props
}) {
  const shouldReduceMotion = useReducedMotion();

  const motionProps = shouldReduceMotion
    ? {}
    : {
        whileHover: disabled ? {} : { scale: scaleHover },
        whileTap: disabled ? {} : { scale: scaleTap },
        transition: transitions.button,
      };

  if (as === 'a' || href) {
    return (
      <motion.a
        href={href}
        target={target}
        rel={rel}
        className={`inline-flex items-center justify-center will-change-transform ${className}`}
        {...motionProps}
        {...props}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center will-change-transform ${className}`}
      {...motionProps}
      {...props}
    >
      {children}
    </motion.button>
  );
}
