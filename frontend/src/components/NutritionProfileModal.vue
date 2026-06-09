<template>
  <Teleport to="body">
    <div v-if="visible" class="fixed inset-0 z-[60] flex items-center justify-center p-4" @click.self="$emit('close')">
      <div class="absolute inset-0 bg-black/30" />
      <div class="relative w-full max-w-md bg-[var(--color-surface)] rounded-2xl shadow-xl border border-[var(--color-border)] p-6 max-h-[85vh] overflow-y-auto">
        <!-- Header -->
        <div class="flex items-center justify-between mb-5">
          <h2 class="text-lg font-bold text-[var(--color-text-primary)]">营养档案</h2>
          <button class="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--color-text-secondary)] hover:bg-[var(--color-sidebar-hover)] transition-colors" @click="$emit('close')">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <!-- Goal label -->
        <label class="block mb-4">
          <span class="text-sm font-medium text-[var(--color-text-primary)]">当前目标</span>
          <input
            :value="profile.goalLabel"
            class="mt-1.5 w-full px-3 py-2.5 rounded-xl border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] bg-[var(--color-bg)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
            @input="setGoalLabel(($event.target as HTMLInputElement).value)"
          />
        </label>

        <!-- Nutrition goals -->
        <p class="text-sm font-medium text-[var(--color-text-primary)] mb-2">每日营养目标</p>
        <div class="grid grid-cols-2 gap-2.5 mb-4">
          <div v-for="g in goalFields" :key="g.key" class="bg-[var(--color-bg)] rounded-xl p-3 border border-[var(--color-border-light)]">
            <span class="text-xs text-[var(--color-text-secondary)]">{{ g.label }}</span>
            <div class="flex items-center gap-1 mt-1">
              <input
                :value="profile.goals[g.key as keyof NutritionGoals]"
                type="number"
                class="w-full bg-transparent text-lg font-bold text-[var(--color-text-primary)] focus:outline-none"
                @input="handleGoalChange(g.key, ($event.target as HTMLInputElement).value)"
              />
              <span class="text-xs text-[var(--color-text-secondary)] flex-shrink-0">{{ g.unit }}</span>
            </div>
          </div>
        </div>

        <!-- Meal plan -->
        <p class="text-sm font-medium text-[var(--color-text-primary)] mb-2">餐食类型偏好</p>
        <div class="flex gap-2 mb-4">
          <button
            v-for="m in mealOptions"
            :key="m.value"
            class="px-4 py-2 rounded-xl text-sm font-medium transition-colors"
            :class="profile.mealPlan === m.value
              ? 'bg-[var(--color-primary)] text-white'
              : 'bg-[var(--color-bg)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:border-[var(--color-primary)]'"
            @click="setMealPlan(m.value)"
          >
            {{ m.label }}
          </button>
        </div>

        <!-- Dietary restrictions -->
        <p class="text-sm font-medium text-[var(--color-text-primary)] mb-2">饮食限制</p>
        <div class="flex flex-wrap gap-2 mb-2">
          <button
            v-for="r in restrictionOptions"
            :key="r"
            class="px-3 py-1.5 text-sm rounded-full border transition-colors"
            :class="profile.restrictions.includes(r)
              ? 'bg-[var(--color-primary-light)] border-[var(--color-primary)] text-[var(--color-primary-dark)]'
              : 'bg-[var(--color-bg)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]'"
            @click="toggleRestriction(r)"
          >
            {{ r }}
          </button>
        </div>

        <!-- Save -->
        <button class="w-full mt-5 py-2.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white text-sm font-medium rounded-xl transition-colors" @click="$emit('close')">
          保存
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useNutritionProfile } from '../composables/useNutritionProfile'
import type { NutritionGoals } from '../composables/useNutritionProfile'

defineProps<{ visible: boolean }>()
defineEmits<{ close: [] }>()

const { profile, setGoalLabel, updateGoals, addRestriction, removeRestriction, setMealPlan } = useNutritionProfile()

const goalFields = [
  { key: 'calories', label: '热量', unit: 'kcal' },
  { key: 'protein', label: '蛋白质', unit: 'g' },
  { key: 'fat', label: '脂肪', unit: 'g' },
  { key: 'carbs', label: '碳水', unit: 'g' },
]

const mealOptions = [
  { value: 'all', label: '不限' },
  { value: 'breakfast', label: '早餐' },
  { value: 'lunch', label: '午餐' },
  { value: 'dinner', label: '晚餐' },
] as const

const restrictionOptions = ['不吃坚果', '无乳制品', '无麸质', '素食', '低碳水', '低脂', '低钠', '无糖']

function handleGoalChange(key: string, val: string) {
  const num = Number(val)
  if (isNaN(num) || num < 0) return
  const newGoals = { ...profile.goals, [key]: num }
  updateGoals(newGoals)
}

function toggleRestriction(r: string) {
  if (profile.restrictions.includes(r)) {
    removeRestriction(r)
  } else {
    addRestriction(r)
  }
}
</script>
