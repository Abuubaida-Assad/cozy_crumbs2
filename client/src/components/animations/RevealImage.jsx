import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { transitions } from '../../animations/transitions';

export default function RevealImage({
  src,
  alt = '',
  className = '',
  imageClassName = '',
  aspectRatio = 'aspect-[4/5]',
  once = false,
  amount = 0.2,
  delay = 0,
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div className={`overflow-hidden ${aspectRatio} ${className}`}>
        <img src={src} alt={alt} className={`w-full h-full object-cover ${imageClassName}`} />
      </div>
    );
  }

  return (
    <div className={`overflow-hidden ${aspectRatio} ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        initial={{ scale: 1.12, opacity: 0.8 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once, amount }}
        transition={{
          duration: transitions.imageReveal.duration,
          ease: transitions.imageReveal.ease,
          delay,
        }}
        className={`w-full h-full object-cover select-none will-change-transform ${imageClassName}`}
      />
    </div>
  );
}
