import React from 'react';
import {
  FlaskConical,
  Laptop,
  Settings,
  Palette,
  Compass,
  Dna,
  Rocket,
  Lightbulb,
  Shield,
  GraduationCap
} from 'lucide-react';

export const AVATAR_ICON_MAP: Record<string, React.FC<{ size?: number; color?: string; style?: React.CSSProperties }>> = {
  science: FlaskConical,
  tech: Laptop,
  engineering: Settings,
  art: Palette,
  math: Compass,
  bio: Dna,
  rocket: Rocket,
  idea: Lightbulb,
  shield: Shield,
  lecturer: GraduationCap,
  // Backwards compatibility with any previous emoji strings using unicode escapes
  '\u{1F52C}': FlaskConical, // microscope
  '\u{1F4BB}': Laptop,       // laptop
  '\u{2699}': Settings,      // gear
  '\u{2699}\u{FE0F}': Settings,
  '\u{1F3A8}': Palette,      // art palette
  '\u{1F4D0}': Compass,      // triangular ruler
  '\u{1F9EC}': Dna,          // dna
  '\u{1F680}': Rocket,       // rocket
  '\u{1F4A1}': Lightbulb,    // lightbulb
  '\u{1F6E1}': Shield,       // shield
  '\u{1F6E1}\u{FE0F}': Shield,
  '\u{1F468}\u{200D}\u{1F3EB}': GraduationCap, // teacher man
  '\u{1F469}\u{200D}\u{1F3EB}': GraduationCap, // teacher woman
  '\u{1F6E0}': Settings,     // hammer and wrench
  '\u{1F6E0}\u{FE0F}': Settings
};

export const AVATAR_ICON_KEYS = [
  'science',
  'tech',
  'engineering',
  'art',
  'math',
  'bio',
  'rocket',
  'idea',
  'shield',
  'lecturer'
];

export const AvatarBadgeIcon: React.FC<{ iconKey?: string; size?: number; color?: string; style?: React.CSSProperties }> = ({
  iconKey,
  size = 14,
  color,
  style
}) => {
  if (!iconKey) return <FlaskConical size={size} color={color} style={style} />;
  const Comp = AVATAR_ICON_MAP[iconKey];
  if (Comp) {
    return <Comp size={size} color={color} style={style} />;
  }
  return <span style={style}>{iconKey}</span>;
};
