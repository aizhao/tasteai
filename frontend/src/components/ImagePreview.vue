<template>
  <div class="flex gap-2 flex-wrap pb-2">
    <div
      v-for="img in images"
      :key="img.id"
      class="relative w-16 h-16 rounded-lg overflow-hidden border border-[var(--color-border)] flex-shrink-0"
    >
      <img :src="img.previewUrl || img.accessUrl || ''" alt="" class="w-full h-full object-cover" />
      <div v-if="img.uploading" class="absolute inset-0 bg-black/30 flex items-center justify-center">
        <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
      </div>
      <button
        v-if="removable && !img.uploading"
        class="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-black/40 text-white text-xs leading-none flex items-center justify-center hover:bg-black/60 transition-colors"
        @click="$emit('remove', img.id)"
      >
        &times;
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PendingImage } from '../types'

defineProps<{
  images: PendingImage[]
  removable?: boolean
}>()

defineEmits<{ remove: [id: string] }>()
</script>
