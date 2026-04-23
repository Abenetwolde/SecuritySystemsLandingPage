import { existsSync, readFileSync } from 'fs'
import { join } from 'path'

const root = join(__dirname, '..')

describe('Smoke tests', () => {
  it('app/layout.tsx exists', () => {
    expect(existsSync(join(root, 'app/layout.tsx'))).toBe(true)
  })

  it('tailwind.config.ts exists', () => {
    expect(existsSync(join(root, 'tailwind.config.ts'))).toBe(true)
  })

  it('globals.css contains --accent-cyan', () => {
    const css = readFileSync(join(root, 'app/globals.css'), 'utf-8')
    expect(css).toContain('--accent-cyan')
  })

  it('globals.css contains --glass-border', () => {
    const css = readFileSync(join(root, 'app/globals.css'), 'utf-8')
    expect(css).toContain('--glass-border')
  })

  it('app/layout.tsx does not import from @mui', () => {
    const layout = readFileSync(join(root, 'app/layout.tsx'), 'utf-8')
    expect(layout).not.toContain('@mui')
  })

  it('app/page.tsx does not import from @mui', () => {
    const page = readFileSync(join(root, 'app/page.tsx'), 'utf-8')
    expect(page).not.toContain('@mui')
  })
})
