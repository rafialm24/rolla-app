<template>
  <NuxtLayout name="dashboard">
    <div class="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-50 via-gray-100 to-slate-200 p-4 lg:p-8 font-sans relative overflow-hidden">
      <!-- Decorative Background Elements -->
      <div class="absolute top-0 left-0 w-96 h-96 bg-blue-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div class="absolute top-0 right-0 w-96 h-96 bg-indigo-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

      <!-- Page Header -->
      <div class="relative backdrop-blur-xl bg-white/80 rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white mb-8 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <UIcon name="i-heroicons-arrow-path-rounded-square" class="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 class="text-2xl font-black text-slate-800 tracking-tight">Mutasi Produksi</h1>
            <p class="text-xs font-semibold text-slate-500 tracking-wide mt-0.5 uppercase">Kelola mutasi item produksi</p>
          </div>
        </div>
        <NuxtLink to="/PROD/invlok" class="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors shadow-sm">
          <UIcon name="i-heroicons-arrow-left" class="w-4 h-4" />
          Kembali ke Inventory Lokasi
        </NuxtLink>
      </div>

      <div class="space-y-6 relative z-10">
        
        <!-- CARD 1: Data Mutasi / Available Items -->
        <div class="backdrop-blur-md bg-white/90 rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden transition-all duration-300 hover:shadow-xl">
          <div class="bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-100 px-6 py-4 flex flex-wrap justify-between items-center gap-4">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                <UIcon name="i-heroicons-clipboard-document-list" class="w-4 h-4" />
              </div>
              <h2 class="text-sm font-extrabold text-slate-800 uppercase tracking-widest">List Item Tersedia</h2>
            </div>
            <UButton 
              @click="handleAddLoading" :disabled="isSaving"
              size="md" color="blue" variant="solid" icon="i-heroicons-inbox-arrow-down"
              class="rounded-xl shadow-md shadow-blue-500/20 font-bold uppercase tracking-widest text-[10px] text-white"
            >
              LOADING QTY SET
            </UButton>
          </div>
          
          <div class="p-6">
            <!-- Search Data Stock -->
            <div class="mb-4">
              <UInput 
                v-model="searchExport" @input="handleSearchExport" 
                placeholder="Cari produk..." 
                icon="i-heroicons-magnifying-glass"
                size="md"
                :ui="{ rounded: 'rounded-xl', base: 'max-w-sm font-semibold' }"
              />
            </div>

            <div class="border border-slate-100 rounded-2xl overflow-hidden shadow-sm bg-white">
              <div class="overflow-x-auto custom-scrollbar">
                <table class="w-full text-xs text-left min-w-[1200px]">
                  <thead class="bg-slate-50/80 backdrop-blur-sm border-b border-slate-100">
                    <tr>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] whitespace-nowrap">Kode Produk</th>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] whitespace-nowrap min-w-[200px]">Nama Produk</th>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] whitespace-nowrap">Kategory</th>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] whitespace-nowrap">UOM</th>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] whitespace-nowrap text-right">Stok</th>
                      <th class="px-4 py-3 font-bold text-blue-600 uppercase tracking-wider text-[9px] whitespace-nowrap text-center bg-blue-50/50">Set Qty Mutasi</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-50">
                    <tr v-if="isLoadingExport">
                      <td colspan="6" class="px-4 py-12 text-center text-slate-400">
                        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin mx-auto mb-2 text-blue-500" />
                        <p class="font-semibold text-[10px]">Memuat data...</p>
                      </td>
                    </tr>
                    <tr v-else-if="exportDetails.length === 0">
                      <td colspan="6" class="px-4 py-12 text-center text-slate-400">
                        <UIcon name="i-heroicons-inbox" class="w-8 h-8 mx-auto mb-2 text-slate-300" />
                        <p class="font-semibold text-[10px]">Tidak ada item tersedia</p>
                      </td>
                    </tr>
                    <tr v-else v-for="(item, idx) in exportDetails" :key="item.kode_produk || item.id || idx" class="hover:bg-blue-50/30 transition-colors">
                      <td class="px-4 py-3">
                        <UBadge color="gray" variant="soft" size="xs" class="font-black">
                          {{ item.kode_produk || item.kode || '-' }}
                        </UBadge>
                      </td>
                      <td class="px-4 py-3 font-extrabold text-slate-800">{{ item.name_produk || item.nama_produk || item.nama || '-' }}</td>
                      <td class="px-4 py-3 font-bold text-slate-600">{{ item.name_prod_cate || item.kategori || '-' }}</td>
                      <td class="px-4 py-3 font-bold text-slate-600">{{ item.uom_dc }}</td>
                      <td class="px-4 py-3 text-right font-black text-slate-800 text-sm">{{ item.qty_big }}</td>
                      <td class="px-4 py-2 text-center bg-blue-50/50">
                        <UInput 
                          type="number" 
                          v-model.number="item._qtyset"
                          size="sm"
                          class="w-24 mx-auto"
                          :ui="{ base: 'text-right font-black', rounded: 'rounded-lg' }"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <!-- Pagination Export -->
              <div class="bg-slate-50/50 border-t border-slate-100 p-4 flex flex-wrap justify-between items-center gap-4">
                <div class="flex items-center gap-2">
                  <span class="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Rows:</span>
                  <USelect 
                    v-model="rowsExport" @change="handleRowsChangeExport" 
                    :options="[{label:'10', value:10}, {label:'20', value:20}, {label:'50', value:50}, {label:'100', value:100}]"
                    size="xs" :ui="{ rounded: 'rounded-md', base: 'font-semibold' }"
                  />
                </div>
                
                <div class="flex items-center gap-1">
                  <UButton @click="goToPageExport(1)" :disabled="pageExport === 1" size="2xs" color="gray" variant="ghost" icon="i-heroicons-chevron-double-left" />
                  <UButton @click="changePageExport(-1)" :disabled="pageExport === 1" size="2xs" color="gray" variant="ghost" icon="i-heroicons-chevron-left" />
                  
                  <div class="flex items-center gap-2 mx-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    Page
                    <UInput type="number" v-model.lazy="pageExport" @change="loadExportDetails" size="2xs" class="w-12 text-center" :ui="{ base: 'text-center font-bold' }" />
                    of <span class="text-slate-800">{{ totalPagesExport }}</span>
                  </div>
                  
                  <UButton @click="changePageExport(1)" :disabled="pageExport >= totalPagesExport" size="2xs" color="gray" variant="ghost" icon="i-heroicons-chevron-right" />
                  <UButton @click="goToPageExport(totalPagesExport)" :disabled="pageExport >= totalPagesExport" size="2xs" color="gray" variant="ghost" icon="i-heroicons-chevron-double-right" />
                  
                  <UButton @click="loadExportDetails" size="xs" color="gray" variant="soft" icon="i-heroicons-arrow-path" class="ml-2 rounded-lg" title="Refresh" />
                </div>
                
                <div class="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                  Menampilkan {{ (pageExport - 1) * rowsExport + 1 }} - {{ Math.min(pageExport * rowsExport, totalExport) }} dari {{ totalExport }} items
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- CARD 2: Data Loading Mutasi -->
        <div class="backdrop-blur-md bg-white/90 rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden transition-all duration-300 hover:shadow-xl">
          <div class="bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-100 px-6 py-4 flex flex-wrap justify-between items-center gap-4">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <UIcon name="i-heroicons-truck" class="w-4 h-4" />
              </div>
              <h2 class="text-sm font-extrabold text-slate-800 uppercase tracking-widest">List Item Mutasi (On Loading)</h2>
            </div>
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-2">
                <span class="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Store Tujuan:</span>
                <UInput v-model="storeId" type="number" placeholder="ID Store" size="md" :ui="{ rounded: 'rounded-xl', base: 'font-semibold w-24' }" />
              </div>
              <div class="flex items-center gap-2">
                <span class="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Tgl Mutasi:</span>
                <UInput v-model="mutasiDate" type="date" size="md" :ui="{ rounded: 'rounded-xl', base: 'font-semibold' }" />
              </div>
              <UButton 
                @click="handleDeleteAll" :disabled="isSaving || loadingDetails.length === 0" 
                size="md" color="red" variant="soft" icon="i-heroicons-trash"
                class="rounded-xl font-bold uppercase tracking-widest text-[10px]"
              >
                Hapus Semua
              </UButton>
              <UButton 
                @click="handlePosting" :disabled="isSaving" 
                size="md" color="indigo" variant="solid" icon="i-heroicons-paper-airplane"
                class="rounded-xl shadow-md shadow-indigo-500/20 font-bold uppercase tracking-widest text-[10px] text-white"
              >
                POSTING MUTASI
              </UButton>
            </div>
          </div>
          
          <div class="p-6">
            <div class="border border-slate-100 rounded-2xl overflow-hidden shadow-sm bg-white">
              <div class="overflow-x-auto custom-scrollbar">
                <table class="text-xs text-left table-auto">
                  <thead class="bg-slate-50/80 backdrop-blur-sm border-b border-slate-100">
                    <tr>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] w-20">Aksi</th>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] w-32">Kode Produk</th>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] w-64">Nama Produk</th>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] text-left w-20">Qty</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-50">
                    <tr v-if="isLoadingLoading">
                      <td colspan="4" class="px-4 py-12 text-center text-slate-400">
                        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin mx-auto mb-2 text-indigo-500" />
                        <p class="font-semibold text-[10px]">Memuat data loading mutasi...</p>
                      </td>
                    </tr>
                    <tr v-else-if="loadingDetails.length === 0">
                      <td colspan="4" class="px-4 py-12 text-center text-slate-400">
                        <UIcon name="i-heroicons-inbox" class="w-8 h-8 mx-auto mb-2 text-slate-300" />
                        <p class="font-semibold text-[10px]">Belum ada item loading mutasi</p>
                      </td>
                    </tr>
                    <tr v-else v-for="load in loadingDetails" :key="load.id || load.kode_produk" class="hover:bg-red-50/30 transition-colors">
                      <td class="px-4 py-3">
                        <UButton @click="handleDeleteItem(load.id)" :disabled="isSaving" size="2xs" color="red" variant="soft" icon="i-heroicons-trash" class="font-bold text-[9px] uppercase tracking-wider" />
                      </td>
                      <td class="px-4 py-3">
                        <UBadge color="gray" variant="soft" size="xs" class="font-black">
                          {{ load.kode_product || load.kode_produk || '-' }}
                        </UBadge>
                      </td>
                      <td class="px-4 py-3 font-extrabold text-slate-800">{{ load.name_produk || load.nama_produk || '-' }}</td>
                      <td class="px-4 py-3 text-left font-black text-indigo-600 text-sm">{{ load.qty || load.qtyset || 0 }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useMutasiProduksi } from '../../composables/useMutasiProduksi'
