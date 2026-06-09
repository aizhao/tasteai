<template>
  <ChatLayout />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import ChatLayout from './components/ChatLayout.vue'
import { useChat } from './composables/useChat'
import { useTheme } from './composables/useTheme'

const { loadHistory, loadThreads } = useChat()

// Init dark mode on mount
const { theme } = useTheme()
if (theme.value === 'dark') {
  document.documentElement.classList.add('dark')
}

onMounted(() => {
  loadHistory()
  loadThreads()
})
</script>
