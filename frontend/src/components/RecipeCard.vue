<template>
  <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-card)] overflow-hidden shadow-sm">
    <!-- Header -->
    <div class="p-5 pb-4">
      <div class="flex items-start justify-between gap-4">
        <div class="flex-1">
          <p class="text-xs font-medium text-[var(--color-primary)] uppercase tracking-wide mb-1">推荐早餐</p>
          <h3 class="text-xl font-bold text-[var(--color-text-primary)]">{{ recipe.name }}</h3>
        </div>
        <div class="flex flex-col items-center flex-shrink-0">
          <div class="w-14 h-14 rounded-2xl bg-[var(--color-bg-warm)] flex flex-col items-center justify-center border border-[var(--color-warm-light)]">
            <span class="text-xl font-bold text-[var(--color-warm)]">{{ recipe.score }}</span>
            <span class="text-xs text-[var(--color-text-secondary)]">分</span>
          </div>
          <span class="text-xs text-[var(--color-text-secondary)] mt-1">匹配{{ recipe.matchGoal }}</span>
        </div>
      </div>

      <!-- Tags -->
      <div class="flex flex-wrap gap-2 mt-3">
        <span
          v-for="tag in recipe.tags"
          :key="tag.label"
          class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
          :class="tagClass(tag.type)"
        >
          <component :is="tag.icon" v-if="tag.icon" class="w-3 h-3" />
          {{ tag.label }}
        </span>
      </div>
    </div>

    <!-- Nutrition Stats -->
    <div class="px-5 pb-4">
      <NutritionStats :stats="recipe.nutrition" />
    </div>

    <!-- Recommendation Reason -->
    <div class="mx-5 mb-4 p-4 bg-[var(--color-bg)] rounded-xl border border-[var(--color-border-light)]">
      <h4 class="text-sm font-semibold text-[var(--color-text-primary)] mb-1.5">为什么推荐它？</h4>
      <p class="text-sm text-[var(--color-text-secondary)] leading-relaxed">{{ recipe.reason }}</p>
    </div>

    <!-- Ingredients + Steps -->
    <div class="mx-5 mb-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
      <!-- Ingredients -->
      <div>
        <h4 class="text-sm font-semibold text-[var(--color-text-primary)] mb-2 flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          食材清单
        </h4>
        <ul class="space-y-1.5">
          <li v-for="item in recipe.ingredients" :key="item.name" class="flex justify-between text-sm">
            <span class="text-[var(--color-text-primary)]">{{ item.name }}</span>
            <span class="text-[var(--color-text-secondary)] ml-2">{{ item.amount }}</span>
          </li>
        </ul>
      </div>

      <!-- Steps -->
      <div>
        <h4 class="text-sm font-semibold text-[var(--color-text-primary)] mb-2 flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
          制作步骤
        </h4>
        <ol class="space-y-1.5">
          <li v-for="(step, idx) in recipe.steps" :key="idx" class="flex gap-2 text-sm">
            <span class="flex-shrink-0 w-5 h-5 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] text-xs font-semibold flex items-center justify-center mt-0.5">{{ idx + 1 }}</span>
            <span class="text-[var(--color-text-primary)]">{{ step }}</span>
          </li>
        </ol>
      </div>
    </div>

    <!-- Actions -->
    <div class="px-5 pb-5 flex flex-wrap gap-2">
      <button
        class="inline-flex items-center gap-2 px-4 py-2.5 text-white text-sm font-medium rounded-[var(--radius-btn)] transition-all shadow-sm"
        :class="addedToPlan ? 'bg-green-600' : 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)]'"
        @click="handleAddToPlan"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path v-if="addedToPlan" d="M20 6L9 17l-5-5"/>
          <template v-else><path d="M12 5v14"/><line x1="5" y1="12" x2="19" y2="12"/></template>
        </svg>
        {{ addedToPlan ? '已加入计划' : '加入早餐计划' }}
      </button>
      <button
        class="inline-flex items-center gap-1.5 px-4 py-2.5 border text-sm rounded-[var(--radius-btn)] transition-colors"
        :class="liked ? 'border-red-300 bg-red-50 text-red-500' : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-sidebar-hover)]'"
        @click="handleLike"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" :fill="liked ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        {{ liked ? '已收藏' : '收藏' }}
      </button>
      <button class="inline-flex items-center gap-1.5 px-4 py-2.5 border border-[var(--color-border)] text-sm text-[var(--color-text-secondary)] rounded-[var(--radius-btn)] hover:bg-[var(--color-sidebar-hover)] transition-colors" @click="handleRefresh">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
        换一份
      </button>
      <button class="inline-flex items-center gap-1.5 px-4 py-2.5 border border-[var(--color-border)] text-sm text-[var(--color-text-secondary)] rounded-[var(--radius-btn)] hover:bg-[var(--color-sidebar-hover)] transition-colors" @click="handleShoppingList">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
        生成购物清单
      </button>
      <button class="inline-flex items-center gap-1.5 px-4 py-2.5 border border-[var(--color-border)] text-sm text-[var(--color-text-secondary)] rounded-[var(--radius-btn)] hover:bg-[var(--color-sidebar-hover)] transition-colors" @click="handleAdjustDiet">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
        调整为更低脂
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import NutritionStats from './NutritionStats.vue'
import type { RecipeData } from '../types'

defineProps<{
  recipe: RecipeData
}>()

const liked = ref(false)
const addedToPlan = ref(false)

function handleAddToPlan() {
  addedToPlan.value = !addedToPlan.value
}

function handleLike() {
  liked.value = !liked.value
}

function handleRefresh() {
  window.location.reload()
}

function handleShoppingList() {
  alert('购物清单功能即将上线，敬请期待！')
}

function handleAdjustDiet() {
  alert('已请求调整食谱配方，AI 将重新生成更低脂版本')
}

function tagClass(type: string) {
  switch (type) {
    case 'green': return 'bg-[var(--color-primary-light)] text-[var(--color-primary-dark)]'
    case 'orange': return 'bg-[var(--color-warm-light)] text-amber-700'
    case 'blue': return 'bg-blue-50 text-blue-700'
    default: return 'bg-gray-100 text-gray-600'
  }
}
</script>