import { useProduksi } from '../../composables/useProduksi'

const { activeProdId } = useProduksi()

const {
  exportDetails,
  loadingDetails,
  totalExport,
  isLoadingExport,
  isLoadingLoading,
  isSaving,
  fetchExportDetails,
  fetchLoadingExportDetails,
  saveLoadingItemMutasi,
  postLoadingMutasi,
  deleteLoadingItemMutasi
} = useMutasiProduksi()

// Pagination State
const searchExport = ref('')
const pageExport = ref(1)
const rowsExport = ref(10)
const totalPagesExport = computed(() => Math.ceil(totalExport.value / rowsExport.value) || 1)
let exportTimeout: any = null

const mutasiDate = ref('')
const storeId = ref<number | null>(null)

const initPage = async () => {
  await fetchLoadingExportDetails()
  await loadExportDetails()
}

onMounted(async () => {
  if (activeProdId.value) {
    await initPage()
  }
})

watch(activeProdId, async (newVal) => {
  if (newVal) {
    await initPage()
  }
})

const formatNumber = (num: number) => {
  if (!num) return '0'
  return new Intl.NumberFormat('id-ID').format(num)
}

const loadExportDetails = async () => {
  await fetchExportDetails(searchExport.value, pageExport.value, rowsExport.value)
  if (exportDetails.value && exportDetails.value.length > 0) {
    for (const item of exportDetails.value) {
      item._qtyset = 0
    }
  }
}

