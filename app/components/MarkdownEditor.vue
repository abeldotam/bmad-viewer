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
      <button
        type="button"
        class="px-2.5 py-1 text-xs font-medium rounded transition-colors"
        :class="mode === 'write' ? 'bg-primary/10 text-primary' : 'text-muted hover:text-foreground'"
        @click="mode = 'write'"
      >
        Write
      </button>
      <button
        type="button"
        class="px-2.5 py-1 text-xs font-medium rounded transition-colors"
        :class="mode === 'preview' ? 'bg-primary/10 text-primary' : 'text-muted hover:text-foreground'"
        @click="mode = 'preview'"
      >
        Preview
      </button>
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
