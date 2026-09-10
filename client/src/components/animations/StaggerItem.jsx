import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { transitions } from '../../animations/transitions';

export default function StaggerItem({
  children,
  className = '',
  y = 40,
  scale = 0.97,
  as: Component = motion.div,
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const itemVariants = {
    hidden: {
      opacity: 0,
      y,
      scale,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: transitions.card,
    },
  };

  return (
    <Component variants={itemVariants} className={className}>
      {children}
    </Component>
  );
}
