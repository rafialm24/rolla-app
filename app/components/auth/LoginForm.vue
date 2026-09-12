<template>
  <form @submit.prevent class="space-y-5">
    <!-- Error Message Alert -->
    <div v-if="error" class="bg-red-500/10 border border-red-500/30 text-red-400 p-3.5 rounded-xl text-sm flex items-center backdrop-blur-sm">
      <svg class="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      {{ error }}
    </div>
    
    <!-- Username -->
    <div class="relative">
      <label for="username" class="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Username / NIK</label>
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <svg class="h-4.5 w-4.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
        </div>
        <input 
          id="username" 
          v-model="username" 
          name="username" 
          type="text" 
          required 
          class="block w-full pl-10 pr-3 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-slate-600 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 hover:border-white/20" 
          placeholder="Masukkan username atau NIK" 
        />
      </div>
    </div>

    <!-- Password -->
    <div class="relative">
      <label for="password" class="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Password</label>
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <svg class="h-4.5 w-4.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
        </div>
        <input 
          id="password" 
          v-model="password" 
          name="password" 
          :type="showPassword ? 'text' : 'password'" 
          required 
          class="block w-full pl-10 pr-10 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-slate-600 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 hover:border-white/20" 
          placeholder="Masukkan password" 
        />
        <!-- Password Toggle -->
        <button 
          type="button" 
          @click="showPassword = !showPassword" 
          class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-amber-400 transition-colors"
        >
          <svg v-if="!showPassword" class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
          <svg v-else class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
        </button>
      </div>
    </div>

    <!-- Remember & Forgot -->
    <div class="flex items-center justify-between pt-1">
      <div class="flex items-center">
        <input id="remember-me" name="remember-me" type="checkbox" class="h-3.5 w-3.5 text-amber-500 focus:ring-amber-500 bg-black/30 border-white/20 rounded cursor-pointer" />
        <label for="remember-me" class="ml-2 block text-xs font-semibold text-amber-500/80 cursor-pointer">
          Ingat saya
        </label>
      </div>
      <div class="text-xs">
        <a href="#" class="font-semibold text-amber-500/80 hover:text-amber-400 transition-colors">
          Lupa password?
        </a>
      </div>
    </div>

    <!-- Submit Button -->
    <div class="pt-1">
      <button 
        type="button" 
        @click="handleSubmit"
        :disabled="isLoading"
        class="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#2a1a0a] focus:ring-amber-500 disabled:opacity-60 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-5px_rgba(245,158,11,0.4)] active:translate-y-0"
      >
        <svg v-if="isLoading" class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <template v-if="isLoading">Memproses...</template>
        <template v-else>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          Masuk
        </template>
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const { login } = useAuth()

const username = ref('')
const password = ref('')
const error = ref('')
const isLoading = ref(false)
const showPassword = ref(false)

const handleSubmit = async () => {
  if (!username.value || !password.value) {
    error.value = 'Silakan lengkapi Username dan Password terlebih dahulu.'
    return
  }

  error.value = ''
  isLoading.value = true
  
  const result = await login(username.value, password.value)
  
  if (result.success) {
    // Navigate ke dashboard jika sukses login
    await navigateTo('/dashboard')
  } else {
    error.value = result.message || 'Gagal login, periksa kembali data Anda.'
  }
  
  isLoading.value = false
}
</script>
