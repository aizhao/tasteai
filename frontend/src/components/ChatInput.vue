<template>
  <div class="flex-shrink-0 px-5 pb-5">
    <!-- Dietary restriction tags -->
    <div class="flex flex-wrap gap-2 mb-2 justify-center">
      <button
        v-for="tag in dietTags"
        :key="tag"
        class="px-3 py-1 text-xs rounded-full border transition-colors"
        :class="activeTags.includes(tag)
          ? 'bg-[var(--color-primary-light)] border-[var(--color-primary)] text-[var(--color-primary-dark)]'
          : 'bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]'"
        @click="toggleTag(tag)"
      >
        {{ tag }}
      </button>
    </div>

    <!-- Input wrapper -->
    <div class="max-w-3xl mx-auto bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-input)] p-3 shadow-sm transition-shadow focus-within:shadow-md focus-within:border-[var(--color-primary)]">
      <!-- Image preview -->
      <ImagePreview
        v-if="pendingImages.length"
        :images="pendingImages"
        removable
        @remove="removeImage"
      />
      <div v-if="uploadError" class="text-[var(--color-error)] text-xs px-1 pb-2">{{ uploadError }}</div>

      <!-- Input row -->
      <div class="flex items-end gap-2.5">
        <label class="flex items-center justify-center p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-light)] rounded-full cursor-pointer transition-colors flex-shrink-0" title="上传食材图">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
          <input type="file" accept="image/*" multiple hidden @change="onFileChange" />
        </label>
        <textarea
          ref="textRef"
          v-model="text"
          class="flex-1 resize-none py-1.5 leading-relaxed max-h-40 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] disabled:opacity-40"
          :placeholder="activeTags.length > 0 ? '输入补充说明...' : '输入你的目标、食材或饮食限制，例如：高蛋白低脂早餐 / 不吃坚果 / 冰箱里有鸡蛋和牛奶'"
          :rows="1"
          :disabled="isStreaming"
          @input="autoResize"
          @keydown.enter.exact.prevent="handleSend"
        />
        <button
          class="flex items-center justify-center w-9 h-9 rounded-full transition-all flex-shrink-0"
          :class="canSend ? 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] hover:scale-105' : 'bg-gray-300 text-gray-400 cursor-not-allowed'"
          :disabled="!canSend"
          @click="handleSend"
          title="发送"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Hint -->
    <p class="text-center text-xs text-[var(--color-text-tertiary)] mt-3">AI 营养厨师可能产生不准确信息，请注意甄别</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import ImagePreview from './ImagePreview.vue'
import { useImageUpload } from '../composables/useImageUpload'

const props = defineProps<{ isStreaming: boolean }>()
const emit = defineEmits<{ send: [text: string, imageUrls: string[]] }>()

const { pendingImages, isUploading, addImages, removeImage, uploadAll, clearPending } = useImageUpload()

const text = ref('')
const textRef = ref<HTMLTextAreaElement | null>(null)
const uploadError = ref('')
const activeTags = ref<string[]>([])

const dietTags = ['不吃坚果', '少油', '高蛋白', '低碳水', '低脂', '无糖']

const canSend = computed(
  () => !props.isStreaming && !isUploading.value && (text.value.trim() || pendingImages.value.length > 0)
)

function toggleTag(tag: string) {
  const idx = activeTags.value.indexOf(tag)
  if (idx >= 0) {
    activeTags.value.splice(idx, 1)
  } else {
    activeTags.value.push(tag)
  }
}

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  if (input.files) addImages(input.files)
  uploadError.value = ''
  input.value = ''
}

async function handleSend() {
  if (!canSend.value) return
  uploadError.value = ''

  let imageUrls: string[] = []
  if (pendingImages.value.length > 0) {
    try {
      imageUrls = await uploadAll()
    } catch (err) {
      uploadError.value = (err as Error).message || '图片上传失败'
      return
    }
  }

  // Combine dietary tags with text
  let finalText = text.value.trim()
  if (activeTags.value.length > 0) {
    const tagStr = activeTags.value.join('、')
    finalText = finalText ? `${finalText}（${tagStr}）` : tagStr
  }

  emit('send', finalText, imageUrls)
  text.value = ''
  activeTags.value = []
  clearPending()
  nextTick(() => autoResize())
}

function autoResize() {
  const el = textRef.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = Math.min(el.scrollHeight, 160) + 'px'
}
</script>
