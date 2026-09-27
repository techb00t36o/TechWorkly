// Shared company logo helpers so Browse Jobs / company profiles use one source.
const palette = [
  '6366f1,8b5cf6',
  '0ea5e9,0284c7',
  '10b981,059669',
  'f59e0b,d97706',
  'ec4899,db2777',
  '14b8a6,0d9488',
  '8b5cf6,7c3aed',
  'ef4444,dc2626',
]

function slugify(name) {
  return (name || 'company')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// Stable DiceBear URL keyed by company name (matches company profile seeds)
export function getCompanyLogo(name) {
  const seed = slugify(name)
  const colors = palette[seed.length % palette.length]
  return `https://api.dicebear.com/9.x/shapes/svg?seed=${seed}&backgroundColor=${colors}`
}
