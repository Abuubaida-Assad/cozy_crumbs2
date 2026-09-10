import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { transitions } from '../../animations/transitions';

export default function ScaleReveal({
  children,
  className = '',
  delay = 0,
  initialScale = 0.93,
  duration,
  once = false,
  amount = 0.15,
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: initialScale }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once, amount }}
      transition={{
        duration: duration || transitions.editorial.duration,
        ease: transitions.editorial.ease,
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
