import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { transitions } from '../../animations/transitions';

export default function Reveal({
  children,
  className = '',
  delay = 0,
  duration,
  y = 40,
  x = 0,
  scale = 1,
  once = false,
  amount = 0.15,
  as = 'div',
}) {
  const shouldReduceMotion = useReducedMotion();
  const Component = motion[as] || motion.div;

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <Component
      initial={{ opacity: 0, y, x, scale }}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      viewport={{ once, amount }}
      transition={{
        duration: duration || transitions.editorial.duration,
        ease: transitions.editorial.ease,
        delay,
      }}
      className={className}
    >
      {children}
    </Component>
  );
}
