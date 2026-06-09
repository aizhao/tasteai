import type {
  ChatRequestBody,
  HistoryResponse,
  UploadResponse,
  ThreadListResponse,
} from '../types'

const BASE = '/api'

export const api = {
  streamChat(body: ChatRequestBody, signal?: AbortSignal) {
    return fetch(`${BASE}/chat/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal,
    })
  },

  async getHistory(threadId: string): Promise<HistoryResponse> {
    const res = await fetch(`${BASE}/chat/history/${threadId}`)
    if (!res.ok) throw new Error(`加载历史失败: ${res.status}`)
    return res.json()
  },

  async clearHistory(threadId: string): Promise<void> {
    await fetch(`${BASE}/chat/history/${threadId}`, { method: 'DELETE' })
  },

  async uploadFile(file: File): Promise<UploadResponse> {
    const form = new FormData()
    form.append('file', file)
    const res = await fetch(`${BASE}/file/upload`, {
      method: 'POST',
      body: form,
    })
    if (!res.ok) {
      const err = await res.text()
      throw new Error(`上传失败: ${err || res.status}`)
    }
    return res.json()
  },

  async getThreads(): Promise<ThreadListResponse> {
    const res = await fetch(`${BASE}/chat/threads`)
    if (!res.ok) throw new Error(`加载会话列表失败: ${res.status}`)
    return res.json()
  },
}
