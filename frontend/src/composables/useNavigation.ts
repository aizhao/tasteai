import { ref } from 'vue'

export type NavItem = 'recipe' | 'favorites' | 'mealplan' | 'ingredients' | 'nutrition'

const activeNav = ref<NavItem>('recipe')

export function useNavigation() {
  function setNav(item: NavItem) {
    activeNav.value = item
  }

  return { activeNav, setNav }
}
