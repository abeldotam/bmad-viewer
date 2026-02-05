<script setup lang="ts">
import type { Repository } from '~~/shared/types/bmad'

const props = defineProps<{
  repo: Repository
}>()

defineEmits<{
  delete: [id: string]
}>()

const { updateBranch } = useRepository()
const { handleError, handleSuccess } = useErrorHandler()

const editOpen = ref(false)
const branchInput = ref(props.repo.defaultBranch ?? '')
const saving = ref(false)

async function saveBranch() {
  const trimmed = branchInput.value.trim()
  const newValue = trimmed || null
  if (newValue === props.repo.defaultBranch) {
    editOpen.value = false
    return
  }
  saving.value = true
  try {
    await updateBranch(props.repo.id, newValue)
    handleSuccess(newValue ? `Branch updated to ${newValue}` : 'Branch reset to default')
    editOpen.value = false
  } catch (e) {
    handleError(e, 'Failed to update branch')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <UCard>
    <div class="flex items-start justify-between">
      <div>
        <NuxtLink
          :to="`/repos/${repo.owner}/${repo.name}`"
          class="font-semibold text-primary hover:underline"
        >
          {{ repo.owner }}/{{ repo.name }}
        </NuxtLink>
        <div class="flex items-center gap-2 mt-1">
          <UPopover v-model:open="editOpen">
            <UBadge
              :label="repo.defaultBranch ?? 'default'"
              icon="i-lucide-git-branch"
              variant="subtle"
              color="neutral"
              size="sm"
              class="cursor-pointer hover:opacity-80"
            />
            <template #content>
              <div class="p-3 space-y-2 w-56">
                <p class="text-xs font-medium">
                  Branch
                </p>
                <form
                  class="flex gap-1.5"
                  @submit.prevent="saveBranch"
                >
                  <UInput
                    v-model="branchInput"
                    size="sm"
                    placeholder="main"
                    class="flex-1"
                  />
                  <UButton
                    type="submit"
                    icon="i-lucide-check"
                    size="sm"
                    :loading="saving"
                  />
                </form>
              </div>
            </template>
          </UPopover>
          <span
            v-if="repo.lastSyncedAt"
            class="text-xs text-muted"
          >
            Last synced: {{ new Date(repo.lastSyncedAt).toLocaleDateString() }}
          </span>
          <span
            v-else
            class="text-xs text-muted"
          >
            Never synced
          </span>
        </div>
      </div>
      <UButton
        icon="i-lucide-trash-2"
        color="error"
        variant="ghost"
        size="xs"
        aria-label="Delete repository"
        @click="$emit('delete', repo.id)"
      />
    </div>
  </UCard>
</template>
