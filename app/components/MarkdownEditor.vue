<script setup lang="ts">
defineProps<{
  placeholder?: string
  rows?: number
  required?: boolean
}>()

const model = defineModel<string>({ default: '' })

const mode = ref<'write' | 'preview'>('write')
</script>

<template>
  <div>
    <div class="flex gap-1 mb-2">
      <UButton
        label="Write"
        size="xs"
        :variant="mode === 'write' ? 'subtle' : 'ghost'"
        :color="mode === 'write' ? 'primary' : 'neutral'"
        @click="mode = 'write'"
      />
      <UButton
        label="Preview"
        size="xs"
        :variant="mode === 'preview' ? 'subtle' : 'ghost'"
        :color="mode === 'preview' ? 'primary' : 'neutral'"
        @click="mode = 'preview'"
      />
    </div>

    <UTextarea
      v-show="mode === 'write'"
      v-model="model"
      :placeholder="placeholder"
      :rows="rows"
      :required="required"
    />

    <div
      v-show="mode === 'preview'"
      class="min-h-[4rem] rounded-md border border-default px-3 py-2"
    >
      <div
        v-if="model.trim()"
        class="prose dark:prose-invert max-w-none text-sm"
      >
        <MDC :value="model" />
      </div>
      <p
        v-else
        class="text-muted text-sm italic"
      >
        Nothing to preview
      </p>
    </div>
  </div>
</template>
