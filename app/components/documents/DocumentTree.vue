<script setup lang="ts">
import type { BmadDocument } from '~~/shared/types/bmad'

defineProps<{
  items: BmadDocument[]
  selectedPath?: string
  depth?: number
}>()

defineEmits<{
  select: [path: string]
}>()

const expanded = ref<Set<string>>(new Set())

function toggle(path: string) {
  if (expanded.value.has(path)) {
    expanded.value.delete(path)
  } else {
    expanded.value.add(path)
  }
}

function getIcon(item: BmadDocument): string {
  if (item.type === 'directory') {
    return expanded.value.has(item.path) ? 'i-lucide-folder-open' : 'i-lucide-folder'
  }
  if (item.name.endsWith('.yaml') || item.name.endsWith('.yml')) return 'i-lucide-file-code'
  if (item.name.endsWith('.md')) return 'i-lucide-file-text'
  return 'i-lucide-file'
}
</script>

<template>
  <ul :class="depth ? 'ml-4' : ''">
    <li
      v-for="item in items"
      :key="item.path"
    >
      <button
        class="flex items-center gap-2 w-full px-2 py-1.5 rounded text-sm hover:bg-elevated transition-colors text-left"
        :class="selectedPath === item.path ? 'bg-primary/10 text-primary font-medium' : 'text-muted'"
        @click="item.type === 'directory' ? toggle(item.path) : $emit('select', item.path)"
      >
        <UIcon
          :name="getIcon(item)"
          class="shrink-0"
        />
        <span class="truncate">{{ item.name }}</span>
        <span
          v-if="item.source === 'wds' && !depth"
          class="shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-purple-500/15 text-purple-500"
        >WDS</span>
        <UIcon
          v-if="item.type === 'directory'"
          :name="expanded.has(item.path) ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right'"
          class="ml-auto shrink-0 size-3.5"
        />
      </button>

      <DocumentTree
        v-if="item.type === 'directory' && item.children && expanded.has(item.path)"
        :items="item.children"
        :selected-path="selectedPath"
        :depth="(depth || 0) + 1"
        @select="$emit('select', $event)"
      />
    </li>
  </ul>
</template>
