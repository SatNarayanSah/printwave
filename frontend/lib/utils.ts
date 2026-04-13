import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getMediaUrl(path: string | null | undefined) {
  if (!path || path === '/placeholder.svg') return '/placeholder.svg'
  if (path.startsWith('http') || path.startsWith('data:')) return path
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000'
  return `${apiBase}${path.startsWith('/') ? '' : '/'}${path}`
}
