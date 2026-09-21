<template>
  <form class="login-form" @submit.prevent="handleSubmit">
    <div v-if="error" class="form-alert" role="alert">
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
        <path d="M12 8v4m0 4h.01M10.3 4.7 3.5 17a2 2 0 0 0 1.75 3h13.5a2 2 0 0 0 1.75-3L13.7 4.7a2 2 0 0 0-3.4 0Z" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span>{{ error }}</span>
    </div>

    <div class="field">
      <label for="username">Username / NIK</label>
      <div class="field__control">
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
          <path d="M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm7 6a7 7 0 0 0-14 0" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
        </svg>
        <input
          id="username"
          v-model="username"
          name="username"
          type="text"
          required
          autocomplete="username"
          inputmode="text"
          placeholder="Masukkan username atau NIK"
        />
      </div>
    </div>

    <div class="field">
      <div class="field__label-row">
        <label for="password">Password</label>
        <a href="#" @click.prevent>Lupa password?</a>
      </div>
      <div class="field__control">
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
          <path d="M7 10V8a5 5 0 0 1 10 0v2m-9 0h8a2 2 0 0 1 2 2v7H6v-7a2 2 0 0 1 2-2Z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <input
          id="password"
          v-model="password"
          name="password"
          :type="showPassword ? 'text' : 'password'"
          required
          autocomplete="current-password"
          placeholder="Masukkan password"
        />
        <button
          class="password-toggle"
          type="button"
          :aria-label="showPassword ? 'Sembunyikan password' : 'Tampilkan password'"
          :aria-pressed="showPassword"
          @click="showPassword = !showPassword"
        >
          <svg v-if="!showPassword" aria-hidden="true" viewBox="0 0 24 24" fill="none">
            <path d="M2.5 12s3.4-6 9.5-6 9.5 6 9.5 6-3.4 6-9.5 6-9.5-6-9.5-6Z" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="2.7" stroke="currentColor" stroke-width="1.5"/>
          </svg>
          <svg v-else aria-hidden="true" viewBox="0 0 24 24" fill="none">
            <path d="m4 4 16 16M10.6 6.1A9.6 9.6 0 0 1 12 6c6.1 0 9.5 6 9.5 6a13.2 13.2 0 0 1-2.4 3.1M7.1 7.1C4.1 9 2.5 12 2.5 12s3.4 6 9.5 6c1 0 1.9-.2 2.7-.4M9.9 9.9a3 3 0 0 0 4.2 4.2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    </div>

    <label class="remember">
      <input id="remember-me" name="remember-me" type="checkbox" />
      <span class="remember__box">
        <svg aria-hidden="true" viewBox="0 0 12 12" fill="none"><path d="m2.5 6 2.2 2.2L9.6 3.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </span>
      <span>Ingat saya di perangkat ini</span>
    </label>

    <button
      class="submit-button"
      type="submit"
      :disabled="isLoading"
      @pointerenter="emit('productHover', true)"
      @pointerleave="emit('productHover', false)"
      @pointerdown="emit('productPress')"
      @blur="emit('productHover', false)"
    >
      <span>{{ isLoading ? 'Memproses...' : 'Masuk ke sistem' }}</span>
      <svg v-if="isLoading" class="spinner" aria-hidden="true" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2.4" opacity=".25"/>
        <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
      </svg>
      <svg v-else aria-hidden="true" viewBox="0 0 24 24" fill="none">
        <path d="M5 12h14m-5-5 5 5-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  productHover: [active: boolean]
  productPress: []
  loginSuccess: []
}>()

const { login } = useAuth()
const username = ref('')
const password = ref('')
const error = ref('')
const isLoading = ref(false)
const showPassword = ref(false)

