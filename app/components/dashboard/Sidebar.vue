<template>
  <aside
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    :class="[
      'fixed inset-y-0 left-0 z-50 flex transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] h-screen overflow-hidden',
      'lg:translate-x-0', // Always visible on desktop
      isOpen ? 'translate-x-0 shadow-[20px_0_40px_rgba(0,0,0,0.3)]' : '-translate-x-full',
      isHovered || isOpen ? 'w-72 shadow-[20px_0_40px_rgba(0,0,0,0.3)]' : 'lg:w-[76px] w-72'
    ]"
  >
    <!-- Main Sidebar Column -->
    <div class="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 backdrop-blur-2xl border-r border-white/10 flex flex-col h-full w-72 flex-shrink-0 relative overflow-hidden shadow-2xl shadow-indigo-900/20">
      <!-- Ambient Glow Effects -->
      <div class="absolute top-0 left-0 w-full h-80 bg-gradient-to-br from-indigo-500/20 to-sky-500/10 rounded-full blur-[60px] pointer-events-none"></div>
      <div class="absolute bottom-0 right-0 w-full h-80 bg-gradient-to-tl from-purple-500/10 to-transparent rounded-full blur-[60px] pointer-events-none"></div>
      
      <!-- App Header -->
      <div class="flex flex-col px-4 pt-6 pb-5 flex-shrink-0 z-20 space-y-5 relative">
        
        <!-- App/Module Title -->
        <div class="flex items-center group/logo cursor-pointer">
          <div class="w-11 flex justify-center flex-shrink-0 relative">
            <div class="absolute inset-0 bg-orange-500/40 blur-md rounded-full group-hover/logo:bg-amber-500/60 transition-colors"></div>
            <div class="relative w-9 h-9 rounded-full bg-white flex items-center justify-center border border-white/20 shadow-lg shadow-orange-500/50 group-hover/logo:scale-105 transition-all overflow-hidden">
              <img src="/rolla-logo.jpg" alt="Rolla Logo" class="w-full h-full object-cover" />
            </div>
          </div>
          <div :class="['flex flex-col transition-opacity duration-300 whitespace-nowrap ml-3', isHovered || isOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden']">
            <span class="text-lg font-black text-white tracking-tight leading-none">ROLLA<span class="text-orange-500">.</span></span>
            <span class="text-[9px] font-bold text-slate-500 tracking-widest uppercase mt-0.5">Enterprise System</span>
          </div>
        </div>

        <!-- User Profile -->
        <div class="flex items-center justify-between pt-1">
          <div class="flex items-center bg-white/5 rounded-2xl p-1.5 pr-4 border border-white/5 shadow-inner min-w-0">
            <!-- Avatar -->
            <div class="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0 shadow-lg">
              <img
                v-if="userProfile?.foto"
                :src="userProfile.foto"
                :alt="userProfile.nama_lengkap"
                class="w-full h-full object-cover"
              />
              <div
                v-else
                class="w-full h-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center"
              >
                <span class="text-white font-bold text-sm uppercase">
                  {{ (userProfile?.nama_lengkap || user?.nik || 'A').charAt(0) }}
                </span>
              </div>
            </div>
            <div :class="['flex flex-col ml-3 transition-opacity duration-300 whitespace-nowrap min-w-0', isHovered || isOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden']">
              <span class="text-xs font-bold text-slate-200 leading-tight truncate max-w-[140px]">
                {{ userProfile?.nama_lengkap || user?.nik || 'Administrator' }}
              </span>
              <span class="text-[9px] font-semibold text-sky-400/80 uppercase tracking-wider truncate max-w-[140px]">
                {{ userProfile?.nama_jabatan || 'Super User' }}
              </span>
            </div>
          </div>
          
          <button @click="logout" title="Logout" :class="['p-2.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-300 rounded-xl flex-shrink-0', isHovered || isOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden pointer-events-none']">
            <UIcon name="i-heroicons-arrow-right-on-rectangle" class="w-5 h-5" />
          </button>
        </div>

        <!-- Location Dropdown -->
        <div class="flex items-center space-x-2 pt-1">
          <div class="relative flex-1" ref="dropdownRef">
            <button
              @click="isDropdownOpen = !isDropdownOpen"
              class="w-full flex items-center bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-[10px] font-black py-2.5 rounded-xl transition-all cursor-pointer uppercase tracking-widest shadow-lg backdrop-blur-sm group/loc"
            >
              <div class="w-11 flex justify-center flex-shrink-0">
                <UIcon name="i-heroicons-map-pin" class="w-4 h-4 text-emerald-400 group-hover/loc:scale-110 transition-transform" />
              </div>
              <div :class="['flex flex-1 items-center justify-between pr-3 transition-opacity duration-300', isHovered || isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden']">
                <span class="truncate">{{ activeProdName }}</span>
                <UIcon name="i-heroicons-chevron-up-down" class="w-4 h-4 ml-1 flex-shrink-0 text-slate-500" />
              </div>
            </button>
            
            <div v-if="isDropdownOpen" class="absolute z-50 w-full mt-2 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-[0_15px_40px_rgba(0,0,0,0.6)] max-h-60 overflow-y-auto custom-scrollbar p-2">
              <button
                v-for="prod in produksiList"
                :key="prod.id"
                @click="selectLocation(prod.id)"
                class="w-full text-left px-3 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-colors flex items-center gap-2"
                :class="activeProdId == prod.id ? 'bg-sky-500/20 text-sky-400' : 'text-slate-400 hover:bg-white/5 hover:text-white'"
              >
                <div class="w-1.5 h-1.5 rounded-full" :class="activeProdId == prod.id ? 'bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]' : 'bg-transparent'"></div>
                {{ prod.name_prod }}
              </button>
            </div>
          </div>
        </div>

        <!-- Search Bar -->
        <div class="relative mt-2 flex items-center bg-black/20 border border-white/5 rounded-xl overflow-hidden focus-within:ring-1 focus-within:ring-sky-500/50 focus-within:bg-black/40 transition-all">
          <div class="w-11 py-2.5 flex justify-center flex-shrink-0 cursor-pointer text-slate-500" @click="isHovered = true">
            <UIcon name="i-heroicons-magnifying-glass" class="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Quick search..."
            :class="['bg-transparent text-slate-200 text-[11px] font-bold tracking-wide py-2.5 pr-3 focus:outline-none placeholder-slate-600 transition-opacity duration-300', isHovered || isOpen ? 'opacity-100 w-full' : 'opacity-0 w-0']"
          />
        </div>
      </div>

      <!-- Scrollable Submenu Area -->
      <div class="flex-1 overflow-y-auto custom-scrollbar px-3 py-2 relative border-t border-white/5">
        <div class="space-y-1 relative">
          <div v-for="(menu, mIdx) in displayNavigation" :key="menu.id_menu" class="relative">
            <!-- Level 1: Root Menu Item -->
            <div class="group/nav relative">
              <!-- Active Highlight Decorator -->
              <div v-if="expandedSubMenus.includes(menu.id_menu) || (isRouteActive(menu.mn_pth) && !menu.submenu?.length)" class="absolute left-0 top-0 bottom-0 w-1 bg-sky-400 rounded-r-full shadow-[0_0_10px_rgba(56,189,248,0.8)] z-10"></div>
              
              <!-- Case A: Has Submenus (Toggle Button) -->
              <button
                v-if="menu.submenu && menu.submenu.length"
                @click="toggleSubMenu(menu.id_menu)"
                class="w-full flex items-center text-[12px] font-black uppercase tracking-wider transition-all rounded-xl relative z-10 py-2 px-1 hover:bg-white/5"
                :class="[expandedSubMenus.includes(menu.id_menu) ? 'text-white bg-white/5' : 'text-slate-400']"
              >
                <div class="w-10 py-1 flex justify-center flex-shrink-0 transition-colors" :class="expandedSubMenus.includes(menu.id_menu) ? 'text-sky-400' : 'text-slate-500 group-hover/nav:text-slate-300'" v-html="getProfessionalIcon(menu.mn_nm)"></div>
                <div :class="['flex flex-1 items-center justify-between pr-3 transition-opacity duration-300', isHovered || isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden']">
                  <span class="truncate">{{ menu.mn_nm }}</span>
                  <UIcon name="i-heroicons-chevron-right" 
                    :class="['w-3.5 h-3.5 transition-transform duration-300 opacity-50 flex-shrink-0', expandedSubMenus.includes(menu.id_menu) ? 'rotate-90 text-sky-400 opacity-100' : '']"
                  />
                </div>
              </button>

              <!-- Case B: No Submenus (Direct Link) -->
              <NuxtLink
                v-else
                :to="formatPath(menu.mn_pth)"
                class="w-full flex items-center text-[12px] font-black uppercase tracking-wider transition-all rounded-xl relative z-10 py-2 px-1 hover:bg-white/5"
                :class="[isRouteActive(menu.mn_pth) ? 'text-white bg-white/5' : 'text-slate-400']"
              >
                <div class="w-10 py-1 flex justify-center flex-shrink-0 transition-colors" :class="isRouteActive(menu.mn_pth) ? 'text-sky-400 drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]' : 'text-slate-500 group-hover/nav:text-slate-300'" v-html="getProfessionalIcon(menu.mn_nm)"></div>
                <span :class="['truncate transition-opacity duration-300', isHovered || isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden']">{{ menu.mn_nm }}</span>
              </NuxtLink>
            </div>

            <!-- Level 2: Submenus -->
            <div 
              v-show="isHovered || isOpen"
              v-if="expandedSubMenus.includes(menu.id_menu)" 
              class="pl-4 ml-6 border-l border-white/10 space-y-1 relative mt-1 mb-2"
            >
              <NuxtLink
                v-for="sub in menu.submenu"
                :key="sub.id_sb_mn"
                :to="formatPath(sub.mn_pth)"
                class="flex items-center px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-slate-400 rounded-lg transition-all hover:text-white hover:bg-white/5 relative group/item"
                active-class="!text-sky-400 bg-sky-500/10 font-black"
              >
                <div class="absolute -left-4 top-1/2 w-3.5 border-t border-white/10 group-hover/item:border-sky-400/50 group-[.router-link-active]/item:border-sky-400 transition-colors"></div>
                <div class="w-1.5 h-1.5 rounded-full border border-current mr-2 flex-shrink-0 transition-colors group-[.router-link-active]/item:bg-sky-400"></div>
                {{ sub.mn_sb_nm }}
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Footer Info -->
      <div class="px-6 py-4 border-t border-white/10 bg-slate-950/50 text-center transition-opacity duration-300" :class="isHovered || isOpen ? 'opacity-100' : 'opacity-0'">
        <p class="text-[10px] font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-sky-400 tracking-widest uppercase">Version 2.0.1</p>
      </div>
    </div>
  </aside>

  <!-- Overlay -->
  <div v-if="isOpen" @click="$emit('close')" class="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"></div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNavigation } from '../../composables/useNavigation'
