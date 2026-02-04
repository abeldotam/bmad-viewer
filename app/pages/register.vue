<script setup lang="ts">
definePageMeta({
  layout: false
})

const { register, loginWithGithub } = useAuth()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const loading = ref(false)

async function handleRegister() {
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }
  loading.value = true
  error.value = ''
  try {
    await register(email.value, password.value)
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Registration failed'
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
          Create your account
        </p>
      </div>

      <form
        class="space-y-4"
        @submit.prevent="handleRegister"
      >
        <UFormField label="Email">
          <UInput
            v-model="email"
            type="email"
            placeholder="you@example.com"
            required
          />
        </UFormField>

        <UFormField label="Password">
          <UInput
            v-model="password"
            type="password"
            placeholder="Choose a password"
            required
          />
        </UFormField>

        <UFormField label="Confirm Password">
          <UInput
            v-model="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            required
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
          label="Create account"
          block
          :loading="loading"
        />
      </form>

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
        Already have an account?
        <NuxtLink
          to="/login"
          class="text-primary hover:underline"
        >
          Sign in
        </NuxtLink>
      </p>
    </UCard>
  </div>
</template>
