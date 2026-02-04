<script setup lang="ts">
const { stories, epics, loading } = useRepoData()

const selectedEpic = ref<string>()
const search = ref('')
const statusFilter = ref('')
const priorityFilter = ref('')

const filteredStories = computed(() => {
  return stories.value.filter((story) => {
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
    <h2 class="text-xl font-bold mb-1">
      Epics & Stories
    </h2>
    <p class="text-muted text-sm mb-6">
      Track progress across epics
    </p>

    <div
      v-if="loading"
      class="text-center py-20"
    >
      <UIcon
        name="i-lucide-loader-2"
        class="text-primary text-4xl animate-spin"
      />
    </div>

    <div
      v-else-if="stories.length === 0"
      class="text-center py-20"
    >
      <UIcon
        name="i-lucide-file-search"
        class="text-muted text-4xl mb-4"
      />
      <p class="text-muted text-sm">
        No stories found in <code>sprint-status.yaml</code>.
      </p>
    </div>

    <div
      v-else
      class="space-y-6"
    >
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
