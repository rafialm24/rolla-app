<template>
  <NuxtLayout name="dashboard">
    <div class="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-50 via-gray-100 to-slate-200 p-4 lg:p-8 font-sans relative overflow-hidden">
      <!-- Decorative Background Elements -->
      <div class="absolute top-0 left-0 w-96 h-96 bg-amber-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div class="absolute top-0 right-0 w-96 h-96 bg-orange-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

      <!-- Top Header (Glassmorphism) -->
      <div class="relative backdrop-blur-xl bg-white/80 rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white mb-8 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
            <UIcon name="i-heroicons-bolt" class="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 class="text-2xl font-black text-slate-800 tracking-tight">Real Time Order</h1>
            <p class="text-xs font-semibold text-slate-500 tracking-wide mt-0.5 uppercase">Kelola antrean order per store / DC</p>
          </div>
        </div>
      </div>

      <!-- MASTER VIEW -->
      <div class="relative z-10 pb-12">
        <div class="backdrop-blur-md bg-white/90 rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden transition-all duration-300 hover:shadow-xl">
          <div class="bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-100 px-6 py-4">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center"><UIcon name="i-heroicons-building-storefront" class="w-4 h-4" /></div>
              <h2 class="text-sm font-extrabold text-slate-800 uppercase tracking-widest">Master Real Time Order</h2>
            </div>
          </div>
          
          <div class="p-6">
            <!-- Search & Filter -->
            <div class="mb-5">
              <UInput v-model="searchHeader" @input="handleSearchHeader" icon="i-heroicons-magnifying-glass" placeholder="Cari store..." size="md" :ui="{ base: 'w-full sm:w-72 font-semibold text-slate-700', rounded: 'rounded-xl', color: { white: { outline: 'ring-1 ring-slate-200 focus:ring-2 focus:ring-amber-500' } } }" />
            </div>
            
            <div class="border border-slate-100 rounded-2xl overflow-hidden shadow-sm bg-white">
              <div class="overflow-x-auto custom-scrollbar">
                <table class="w-full text-sm">
                  <thead class="bg-slate-50/80 backdrop-blur-sm border-b border-slate-100">
                    <tr>
                      <th class="px-4 py-3 text-center font-bold text-slate-500 uppercase tracking-wider text-[10px] w-24">Action</th>
                      <th class="px-4 py-3 text-left font-bold text-slate-500 uppercase tracking-wider text-[10px]">Kode DC</th>
                      <th class="px-4 py-3 text-left font-bold text-slate-500 uppercase tracking-wider text-[10px]">Nama DC</th>
                      <th class="px-4 py-3 text-left font-bold text-slate-500 uppercase tracking-wider text-[10px]">Kode Store</th>
                      <th class="px-4 py-3 text-left font-bold text-slate-500 uppercase tracking-wider text-[10px]">Nama Store</th>
                      <th class="px-4 py-3 text-left font-bold text-slate-500 uppercase tracking-wider text-[10px]">Area DC</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="isLoadingHeader">
                      <td colspan="6" class="px-4 py-12 text-center text-slate-400"><UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin mx-auto mb-2 text-amber-500" /><p class="font-semibold text-xs">Memuat data...</p></td>
                    </tr>
                    <tr v-else-if="headerList.length === 0">
                      <td colspan="6" class="px-4 py-12 text-center text-slate-400"><UIcon name="i-heroicons-inbox" class="w-8 h-8 mx-auto mb-2 text-slate-300" /><p class="font-semibold text-xs">Tidak ada data</p></td>
                    </tr>
                    <tr v-else v-for="h in headerList" :key="h.id_store" class="border-b border-slate-50 hover:bg-amber-50/50 transition-colors group cursor-default">
                      <td class="px-4 py-3 text-center">
                        <UButton @click="selectStore(h)" size="xs" color="amber" variant="solid" icon="i-heroicons-arrow-right-circle" class="font-black tracking-wider uppercase text-[9px] shadow-sm shadow-amber-500/20 rounded-lg hover:-translate-y-0.5 transition-transform">
                          PROSES
                        </UButton>
                      </td>
                      <td class="px-4 py-3 text-slate-500 text-xs font-bold">{{ h.kode_prod }}</td>
                      <td class="px-4 py-3 font-extrabold text-slate-700">{{ h.name_prod }}</td>
                      <td class="px-4 py-3 text-slate-500 text-xs font-bold">{{ h.kode_store }}</td>
                      <td class="px-4 py-3 font-extrabold text-slate-800">{{ h.name_store }}</td>
                      <td class="px-4 py-3 text-slate-500 font-medium text-xs">{{ h.area_desc }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <!-- Pagination Master -->
            <div class="mt-5 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
              <div class="flex items-center gap-3">
                <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Rows per page:</span>
                <USelect v-model="rowsHeader" :options="[{label:'10', value:10},{label:'20', value:20},{label:'30', value:30},{label:'40', value:40},{label:'50', value:50}]" @change="handleRowsChangeHeader" size="sm" :ui="{ rounded: 'rounded-lg' }" />
              </div>
              <div class="flex items-center gap-2">
                <UButton @click="goToPageHeader(1)" :disabled="pageHeader === 1" size="xs" color="gray" variant="ghost" icon="i-heroicons-chevron-double-left" />
                <UButton @click="changePageHeader(-1)" :disabled="pageHeader === 1" size="xs" color="gray" variant="ghost" icon="i-heroicons-chevron-left" />
                
                <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 flex items-center gap-2">
                  Page 
                  <UInput type="number" v-model.lazy="pageHeader" @change="loadHeader" size="2xs" :ui="{ base: 'w-12 text-center font-bold', rounded: 'rounded-md' }" /> 
                  of {{ totalPagesHeader }}
                </span>
                
                <UButton @click="changePageHeader(1)" :disabled="pageHeader >= totalPagesHeader" size="xs" color="gray" variant="ghost" icon="i-heroicons-chevron-right" />
                <UButton @click="goToPageHeader(totalPagesHeader)" :disabled="pageHeader >= totalPagesHeader" size="xs" color="gray" variant="ghost" icon="i-heroicons-chevron-double-right" />
                <div class="w-px h-4 bg-slate-300 mx-1"></div>
                <UButton @click="loadHeader" size="xs" color="amber" variant="ghost" icon="i-heroicons-arrow-path" title="Refresh" />
              </div>
              <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Showing {{ (pageHeader - 1) * rowsHeader + 1 }} - {{ Math.min(pageHeader * rowsHeader, totalHeader) }} of {{ totalHeader }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useRealTimeOrder } from '../../composables/useRealTimeOrder'

const router = useRouter()
const {
  headerList,
  totalHeader,
  isLoadingHeader,
  fetchHeaderList
} = useRealTimeOrder()

// Pagination State
const searchHeader = ref('')
const pageHeader = ref(1)
const rowsHeader = ref(10)
const totalPagesHeader = computed(() => Math.ceil(totalHeader.value / rowsHeader.value) || 1)

let headerTimeout: any = null

onMounted(() => {
  loadHeader()
})

const loadHeader = async () => {
  await fetchHeaderList(searchHeader.value, pageHeader.value, rowsHeader.value)
}

const handleSearchHeader = () => {
  if (headerTimeout) clearTimeout(headerTimeout)
  headerTimeout = setTimeout(() => {
    pageHeader.value = 1
    loadHeader()
  }, 500)
}

const changePageHeader = (offset: number) => {
  pageHeader.value += offset
  loadHeader()
}

const goToPageHeader = (page: number) => {
  pageHeader.value = page
  loadHeader()
}

const handleRowsChangeHeader = () => {
  pageHeader.value = 1
  loadHeader()
}

const selectStore = (store: any) => {
  const storeId = store.id_store || store.id || store.store_id || store.id_dc || 0
  if (!storeId) {
    console.error("COULD NOT FIND STORE ID IN:", store)
    alert("Gagal: ID Store tidak ditemukan!")
    return
  }
  
  // Navigate to listorder view
  router.push({
    path: '/PROD/listorder',
    query: {
      id_store: storeId,
      name_store: store.name_store
    }
  })
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9; 
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1; 
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8; 
}
</style>
