<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const { documents, getDocumentContent } = useMockData()

const selectedPath = computed(() => (route.query.path as string) || '')

const content = computed(() => {
  if (!selectedPath.value) return ''
  return getDocumentContent(selectedPath.value)
})

function selectDocument(path: string) {
  router.push({ query: { path } })
}

const owner = computed(() => route.params.owner as string)
const repo = computed(() => route.params.repo as string)
</script>

<template>
  <div>
    <UPageHeader
      title="Documents"
      description="Browse project documentation"
    />

    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
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
        <template v-if="selectedPath">
          <DocumentBreadcrumb
            :path="selectedPath"
            class="mb-4"
          />
          <DocumentViewer
            :content="content"
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
