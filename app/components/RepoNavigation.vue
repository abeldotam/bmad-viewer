<script setup lang="ts">
const route = useRoute()

const owner = computed(() => route.params.owner as string)
const repo = computed(() => route.params.repo as string)
const basePath = computed(() => `/repos/${owner.value}/${repo.value}`)

const items = computed(() => [
  [{
    label: 'Overview',
    icon: 'i-lucide-layout-dashboard',
    to: basePath.value
  }],
  [{
    label: 'Documents',
    icon: 'i-lucide-file-text',
    to: `${basePath.value}/documents`
  }],
  [{
    label: 'Roadmap',
    icon: 'i-lucide-milestone',
    to: `${basePath.value}/roadmap`
  }],
  [{
    label: 'Epics & Stories',
    icon: 'i-lucide-kanban',
    to: `${basePath.value}/epics`
  }]
])

const mobileItems = computed(() =>
  items.value.flat().map(item => ({
    label: item.label,
    value: item.to
  }))
)

const currentPath = computed(() => route.path)

function onMobileSelect(value: string) {
  navigateTo(value)
}
</script>

<template>
  <div>
    <UNavigationMenu
      :items="items"
      orientation="horizontal"
      class="hidden md:flex"
    />

    <USelectMenu
      :model-value="currentPath"
      :items="mobileItems"
      value-key="value"
      class="md:hidden w-40"
      @update:model-value="onMobileSelect"
    />
  </div>
</template>
