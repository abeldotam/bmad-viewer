<script setup lang="ts">
definePageMeta({
  layout: false
})

const { register, loginWithGithub } = useAuth()

const state = reactive({
  email: '',
  password: '',
  confirmPassword: ''
})
const error = ref('')
const loading = ref(false)

async function handleRegister() {
  if (state.password !== state.confirmPassword) {
    error.value = 'Passwords do not match'
    return
  }
  loading.value = true
  error.value = ''
  try {
    await register(state.email, state.password)
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

      <UForm
        :state="state"
        class="space-y-4"
        @submit="handleRegister"
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
            placeholder="Choose a password"
          />
        </UFormField>

        <UFormField
          label="Confirm Password"
          name="confirmPassword"
          required
        >
          <UInput
            v-model="state.confirmPassword"
            type="password"
            placeholder="Confirm your password"
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
