import { ref, computed } from 'vue'
import { api } from '../api/client'
import type { PendingImage } from '../types'

const pendingImages = ref<PendingImage[]>([])

const isUploading = computed(() =>
  pendingImages.value.some((img) => img.uploading)
)

const allReady = computed(() =>
  pendingImages.value.length > 0 && pendingImages.value.every((img) => img.uploaded)
)

export function useImageUpload() {
  function addImages(files: FileList | File[]) {
    for (const file of files) {
      if (!file.type.startsWith('image/')) continue
      pendingImages.value = [
        ...pendingImages.value,
        {
          id: crypto.randomUUID(),
          file,
          previewUrl: URL.createObjectURL(file),
          uploading: false,
          uploaded: false,
          accessUrl: null,
        },
      ]
    }
  }

  function removeImage(id: string) {
    const img = pendingImages.value.find((i) => i.id === id)
    if (img) URL.revokeObjectURL(img.previewUrl)
    pendingImages.value = pendingImages.value.filter((i) => i.id !== id)
  }

  async function uploadAll(): Promise<string[]> {
    const results: string[] = []
    for (const img of pendingImages.value) {
      if (img.uploaded) {
        results.push(img.accessUrl!)
        continue
      }
      img.uploading = true
      try {
        const res = await api.uploadFile(img.file)
        img.accessUrl = res.accessUrl
        img.uploaded = true
        results.push(res.accessUrl)
      } finally {
        img.uploading = false
      }
    }
    return results
  }

  function clearPending() {
    for (const img of pendingImages.value) {
      URL.revokeObjectURL(img.previewUrl)
    }
    pendingImages.value = []
  }

  return {
    pendingImages,
    isUploading,
    allReady,
    addImages,
    removeImage,
    uploadAll,
    clearPending,
  }
}
