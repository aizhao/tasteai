<template>
  <div class="flex-1 overflow-y-auto" ref="listRef">
    <!-- Empty state -->
    <div v-if="messages.length === 0 && !isLoading" class="flex flex-col items-center justify-center min-h-full px-5 py-12 text-center">
      <div class="w-16 h-16 rounded-2xl bg-[var(--color-primary)] flex items-center justify-center mb-6 shadow-lg shadow-green-200">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round">
          <path d="M12 2c-1.5 1.5-3 3-4 6s-1 6 0 9c1.5 4.5 5 5 5 5"/>
          <path d="M12 2c1.5 1.5 3 3 4 6s1 6 0 9c-1.5 4.5-5 5-5 5"/>
          <line x1="3" y1="9" x2="21" y2="9"/>
        </svg>
      </div>
      <h1 class="text-2xl font-bold text-[var(--color-text-primary)] mb-2">你好，我是你的营养厨师</h1>
      <p class="text-[var(--color-text-secondary)] max-w-md leading-relaxed mb-10">
        告诉我你有什么食材，或者上传食材照片，我为你推荐健康美味的菜谱
      </p>
      <QuickPromptCards @select="(text) => $emit('select-suggestion', text)" />
    </div>

    <!-- Messages -->
    <div v-else>
      <ChatMessageComponent v-for="msg in messages" :key="msg.id" :msg="msg" />
    </div>

    <!-- Stop button -->
    <div v-if="isStreaming" class="flex justify-center py-3">
      <button
        class="inline-flex items-center gap-1.5 px-5 py-2 border border-[var(--color-border)] rounded-full text-sm text-[var(--color-text-secondary)] bg-[var(--color-surface)] hover:text-[var(--color-text-primary)] transition-colors"
        @click="$emit('stop')"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="1"/></svg>
        停止生成
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import type { ChatMessage as ChatMessageType } from '../types'
import ChatMessageComponent from './ChatMessage.vue'
import QuickPromptCards from './QuickPromptCards.vue'

const props = defineProps<{
  messages: ChatMessageType[]
  isStreaming: boolean
  isLoading: boolean
}>()

defineEmits<{ stop: []; 'select-suggestion': [text: string] }>()

const listRef = ref<HTMLElement | null>(null)

watch(
  () => props.messages,
  () => {
    nextTick(() => {
      const el = listRef.value
      if (!el) return
      const { scrollTop, scrollHeight, clientHeight } = el
      if (scrollHeight - scrollTop - clientHeight < 120) {
        el.scrollTop = scrollHeight
      }
    })
  },
  { deep: true, immediate: true }
)
</script>
