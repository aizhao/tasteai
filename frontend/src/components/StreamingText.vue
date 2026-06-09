<template>
  <div class="prose prose-sm max-w-none text-[var(--color-text-primary)] leading-relaxed break-words" v-html="sanitizedHtml" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

const props = defineProps<{ text: string }>()

const sanitizedHtml = computed(() => {
  const raw = marked.parse(props.text ?? '') as string
  const clean = DOMPurify.sanitize(raw, {
    ADD_ATTR: ['referrerpolicy', 'crossorigin', 'loading'],
  })
  return clean.replace(
    /<img /g,
    '<img referrerpolicy="no-referrer" loading="lazy" '
  )
})
</script>
