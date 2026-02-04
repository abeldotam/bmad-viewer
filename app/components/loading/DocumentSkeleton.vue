<template>
  <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
    <div class="md:col-span-1">
      <UCard>
        <div class="space-y-2">
          <USkeleton
            v-for="i in 6"
            :key="i"
            class="h-6 w-full"
          />
        </div>
      </UCard>
    </div>
    <div class="md:col-span-3">
      <UCard>
        <div class="space-y-4">
          <USkeleton class="h-8 w-1/3" />
          <USkeleton class="h-4 w-full" />
          <USkeleton class="h-4 w-5/6" />
          <USkeleton class="h-4 w-4/5" />
          <USkeleton class="h-32 w-full" />
        </div>
      </UCard>
    </div>
  </div>
</template>
