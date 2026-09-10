import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { transitions } from '../../animations/transitions';

export default function RevealText({
  lines = [],
  className = '',
  lineClassName = '',
  as: HeadingTag = 'h2',
  once = false,
  amount = 0.15,
  delay = 0,
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <HeadingTag className={className}>
        {lines.map((line, i) => (
          <span key={i} className={`block ${lineClassName}`}>
            {line}
          </span>
        ))}
      </HeadingTag>
    );
  }

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12,
        delayChildren: delay,
      },
    },
  };

  const lineVariants = {
    hidden: {
      opacity: 0,
      y: 45,
      scale: 0.98,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: transitions.editorial.ease,
      },
    },
  };

  return (
    <HeadingTag className={className}>
      <motion.span
        initial="hidden"
        whileInView="visible"
        viewport={{ once, amount }}
        variants={containerVariants}
        className="block"
      >
        {lines.map((line, i) => (
          <span key={i} className="block overflow-hidden leading-[0.9]">
            <motion.span
              variants={lineVariants}
              className={`block will-change-transform ${lineClassName}`}
            >
              {line}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </HeadingTag>
  );
}
