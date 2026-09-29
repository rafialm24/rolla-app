<template>
  <NuxtLayout name="dashboard">
    <div class="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-50 via-gray-100 to-slate-200 p-4 lg:p-8 font-sans relative overflow-hidden">
      <!-- Decorative Background Elements -->
      <div class="absolute top-0 left-0 w-96 h-96 bg-cyan-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div class="absolute top-0 right-0 w-96 h-96 bg-blue-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

      <!-- Header Section -->
      <div class="relative backdrop-blur-xl bg-white/80 rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white mb-8 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <UIcon name="i-heroicons-document-chart-bar" class="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 class="text-2xl font-black text-slate-800 tracking-tight">Master Production Order Primix</h1>
            <p class="text-xs font-semibold text-slate-500 tracking-wide mt-0.5 uppercase">Kelola order produksi secara real-time</p>
          </div>
        </div>
      </div>

      <div class="space-y-8 relative z-10">
        
        <!-- MASTER TABLE CARD -->
        <div class="backdrop-blur-md bg-white/90 rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden transition-all duration-300">
          <div class="bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-100 px-6 py-4 flex justify-between items-center cursor-pointer hover:bg-slate-100/50 transition-colors" @click="isMasterOpen = !isMasterOpen">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center"><UIcon name="i-heroicons-clipboard-document-list" class="w-4 h-4" /></div>
              <h2 class="text-sm font-extrabold text-slate-800 uppercase tracking-widest">Master Production Order List</h2>
            </div>
            <UButton color="gray" variant="ghost" :icon="isMasterOpen ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'" :padded="false" class="transition-transform duration-300" />
          </div>

          <div v-show="isMasterOpen" class="p-6">
            <!-- Filter & Actions -->
            <div class="bg-slate-50/50 border border-slate-100 p-4 rounded-2xl flex flex-col sm:flex-row flex-wrap items-center gap-4 mb-5 shadow-inner">
              <div class="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
                <label class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">TGL:</label>
                <UInput type="date" v-model="filterDate" size="xs" variant="none" :ui="{ base: 'font-bold' }" />
              </div>
              <UButton @click="loadMaster" :loading="isLoadingMaster" size="sm" color="cyan" variant="solid" icon="i-heroicons-magnifying-glass" class="rounded-xl shadow-md shadow-cyan-500/20 font-bold uppercase tracking-wider text-[10px]">
                FIND
              </UButton>
              <div class="sm:ml-auto flex flex-wrap gap-3">
                <UButton @click="printAllMaterial" size="sm" color="amber" variant="solid" icon="i-heroicons-printer" class="rounded-xl shadow-md shadow-amber-500/20 font-bold uppercase tracking-wider text-[10px]">
                  PRINT ALL MATERIAL
                </UButton>
                <UButton @click="printHppArtikel" size="sm" color="indigo" variant="solid" icon="i-heroicons-document-text" class="rounded-xl shadow-md shadow-indigo-500/20 font-bold uppercase tracking-wider text-[10px]">
                  PRINT HPP ARTIKEL
                </UButton>
              </div>
            </div>

            <!-- Master Table -->
            <div class="border border-slate-100 rounded-2xl overflow-hidden shadow-sm bg-white">
              <div class="overflow-x-auto max-h-[500px] custom-scrollbar">
                <table class="w-full text-xs text-left min-w-[1800px]">
                  <thead class="bg-slate-50 border-b border-slate-200 sticky top-0 z-20 shadow-sm">
                    <tr>
                      <th class="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] text-center w-24">Option</th>
                      <th class="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px]">ARTIKEL</th>
                      <th class="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px]">ARTIKEL NAME</th>
                      <th class="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px]">UOM</th>
                      <th class="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] text-right w-24">QTY PROD</th>
                      <th class="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] text-right w-24">QTY GOOD</th>
                      <th class="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] text-right w-24">QTY DEFECT</th>
                      <th class="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] text-right w-24">QTY OTHER</th>
                      <th class="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] text-right">QTY REMAINDER</th>
                      <th class="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] text-right">COST PROD</th>
                      <th class="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px]">TANGGAL START</th>
                      <th class="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px]">TANGGAL END</th>
                      <th class="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px]">TANGGAL EXP</th>
                      <th class="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px]">TANGGAL PO</th>
                      <th class="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px]">TANGGAL PENGERJAAN</th>
                      <th class="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px]">TANGGAL SELESAI</th>
                      <th class="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px]">STATUS PO</th>
                      <th class="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px]">REQUEST BY</th>
                      <th class="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] text-center w-32">ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="isLoadingMaster">
                      <td colspan="19" class="px-4 py-12 text-center text-slate-400"><UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin mx-auto mb-2 text-cyan-500" /><p class="font-semibold text-[10px]">Memuat data...</p></td>
                    </tr>
                    <tr v-else-if="productionOrderList.length === 0">
                      <td colspan="19" class="px-4 py-12 text-center text-slate-400"><UIcon name="i-heroicons-inbox" class="w-8 h-8 mx-auto mb-2 text-slate-300" /><p class="font-semibold text-[10px]">Tidak ada data order produksi.</p></td>
                    </tr>
                    <tr v-else v-for="(row, idx) in productionOrderList" :key="row.id || idx" 
                        class="border-b border-slate-50 hover:bg-slate-50/80 transition-colors whitespace-nowrap" 
                        :class="{'bg-cyan-50/50 shadow-inner': selectedHeaderId === row.id}">
                      <td class="px-2 py-3 text-center flex flex-col gap-1 sm:flex-row sm:gap-1 justify-center">
                        <UButton @click="showDetail(row)" size="2xs" color="indigo" variant="soft" class="font-bold text-[9px] uppercase tracking-wider">Show</UButton>
                        <UButton v-if="row.status == 1 && row.id != 0" @click="printTrx(row)" size="2xs" color="emerald" variant="soft" class="font-bold text-[9px] uppercase tracking-wider">Print</UButton>
                      </td>
                      <td class="px-3 py-3 text-slate-500 font-bold">{{ row.artikel || '-' }}</td>
                      <td class="px-3 py-3 font-extrabold text-slate-700">{{ row.artikel_name || '-' }}</td>
                      <td class="px-3 py-3 text-slate-500 font-bold">{{ row.uom_article || '-' }}</td>
                      <td class="px-3 py-3">
                        <UInput type="number" v-model="row._qty_prod" readonly size="xs" :ui="{ base: 'text-right font-black w-full', rounded: 'rounded-md', color: { white: { outline: 'bg-slate-100' } } }" />
                      </td>
                      <td class="px-3 py-3">
                        <UInput type="number" v-model="row._qty_good" :disabled="row.status != 1" size="xs" :ui="{ base: 'text-right font-black w-full text-emerald-600', rounded: 'rounded-md' }" />
                      </td>
                      <td class="px-3 py-3">
                        <UInput type="number" v-model="row._qty_defect" :disabled="row.status != 1" size="xs" :ui="{ base: 'text-right font-black w-full text-rose-500', rounded: 'rounded-md' }" />
                      </td>
                      <td class="px-3 py-3">
                        <UInput type="number" v-model="row._qty_other" :disabled="row.status != 1" size="xs" :ui="{ base: 'text-right font-black w-full text-amber-500', rounded: 'rounded-md' }" />
                      </td>
                      <td class="px-3 py-3 text-right font-black text-slate-800">{{ formatNumber(row.remainder) }}</td>
                      <td class="px-3 py-3 text-right font-black text-blue-600">{{ formatNumber(row.cost_produksi) }}</td>
                      <td class="px-3 py-3 text-[10px] font-semibold text-slate-500">{{ formatDateTime(row.start_date) }}</td>
                      <td class="px-3 py-3 text-[10px] font-semibold text-slate-500">{{ formatDateTime(row.end_date) }}</td>
                      <td class="px-3 py-3 text-[10px] font-semibold text-rose-500">{{ formatDateTime(row.expried_date) }}</td>
                      <td class="px-3 py-3 text-[10px] font-semibold text-slate-500">{{ formatDateTime(row.create_date) }}</td>
                      <td class="px-3 py-3 text-[10px] font-semibold text-slate-500">{{ formatDateTime(row.progress_date) }}</td>
                      <td class="px-3 py-3 text-[10px] font-semibold text-emerald-600">{{ formatDateTime(row.finish_date) }}</td>
                      <td class="px-3 py-3">
                        <UBadge :color="row.status == 0 ? 'amber' : row.status == 1 ? 'blue' : 'emerald'" variant="subtle" size="xs" class="font-bold tracking-wider uppercase text-[9px]">
                          {{ getStatusText(row.status) }}
                        </UBadge>
                      </td>
                      <td class="px-3 py-3 text-[10px] font-bold text-slate-600">{{ row.usrnm || '-' }}</td>
                      <td class="px-3 py-3 text-center">
                        <UButton @click="handleAction(row)" :disabled="row.status == 2 || isSaving" 
                                size="xs" :color="row.status == 0 ? 'blue' : 'amber'" variant="solid" 
                                class="w-full justify-center font-bold uppercase tracking-wider text-[9px] shadow-sm">
                          {{ getActionText(row.status) }}
                        </UButton>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Pagination Master -->
            <div class="mt-5 flex items-center justify-between bg-slate-50/50 p-3 rounded-xl border border-slate-100">
              <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total: {{ totalProductionOrder }} items</span>
              <div class="flex items-center gap-2">
                <UButton @click="changePageMaster(-1)" :disabled="pageMaster <= 1" size="xs" color="gray" variant="ghost" icon="i-heroicons-chevron-left" />
                <span class="text-[10px] font-bold text-slate-700 mx-2">Page {{ pageMaster }}</span>
                <UButton @click="changePageMaster(1)" :disabled="pageMaster * rowsMaster >= totalProductionOrder" size="xs" color="gray" variant="ghost" icon="i-heroicons-chevron-right" />
              </div>
            </div>
          </div>
        </div>

        <!-- DETAIL TABLE CARD -->
        <div v-if="selectedHeaderId" class="backdrop-blur-md bg-white/90 rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden transition-all duration-300">
          <div class="bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-100 px-6 py-4 flex justify-between items-center cursor-pointer hover:bg-slate-100/50 transition-colors" @click="isDetailOpen = !isDetailOpen">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center"><UIcon name="i-heroicons-queue-list" class="w-4 h-4" /></div>
              <h2 class="text-sm font-extrabold text-slate-800 uppercase tracking-widest">
                Detail <span class="text-indigo-600 ml-1 font-black">#{{ selectedHeaderName }}</span>
              </h2>
            </div>
            <UButton color="gray" variant="ghost" :icon="isDetailOpen ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'" :padded="false" class="transition-transform duration-300" />
          </div>

          <div v-show="isDetailOpen" class="p-6">
            <div class="border border-slate-100 rounded-2xl overflow-hidden shadow-sm bg-white">
              <div class="overflow-x-auto max-h-[400px] custom-scrollbar">
                <table class="w-full text-xs text-left">
                  <thead class="bg-slate-50 border-b border-slate-200 sticky top-0 z-10 shadow-sm">
                    <tr>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px]">FORMULA</th>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px]">KODE PRODUK</th>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px]">NAMA PRODUK</th>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px]">UOM</th>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px] text-right">NETTO</th>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px] text-right">QTY NETTO</th>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px] text-right">PRICE BOM/CHILD</th>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px] text-right">SUB PRICE</th>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px] text-right">SUB COST PRICE</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="isLoadingDetail">
                      <td colspan="9" class="px-4 py-12 text-center text-slate-400"><UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin mx-auto mb-2 text-indigo-500" /><p class="font-semibold text-[10px]">Memuat detail...</p></td>
                    </tr>
                    <tr v-else-if="productionOrderDetailList.length === 0">
                      <td colspan="9" class="px-4 py-12 text-center text-slate-400"><UIcon name="i-heroicons-inbox" class="w-8 h-8 mx-auto mb-2 text-slate-300" /><p class="font-semibold text-[10px]">Tidak ada detail</p></td>
                    </tr>
                    <tr v-else v-for="(row, idx) in productionOrderDetailList" :key="idx" class="border-b border-slate-50 hover:bg-slate-50/80 transition-colors whitespace-nowrap">
                      <td class="px-4 py-3 font-bold text-slate-600">{{ row.choice_num || '-' }}</td>
                      <td class="px-4 py-3 font-bold text-slate-500">{{ row.kode_produk || '-' }}</td>
                      <td class="px-4 py-3 font-extrabold text-slate-700">{{ row.name_produk || '-' }}</td>
                      <td class="px-4 py-3 font-bold text-slate-500">{{ row.uom_komponen || '-' }}</td>
                      <td class="px-4 py-3 text-right font-bold text-slate-600">{{ formatNumber(row.netto) }}</td>
                      <td class="px-4 py-3 text-right font-black text-blue-600 bg-blue-50/30">{{ formatNumber(row.netto_qty_produksi) }}</td>
                      <td class="px-4 py-3 text-right font-medium text-slate-500">{{ formatNumber(row.price_bom) }}</td>
                      <td class="px-4 py-3 text-right font-black text-slate-800">{{ formatNumber(row.sub_price) }}</td>
                      <td class="px-4 py-3 text-right font-black text-indigo-600 bg-indigo-50/30">{{ formatNumber(row.sub_cost_price) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Pagination Detail -->
            <div class="mt-5 flex items-center justify-between bg-slate-50/50 p-3 rounded-xl border border-slate-100">
              <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total: {{ totalProductionOrderDetail }} items</span>
              <div class="flex items-center gap-2">
                <UButton @click="changePageDetail(-1)" :disabled="pageDetail <= 1" size="xs" color="gray" variant="ghost" icon="i-heroicons-chevron-left" />
                <span class="text-[10px] font-bold text-slate-700 mx-2">Page {{ pageDetail }}</span>
                <UButton @click="changePageDetail(1)" :disabled="pageDetail * rowsDetail >= totalProductionOrderDetail" size="xs" color="gray" variant="ghost" icon="i-heroicons-chevron-right" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useProduksi } from '../../composables/useProduksi'
import { useProductionOrder } from '../../composables/useProductionOrder'

const { activeProdId } = useProduksi()
const {
  productionOrderList,
  totalProductionOrder,
  productionOrderDetailList,
  totalProductionOrderDetail,
  isLoadingMaster,
  isLoadingDetail,
  isSaving,
  fetchProductionOrderList,
  fetchProductionOrderDetail,
  actionProduksiArtikel,
  fetchPrintData,
  fetchPrintMaterialData
} = useProductionOrder()

// Toggles
const isMasterOpen = ref(true)
const isDetailOpen = ref(true)

// Formatting
const formatNumber = (val: any) => {
  if (val === null || val === undefined) return '0'
  const num = Number(val)
  if (isNaN(num)) return String(val)
  return num.toLocaleString('id-ID')
}

const formatDateTime = (val: any) => {
  if (!val) return '-'
  const d = new Date(val)
  if (isNaN(d.getTime())) return val
  return d.toLocaleString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

// =====================================
// MASTER LIST
// =====================================
const getLocalToday = () => {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
const filterDate = ref(getLocalToday())
const pageMaster = ref(1)
const rowsMaster = 10

const getStatusText = (status: number) => {
  if (status == 0) return 'On Set'
  if (status == 1) return 'On Progres'
  if (status == 2) return 'Complete'
  return '-'
}

const getStatusClass = (status: number) => {
  if (status == 0) return 'bg-slate-200 text-slate-800'
  if (status == 1) return 'bg-blue-100 text-blue-800'
  if (status == 2) return 'bg-green-100 text-green-800'
  return 'bg-slate-100 text-slate-600'
}

const getActionText = (status: number) => {
  if (status == 0) return 'Start'
  if (status == 1) return 'Progres Finish'
  if (status == 2) return 'Complete'
  return '-'
}

const loadMaster = async () => {
  if (!activeProdId.value) return
  await fetchProductionOrderList(filterDate.value, 1, pageMaster.value, rowsMaster, activeProdId.value)

  // Mapping state for inline edit
  if (productionOrderList.value) {
    for (const row of productionOrderList.value) {
      row._qty_prod = row.qty_produksi || 0
      row._qty_defect = row.defect_qty || 0
      row._qty_other = row.depre_qty || 0
      
      const goodVal = row._qty_prod - row._qty_defect - row._qty_other
      row._qty_good = goodVal < 0 ? 0 : goodVal
    }
  }
}

const changePageMaster = (offset: number) => {
  pageMaster.value += offset
  loadMaster()
}

const handleAction = async (row: any) => {
  if (!activeProdId.value) return
  const q_defect = Number(row._qty_defect || 0)
  const q_prod = Number(row._qty_prod || 0)
  const q_good = Number(row._qty_good || 0)
  const q_other = Number(row._qty_other || 0)
  
  if (q_defect > q_prod) {
    alert('Qty Defect Melebihi Qty Produksi')
    return
  }
  if (q_good > q_prod) {
    alert('Qty Finish Good Melebihi Qty Produksi')
    return
  }
  if (q_defect > q_good && q_good !== 0) {
    alert('Qty Defect Melebihi Qty Finish Good')
    return
  }

  const payload = {
    id: row.id,
    status: row.status,
    qty_defect: q_defect,
    qty_other: q_other,
    qty_remain: q_prod - q_good - q_defect,
    id_prod: activeProdId.value
  }

  const res = await actionProduksiArtikel(payload)
  if (res.success) {
    alert('Action sukses')
    loadMaster()
  } else {
    alert('Action gagal')
  }
}

// =====================================
// PRINT FUNCTIONS
// =====================================
const printTrx = async (row: any) => {
  const data = await fetchPrintData(row.id)
  console.log('Print Trx Data:', data)
  alert('Data print ready (perlu integrasi printjs). Lihat console.')
}

const printAllMaterial = async () => {
  if (!activeProdId.value) return
  const data = await fetchPrintMaterialData(filterDate.value, activeProdId.value)
  console.log('Print All Material Data:', data)
  alert('Data print all material ready (perlu integrasi printjs). Lihat console.')
}

const printHppArtikel = () => {
  // Legacy redirects to an endpoint that exports excel
  const url = `${useRuntimeConfig().public.apiBase || ''}/produksi/mes/report-hpp-artikel?v_prod_id=${activeProdId.value}`
  window.open(url, '_blank')
}

// =====================================
// DETAIL LIST
// =====================================
const selectedHeaderId = ref<number | null>(null)
const selectedHeaderName = ref<string>('')
const pageDetail = ref(1)
const rowsDetail = 10

const showDetail = (row: any) => {
  selectedHeaderId.value = row.id
  selectedHeaderName.value = row.name_produk || row.artikel_name || ''
  pageDetail.value = 1
  loadDetail()
}

const loadDetail = async () => {
  if (!selectedHeaderId.value) return
  await fetchProductionOrderDetail(selectedHeaderId.value, pageDetail.value, rowsDetail)
}

const changePageDetail = (offset: number) => {
  pageDetail.value += offset
  loadDetail()
}

// =====================================
// INIT
// =====================================
onMounted(() => {
  if (activeProdId.value) {
    loadMaster()
  }
})

watch(activeProdId, () => {
  if (activeProdId.value) {
    selectedHeaderId.value = null
    pageMaster.value = 1
    loadMaster()
  }
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { height: 8px; width: 8px; }
.custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
</style>
