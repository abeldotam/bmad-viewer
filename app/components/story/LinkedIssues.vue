<script setup lang="ts">
import type { GitHubIssue } from '~~/shared/types/bmad'

const props = defineProps<{
  owner: string
  repo: string
  storyId: string
}>()

const { fetchLinkedIssues } = useGitHubIssues()
const issues = ref<GitHubIssue[]>([])

onMounted(async () => {
  try {
    issues.value = await fetchLinkedIssues(props.owner, props.repo, props.storyId)
  } catch {
    // Silently fail — issues are supplementary
  }
})
</script>

<template>
  <UCard>
    <h3 class="font-semibold text-sm mb-3">
      Linked Issues
    </h3>
    <div
      v-if="issues.length === 0"
      class="text-sm text-muted"
    >
      No issues linked yet.
    </div>
    <ul
      v-else
      class="space-y-2"
    >
      <li
        v-for="issue in issues"
        :key="issue.id"
      >
        <a
          :href="issue.htmlUrl"
          target="_blank"
          class="text-sm text-primary hover:underline flex items-center gap-1"
        >
          <UIcon
            :name="issue.state === 'open' ? 'i-lucide-circle-dot' : 'i-lucide-check-circle'"
            :class="issue.state === 'open' ? 'text-success' : 'text-muted'"
          />
          #{{ issue.number }} {{ issue.title }}
        </a>
      </li>
    </ul>
  </UCard>
</template>
