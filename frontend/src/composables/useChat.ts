import { ref } from 'vue'
import { api } from '../api/client'
import type { ChatMessage, ChatRequestBody, ThreadSummary } from '../types'
import { useThreadId } from './useThreadId'

const messages = ref<ChatMessage[]>([])
const isStreaming = ref(false)
const isLoadingHistory = ref(false)
const error = ref<string | null>(null)
const threads = ref<ThreadSummary[]>([])
let abortController: AbortController | null = null

export function useChat() {
  const { threadId } = useThreadId()

  async function loadHistory() {
    isLoadingHistory.value = true
    try {
      const res = await api.getHistory(threadId.value)
      messages.value = res.messages.map((m) => ({
        id: crypto.randomUUID(),
        role: m.role,
        content: m.message,
        imageUrls: m.image_url ?? [],
        isStreaming: false,
      }))
    } catch {
      messages.value = []
    } finally {
      isLoadingHistory.value = false
    }
  }

  async function loadThreads() {
    try {
      const res = await api.getThreads()
      threads.value = res.threads
    } catch {
      threads.value = []
    }
  }

  async function switchThread(tid: string) {
    threadId.value = tid
    localStorage.setItem('thread_id', tid)
    await loadHistory()
    await loadThreads()
  }

  async function sendMessage(text: string, imageUrls: string[]) {
    error.value = null

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      imageUrls,
      isStreaming: false,
    }
    const aiMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: '',
      imageUrls: [],
      isStreaming: true,
    }

    messages.value = [...messages.value, userMsg, aiMsg]
    const aiIdx = messages.value.length - 1
    isStreaming.value = true

    abortController = new AbortController()

    const body: ChatRequestBody = {
      message: text,
      image_url: imageUrls,
      thread_id: threadId.value,
    }

    try {
      const response = await api.streamChat(body, abortController.signal)

      if (!response.ok) {
        const errText = await response.text()
        throw new Error(errText || `请求失败: ${response.status}`)
      }

      const reader = response.body!.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let rafId: number | null = null

      function flush() {
        messages.value[aiIdx].content += buffer
        buffer = ''
        rafId = null
      }

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        if (rafId === null) {
          rafId = requestAnimationFrame(flush)
        }
      }
      if (buffer) {
        messages.value[aiIdx].content += buffer
      }
    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        messages.value[aiIdx].content += ' [已取消]'
      } else {
        messages.value[aiIdx].content += `\n\n[错误: ${(err as Error).message}]`
        error.value = (err as Error).message
      }
    } finally {
      messages.value[aiIdx].isStreaming = false
      isStreaming.value = false
      abortController = null
      // refresh thread list after new message
      loadThreads()
    }
  }

  async function clearHistory() {
    try {
      await api.clearHistory(threadId.value)
    } catch {
      // ignore
    }
    messages.value = []
    loadThreads()
  }

  function cancelStreaming() {
    abortController?.abort()
  }

  return {
    messages,
    isStreaming,
    isLoadingHistory,
    error,
    threads,
    loadHistory,
    loadThreads,
    switchThread,
    sendMessage,
    clearHistory,
    cancelStreaming,
  }
}
