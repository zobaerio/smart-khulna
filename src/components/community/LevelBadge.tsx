import React from 'react';
import { Award, Crown, ShieldCheck, Star, Sparkles } from 'lucide-react';
import { Language } from '../../utils/translations';

export interface LevelBadgeProps {
  invitesCount: number;
  lang?: Language;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

export interface LevelDefinition {
  level: number;
  nameBn: string;
  nameEn: string;
  minInvites: number;
  icon: React.ReactNode;
  bgGradient: string;
  borderColor: string;
  textColor: string;
  badgeBg: string;
}

export const getLevelDefinition = (invites: number): LevelDefinition => {
  if (invites >= 100) {
    return {
      level: 5,
      nameBn: 'অ্যাম্বাসেডর (Ambassador)',
      nameEn: 'Ambassador (Level 5)',
      minInvites: 100,
      icon: <Crown size={16} className="text-amber-300 animate-pulse" />,
      bgGradient: 'bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500',
      borderColor: 'border-purple-400/60',
      textColor: 'text-white',
      badgeBg: 'bg-purple-950/80 text-purple-200 border-purple-500/40',
    };
  } else if (invites >= 50) {
    return {
      level: 4,
      nameBn: 'প্লাটিনাম লিডার (Platinum)',
      nameEn: 'Platinum Leader (Level 4)',
      minInvites: 50,
      icon: <Sparkles size={16} className="text-cyan-300" />,
      bgGradient: 'bg-gradient-to-r from-cyan-600 to-blue-600',
      borderColor: 'border-cyan-400/50',
      textColor: 'text-white',
      badgeBg: 'bg-cyan-950/80 text-cyan-200 border-cyan-500/40',
    };
  } else if (invites >= 20) {
    return {
      level: 3,
      nameBn: 'গোল্ড কন্ট্রিবিউটর (Gold)',
      nameEn: 'Gold Contributor (Level 3)',
      minInvites: 20,
      icon: <Award size={16} className="text-yellow-300" />,
      bgGradient: 'bg-gradient-to-r from-amber-500 to-yellow-600',
      borderColor: 'border-amber-400/50',
      textColor: 'text-slate-950',
      badgeBg: 'bg-amber-950/80 text-amber-200 border-amber-500/40',
    };
  } else if (invites >= 10) {
    return {
      level: 2,
      nameBn: 'সিলভার সদস্য (Silver)',
      nameEn: 'Silver Member (Level 2)',
      minInvites: 10,
      icon: <Star size={16} className="text-slate-200" />,
      bgGradient: 'bg-gradient-to-r from-slate-400 to-slate-600',
      borderColor: 'border-slate-400/40',
      textColor: 'text-white',
      badgeBg: 'bg-slate-800 text-slate-200 border-slate-600',
    };
  } else {
    return {
      level: 1,
      nameBn: 'নাগরিক (Citizen)',
      nameEn: 'Citizen (Level 1)',
      minInvites: 0,
      icon: <ShieldCheck size={16} className="text-emerald-400" />,
      bgGradient: 'bg-gradient-to-r from-emerald-600 to-teal-700',
      borderColor: 'border-emerald-500/30',
      textColor: 'text-white',
      badgeBg: 'bg-emerald-950/80 text-emerald-200 border-emerald-500/30',
    };
  }
};

export const LevelBadge: React.FC<LevelBadgeProps> = ({
  invitesCount,
  lang = 'bn',
  size = 'md',
  showDetails = true,
}) => {
  const def = getLevelDefinition(invitesCount);
  const isBn = lang === 'bn';

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3.5 py-1.5 text-sm',
  };

  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full font-bold shadow-xs border ${def.bgGradient} ${def.borderColor} ${def.textColor} ${sizeClasses[size]} transition-all`}>
      <span className="shrink-0">{def.icon}</span>
      <span>{isBn ? def.nameBn : def.nameEn}</span>
      {showDetails && (
        <span className="opacity-80 text-[10px] font-mono ml-0.5 bg-black/20 px-1.5 py-0.2 rounded-full">
          ({invitesCount} invites)
        </span>
      )}
    </div>
  );
};

export default LevelBadge;
