import { ref, watchEffect } from 'vue'

type Theme = 'light' | 'dark'

const STORAGE_KEY = 'app-theme'
const theme = ref<Theme>((localStorage.getItem(STORAGE_KEY) as Theme) || 'light')

export function useTheme() {
  function apply(t: Theme) {
    const root = document.documentElement
    if (t === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }

  watchEffect(() => {
    apply(theme.value)
  })

  function toggle() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    localStorage.setItem(STORAGE_KEY, theme.value)
  }

  function set(t: Theme) {
    theme.value = t
    localStorage.setItem(STORAGE_KEY, t)
  }

  return { theme, toggle, set }
}
