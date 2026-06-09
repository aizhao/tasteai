import { reactive, computed } from 'vue'

export interface NutritionGoals {
  calories: number
  protein: number
  fat: number
  carbs: number
}

export interface NutritionProfile {
  goalLabel: string
  goals: NutritionGoals
  restrictions: string[]
  mealPlan: 'breakfast' | 'lunch' | 'dinner' | 'all'
}

const STORAGE_KEY = 'nutrition-profile'

function load(): NutritionProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return {
    goalLabel: '高蛋白低脂',
    goals: { calories: 1800, protein: 90, fat: 40, carbs: 200 },
    restrictions: [],
    mealPlan: 'all',
  }
}

function save(p: NutritionProfile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p))
}

const profile = reactive<NutritionProfile>(load())

export function useNutritionProfile() {
  const goalLabel = computed(() => profile.goalLabel)
  const goals = computed(() => profile.goals)
  const restrictions = computed(() => profile.restrictions)
  const mealPlan = computed(() => profile.mealPlan)

  function updateGoals(g: NutritionGoals) {
    profile.goals = g
    save({ ...profile })
  }

  function setGoalLabel(label: string) {
    profile.goalLabel = label
    save({ ...profile })
  }

  function addRestriction(r: string) {
    if (!profile.restrictions.includes(r)) {
      profile.restrictions.push(r)
      save({ ...profile })
    }
  }

  function removeRestriction(r: string) {
    profile.restrictions = profile.restrictions.filter((x) => x !== r)
    save({ ...profile })
  }

  function setMealPlan(m: NutritionProfile['mealPlan']) {
    profile.mealPlan = m
    save({ ...profile })
  }

  return {
    profile,
    goalLabel,
    goals,
    restrictions,
    mealPlan,
    updateGoals,
    setGoalLabel,
    addRestriction,
    removeRestriction,
    setMealPlan,
  }
}
