import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function AnimatedLink({
  to,
  children,
  className = '',
  underlineClassName = 'bg-[#FFA7EE]',
  isActive = false,
  ...props
}) {
  return (
    <Link
      to={to}
      className={`group relative inline-block ${className}`}
      {...props}
    >
      <span>{children}</span>
      <motion.span
        className={`absolute left-0 bottom-[-2px] h-[2px] w-full origin-left transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
        } ${underlineClassName}`}
      />
    </Link>
  );
}
