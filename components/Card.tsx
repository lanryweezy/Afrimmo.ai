import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`glass-card rounded-2xl p-5 sm:p-6 shadow-lg ${className}`}>
      {children}
    </div>
  );
};

export default Card;