import { useAuth } from '../../composables/useAuth'
import { useProduksi } from '../../composables/useProduksi'

const route = useRoute()
const router = useRouter()
defineProps<{ isOpen: boolean }>()
defineEmits(['close', 'mouseleave'])

const { navigation, isLoading, fetchNavigation } = useNavigation()
const { logout, userProfile, user } = useAuth()
const { produksiList, currentProduksi, activeProdId, fetchProduksiIndex, setActiveProdId } = useProduksi()

const isDropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)
const isHovered = ref(false)

const activeProdName = computed(() => {
  if (!activeProdId.value || !produksiList.value) return 'PILIH LOKASI'
  // Use non-strict equality in case the cookie stores the value as a string
  const prod = produksiList.value.find((p: any) => p.id == activeProdId.value)
  return prod ? prod.name_prod : 'PILIH LOKASI'
})

const selectLocation = async (id: number) => {
  activeProdId.value = id
  isDropdownOpen.value = false
  if (id) {
    await setActiveProdId(id)
  }
}

// Close dropdown when clicking outside
onMounted(() => {
  document.addEventListener('click', (e) => {
    if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
      isDropdownOpen.value = false
    }
  })
})

const dashboardMenu = {
  id_menu: 999999,
  mn_nm: 'Dashboard',
  mn_pth: '/dashboard',
  submenu: []
}

