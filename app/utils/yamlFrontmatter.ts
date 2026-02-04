import yaml from 'js-yaml'

export interface FrontmatterResult<T = Record<string, unknown>> {
  data: T
  content: string
}

const FRONTMATTER_RE = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/

export function parseFrontmatter<T = Record<string, unknown>>(raw: string): FrontmatterResult<T> {
  const match = raw.trim().match(FRONTMATTER_RE)
  if (!match) {
    return { data: {} as T, content: raw }
  }
  const data = yaml.load(match[1] ?? '') as T
  return { data, content: (match[2] ?? '').trim() }
}
