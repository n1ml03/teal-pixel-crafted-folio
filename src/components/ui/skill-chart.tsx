import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SkillItemProps {
  name: string;
  level: number; // 0-100
  color?: string;
  icon?: React.ReactNode;
  index?: number;
}

interface SkillChartProps {
  skills: SkillItemProps[];
  className?: string;
  title?: string;
  subtitle?: string;
}

const SkillItem = ({ name, level, color = 'teal', icon, index = 0 }: SkillItemProps) => {
  return (
    <motion.div 
      className="mb-4"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center">
          {icon && <span className="mr-2">{icon}</span>}
          <span className="text-sm font-medium text-gray-700">{name}</span>
        </div>
        <span className="text-xs font-semibold text-gray-500">{level}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
        <motion.div 
          className={cn(`h-2.5 rounded-full bg-${color}-500`)}
          initial={{ width: 0 }}
          animate={{ width: `${level}%` }}
          transition={{ duration: 0.8, delay: index * 0.1 + 0.3, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
};

export const SkillChart = ({ skills, className, title, subtitle }: SkillChartProps) => {
  return (
    <div className={cn("bg-white p-6 rounded-xl shadow-sm border border-gray-100", className)}>
      {title && <h3 className="text-lg font-bold mb-1 text-gray-800">{title}</h3>}
      {subtitle && <p className="text-sm text-gray-600 mb-6">{subtitle}</p>}
      
      <div className="space-y-5">
        {skills.map((skill, index) => (
          <SkillItem key={skill.name} {...skill} index={index} />
        ))}
      </div>
    </div>
  );
};
