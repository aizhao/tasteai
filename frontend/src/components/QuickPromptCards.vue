<template>
  <div
    class="flex gap-3 overflow-x-auto px-5 py-4 flex-shrink-0 scrollbar-none"
  >
    <button
      v-for="card in cards"
      :key="card.title"
      class="flex-shrink-0 w-44 sm:w-48 p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-card)] text-left hover:border-[var(--color-primary)] hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
      @click="$emit('select', card.prompt)"
    >
      <div class="w-9 h-9 rounded-xl bg-[var(--color-primary-light)] flex items-center justify-center mb-3 group-hover:bg-[var(--color-primary-soft)] transition-colors">
        <component :is="card.icon" class="w-5 h-5 text-[var(--color-primary)]" />
      </div>
      <h4 class="text-sm font-semibold text-[var(--color-text-primary)] mb-1">{{ card.title }}</h4>
      <p class="text-xs text-[var(--color-text-secondary)] leading-relaxed">{{ card.desc }}</p>
    </button>
  </div>
</template>

<script setup lang="ts">
import { h } from 'vue'

defineEmits<{ select: [text: string] }>()

const cards = [
  {
    title: '高蛋白低脂早餐',
    desc: '快速补充蛋白质，开启活力一天',
    prompt: '推荐一份高蛋白低脂的早餐',
    icon: {
      render() {
        return h('svg', { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2 }, [
          h('path', { d: 'M18 8h1a4 4 0 0 1 0 8h-1' }),
          h('path', { d: 'M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z' }),
          h('line', { x1: '6', y1: '1', x2: '6', y2: '4' }),
          h('line', { x1: '10', y1: '1', x2: '10', y2: '4' }),
          h('line', { x1: '14', y1: '1', x2: '14', y2: '4' }),
        ])
      },
    },
  },
  {
    title: '减脂午餐',
    desc: '低卡高饱腹，均衡营养搭配',
    prompt: '推荐一份减脂午餐',
    icon: {
      render() {
        return h('svg', { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2 }, [
          h('path', { d: 'M12 20V10' }),
          h('path', { d: 'M18 20V4' }),
          h('path', { d: 'M6 20v-4' }),
        ])
      },
    },
  },
  {
    title: '10分钟快手晚餐',
    desc: '简单快速，下班也能轻松做',
    prompt: '推荐一份10分钟就能做好的晚餐',
    icon: {
      render() {
        return h('svg', { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2 }, [
          h('circle', { cx: '12', cy: '12', r: '10' }),
          h('polyline', { points: '12 6 12 12 16 14' }),
        ])
      },
    },
  },
  {
    title: '冰箱食材推荐',
    desc: '根据你手头的食材智能搭配',
    prompt: '冰箱里有鸡蛋、番茄和洋葱，怎么做？',
    icon: {
      render() {
        return h('svg', { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2 }, [
          h('path', { d: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20' }),
          h('path', { d: 'M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z' }),
        ])
      },
    },
  },
  {
    title: '一周饮食计划',
    desc: '科学的周计划，营养不重复',
    prompt: '帮我设计一份一周减脂食谱',
    icon: {
      render() {
        return h('svg', { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2 }, [
          h('rect', { x: '3', y: '4', width: '18', height: '18', rx: '2', ry: '2' }),
          h('line', { x1: '16', y1: '2', x2: '16', y2: '6' }),
          h('line', { x1: '8', y1: '2', x2: '8', y2: '6' }),
          h('line', { x1: '3', y1: '10', x2: '21', y2: '10' }),
        ])
      },
    },
  },
]
</script>
