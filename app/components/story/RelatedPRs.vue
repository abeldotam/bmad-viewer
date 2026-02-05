<script setup lang="ts">
import type { PullRequest, PullRequestState } from '~~/shared/types/bmad'

defineProps<{
  pullRequests: PullRequest[]
}>()

type BadgeColor = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral'

function getPrBadgeColor(state: PullRequestState): BadgeColor {
  const colors: Record<PullRequestState, BadgeColor> = {
    open: 'success',
    draft: 'neutral',
    merged: 'primary',
    closed: 'error'
  }
  return colors[state]
}

function getPrIcon(state: PullRequestState): string {
  const icons: Record<PullRequestState, string> = {
    open: 'i-lucide-git-pull-request',
    draft: 'i-lucide-git-pull-request-draft',
    merged: 'i-lucide-git-merge',
    closed: 'i-lucide-git-pull-request-closed'
  }
  return icons[state]
}
</script>

<template>
  <UCard v-if="pullRequests.length">
    <h3 class="font-semibold text-sm mb-3">
      Related PRs
    </h3>
    <ul class="space-y-2">
      <li
        v-for="pr in pullRequests"
        :key="pr.number"
        class="flex items-center gap-2"
      >
        <a
          :href="pr.htmlUrl"
          target="_blank"
          class="flex items-center gap-2 no-underline hover:underline text-sm"
        >
          <UBadge
            :label="`#${pr.number}`"
            :color="getPrBadgeColor(pr.state)"
            :icon="getPrIcon(pr.state)"
            variant="subtle"
            size="sm"
          />
          <span class="text-muted truncate">{{ pr.title }}</span>
        </a>
      </li>
    </ul>
  </UCard>
</template>
