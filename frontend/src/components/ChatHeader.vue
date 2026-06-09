<template>
  <header class="flex items-center justify-between px-5 py-3 bg-[var(--color-surface)] border-b border-[var(--color-border)] flex-shrink-0">
    <div class="flex items-center gap-3">
      <button
        class="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-sidebar-hover)] transition-colors"
        @click="$emit('toggleSidebar')"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>
      <div>
        <h1 class="text-lg font-semibold text-[var(--color-text-primary)]">AI 食谱推荐</h1>
        <p class="text-sm text-[var(--color-text-secondary)] hidden sm:block">根据你的目标、食材和饮食偏好生成健康餐食</p>
      </div>
    </div>
    <div class="flex items-center gap-3">
      <button
        class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-primary-light)] text-[var(--color-primary-dark)] text-sm font-medium rounded-full hover:bg-[var(--color-primary-soft)] transition-colors cursor-pointer"
        @click="$emit('openNutrition')"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
        当前目标：{{ goalLabel }}
      </button>
      <button
        class="inline-flex items-center gap-1.5 px-4 py-1.5 border border-[var(--color-border)] rounded-[var(--radius-btn)] text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-sidebar-hover)] transition-colors cursor-pointer"
        @click="$emit('openNutrition')"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        营养档案
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useNutritionProfile } from '../composables/useNutritionProfile'

defineEmits<{ toggleSidebar: []; openNutrition: [] }>()

const { goalLabel } = useNutritionProfile()
</script>
