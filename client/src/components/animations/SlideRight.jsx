import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { transitions } from '../../animations/transitions';

export default function SlideRight({
  children,
  className = '',
  delay = 0,
  distance = 50,
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
      initial={{ opacity: 0, x: -distance }}
      whileInView={{ opacity: 1, x: 0 }}
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
