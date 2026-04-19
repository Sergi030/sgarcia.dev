import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

export interface RepoConfig {
  repo: string;
  role: string;
  nameOverride?: string;
  descOverride?: string;
}

export interface Project {
  name: string;
  description: string;
  url: string;
  role: string;
  language: string | null;
  stars: number;
  updatedAt: string | null;
}

const CACHE_PATH = resolve('src/data/projects-cache.json');

function readCache(): Record<string, any> {
  try {
    const raw = JSON.parse(readFileSync(CACHE_PATH, 'utf-8'));
    const map: Record<string, any> = {};
    for (const item of raw) map[item.repo] = item;
    return map;
  } catch {
    return {};
  }
}

function writeCache(repos: RepoConfig[], cache: Record<string, any>) {
  try {
    const data = repos.map(({ repo }) => cache[repo]).filter(Boolean);
    writeFileSync(CACHE_PATH, JSON.stringify(data, null, 2) + '\n');
  } catch {}
}

export async function fetchProjects(repos: RepoConfig[]): Promise<Project[]> {
  const cache = readCache();
  let cacheUpdated = false;

  const projects = await Promise.all(
    repos.map(async ({ repo, role, nameOverride, descOverride }) => {
      const cached = cache[repo];
      try {
        const res = await fetch(`https://api.github.com/repos/${repo}`, {
          headers: { 'Accept': 'application/vnd.github.v3+json' },
        });
        if (!res.ok) throw new Error('API error');
        const data = await res.json();
        const project = {
          repo,
          name: nameOverride || data.name,
          description: descOverride || data.description || '',
          url: data.html_url,
          language: data.language,
          stars: data.stargazers_count,
          updatedAt: data.pushed_at,
        };
        cache[repo] = project;
        cacheUpdated = true;
        return { ...project, role };
      } catch {
        return {
          name: cached?.name || repo.split('/')[1],
          description: cached?.description || '',
          url: cached?.url || `https://github.com/${repo}`,
          role,
          language: cached?.language || null,
          stars: cached?.stars || 0,
          updatedAt: cached?.updatedAt || null,
        };
      }
    })
  );

  if (cacheUpdated) writeCache(repos, cache);

  return projects;
}

export const langColors: Record<string, string> = {
  'Vim Script': '#199f4b', 'Vim script': '#199f4b', 'Python': '#3572A5', 'TypeScript': '#3178c6',
  'JavaScript': '#f1e05a', 'Shell': '#89e051', 'C': '#555555', 'Astro': '#ff5a03',
};
