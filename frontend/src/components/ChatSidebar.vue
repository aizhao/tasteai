<template>
  <!-- Mobile overlay -->
  <div
    v-if="visible"
    class="fixed inset-0 bg-black/30 z-40 lg:hidden"
    @click="$emit('close')"
  />

  <!-- Sidebar -->
  <aside
    class="fixed lg:static inset-y-0 left-0 z-50 w-[280px] bg-[var(--color-sidebar)] border-r border-[var(--color-border)] flex flex-col transition-transform duration-300"
    :class="visible ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:hidden'"
  >
    <!-- Logo -->
    <div class="px-5 py-5 flex items-center gap-3">
      <div class="w-10 h-10 rounded-xl bg-[var(--color-primary)] flex items-center justify-center flex-shrink-0">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round">
          <path d="M12 2c-1.5 1.5-3 3-4 6s-1 6 0 9c1.5 4.5 5 5 5 5"/>
          <path d="M12 2c1.5 1.5 3 3 4 6s1 6 0 9c-1.5 4.5-5 5-5 5"/>
          <line x1="3" y1="9" x2="21" y2="9"/>
        </svg>
      </div>
      <div class="min-w-0">
        <h2 class="text-base font-bold text-[var(--color-text-primary)]">AI 营养厨师</h2>
        <p class="text-xs text-[var(--color-text-secondary)] truncate">智能饮食推荐助手</p>
      </div>
    </div>

    <!-- CTA -->
    <div class="px-4 pb-4">
      <button
        class="w-full flex items-center justify-center gap-2 py-2.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white text-sm font-medium rounded-xl transition-colors"
        @click="$emit('newChat')"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        + 新建食谱推荐
      </button>
    </div>

    <!-- Navigation -->
    <nav class="px-3 pb-3">
      <button
        v-for="item in navItems"
        :key="item.label"
        class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors mb-0.5"
        :class="activeNav === item.id
          ? 'bg-[var(--color-sidebar-active)] text-[var(--color-primary)] font-semibold'
          : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-sidebar-hover)] hover:text-[var(--color-text-primary)]'"
        @click="setNav(item.id)"
      >
        <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />
        <span>{{ item.label }}</span>
      </button>
    </nav>

    <!-- Divider -->
    <div class="border-t border-[var(--color-border)] mx-4" />

    <!-- History -->
    <div class="flex-1 overflow-y-auto px-3 py-3">
      <p class="px-3 mb-2 text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider">最近对话</p>
      <button
        v-for="thread in threads"
        :key="thread.thread_id"
        class="w-full text-left px-3 py-2.5 rounded-xl text-sm transition-colors mb-0.5 truncate block"
        :class="thread.thread_id === activeThreadId
          ? 'bg-[var(--color-sidebar-active)] text-[var(--color-primary)] font-medium'
          : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-sidebar-hover)] hover:text-[var(--color-text-primary)]'"
        @click="$emit('switchThread', thread.thread_id)"
      >
        {{ thread.preview || '新对话' }}
      </button>
      <p v-if="threads.length === 0" class="px-3 text-xs text-[var(--color-text-tertiary)]">暂无对话记录</p>
    </div>

    <!-- Bottom -->
    <div class="px-4 py-3 border-t border-[var(--color-border)] flex items-center gap-1">
      <button
        class="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-sidebar-hover)] hover:text-[var(--color-text-primary)] transition-colors flex-1"
        @click="toggleTheme"
      >
        <svg v-if="theme === 'light'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
        深色模式
      </button>
      <button class="flex items-center justify-center w-9 h-9 rounded-xl text-[var(--color-text-secondary)] hover:bg-[var(--color-sidebar-hover)] hover:text-[var(--color-text-primary)] transition-colors" @click="$emit('openSettings')">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { h } from 'vue'
import type { ThreadSummary } from '../types'
import { useTheme } from '../composables/useTheme'
import { useNavigation } from '../composables/useNavigation'
import type { NavItem } from '../composables/useNavigation'

defineProps<{
  visible: boolean
  threads: ThreadSummary[]
  activeThreadId: string
}>()

defineEmits<{
  close: []
  newChat: []
  switchThread: [threadId: string]
  openSettings: []
}>()

const { theme, toggle: toggleTheme } = useTheme()
const { activeNav, setNav } = useNavigation()

const navItems: { label: string; id: NavItem; icon: any }[] = [
  {
    label: 'AI 食谱推荐',
    id: 'recipe',
    icon: {
      render() {
        return h('svg', { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2 }, [
          h('path', { d: 'M12 2L2 7l10 5 10-5-10-5z' }),
          h('path', { d: 'M2 17l10 5 10-5' }),
          h('path', { d: 'M2 12l10 5 10-5' }),
        ])
      },
    },
  },
  {
    label: '我的收藏',
    id: 'favorites',
    icon: {
      render() {
        return h('svg', { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2 }, [
          h('path', { d: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z' }),
        ])
      },
    },
  },
  {
    label: '一周饮食计划',
    id: 'mealplan',
    icon: {
      render() {
        return h('svg', { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2 }, [
          h('rect', { x: '3', y: '4', width: '18', height: '18', rx: '2', ry: '2' }),
          h('line', { x1: '16', y1: '2', x2: '16', y2: '6' }),
          h('line', { x1: '8', y1: '2', x2: '8', y2: '6' }),
          h('line', { x1: '3', y1: '10', x2: '21', y2: '10' }),
        ])
      },
    },
  },
  {
    label: '食材库',
    id: 'ingredients',
    icon: {
      render() {
        return h('svg', { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2 }, [
          h('rect', { x: '2', y: '3', width: '20', height: '18', rx: '2' }),
          h('path', { d: 'M12 8v4' }),
          h('path', { d: 'M10 10h4' }),
        ])
      },
    },
  },
  {
    label: '营养目标',
    id: 'nutrition',
    icon: {
      render() {
        return h('svg', { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2 }, [
          h('circle', { cx: '12', cy: '12', r: '10' }),
          h('circle', { cx: '12', cy: '12', r: '6' }),
          h('circle', { cx: '12', cy: '12', r: '2' }),
        ])
      },
    },
  },
]
</script>
