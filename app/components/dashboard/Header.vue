<template>
  <header class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30">
    <div class="flex items-center">
      <button
        @click="$emit('toggle-sidebar')"
        class="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg lg:hidden"
      >
        <span class="sr-only">Toggle Sidebar</span>
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>
      <h2 class="ml-4 lg:ml-0 text-lg font-semibold text-slate-800">{{ pageTitle }}</h2>
    </div>

    <div class="flex items-center space-x-4">
      <!-- Search Bar -->
      <div class="hidden md:block relative group">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search module..."
            class="w-64 bg-slate-100 border border-transparent rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-theme-primary focus:bg-white focus:border-theme-primary/20 transition-all outline-none"
            @focus="isSearchFocused = true"
            @blur="setTimeout(() => isSearchFocused = false, 200)"
          />
          <span class="absolute left-3 top-2.5 text-slate-400">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
        </div>

        <!-- Search Results Dropdown -->
        <div 
          v-if="isSearchFocused && searchQuery.length > 1"
          class="absolute top-full mt-2 left-0 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 backdrop-blur-xl bg-white/95"
        >
          <div v-if="filteredResults.length === 0" class="p-4 text-center text-slate-500 text-sm">
            No modules found for "{{ searchQuery }}"
          </div>
          <div v-else class="max-h-96 overflow-y-auto py-2">
            <div class="px-4 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 mb-1">
              Search Results
            </div>
            <button
              v-for="result in filteredResults"
              :key="result.path"
              @click="navigateToModule(result.path)"
              class="w-full px-4 py-2.5 text-left hover:bg-theme-primary/5 group transition-colors flex items-center justify-between"
            >
              <div class="flex flex-col">
                <span class="text-sm font-bold text-slate-700 group-hover:text-theme-primary transition-colors">
                  {{ result.name }}
                </span>
                <span class="text-[10px] text-slate-400 uppercase font-medium">
                  {{ result.parent }}
                </span>
              </div>
              <svg class="w-4 h-4 text-slate-300 group-hover:text-theme-primary opacity-0 group-hover:opacity-100 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Notifications -->
      <button class="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors relative">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <span class="absolute top-2 right-2 w-2 h-2 bg-theme-primary rounded-full border-2 border-white"></span>
      </button>

      <!-- User Profile -->
      <div class="relative" ref="profileRef">
        <button
          @click="isProfileOpen = !isProfileOpen"
          class="flex items-center space-x-3 pl-4 border-l border-slate-200 hover:opacity-80 transition-opacity"
        >
          <div class="text-right hidden sm:block">
            <p class="text-sm font-medium text-slate-900 leading-none">
              {{ userProfile?.nama_lengkap || user?.nik || 'User' }}
            </p>
            <p class="text-xs text-slate-500 mt-1 uppercase tracking-wider">
              {{ userProfile?.nama_jabatan || '-' }}
            </p>
          </div>
          <!-- Avatar: foto jika ada, fallback ke inisial -->
          <div class="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
            <img
              v-if="userProfile?.foto"
              :src="userProfile.foto"
              :alt="userProfile.nama_lengkap"
              class="w-full h-full object-cover"
              @error="onAvatarError"
            />
            <div
              v-else
              class="w-full h-full bg-theme-primary flex items-center justify-center text-white font-bold uppercase text-sm"
            >
              {{ avatarInitial }}
            </div>
          </div>
        </button>

        <!-- Dropdown Profile Card -->
        <transition name="fade-drop">
          <div
            v-if="isProfileOpen"
            class="absolute right-0 top-full mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50"
          >
            <!-- Profile Header -->
            <div class="bg-gradient-to-br from-theme-primary/10 to-indigo-500/10 p-5 flex items-center space-x-4">
              <div class="w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-md flex-shrink-0">
                <img
                  v-if="userProfile?.foto"
                  :src="userProfile.foto"
                  :alt="userProfile.nama_lengkap"
                  class="w-full h-full object-cover"
                />
                <div
                  v-else
                  class="w-full h-full bg-theme-primary flex items-center justify-center text-white font-bold text-xl uppercase"
                >
                  {{ avatarInitial }}
                </div>
              </div>
              <div class="min-w-0">
                <p class="font-bold text-slate-800 text-sm leading-tight truncate">
                  {{ userProfile?.nama_lengkap || user?.nik || '-' }}
                </p>
                <p class="text-xs text-theme-primary font-semibold mt-0.5 truncate">
                  {{ userProfile?.nama_jabatan || '-' }}
                </p>
                <p class="text-[10px] text-slate-400 mt-0.5 truncate">
                  {{ userProfile?.cmp_desc || '-' }}
                </p>
              </div>
            </div>

            <!-- Info rows -->
            <div class="px-5 py-3 space-y-2 border-b border-slate-100">
              <div class="flex items-center space-x-2 text-xs text-slate-600">
                <svg class="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>{{ userProfile?.kelamin || '-' }}</span>
              </div>
              <div class="flex items-center space-x-2 text-xs text-slate-600">
                <svg class="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>{{ userProfile?.tlp || '-' }}</span>
              </div>
            </div>

            <!-- Logout button -->
            <div class="px-5 py-3">
              <button
                @click="handleLogout"
                class="w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Keluar</span>
              </button>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