const handleSearchExport = () => {
  if (exportTimeout) clearTimeout(exportTimeout)
  exportTimeout = setTimeout(() => {
    pageExport.value = 1
    loadExportDetails()
  }, 500)
}

const changePageExport = (offset: number) => {
  pageExport.value += offset
  loadExportDetails()
}

const goToPageExport = (page: number) => {
  pageExport.value = page
  loadExportDetails()
}

const handleRowsChangeExport = () => {
  pageExport.value = 1
  loadExportDetails()
}

const handleAddLoading = async () => {
  const itemsToSave = exportDetails.value
    .filter(item => item._qtyset > 0)
    .map(item => ({
      id_item: item.id_item || item.id_produk || item.id || 0,
      qtyset: item._qtyset
    }))
    
  if (itemsToSave.length === 0) {
    alert("Tidak ada item yang diisi.")
    return
  }
  
  const res = await saveLoadingItemMutasi(itemsToSave)
  if (res.success) {
    await loadExportDetails()
    await fetchLoadingExportDetails()
  } else {
    alert("Gagal menyimpan data.")
  }
}

const handlePosting = async () => {
  if (!mutasiDate.value) {
    alert("Tanggal Mutasi tidak boleh kosong!")
    return
  }
  if (!storeId.value) {
    alert("Store Tujuan tidak boleh kosong!")
    return
  }
  
  const res = await postLoadingMutasi(storeId.value, mutasiDate.value)
  if (res.success) {
    alert("Berhasil di-posting!")
    await loadExportDetails()
    await fetchLoadingExportDetails()
    mutasiDate.value = ''
    storeId.value = null
  } else {
    alert("Gagal posting.")
  }
}

// Hapus item tertentu (action = 1)
const handleDeleteItem = async (id: number) => {
  if (!id) return
  if (!confirm('Hapus item ini dari loading mutasi?')) return
  const res = await deleteLoadingItemMutasi(id, 1)
  if (res.success) {
    await fetchLoadingExportDetails()
  } else {
    alert('Gagal menghapus item.')
  }
}

// Hapus semua item draft (action = 2)
const handleDeleteAll = async () => {
  if (loadingDetails.value.length === 0) return
  if (!confirm('Hapus semua item loading mutasi yang belum diposting?')) return
  const res = await deleteLoadingItemMutasi(0, 2)
  if (res.success) {
    await fetchLoadingExportDetails()
  } else {
    alert('Gagal menghapus semua item.')
  }
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
