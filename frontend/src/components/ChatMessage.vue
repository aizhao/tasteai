<template>
  <div class="flex px-5 py-3" :class="msg.role === 'user' ? 'justify-end' : 'justify-start'">
    <!-- User bubble -->
    <div v-if="msg.role === 'user'" class="max-w-[82%]">
      <div v-if="msg.imageUrls.length" class="flex gap-1.5 flex-wrap mb-2 justify-end">
        <img v-for="url in msg.imageUrls" :key="url" :src="url" class="w-24 h-24 object-cover rounded-xl" alt="" />
      </div>
      <div v-if="msg.content" class="px-4 py-2.5 bg-[var(--color-primary)] text-white rounded-[18px_18px_6px_18px] text-sm leading-relaxed whitespace-pre-wrap shadow-sm">
        {{ msg.content }}
      </div>
    </div>

    <!-- AI bubble -->
    <div v-else class="max-w-[85%] w-full">
      <!-- When streaming (no content yet), show a status line -->
      <div v-if="msg.isStreaming && !msg.content" class="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] py-1">
        <span class="inline-flex gap-1">
          <span class="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-bounce" style="animation-delay: 0ms"></span>
          <span class="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-bounce" style="animation-delay: 150ms"></span>
          <span class="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-bounce" style="animation-delay: 300ms"></span>
        </span>
        正在为你筛选方案...
      </div>
      <!-- Markdown content -->
      <StreamingText v-if="msg.content" :text="msg.content" />
      <!-- Cursor when streaming -->
      <span v-if="msg.isStreaming && msg.content" class="inline-block w-0.5 h-4 bg-[var(--color-primary)] align-text-bottom animate-pulse ml-0.5" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ChatMessage } from '../types'
import StreamingText from './StreamingText.vue'

defineProps<{ msg: ChatMessage }>()
</script>
