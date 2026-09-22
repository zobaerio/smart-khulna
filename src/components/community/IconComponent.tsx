
import React from 'react';
import { 
  Building2, HeartPulse, GraduationCap, Bus, Landmark, Truck, Scale, MapPin, Sprout, Tractor,
  Briefcase, Home, HardHat, UserCheck, Car, Zap, Wrench, Settings, Utensils, Bed, Compass, Grid,
  PhoneCall, Info, ShieldAlert, Shield, Flame, Ambulance, Sparkles, BarChart2, Plus, Bell, Clock, Edit2, LayoutGrid,
  AlertTriangle, User
} from 'lucide-react';

interface IconComponentProps {
  name: string;
  className?: string;
  size?: number;
  strokeWidth?: number;
}

export const IconComponent = ({ name, className, size = 20, strokeWidth = 1.5 }: IconComponentProps) => {
  const icons: Record<string, any> = {
    Building2, HeartPulse, GraduationCap, Bus, Landmark, Truck, Scale, MapPin, Sprout, Tractor,
    Briefcase, Home, HardHat, UserCheck, Car, Zap, Wrench, Settings, Utensils, Bed, Compass, Grid,
    PhoneCall, Info, ShieldAlert, Shield, Flame, Ambulance, Sparkles, BarChart2, Plus, Bell, Clock, Edit2, LayoutGrid,
    AlertTriangle, User
  };
  const Comp = icons[name] || Grid;
  return <Comp className={className} size={size} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />;
};