defineEmits(['toggle-sidebar'])

const router = useRouter()
const route = useRoute()
const { navigation } = useNavigation()
const { user, userProfile, logout } = useAuth()

const isProfileOpen = ref(false)
const profileRef = ref<HTMLElement | null>(null)

// Tutup dropdown jika klik di luar
onMounted(() => {
  document.addEventListener('click', (e) => {
    if (profileRef.value && !profileRef.value.contains(e.target as Node)) {
      isProfileOpen.value = false
    }
  })
})

// Inisial nama untuk fallback avatar
const avatarInitial = computed(() => {
  const name = userProfile.value?.nama_lengkap || user.value?.nik || ''
  return name.charAt(0).toUpperCase()
})

// Fallback jika foto gagal load
const onAvatarError = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.style.display = 'none'
}

const handleLogout = async () => {
  isProfileOpen.value = false
  await logout()
}

const searchQuery = ref('')
const isSearchFocused = ref(false)

const pageTitle = computed(() => {
  const path = route.path.split('/').pop()
  if (!path || path === 'dashboard') return 'Dashboard Overview'
  return path.replace(/-/g, ' ').toUpperCase()
})

// Flatten navigation tree for searching
const allModules = computed(() => {
  const flattened: any[] = []
  
  navigation.value.forEach((menu: any) => {
    if (menu.submenu) {
      menu.submenu.forEach((sub: any) => {
        // Add Submenu (Level 2)
        if (sub.mn_pth && sub.mn_pth !== '-') {
          flattened.push({
            name: sub.mn_sb_nm,
            path: sub.mn_pth,
            parent: menu.mn_nm
          })
        }
        
        // Add Sub-submenu (Level 3)
        if (sub.subsubmenu) {
          sub.subsubmenu.forEach((ss: any) => {
            flattened.push({
              name: ss.mn_sb_sb_nm,
              path: ss.mn_pth,
              parent: `${menu.mn_nm} > ${sub.mn_sb_nm}`
            })
          })
        }
      })
    }
  })
  
  return flattened
})

const filteredResults = computed(() => {
  if (searchQuery.value.length < 2) return []
  const query = searchQuery.value.toLowerCase()
  return allModules.value.filter(m => 
    m.name.toLowerCase().includes(query) || 
    m.parent.toLowerCase().includes(query)
  ).slice(0, 10) // Limit results
})

function navigateToModule(path: string) {
  searchQuery.value = ''
  isSearchFocused.value = false
  router.push(`/${path}`)
}
</script>
