<template>
  <NuxtLayout name="dashboard">
    <div class="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-50 via-gray-100 to-slate-200 p-4 lg:p-8 font-sans relative overflow-hidden">
      <!-- Decorative Background Elements -->
      <div class="absolute top-0 left-0 w-96 h-96 bg-blue-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div class="absolute top-0 right-0 w-96 h-96 bg-indigo-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

      <!-- Header Section -->
      <div class="relative backdrop-blur-xl bg-white/80 rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white mb-8 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 z-10">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <UIcon name="i-heroicons-truck" class="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 class="text-2xl font-black text-slate-800 tracking-tight">Form Loading Produksi</h1>
            <p class="text-xs font-semibold text-slate-500 tracking-wide mt-0.5 uppercase">Kelola Data Loading Produksi</p>
          </div>
        </div>
      </div>

      <!-- Filter Section -->
      <div class="relative backdrop-blur-md bg-white/90 rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-visible flex flex-col mb-6 z-30">
        <div class="bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-100 px-6 py-4 flex items-center gap-3 rounded-t-[2rem]">
          <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><UIcon name="i-heroicons-funnel" class="w-4 h-4" /></div>
          <h3 class="text-sm font-extrabold text-slate-800 uppercase tracking-widest">Filter Data</h3>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Kategori</label>
              <USelectMenu v-model="filterKategori" :options="kategoriOptions" multiple placeholder="-- Select Kategori --" value-attribute="id" option-attribute="name_prod_cate" :ui="{ rounded: 'rounded-xl' }" />
            </div>
            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Store</label>
              <USelectMenu v-model="filterStore" :options="storeOptions" multiple placeholder="-- Select Store --" value-attribute="id" option-attribute="display_name" searchable searchable-placeholder="Search Store..." :ui="{ rounded: 'rounded-xl' }" />
            </div>
            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Qty Type</label>
              <USelect v-model="filterQtyType" :options="qtyTypeOptions" placeholder="-- Optional --" value-attribute="id" option-attribute="text" :ui="{ rounded: 'rounded-xl' }" />
            </div>
            <div class="flex items-end gap-3">
              <UButton @click="loadData" :loading="isLoading" size="md" color="blue" variant="solid" icon="i-heroicons-magnifying-glass" class="rounded-xl shadow-md shadow-blue-500/20 font-bold uppercase tracking-wider text-[10px] flex-1 justify-center">FIND</UButton>
              <UButton @click="exportGrid" size="md" color="indigo" variant="soft" icon="i-heroicons-printer" class="rounded-xl font-bold uppercase tracking-wider text-[10px] flex-1 justify-center">PRINT</UButton>
            </div>
          </div>
        </div>
      </div>

      <!-- DataGrid Section -->
      <div class="relative backdrop-blur-md bg-white/90 rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden flex flex-col mb-6 z-10">
        <div class="bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-100 px-6 py-4 flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center"><UIcon name="i-heroicons-table-cells" class="w-4 h-4" /></div>
          <h3 class="text-sm font-extrabold text-slate-800 uppercase tracking-widest">Load Data</h3>
        </div>
        <div class="p-6">
          <div class="border border-slate-100 rounded-2xl overflow-hidden shadow-sm bg-white">
            <div class="overflow-x-auto custom-scrollbar max-h-[500px]">
              <table class="w-full text-sm">
                <thead class="bg-slate-50/80 backdrop-blur-sm border-b border-slate-100 sticky top-0 z-10">
                  <tr>
                    <th class="px-4 py-3 text-left font-bold text-slate-500 uppercase tracking-wider text-[10px] whitespace-nowrap sticky left-0 bg-slate-50 z-20">Kode Produk</th>
                    <th class="px-4 py-3 text-left font-bold text-slate-500 uppercase tracking-wider text-[10px] whitespace-nowrap sticky left-[120px] bg-slate-50 z-20">Nama Produk</th>
                    <th class="px-4 py-3 text-left font-bold text-slate-500 uppercase tracking-wider text-[10px] whitespace-nowrap">Brand Produk</th>
                    <th class="px-4 py-3 text-center font-bold text-slate-500 uppercase tracking-wider text-[10px] whitespace-nowrap">UOM</th>
                    <th class="px-4 py-3 text-center font-bold text-slate-500 uppercase tracking-wider text-[10px] whitespace-nowrap">Ket Qty</th>
                    <th class="px-4 py-3 text-right font-bold text-slate-500 uppercase tracking-wider text-[10px] whitespace-nowrap w-32">Total Order</th>
                    
                    <!-- Dynamic Headers for Stores -->
                    <th v-for="(storeCode, idx) in gridHeaders" :key="idx" class="px-4 py-3 text-right font-bold text-slate-500 uppercase tracking-wider text-[10px] whitespace-nowrap min-w-[100px]">
                      {{ storeCode }}
                    </th>
                    
                    <th class="px-4 py-3 text-right font-bold text-slate-500 uppercase tracking-wider text-[10px] whitespace-nowrap">Total</th>
                    <th class="px-4 py-3 text-right font-bold text-slate-500 uppercase tracking-wider text-[10px] whitespace-nowrap">Avg Sale</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="isLoading">
                    <td :colspan="6 + gridHeaders.length + 2" class="px-4 py-12 text-center text-slate-400">
                      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin mx-auto mb-2 text-blue-500" />
                      <p class="font-semibold text-xs">Memuat data...</p>
                    </td>
                  </tr>
                  <tr v-else-if="gridData.length === 0">
                    <td :colspan="6 + gridHeaders.length + 2" class="px-4 py-12 text-center text-slate-400">
                      <UIcon name="i-heroicons-inbox" class="w-8 h-8 mx-auto mb-2 text-slate-300" />
                      <p class="font-semibold text-xs">Tidak ada data. Silahkan filter dan klik FIND.</p>
                    </td>
                  </tr>
                  <tr v-else v-for="item in gridData" :key="item.id" class="border-b border-slate-50 hover:bg-blue-50/50 transition-colors">
                    <td class="px-4 py-3 text-slate-500 text-xs font-bold whitespace-nowrap sticky left-0 bg-white group-hover:bg-blue-50/50 z-10">{{ item.kode_product || item.kode_produk }}</td>
                    <td class="px-4 py-3 font-extrabold text-slate-700 whitespace-nowrap sticky left-[120px] bg-white group-hover:bg-blue-50/50 z-10">{{ item.name || item.name_produk }}</td>
                    <td class="px-4 py-3 text-slate-500 text-xs font-medium whitespace-nowrap">{{ item.kategory || item.name_prod_cate }}</td>
                    <td class="px-4 py-3 text-slate-500 text-xs font-bold text-center whitespace-nowrap">{{ item.name_prod_uom || item.uom }}</td>
                    <td class="px-4 py-3 text-slate-500 text-xs font-medium text-center whitespace-nowrap">{{ item.ket_qty }}</td>
                    <td class="px-4 py-2">
                      <UInput type="number" v-model.number="item.TotalOrder" size="sm" :ui="{ base: 'text-right font-bold w-20 ml-auto' }" />
                    </td>
                    
                    <!-- Dynamic Data for Stores -->
                    <td v-for="(storeCode, idx) in gridHeaders" :key="'data-'+idx" class="px-4 py-3 text-slate-700 text-xs font-bold text-right whitespace-nowrap">
                      {{ formatComma(item[storeCode] || '0 ; 0') }}
                    </td>
                    
                    <td class="px-4 py-3 text-emerald-600 text-xs font-black text-right whitespace-nowrap">{{ formatComma(item.Totalpo || 0) }}</td>
                    <td class="px-4 py-3 text-blue-600 text-xs font-bold text-right whitespace-nowrap">{{ formatComma(item.Totalsale || 0) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Section -->
      <div class="relative backdrop-blur-md bg-white/90 rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-visible flex flex-col z-20">
        <div class="p-6">
          <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div class="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Formula</label>
                <USelect v-model="filterFormula" :options="formulaOptions" placeholder="-- Optional --" value-attribute="id" option-attribute="text" :ui="{ rounded: 'rounded-xl' }" />
              </div>
              <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">SPK Date</label>
                <UInput type="date" v-model="filterSpkDate" :ui="{ rounded: 'rounded-xl' }" />
              </div>
            </div>
            <div class="flex gap-3">
              <UButton @click="handleCreateSpk" :loading="isSaving" :disabled="gridData.length === 0" size="lg" color="emerald" variant="solid" icon="i-heroicons-document-check" class="rounded-xl shadow-md shadow-emerald-500/20 font-bold uppercase tracking-wider text-xs px-8">Create Produksi Order</UButton>
            </div>
          </div>
        </div>
      </div>

    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useFormLoadingProduksi } from '~/composables/useFormLoadingProduksi'
import { useProduksi } from '~/composables/useProduksi'

const {
  kategoriOptions, storeOptions, gridHeaders, gridData, isLoading, isSaving,
  fetchComboKategori, fetchComboStore, fetchGridHeaders, fetchGridData, saveProduksiOrder
} = useFormLoadingProduksi()

const { activeProdId } = useProduksi()

// Filter States
const filterKategori = ref<number[]>([])
const filterStore = ref<number[]>([])
const filterQtyType = ref<number | ''>('')
const filterFormula = ref<number | ''>('')

const today = new Date().toISOString().split('T')[0]
const filterSpkDate = ref(today)

// Options
const qtyTypeOptions = ref([
  { id: 1, text: 'Min - Max' },
  { id: 2, text: 'Fluktuasi' }
])

const formulaOptions = ref([
  { id: 1, text: 'Formula 1' },
  { id: 2, text: 'Formula 2' }
])

// Helpers
const formatComma = (val: number | string) => {
  if (!val && val !== 0) return ''
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

// No longer needed: getDynamicHeader and getDynamicValue

const exportGrid = () => {
  if (gridData.value.length === 0) {
    alert('Tidak ada data untuk di-print/export')
    return
  }
  alert('Export to Excel logic here (To be implemented using print-js or xlsx)')
}

const loadData = async () => {
  const kategoryParam = filterKategori.value.length > 0 ? filterKategori.value.join(',') : '-2'
  const tokoParam = filterStore.value.length > 0 ? filterStore.value.join(',') : '-1'
  const qtyTypeParam = filterQtyType.value ? String(filterQtyType.value) : '-3'

  await fetchGridHeaders(kategoryParam, tokoParam)
  await fetchGridData(kategoryParam, tokoParam, qtyTypeParam)
}

const handleCreateSpk = async () => {
  // Ambil item yang quantity total order nya > 0
  const itemsToSave = gridData.value.filter(item => Number(item.TotalOrder) > 0).map(item => ({
    id: item.id,
    id_item: item.id,
    qtyset: item.TotalOrder
  }))

  if (itemsToSave.length === 0) {
    alert('Tidak ada item dengan Total Order lebih dari 0.')
    return
  }

  if (confirm(`Anda yakin ingin membuat SPK untuk ${itemsToSave.length} item?`)) {
    const res = await saveProduksiOrder(itemsToSave, filterSpkDate.value)
    if (res.success) {
      alert(`Berhasil membuat ${res.successCount} Produksi Order!`)
      loadData()
    } else {
      alert(`Berhasil ${res.successCount}, Gagal ${res.failCount}.`)
      loadData()
    }
  }
}

watch(() => activeProdId.value, () => {
  fetchComboKategori()
  fetchComboStore()
  gridData.value = []
  gridHeaders.value = []
})

onMounted(() => {
  fetchComboKategori()
  fetchComboStore()
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  height: 8px;
  width: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
