<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const owner = computed(() => route.params.owner as string)
const repo = computed(() => route.params.repo as string)
const { documents, sprints, stories, epics, loading, fetchFileContent } = useRepoData()
const { handleError } = useErrorHandler()

// --- Tab state ---
const activeTab = ref('roadmap')
const tabs = [
  { label: 'Roadmap', value: 'roadmap', icon: 'i-lucide-milestone' },
  { label: 'Epics & Stories', value: 'epics', icon: 'i-lucide-kanban' },
  { label: 'Documents', value: 'documents', icon: 'i-lucide-file-text' }
]

// --- Documents state ---
const selectedPath = computed(() => (route.query.path as string) || '')
const docContent = ref('')
const docContentLoading = ref(false)

watch(selectedPath, async (path) => {
  if (!path) {
    docContent.value = ''
    return
  }
  docContentLoading.value = true
  try {
    docContent.value = await fetchFileContent(path)
  } catch (e) {
    handleError(e, 'Failed to load document')
    docContent.value = ''
  } finally {
    docContentLoading.value = false
  }
}, { immediate: true })

function selectDocument(path: string) {
  activeTab.value = 'documents'
  router.push({ query: { path } })
}

// --- Epics state ---
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
    <div
      v-if="loading"
      class="text-center py-20"
    >
      <UIcon
        name="i-lucide-loader-2"
        class="text-primary text-4xl animate-spin"
      />
    </div>

    <template v-else>
      <!-- Tab bar -->
      <div class="flex gap-1 border-b border-default mb-6">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          class="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors"
          :class="activeTab === tab.value ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-foreground'"
          @click="activeTab = tab.value"
        >
          <UIcon
            :name="tab.icon"
            class="size-4"
          />
          {{ tab.label }}
        </button>
      </div>

      <!-- Roadmap tab -->
      <div v-show="activeTab === 'roadmap'">
        <div
          v-if="sprints.length === 0"
          class="text-center py-20"
        >
          <UIcon
            name="i-lucide-calendar-off"
            class="text-muted text-4xl mb-4"
          />
          <p class="text-muted text-sm">
            No <code>sprint-status.yaml</code> found in <code>_bmad-output/</code>.
          </p>
        </div>

        <div
          v-else
          class="space-y-8"
        >
          <GlobalStats
            :stories="stories"
            :sprints="sprints"
          />
          <div>
            <h3 class="text-lg font-semibold mb-4">
              Epic Timeline
            </h3>
            <SprintTimeline :sprints="sprints" />
          </div>
        </div>
      </div>

      <!-- Epics & Stories tab -->
      <div v-show="activeTab === 'epics'">
        <div
          v-if="stories.length === 0"
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

      <!-- Documents tab -->
      <div v-show="activeTab === 'documents'">
        <div
          v-if="documents.length === 0"
          class="text-center py-20"
        >
          <UIcon
            name="i-lucide-file-text"
            class="text-muted text-4xl mb-4"
          />
          <p class="text-muted text-sm">
            No documents found in <code>_bmad-output/</code>.
          </p>
        </div>

        <div
          v-else
          class="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <div class="md:col-span-1">
            <UCard>
              <DocumentTree
                :items="documents"
                :selected-path="selectedPath"
                @select="selectDocument"
              />
            </UCard>
          </div>

          <div class="md:col-span-3">
            <div
              v-if="docContentLoading"
              class="text-center py-20"
            >
              <UIcon
                name="i-lucide-loader-2"
                class="text-primary text-4xl animate-spin"
              />
            </div>
            <template v-else-if="selectedPath">
              <DocumentBreadcrumb
                :path="selectedPath"
                class="mb-4"
              />
              <DocumentViewer
                :content="docContent"
                :path="selectedPath"
                :repo-owner="owner"
                :repo-name="repo"
              />
            </template>

            <div
              v-else
              class="text-center py-20"
            >
              <UIcon
                name="i-lucide-file-text"
                class="text-muted text-5xl mb-4"
              />
              <p class="text-muted">
                Select a document from the sidebar to view its content.
              </p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
