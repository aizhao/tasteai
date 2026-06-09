<template>
  <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
    <div
      v-for="stat in stats"
      :key="stat.label"
      class="flex flex-col items-center p-3 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border-light)]"
      :class="{ 'bg-[var(--color-primary-light)] border-[var(--color-primary-soft)]': stat.highlight }"
    >
      <component :is="stat.icon" class="w-5 h-5 text-[var(--color-primary)] mb-1.5" />
      <div class="text-lg font-bold text-[var(--color-text-primary)]">
        {{ stat.value }} <span class="text-xs font-normal text-[var(--color-text-secondary)]">{{ stat.unit }}</span>
      </div>
      <div class="text-xs text-[var(--color-text-secondary)] mt-0.5">{{ stat.label }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { h } from 'vue'

defineProps<{
  stats: NutritionStat[]
}>()

export interface NutritionStat {
  label: string
  value: number
  unit: string
  highlight?: boolean
  icon: any
}
</script>
