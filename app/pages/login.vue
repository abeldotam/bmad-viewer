<script setup lang="ts">
definePageMeta({
  layout: false
})

const { login, loginWithGithub } = useAuth()

const state = reactive({
  email: '',
  password: ''
})
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  loading.value = true
  error.value = ''
  try {
    await login(state.email, state.password)
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Login failed'
  } finally {
    loading.value = false
  }
}

async function handleGithubLogin() {
  error.value = ''
  try {
    await loginWithGithub()
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'GitHub login failed'
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <UCard class="w-full max-w-sm">
      <div class="text-center mb-6">
        <BmadLogo />
        <p class="text-sm text-muted mt-2">
          Sign in to your account
        </p>
      </div>

      <UForm
        :state="state"
        class="space-y-4"
        @submit="handleLogin"
      >
        <UFormField
          label="Email"
          name="email"
          required
        >
          <UInput
            v-model="state.email"
            type="email"
            placeholder="you@example.com"
          />
        </UFormField>

        <UFormField
          label="Password"
          name="password"
          required
        >
          <UInput
            v-model="state.password"
            type="password"
            placeholder="Your password"
          />
        </UFormField>

        <p
          v-if="error"
          class="text-error text-sm"
        >
          {{ error }}
        </p>

        <UButton
          type="submit"
          label="Sign in"
          block
          :loading="loading"
        />
      </UForm>

      <USeparator
        label="or"
        class="my-4"
      />

      <UButton
        label="Continue with GitHub"
        icon="i-simple-icons-github"
        color="neutral"
        variant="outline"
        block
        @click="handleGithubLogin"
      />

      <p class="text-center text-sm text-muted mt-4">
        Don't have an account?
        <NuxtLink
          to="/register"
          class="text-primary hover:underline"
        >
          Sign up
        </NuxtLink>
      </p>
    </UCard>
  </div>
</template>
