<script setup lang="ts">
import type { Story } from '~~/shared/types/bmad'
import type { TableColumn } from '@nuxt/ui'

defineProps<{
  stories: Story[]
}>()

const route = useRoute()
const owner = computed(() => route.params.owner as string)
const repo = computed(() => route.params.repo as string)

const columns: TableColumn<Story>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'title', header: 'Title' },
  { accessorKey: 'epic', header: 'Epic' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'priority', header: 'Priority' },
  { accessorKey: 'estimate', header: 'Estimate' }
]
</script>

<template>
  <UTable
    :columns="columns"
    :data="stories"
  >
    <template #id-cell="{ row }">
      <NuxtLink
        :to="`/repos/${owner}/${repo}/story/${row.original.id}`"
        class="font-mono text-primary hover:underline"
      >
        {{ row.original.id }}
      </NuxtLink>
    </template>

    <template #title-cell="{ row }">
      <NuxtLink
        :to="`/repos/${owner}/${repo}/story/${row.original.id}`"
        class="hover:underline"
      >
        {{ row.original.title }}
      </NuxtLink>
    </template>

    <template #status-cell="{ row }">
      <StatusBadge :status="row.original.status" />
    </template>

    <template #priority-cell="{ row }">
      <PriorityBadge :priority="row.original.priority" />
    </template>

    <template #estimate-cell="{ row }">
      <span class="text-muted">{{ row.original.estimate }}pt</span>
    </template>
  </UTable>
</template>
