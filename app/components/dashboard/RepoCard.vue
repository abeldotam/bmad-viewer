<script setup lang="ts">
import type { Repository } from '~~/shared/types/bmad'

const props = defineProps<{
  repo: Repository
}>()

defineEmits<{
  delete: [owner: string, name: string]
}>()

const { updateBranch } = useRepository()
const { handleSuccess } = useErrorHandler()

const editOpen = ref(false)
const branchInput = ref(props.repo.defaultBranch ?? '')
const saving = ref(false)

function saveBranch() {
  const trimmed = branchInput.value.trim()
  const newValue = trimmed || null
  if (newValue === props.repo.defaultBranch) {
    editOpen.value = false
    return
  }
  saving.value = true
  updateBranch(props.repo.owner, props.repo.name, newValue)
  handleSuccess(newValue ? `Branch updated to ${newValue}` : 'Branch reset to default')
  editOpen.value = false
  saving.value = false
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
        </div>
      </div>
      <UButton
        icon="i-lucide-trash-2"
        color="error"
        variant="ghost"
        size="xs"
        aria-label="Delete repository"
        @click="$emit('delete', repo.owner, repo.name)"
      />
    </div>
  </UCard>
</template>
