import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

type Theme = 'light' | 'dark'

const getInitialTheme = (): Theme => {
  try {
    const savedTheme = window.localStorage.getItem('chowzilla-theme')
    if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme
  } catch {
    // Storage can be unavailable in privacy-restricted browsers.
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const ThemeToggle = ({ className = 'theme-toggle' }: { className?: string }) => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      window.localStorage.setItem('chowzilla-theme', theme)
    } catch {
      // The active theme still applies for this session.
    }
    document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'dark' ? '#111827' : '#FFFFFF')
  }, [theme])

  return (
    <button
      className={className}
      type="button"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      aria-pressed={theme === 'dark'}
      onClick={() => setTheme((currentTheme) => currentTheme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
    </button>
  )
}

export default ThemeToggle