const displayNavigation = computed(() => {
  if (!navigation.value) return [dashboardMenu]
  
  // Clone to avoid mutating original state
  const navCopy = JSON.parse(JSON.stringify(navigation.value))
  const availablePaths = router.getRoutes().map(r => r.path.replace(/\/$/, ''))
  
  const filterMenus = (menus: any[]) => {
    if (!menus) return []
    return menus.filter(menu => {
      if (menu.submenu && menu.submenu.length > 0) {
        menu.submenu = filterMenus(menu.submenu)
        return menu.submenu.length > 0
      }
      
      if (!menu.mn_pth || menu.mn_pth === '-') return false
      const formattedPath = formatPath(menu.mn_pth).replace(/\/$/, '')
      
      return availablePaths.includes(formattedPath)
    })
  }

  return [dashboardMenu, ...filterMenus(navCopy)]
})

const selectedMenuId = ref<number | null>(999999)
const expandedSubMenus = ref<number[]>([])

const currentMenuName = computed(() => {
  const menu = displayNavigation.value.find(m => m.id_menu === selectedMenuId.value)
  return menu ? menu.mn_nm : 'Navigation'
})

const currentSubMenus = computed(() => {
  const menu = displayNavigation.value.find(m => m.id_menu === selectedMenuId.value)
  return menu ? menu.submenu : []
})

