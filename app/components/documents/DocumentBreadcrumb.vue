<script setup lang="ts">
const props = defineProps<{
  path: string
}>()

const breadcrumbItems = computed(() => {
  const parts = props.path.split('/')
  return parts.map((part, index) => ({
    label: part,
    icon: index === 0 ? 'i-lucide-folder' : undefined
  }))
})
</script>

<template>
  <UBreadcrumb :items="breadcrumbItems" />
</template>
