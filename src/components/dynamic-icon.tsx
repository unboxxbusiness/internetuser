// src/components/dynamic-icon.tsx
"use client";

import React from 'react';
import * as LucideIcons from 'lucide-react';
import { Wifi } from 'lucide-react';

interface DynamicIconProps {
  iconName: string;
  className?: string;
}

type LucideIcon = React.ComponentType<LucideIcons.LucideProps>;

const fallbackIcon = Wifi;

export function DynamicIcon({ iconName, className }: DynamicIconProps) {
  // A bit of a hack to deal with casing differences
  const iconKey = iconName.charAt(0).toUpperCase() + iconName.slice(1);
  const IconComponent = (LucideIcons as Record<string, LucideIcon>)[iconKey] || fallbackIcon;

  return <IconComponent className={className} />;
}
