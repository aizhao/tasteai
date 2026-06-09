<template>
  <div class="flex h-full overflow-hidden bg-[var(--color-bg)]">
    <ChatSidebar
      :visible="sidebarVisible"
      :threads="threads"
      :active-thread-id="threadId"
      @close="sidebarVisible = false"
      @new-chat="handleNewChat"
      @switch-thread="handleSwitchThread"
      @open-settings="settingsVisible = true"
    />
    <main class="flex flex-1 flex-col min-w-0">
      <ChatHeader
        @toggle-sidebar="sidebarVisible = !sidebarVisible"
        @open-nutrition="nutritionVisible = true"
      />
      <ChatMessageList
        :messages="messages"
        :is-streaming="isStreaming"
        :is-loading="isLoadingHistory"
        @stop="cancelStreaming"
        @select-suggestion="handleSend($event, [])"
      />
      <ChatInput :is-streaming="isStreaming" @send="handleSend" />
    </main>

    <!-- Modals -->
    <NutritionProfileModal :visible="nutritionVisible" @close="nutritionVisible = false" />
    <SettingsModal :visible="settingsVisible" @close="settingsVisible = false" />

    <!-- Toast -->
    <Teleport to="body">
      <transition name="toast">
        <div v-if="toast" class="fixed bottom-20 left-1/2 -translate-x-1/2 z-[70] px-5 py-2.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm font-medium rounded-2xl shadow-lg">
          {{ toast }}
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ChatSidebar from './ChatSidebar.vue'
import ChatHeader from './ChatHeader.vue'
import ChatMessageList from './ChatMessageList.vue'
import ChatInput from './ChatInput.vue'
import NutritionProfileModal from './NutritionProfileModal.vue'
import SettingsModal from './SettingsModal.vue'
import { useChat } from '../composables/useChat'
import { useThreadId } from '../composables/useThreadId'

const {
  messages,
  isStreaming,
  isLoadingHistory,
  threads,
  sendMessage,
  cancelStreaming,
  loadThreads,
  switchThread,
} = useChat()
const { threadId } = useThreadId()

const sidebarVisible = ref(true)
const nutritionVisible = ref(false)
const settingsVisible = ref(false)
const toast = ref('')

function showToast(msg: string) {
  toast.value = msg
  setTimeout(() => { toast.value = '' }, 2000)
}

function handleSend(text: string, imageUrls: string[]) {
  sendMessage(text, imageUrls)
}

async function handleSwitchThread(tid: string) {
  await switchThread(tid)
}

async function handleNewChat() {
  const newId = crypto.randomUUID()
  localStorage.setItem('thread_id', newId)
  threadId.value = newId
  messages.value = []
  await loadThreads()
}
</script>

<style>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, 10px);
}
</style>
