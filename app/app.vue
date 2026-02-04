<script setup lang="ts">
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

const title = 'BMAD Viewer'
const description = 'Visualize BMAD methodology projects from GitHub repositories. Track sprints, epics, stories, and project documentation.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description
})

const route = useRoute()
const isRepoContext = computed(() => route.path.startsWith('/repos/'))

const { user, logout } = useAuth()

const showNewStoryModal = ref(false)

const userMenuItems = computed(() => [
  [{
    label: user.value?.email || 'Account',
    disabled: true
  }],
  [{
    label: 'Dashboard',
    icon: 'i-lucide-layout-dashboard',
    to: '/dashboard'
  }],
  [{
    label: 'Sign out',
    icon: 'i-lucide-log-out',
    click: logout
  }]
])
</script>

<template>
  <UApp>
    <UHeader>
      <template #left>
        <NuxtLink
          to="/"
          class="flex items-center gap-2"
        >
          <BmadLogo />
        </NuxtLink>

        <RepoNavigation
          v-if="isRepoContext"
          class="ml-6"
        />
      </template>

      <template #right>
        <UColorModeButton />

        <UButton
          to="https://github.com/abel-music/bmad-viewer"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub"
          color="neutral"
          variant="ghost"
        />

        <template v-if="user">
          <UDropdownMenu :items="userMenuItems">
            <UAvatar
              :alt="user.email || 'User'"
              size="sm"
              class="cursor-pointer"
            />
          </UDropdownMenu>
        </template>
        <UButton
          v-else
          to="/login"
          label="Sign in"
          variant="subtle"
          size="sm"
        />
      </template>
    </UHeader>

    <UMain>
      <NuxtPage />
    </UMain>

    <UButton
      v-if="isRepoContext"
      icon="i-lucide-plus"
      label="New Story"
      class="fixed bottom-6 right-6 z-50 shadow-lg"
      size="lg"
      @click="showNewStoryModal = true"
    />

    <NewStoryModal v-model:open="showNewStoryModal" />

    <UFooter>
      <template #left>
        <p class="text-sm text-muted">
          BMAD Viewer &copy; {{ new Date().getFullYear() }}
        </p>
      </template>

      <template #right>
        <UColorModeButton size="xs" />
      </template>
    </UFooter>
  </UApp>
</template>
