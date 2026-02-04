<script setup lang="ts">
import type { Epic, Story } from '~~/shared/types/bmad'

const repoId = inject<Ref<string | null>>('repoId')!
const { fetchSprintStatus, fetchDocumentTree, fetchStories } = useGitHub()
const { handleError } = useErrorHandler()

const stories = ref<Story[]>([])
const epics = ref<Epic[]>([])
const loading = ref(true)

const selectedEpic = ref<string>()
const search = ref('')
const statusFilter = ref('')
const priorityFilter = ref('')

onMounted(async () => {
  try {
    const [sprintData, tree] = await Promise.all([
      fetchSprintStatus(repoId.value!),
      fetchDocumentTree(repoId.value!)
    ])

    stories.value = sprintData.sprints.flatMap(s => s.stories)

    const storyFiles = tree
      .flatMap(function flatten(d): string[] {
        if (d.type === 'file' && d.path.includes('/story-')) return [d.path]
        return (d.children ?? []).flatMap(flatten)
      })

    if (storyFiles.length > 0) {
      const parsed = await fetchStories(repoId.value!, storyFiles)
      const sprintIds = new Set(stories.value.map(s => s.id))
      for (const story of parsed) {
        if (!sprintIds.has(story.id)) {
          stories.value.push(story)
        }
      }
    }

    const epicMap = new Map<string, Epic>()
    for (const story of stories.value) {
      if (!epicMap.has(story.epic)) {
        epicMap.set(story.epic, {
          id: story.epic,
          title: story.epic,
          description: '',
          stories: [],
          filePath: ''
        })
      }
      epicMap.get(story.epic)!.stories.push(story)
    }
    epics.value = Array.from(epicMap.values())
  } catch (e) {
    handleError(e, 'Failed to load epics data')
  } finally {
    loading.value = false
  }
})

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
