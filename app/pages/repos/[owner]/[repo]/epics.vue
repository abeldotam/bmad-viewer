<script setup lang="ts">
const { stories, epics } = useMockData()

const selectedEpic = ref<string>()
const search = ref('')
const statusFilter = ref('')
const priorityFilter = ref('')

const filteredStories = computed(() => {
  return stories.filter((story) => {
    if (selectedEpic.value && story.epic !== selectedEpic.value) return false
    if (statusFilter.value && story.status !== statusFilter.value) return false
    if (priorityFilter.value && story.priority !== priorityFilter.value) return false
    if (search.value && !story.title.toLowerCase().includes(search.value.toLowerCase())) return false
    return true
  })
})

const viewTabs = [
  { label: 'Table', icon: 'i-lucide-table', value: 'table', slot: 'table' as const },
  { label: 'Kanban', icon: 'i-lucide-kanban', value: 'kanban', slot: 'kanban' as const }
]
</script>

<template>
  <div>
    <UPageHeader
      title="Epics & Stories"
      description="Track progress across epics"
    />

    <div class="mt-6 space-y-6">
      <EpicProgressCards
        :epics="epics"
        :selected-epic="selectedEpic"
        @select="selectedEpic = $event"
      />

      <StoryFilters
        v-model:search="search"
        v-model:status-filter="statusFilter"
        v-model:priority-filter="priorityFilter"
        :epics="epics"
      />

      <UTabs
        :items="viewTabs"
        default-value="table"
      >
        <template #table>
          <StoriesTable :stories="filteredStories" />
        </template>

        <template #kanban>
          <KanbanBoard :stories="filteredStories" />
        </template>
      </UTabs>
    </div>
  </div>
</template>
