<script setup lang="ts">
const route = useRoute()
const owner = computed(() => route.params.owner as string)
const repo = computed(() => route.params.repo as string)
</script>

<template>
  <div>
    <UPageHeader
      :title="`${owner}/${repo}`"
      description="Repository overview"
    />

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
      <UCard>
        <div class="flex items-center gap-3">
          <UIcon
            name="i-lucide-file-text"
            class="text-primary text-xl"
          />
          <div>
            <p class="font-medium">
              Documents
            </p>
            <p class="text-sm text-muted">
              Browse project docs
            </p>
          </div>
        </div>
        <template #footer>
          <UButton
            :to="`/repos/${owner}/${repo}/documents`"
            label="View Documents"
            variant="subtle"
            block
          />
        </template>
      </UCard>

      <UCard>
        <div class="flex items-center gap-3">
          <UIcon
            name="i-lucide-milestone"
            class="text-primary text-xl"
          />
          <div>
            <p class="font-medium">
              Roadmap
            </p>
            <p class="text-sm text-muted">
              Sprint progress
            </p>
          </div>
        </div>
        <template #footer>
          <UButton
            :to="`/repos/${owner}/${repo}/roadmap`"
            label="View Roadmap"
            variant="subtle"
            block
          />
        </template>
      </UCard>

      <UCard>
        <div class="flex items-center gap-3">
          <UIcon
            name="i-lucide-kanban"
            class="text-primary text-xl"
          />
          <div>
            <p class="font-medium">
              Epics & Stories
            </p>
            <p class="text-sm text-muted">
              Track work items
            </p>
          </div>
        </div>
        <template #footer>
          <UButton
            :to="`/repos/${owner}/${repo}/epics`"
            label="View Epics"
            variant="subtle"
            block
          />
        </template>
      </UCard>
    </div>
  </div>
</template>
