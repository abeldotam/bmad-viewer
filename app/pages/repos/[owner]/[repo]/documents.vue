<script setup lang="ts">
import type { BmadDocument } from '~~/shared/types/bmad'

const route = useRoute()
const router = useRouter()
const owner = computed(() => route.params.owner as string)
const repo = computed(() => route.params.repo as string)
const repoId = inject<Ref<string | null>>('repoId')!

const { fetchDocumentTree, fetchFileContent } = useGitHub()
const { handleError } = useErrorHandler()

const documents = ref<BmadDocument[]>([])
const loading = ref(true)
const selectedPath = computed(() => (route.query.path as string) || '')
const content = ref('')
const contentLoading = ref(false)

onMounted(async () => {
  try {
    documents.value = await fetchDocumentTree(repoId.value!)
  } catch (e) {
    handleError(e, 'Failed to load document tree')
  } finally {
    loading.value = false
  }
})

watch(selectedPath, async (path) => {
  if (!path) {
    content.value = ''
    return
  }
  contentLoading.value = true
  try {
    content.value = await fetchFileContent(repoId.value!, path)
  } catch (e) {
    handleError(e, 'Failed to load document')
    content.value = ''
  } finally {
    contentLoading.value = false
  }
}, { immediate: true })

function selectDocument(path: string) {
  router.push({ query: { path } })
}
</script>

<template>
  <div>
    <h2 class="text-xl font-bold mb-1">
      Documents
    </h2>
    <p class="text-muted text-sm mb-6">
      Browse project documentation
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
          v-if="contentLoading"
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
