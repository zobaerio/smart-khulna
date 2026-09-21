import { LucideIcon } from 'lucide-react';

interface IconProps {
  icon: LucideIcon;
  className?: string;
  size?: number;
  strokeWidth?: number;
  interactive?: boolean;
}

export const Icon = ({ icon: LucideIcon, className, size = 20, strokeWidth = 1.5, interactive = false }: IconProps) => {
  const content = <LucideIcon className={className} size={size} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />;

  if (interactive) {
    return (
      <div className="icon-container">
        {content}
      </div>
    );
  }
  return content;
};
