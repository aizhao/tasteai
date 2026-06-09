export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  imageUrls: string[]
  isStreaming: boolean
}

export interface HistoryMessage {
  role: 'user' | 'assistant'
  message: string
  image_url?: string[]
}

export interface HistoryResponse {
  messages: HistoryMessage[]
}

export interface ChatRequestBody {
  message: string
  image_url: string[]
  thread_id: string
}

export interface UploadResponse {
  accessUrl: string
  filename: string
}

export interface ThreadSummary {
  thread_id: string
  message_count: number
  preview: string
}

export interface ThreadListResponse {
  threads: ThreadSummary[]
}

export interface PendingImage {
  id: string
  file: File
  previewUrl: string
  uploading: boolean
  uploaded: boolean
  accessUrl: string | null
}

export interface NutritionStat {
  label: string
  value: number
  unit: string
  highlight?: boolean
  icon: string
}

export interface RecipeIngredient {
  name: string
  amount: string
}

export interface RecipeTag {
  label: string
  type: 'green' | 'orange' | 'blue' | 'default'
  icon?: string
}

export interface RecipeData {
  name: string
  score: number
  matchGoal: string
  tags: RecipeTag[]
  nutrition: NutritionStat[]
  reason: string
  ingredients: RecipeIngredient[]
  steps: string[]
}