function formatPath(path: string) {
  if (!path || path === '-') return '/dashboard'
  return path.startsWith('/') ? path : `/${path}`
}

function isRouteActive(path: string) {
  if (!path || path === '-') return false
  const formatted = formatPath(path)
  return route.path === formatted || route.path.startsWith(`${formatted}/`)
}

function toggleSubMenu(id: number) {
  if (expandedSubMenus.value.includes(id)) {
    expandedSubMenus.value = expandedSubMenus.value.filter(i => i !== id)
  } else {
    expandedSubMenus.value.push(id)
  }
}

const handleMenuClick = (menu: any) => {
  selectedMenuId.value = menu.id_menu
  if (menu.submenu && menu.submenu.length) {
    isSubMenuOpen.value = true
  }
  if (menu.id_menu === 999999) {
    router.push('/dashboard')
  }
}

function handleMenuHover(menu: any) {
  selectedMenuId.value = menu.id_menu
  if (menu.submenu && menu.submenu.length) {
    isSubMenuOpen.value = true
  }
}

const isSubMenuOpen = ref(true)

function toggleSubMenuPanel() {
  isSubMenuOpen.value = !isSubMenuOpen.value
}

function abbreviate(name: string) {
  if (name.length <= 8) return name
  const words = name.split(' ')
  if (words.length > 1) {
    return words.map(w => w.charAt(0).toUpperCase()).join('').slice(0, 3)
  }
  return name.slice(0, 5).toUpperCase()
}

