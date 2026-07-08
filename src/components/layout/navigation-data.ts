import type { IconType } from 'react-icons';
import { FaGithub, FaLinkedinIn } from 'react-icons/fa6';
import { FiGlobe } from 'react-icons/fi';

export type NavItem = {
  href: string;
  label: string;
  exact?: boolean;
};

export type DeveloperLink = {
  href: string;
  label: string;
  icon: IconType;
};

export const navItems: NavItem[] = [
  { href: '/', label: 'Home', exact: true },
  { href: '/receitas', label: 'Receitas' },
  { href: '/favoritos', label: 'Favoritos' },
  { href: '/sobre', label: 'Sobre' },
];

export const footerNavItems: NavItem[] = [
  { href: '/', label: 'Home', exact: true },
  { href: '/receitas', label: 'Receitas' },
  { href: '/sobre', label: 'Sobre' },
];

export const developerLinks: DeveloperLink[] = [
  {
    href: 'https://github.com/MacielDouglas',
    label: 'GitHub',
    icon: FaGithub,
  },
  {
    href: 'https://www.linkedin.com/in/douglas-maciel-4943461b0/',
    label: 'LinkedIn',
    icon: FaLinkedinIn,
  },
  {
    href: 'https://macield.vercel.app/',
    label: 'Portfólio',
    icon: FiGlobe,
  },
];
