<script setup lang="ts">
defineProps<{
  content: string
  path: string
  repoOwner?: string
  repoName?: string
}>()
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-semibold">
        {{ path.split('/').pop() }}
      </h2>
      <UButton
        v-if="repoOwner && repoName"
        label="Open in GitHub"
        icon="i-simple-icons-github"
        variant="subtle"
        size="sm"
        :to="`https://github.com/${repoOwner}/${repoName}/blob/main/${path}`"
        target="_blank"
      />
    </div>

    <UCard>
      <div class="prose dark:prose-invert max-w-none">
        <MDC :value="content" />
      </div>
    </UCard>
  </div>
</template>
