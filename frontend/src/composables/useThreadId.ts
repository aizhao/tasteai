import { ref } from 'vue'

const STORAGE_KEY = 'thread_id'

function generateId(): string {
  return crypto.randomUUID()
}

const threadId = ref<string>(getOrCreate())

function getOrCreate(): string {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) return stored
  const id = generateId()
  localStorage.setItem(STORAGE_KEY, id)
  return id
}

export function useThreadId() {
  function newThread() {
    const id = generateId()
    localStorage.setItem(STORAGE_KEY, id)
    threadId.value = id
  }

  return { threadId, newThread }
}