function getMenuIcon(name: string, isActive: boolean, customSize: string = 'w-7 h-7', index: number = 0) {
  const n = name.toLowerCase()
  let icon = ''
  let color = isActive ? 'currentColor' : '#64748b' // Default gray for inactive

  // Define icon paths
  if (n.includes('dashboard')) {
    icon = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />`
  } else if (n.includes('product')) {
    icon = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />`
  } else if (n.includes('payable') || (n.includes('account') && n.includes('pay'))) {
    icon = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />`
  } else if (n.includes('receivable') || (n.includes('account') && n.includes('rec'))) {
    icon = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />`
  } else if (n.includes('human') || n.includes('hr')) {
    icon = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />`
  } else if (n.includes('finance') || n.includes('accounting') || n.includes('fa')) {
    icon = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />`
  } else if (n.includes('produksi')) {
    icon = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86 3.86l-.477 2.387a2 2 0 001.57 2.342l2.387.477a2 2 0 002.342-1.57l.477-2.387a2 2 0 00-.547-1.022zM2.572 15.428a2 2 0 011.022-.547l2.387-.477a6 6 0 013.86 3.86l.477 2.387a2 2 0 01-1.57 2.342l-2.387.477a2 2 0 01-2.342-1.57l-.477-2.387a2 2 0 01.547-1.022z" />`
  } else if (n.includes('warehouse') || n.includes('wm')) {
    icon = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />`
  } else if (n.includes('inventory') || n.includes('im')) {
    icon = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />`
  } else if (n.includes('data') || n.includes('dm')) {
    icon = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8-4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />`
  } else if (n.includes('knowledge') || n.includes('km')) {
    icon = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />`
  } else {
    const fallbacks = [
      `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />`,
      `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 4a2 2 0 114 0v1a2 2 0 11-4 0V4z" />`,
      `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35" />`
    ]
    const fallback = fallbacks[index % fallbacks.length] || ''
    icon = fallback
  }

  return `<svg class="${customSize}" style="color: ${color}" fill="none" stroke="currentColor" viewBox="0 0 24 24">${icon}</svg>`
}

function getProfessionalIcon(menuName: string) {
  const n = (menuName || '').toLowerCase()
  let icon = ''
  
  if (n.includes('dashboard')) {
    icon = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />`
  } else if (n.includes('purchase order')) {
    icon = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />`
  } else if (n.includes('master bom') || n.includes('bom')) {
    icon = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />`
  } else if (n.includes('forecast')) {
    icon = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />`
  } else if (n.includes('real time') || n.includes('order')) {
    icon = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />`
  } else if (n.includes('price')) {
    icon = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />`
  } else if (n.includes('stock opname') && n.includes('set')) {
    icon = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />`
  } else if (n.includes('stock opname')) {
    icon = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8-4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />`
  } else if (n.includes('form loading') || n.includes('loading')) {
    icon = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />`
  } else if (n.includes('kasir')) {
    icon = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />`
  } else if (n.includes('report')) {
    icon = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />`
  } else {
    icon = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />`
  }
  return `<svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">${icon}</svg>`
}

// Update active menu when route changes
watch(() => route.path, () => {
  if (route.path === '/dashboard') {
    selectedMenuId.value = 999999
    return
  }
  for (const menu of displayNavigation.value) {
    const hasMatchingSub = menu.submenu?.some((sub: any) => {
      if (isRouteActive(sub.mn_pth)) return true
      return sub.subsubmenu?.some((ss: any) => isRouteActive(ss.mn_pth))
    })
    
    if (hasMatchingSub) {
      selectedMenuId.value = menu.id_menu
      break
    }
  }
})

onMounted(async () => {
  await fetchProduksiIndex()
  await fetchNavigation()
  
  if (route.path === '/dashboard') {
    selectedMenuId.value = 999999
    return
  }
  
  // Find active menu based on current route
  if (displayNavigation.value.length > 0) {
    let foundMenuId = displayNavigation.value[0].id_menu // Default to first

    for (const menu of displayNavigation.value) {
      const hasMatchingSub = menu.submenu?.some((sub: any) => {
        if (isRouteActive(sub.mn_pth)) return true
        return sub.subsubmenu?.some((ss: any) => isRouteActive(ss.mn_pth))
      })
      
      if (hasMatchingSub) {
        foundMenuId = menu.id_menu
        break
      }
    }
    
    selectedMenuId.value = foundMenuId
    
    // Also expand submenus if active
    const activeSub = displayNavigation.value.find(m => m.id_menu === foundMenuId)
      ?.submenu?.find((sub: any) => sub.subsubmenu?.some((ss: any) => isRouteActive(ss.mn_pth)))
    
    if (activeSub) {
      expandedSubMenus.value.push(activeSub.id_sb_mn)
    }
  }
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

.custom-scrollbar::-webkit-scrollbar { width: 3px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
</style>