const handleSubmit = async () => {
  emit('productPress')

  if (!username.value || !password.value) {
    error.value = 'Silakan lengkapi username dan password terlebih dahulu.'
    return
  }

  error.value = ''
  isLoading.value = true

  const result = await login(username.value, password.value)

  if (result.success) {
    emit('loginSuccess')
    await new Promise(resolve => setTimeout(resolve, 360))
    await navigateTo('/dashboard')
  } else {
    error.value = result.message || 'Gagal login, periksa kembali data Anda.'
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-form { display: grid; gap: 20px; }
.form-alert { display: flex; align-items: flex-start; gap: 9px; padding: 11px 13px; border: 1px solid rgba(174, 62, 45, 0.18); border-radius: 11px; color: #a1382d; background: rgba(194, 67, 49, 0.07); font-size: 0.72rem; line-height: 1.5; }
.form-alert svg { width: 17px; height: 17px; flex: 0 0 auto; margin-top: 1px; }

.field label, .field__label-row label { display: block; color: #4a2b1b; font-size: 0.68rem; font-weight: 800; letter-spacing: 0.085em; text-transform: uppercase; }
.field__label-row { display: flex; align-items: center; justify-content: space-between; }
.field__label-row a { color: #a56640; font-size: 0.7rem; font-weight: 700; text-decoration: none; }
.field__label-row a:hover { color: #704125; }
.field__control { position: relative; display: flex; align-items: center; margin-top: 8px; }
.field__control > svg { position: absolute; left: 15px; width: 18px; height: 18px; color: #a58670; pointer-events: none; }

.field input { width: 100%; height: 50px; padding: 0 43px; border: 1px solid rgba(93, 57, 35, 0.16); border-radius: 12px; outline: none; color: #321b10; background: rgba(255, 253, 249, 0.73); box-shadow: 0 1px 0 rgba(255, 255, 255, 0.7) inset; font-size: 0.83rem; transition: border-color 180ms ease, box-shadow 180ms ease, background-color 180ms ease; }
.field input::placeholder { color: #b9a595; }
.field input:hover { border-color: rgba(113, 68, 41, 0.28); background: rgba(255, 253, 249, 0.96); }
.field input:focus { border-color: #b47148; background: #fffdfa; box-shadow: 0 0 0 3px rgba(183, 112, 69, 0.11); }

.password-toggle { position: absolute; right: 8px; display: grid; width: 34px; height: 34px; padding: 0; place-items: center; border: 0; border-radius: 8px; color: #9c806c; background: transparent; cursor: pointer; transition: color 160ms ease, background-color 160ms ease; }
.password-toggle:hover { color: #704125; background: rgba(114, 65, 36, 0.06); }
.password-toggle svg { width: 18px; height: 18px; }

.remember { display: flex; width: fit-content; align-items: center; gap: 8px; color: #806653; font-size: 0.72rem; font-weight: 600; cursor: pointer; user-select: none; }
.remember input { position: absolute; width: 1px; height: 1px; opacity: 0; }
.remember__box { display: grid; width: 16px; height: 16px; place-items: center; border: 1px solid rgba(95, 58, 36, 0.3); border-radius: 5px; color: white; background: #fffdfa; transition: border-color 160ms ease, background-color 160ms ease; }
.remember__box svg { width: 11px; height: 11px; opacity: 0; transform: scale(0.7); transition: opacity 140ms ease, transform 140ms ease; }
.remember input:checked + .remember__box { border-color: #6c3b22; background: #6c3b22; }
.remember input:checked + .remember__box svg { opacity: 1; transform: scale(1); }
.remember input:focus-visible + .remember__box { box-shadow: 0 0 0 3px rgba(183, 112, 69, 0.16); }

.submit-button { display: flex; width: 100%; height: 52px; align-items: center; justify-content: center; gap: 10px; margin-top: 2px; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; color: #fffaf3; background: linear-gradient(135deg, #3d2114, #6b3b24 58%, #895132); box-shadow: 0 12px 25px rgba(59, 30, 15, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.12); font-size: 0.78rem; font-weight: 800; letter-spacing: 0.025em; cursor: pointer; transform: translate3d(0, 0, 0); transition: transform 250ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 250ms ease, filter 250ms ease; }
.submit-button:hover:not(:disabled) { box-shadow: 0 16px 30px rgba(59, 30, 15, 0.27), inset 0 1px 0 rgba(255, 255, 255, 0.16); filter: brightness(1.06); transform: translate3d(0, -2px, 0); }
.submit-button:active:not(:disabled) { transform: translate3d(0, 0, 0) scale(0.995); }
.submit-button:focus-visible { outline: 3px solid rgba(183, 112, 69, 0.3); outline-offset: 3px; }
.submit-button:disabled { cursor: wait; opacity: 0.72; }
.submit-button svg { width: 18px; height: 18px; }
.spinner { animation: spin 800ms linear infinite; }

@keyframes spin { to { transform: rotate(360deg); } }

@media (prefers-reduced-motion: reduce) {
  .submit-button, .remember__box svg, .spinner { animation: none; transition-duration: 0.01ms; }
}
</style>
