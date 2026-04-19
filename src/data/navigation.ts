import { features } from '../config';

type NavLink = { href: string; label: string; match: (p: string) => boolean };

const allNavLinks: NavLink[] = [
  { href: '/', label: './home', match: (p) => p === '/' },
  { href: '/blog', label: './blog', match: (p) => p.startsWith('/blog') },
  { href: '/projects', label: './projects', match: (p) => p.startsWith('/projects') },
  { href: '/about', label: './about', match: (p) => p.startsWith('/about') },
];

export const navLinks = allNavLinks.filter((l) => {
  if (l.href === '/blog') return features.blog;
  if (l.href === '/projects') return features.projects;
  return true;
});

const allSocialLinks = [
  { label: 'github', href: 'https://github.com/Sergi030' },
  { label: 'linkedin', href: 'https://linkedin.com/in/sergi-garcia-ibanez' },
  { label: 'rss', href: '/rss.xml' },
  { label: 'email', href: 'mailto:me@sgarcia.dev' },
];

export const socialLinks = allSocialLinks.filter((l) => {
  if (l.label === 'rss') return features.blog;
  return true;
});

/** For client-side use (search, terminal) — serializable, no functions */
const allSitePages = [
  { label: 'Home', href: '/', termLabel: './home' },
  { label: 'Blog', href: '/blog', termLabel: './blog' },
  { label: 'Projects', href: '/projects', termLabel: './projects' },
  { label: 'About', href: '/about', termLabel: './about' },
  { label: 'Tags', href: '/blog/tags/', termLabel: './blog/tags' },
];

export const sitePages = allSitePages.filter((p) => {
  if (p.href.startsWith('/blog')) return features.blog;
  if (p.href.startsWith('/projects')) return features.projects;
  return true;
});

export const siteSocials = [
  { label: 'GitHub', href: 'https://github.com/Sergi030', termLabel: 'github.com/Sergi030' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/sergi-garcia-ibanez', termLabel: 'linkedin.com/in/sergi-garcia-ibanez' },
  { label: 'Email', href: 'mailto:me@sgarcia.dev', termLabel: 'me@sgarcia.dev' },
];
