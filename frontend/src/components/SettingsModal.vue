<template>
  <Teleport to="body">
    <div v-if="visible" class="fixed inset-0 z-[60] flex items-center justify-center p-4" @click.self="$emit('close')">
      <div class="absolute inset-0 bg-black/30" />
      <div class="relative w-full max-w-sm bg-[var(--color-surface)] rounded-2xl shadow-xl border border-[var(--color-border)] p-6">
        <!-- Header -->
        <div class="flex items-center justify-between mb-5">
          <h2 class="text-lg font-bold text-[var(--color-text-primary)]">设置</h2>
          <button class="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--color-text-secondary)] hover:bg-[var(--color-sidebar-hover)] transition-colors" @click="$emit('close')">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <!-- Theme -->
        <div class="flex items-center justify-between py-3">
          <span class="text-sm text-[var(--color-text-primary)]">深色模式</span>
          <button
            class="relative w-11 h-6 rounded-full transition-colors"
            :class="theme === 'dark' ? 'bg-[var(--color-primary)]' : 'bg-gray-300'"
            @click="toggleTheme"
          >
            <span class="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform" :class="theme === 'dark' ? 'translate-x-5' : 'translate-x-0'" />
          </button>
        </div>

        <!-- Clear history -->
        <button class="w-full flex items-center justify-between py-3 text-sm text-[var(--color-text-primary)] hover:text-[var(--color-error)] transition-colors" @click="handleClearHistory">
          <span>清空当前会话</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        </button>

        <!-- Divider -->
        <div class="border-t border-[var(--color-border)] my-2" />

        <!-- Toast message -->
        <div v-if="toast" class="mt-3 px-3 py-2 rounded-xl text-xs text-center" :class="toastType === 'success' ? 'bg-[var(--color-primary-light)] text-[var(--color-primary-dark)]' : 'bg-red-50 text-red-700'">
          {{ toast }}
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTheme } from '../composables/useTheme'
import { useChat } from '../composables/useChat'

defineProps<{ visible: boolean }>()
defineEmits<{ close: [] }>()

const { theme, toggle: toggleTheme } = useTheme()
const { clearHistory, loadThreads } = useChat()

const toast = ref('')
const toastType = ref<'success' | 'error'>('success')

async function handleClearHistory() {
  try {
    await clearHistory()
    await loadThreads()
    toast.value = '当前会话已清空'
    toastType.value = 'success'
  } catch {
    toast.value = '清空失败，请重试'
    toastType.value = 'error'
  }
  setTimeout(() => { toast.value = '' }, 2000)
}
</script>
