<template>
  <NuxtLayout name="dashboard">
    <div class="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-50 via-gray-100 to-slate-200 p-4 lg:p-8 font-sans relative overflow-hidden">
      <!-- Decorative Background Elements -->
      <div class="absolute top-0 left-0 w-96 h-96 bg-blue-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div class="absolute top-0 right-0 w-96 h-96 bg-indigo-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

      <!-- Header Section -->
      <div class="relative backdrop-blur-xl bg-white/80 rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white mb-8 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <UIcon name="i-heroicons-document-text" class="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 class="text-2xl font-black text-slate-800 tracking-tight">Surat Perintah Kerja</h1>
            <p class="text-xs font-semibold text-slate-500 tracking-wide mt-0.5 uppercase">Kelola Kebutuhan Material Detail</p>
          </div>
        </div>
        
        <div class="flex flex-wrap items-center gap-3 bg-white/50 p-2 rounded-2xl border border-slate-100 shadow-inner">
          <div class="flex items-center gap-2 px-2">
            <span class="text-xs font-bold text-slate-500 uppercase tracking-widest">SPK Date:</span>
            <UInput type="date" v-model="spkDate" size="sm" :ui="{ rounded: 'rounded-xl', base: 'font-semibold' }" />
          </div>
          <div class="w-px h-6 bg-slate-300 mx-1"></div>
          <UButton @click="loadPremix" :loading="isLoadingPremix" size="sm" color="rose" variant="solid" icon="i-heroicons-arrow-path" class="rounded-xl shadow-md shadow-rose-500/20 font-bold uppercase tracking-wider text-[10px]">Get Data</UButton>
          <UButton @click="handlePrint(1)" size="sm" color="blue" variant="soft" icon="i-heroicons-printer" class="rounded-xl font-bold uppercase tracking-wider text-[10px]">Print Premix</UButton>
          <UButton @click="handlePrint(2)" size="sm" color="blue" variant="soft" icon="i-heroicons-printer" class="rounded-xl font-bold uppercase tracking-wider text-[10px]">Print SM</UButton>
          <UButton @click="handleOrder" :loading="isSaving" size="sm" color="emerald" variant="solid" icon="i-heroicons-shopping-cart" class="rounded-xl shadow-md shadow-emerald-500/20 font-bold uppercase tracking-wider text-[10px]">Order</UButton>
        </div>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-12 gap-6 relative z-10">
        
        <!-- DATA PREMIX (LEFT) -->
        <div class="xl:col-span-5 backdrop-blur-md bg-white/90 rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden flex flex-col">
          <div class="bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-100 px-6 py-4 flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><UIcon name="i-heroicons-cube" class="w-4 h-4" /></div>
            <h3 class="text-sm font-extrabold text-slate-800 uppercase tracking-widest">List SPK Non Premix</h3>
          </div>
          
          <div class="p-6 flex-1 flex flex-col">
            <div class="border border-slate-100 rounded-2xl overflow-hidden shadow-sm bg-white flex-1 min-h-[300px] flex flex-col">
              <div class="overflow-auto custom-scrollbar flex-1">
                <table class="w-full text-sm text-left relative">
                  <thead class="bg-slate-50 border-b border-slate-200 sticky top-0 z-20 shadow-sm">
                    <tr>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px] whitespace-nowrap">PO Number</th>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px]">BOM</th>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px] whitespace-nowrap">SPK Date</th>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Kode Produk</th>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Nama Produk</th>
                      <th class="px-4 py-3 text-right font-bold text-slate-500 uppercase tracking-wider text-[10px] whitespace-nowrap">Qty Order</th>
                      <th class="px-4 py-3 text-center font-bold text-slate-500 uppercase tracking-wider text-[10px] w-24">Qty Set</th>
                      <th class="px-4 py-3 text-center font-bold text-slate-500 uppercase tracking-wider text-[10px] w-40">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="isLoadingPremix">
                      <td colspan="8" class="px-4 py-12 text-center text-slate-400"><UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin mx-auto mb-2 text-rose-500" /><p class="font-semibold text-[10px]">Memuat data...</p></td>
                    </tr>
                    <tr v-else-if="premixList.length === 0">
                      <td colspan="8" class="px-4 py-12 text-center text-slate-400"><UIcon name="i-heroicons-inbox" class="w-8 h-8 mx-auto mb-2 text-slate-300" /><p class="font-semibold text-[10px]">Tidak ada data</p></td>
                    </tr>
                    <tr v-else v-for="item in premixList" :key="item.id" 
                        @click="selectPremix(item)" 
                        :class="['border-b border-slate-50 cursor-pointer transition-colors', selectedPremix?.id === item.id ? 'bg-blue-50/80 shadow-inner' : 'hover:bg-slate-50/80']">
                      <td class="px-4 py-3">
                        <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-black bg-slate-100 text-slate-600">{{ item.po_number || '-' }}</span>
                      </td>
                      <td class="px-4 py-3 text-center">
                        <UButton v-if="item.id !== 0" @click.stop="loadCosting(item.id, qtySet[item.id] || item.qty_order)" size="2xs" color="blue" variant="soft" class="text-[9px] font-bold tracking-widest uppercase rounded-lg w-full justify-center">BOM</UButton>
                      </td>
                      <td class="px-4 py-3 text-xs font-semibold text-slate-600 whitespace-nowrap">{{ item.spk_date ? item.spk_date : '-' }}</td>
                      <td class="px-4 py-3 text-xs font-bold text-slate-500">{{ item.kode_produk }}</td>
                      <td class="px-4 py-3 font-extrabold text-slate-700 text-xs">{{ item.name_produk }}</td>
                      <td class="px-4 py-3 text-xs font-black text-slate-800 text-right">{{ item.qty_order }}</td>
                      <td class="px-4 py-2">
                        <UInput type="number" v-model.number="qtySet[item.id]" size="sm" :ui="{ base: 'text-right font-bold w-16 mx-auto', rounded: 'rounded-lg' }" />
                      </td>
                      <td class="px-4 py-3 text-center">
                        <div class="flex flex-col gap-1 w-full">
                          <UButton @click.stop="handleCreatePremix(item)" :disabled="!(item.id_order == 0 && item.id_staging != 0)" size="2xs" color="emerald" variant="solid" class="text-[9px] font-bold tracking-widest uppercase rounded-lg justify-center w-full">CREATE</UButton>
                          <UButton @click.stop="handleTransferAll(item)" :disabled="!(item.id_order == 0 && item.id_staging == 0)" size="2xs" color="indigo" variant="solid" class="text-[9px] font-bold tracking-widest uppercase rounded-lg justify-center w-full">TRANSFER</UButton>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <!-- Pagination Control -->
            <div class="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
              <div class="flex items-center gap-3">
                <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Rows:</span>
                <USelect v-model="perPage" :options="[{label:'10', value:10},{label:'20', value:20},{label:'50', value:50},{label:'100', value:100}]" @update:model-value="handlePageChange(1)" size="sm" :ui="{ rounded: 'rounded-lg' }" />
              </div>
              <div class="flex items-center gap-2">
                <UButton @click="handlePageChange(1)" :disabled="currentPage === 1" size="xs" color="gray" variant="ghost" icon="i-heroicons-chevron-double-left" />
                <UButton @click="handlePageChange(currentPage - 1)" :disabled="currentPage === 1" size="xs" color="gray" variant="ghost" icon="i-heroicons-chevron-left" />
                <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 flex items-center gap-2">
                  Page 
                  <UInput type="number" v-model.lazy="pageInput" @update:model-value="handlePageChange(pageInput)" size="2xs" :ui="{ base: 'w-12 text-center font-bold', rounded: 'rounded-md' }" /> 
                  of {{ totalPages }}
                </span>
                <UButton @click="handlePageChange(currentPage + 1)" :disabled="currentPage === totalPages" size="xs" color="gray" variant="ghost" icon="i-heroicons-chevron-right" />
                <UButton @click="handlePageChange(totalPages)" :disabled="currentPage === totalPages" size="xs" color="gray" variant="ghost" icon="i-heroicons-chevron-double-right" />
                <div class="w-px h-4 bg-slate-300 mx-1"></div>
                <UButton @click="loadPremix" size="xs" color="blue" variant="ghost" icon="i-heroicons-arrow-path" title="Refresh" />
              </div>
              <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest hidden lg:block">
                Showing {{ totalPremix > 0 ? (currentPage - 1) * perPage + 1 : 0 }} - {{ Math.min(currentPage * perPage, totalPremix) }} of {{ totalPremix }}
              </div>
            </div>
          </div>
        </div>

        <!-- DATA COSTING (RIGHT) -->
        <div class="xl:col-span-7 backdrop-blur-md bg-white/90 rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden flex flex-col">
          <div class="bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-100 px-6 py-4 flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center"><UIcon name="i-heroicons-beaker" class="w-4 h-4" /></div>
            <h3 class="text-sm font-extrabold text-slate-800 uppercase tracking-widest">
              Data Costing 
              <span v-if="selectedPremix" class="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-md text-xs tracking-normal ml-2">{{ selectedPremix.po_number }}</span>
            </h3>
          </div>
          
          <div class="p-6 flex-1 flex flex-col">
            <div v-if="!selectedPremix && costingList.length === 0" class="text-sm font-semibold text-slate-400 text-center py-16 flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl">
              <UIcon name="i-heroicons-cursor-arrow-rays" class="w-12 h-12 mb-3 text-slate-300" />
              Pilih tombol BOM di tabel Data Premix untuk memuat Costing.
            </div>
            
            <div v-else class="border border-slate-100 rounded-2xl overflow-hidden shadow-sm bg-white flex-1 min-h-[300px] flex flex-col">
              <div class="overflow-auto custom-scrollbar flex-1">
                <table class="w-full text-sm text-left relative">
                  <thead class="bg-slate-50 border-b border-slate-200 sticky top-0 z-20 shadow-sm">
                    <tr>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Kode Produk</th>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Component Name</th>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px] text-center">Formula</th>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px] text-center">UOM</th>
                      <th class="px-4 py-3 text-right font-bold text-slate-500 uppercase tracking-wider text-[10px]">Inventory</th>
                      <th class="px-4 py-3 text-right font-bold text-slate-500 uppercase tracking-wider text-[10px]">Netto</th>
                      <th class="px-4 py-3 text-right font-bold text-slate-500 uppercase tracking-wider text-[10px]">Balance</th>
                      <th class="px-4 py-3 text-right font-bold text-slate-500 uppercase tracking-wider text-[10px]">Actual</th>
                      <th class="px-4 py-3 text-center font-bold text-slate-500 uppercase tracking-wider text-[10px] w-56">Action TF</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="isLoadingCosting">
                      <td colspan="9" class="px-4 py-12 text-center text-slate-400"><UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin mx-auto mb-2 text-amber-500" /><p class="font-semibold text-[10px]">Memuat costing...</p></td>
                    </tr>
                    <tr v-else-if="costingList.length === 0">
                      <td colspan="9" class="px-4 py-12 text-center text-slate-400"><UIcon name="i-heroicons-inbox" class="w-8 h-8 mx-auto mb-2 text-slate-300" /><p class="font-semibold text-[10px]">Tidak ada data costing</p></td>
                    </tr>
                    <tr v-else v-for="item in costingList" :key="item.id_spk + '_' + item.id_component" class="border-b border-slate-50 hover:bg-amber-50/30 transition-colors">
                      <td class="px-4 py-3 text-xs font-bold text-slate-500">{{ item.kode_produk }}</td>
                      <td class="px-4 py-3 font-extrabold text-slate-700 text-xs">{{ item.name_produk }}</td>
                      <td class="px-4 py-3 text-xs font-semibold text-slate-600 text-center">{{ item.choice_num }}</td>
                      <td class="px-4 py-3 text-xs font-bold text-slate-500 text-center">{{ item.uom_komponen }}</td>
                      <td class="px-4 py-3 text-xs font-semibold text-slate-700 text-right">{{ Number(item.qty_inv).toFixed(2) }}</td>
                      <td class="px-4 py-3 text-xs font-bold text-indigo-600 text-right">{{ Number(item.netto_qty_produksi).toFixed(2) }}</td>
                      <td :class="['px-4 py-3 text-xs font-black text-right', item.qty_balance < 0 ? 'bg-amber-100 text-rose-600' : 'text-slate-800']">
                        {{ Number(item.qty_balance).toFixed(2) }}
                      </td>
                      <td class="px-4 py-3 text-xs font-bold text-emerald-600 text-right">{{ Number(item.qty_actual).toFixed(2) }}</td>
                      <td class="px-4 py-2">
                        <div class="flex items-center gap-1">
                          <UInput type="number" v-model.number="qtyTf[item.id_spk + '_' + item.id_component]" size="sm" :ui="{ base: 'text-right font-bold w-16', rounded: 'rounded-lg' }" />
                          <UButton @click="handleActionTf(item, 1)" :disabled="item.id == 0 || item.status == 2 || (item.id != 0 && item.qty_balance < 0)" size="2xs" color="emerald" variant="solid" class="text-[9px] font-bold tracking-widest uppercase rounded-lg">TF</UButton>
                          <UButton @click="handleActionTf(item, 2)" :disabled="item.id == 0 || item.status == 2 || (item.id != 0 && item.qty_actual <= 0)" size="2xs" color="rose" variant="solid" class="text-[9px] font-bold tracking-widest uppercase rounded-lg">RET</UButton>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div v-if="costingList.length > 0" class="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
              <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Total Rows: {{ totalCosting }}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useProdInv } from '~/composables/useProdInv'
import { useProduksi } from '~/composables/useProduksi'

const {
  premixList, totalPremix, costingList, totalCosting,
  isLoadingPremix, isLoadingCosting, isSaving,
  fetchPremixList, fetchCostingList, setPremixOrder, transferAll, setActionInventory, orderToDc, fetchPrintData
} = useProdInv()

const { activeProdId } = useProduksi()

// State
const today: string = new Date().toISOString().split('T')[0] || ''
const spkDate = ref<string>(today)
const selectedPremix = ref<any>(null)

// Inputs Mapping
const qtySet = ref<Record<number, number>>({})
const qtyTf = ref<Record<string, number>>({})

// Pagination State
const currentPage = ref(1)
const perPage = ref(10)
const pageInput = ref(1)

const totalPages = computed(() => {
  return Math.ceil(totalPremix.value / perPage.value) || 1
})

const handlePageChange = (page: number) => {
  if (page < 1) page = 1
  if (page > totalPages.value) page = totalPages.value
  currentPage.value = page
  pageInput.value = page
  loadPremix()
}

const loadPremix = async () => {
  await fetchPremixList(spkDate.value, '', currentPage.value, perPage.value)
  // Initialize qtySet with item.qty_order
  const newQtySet: Record<number, number> = {}
  premixList.value.forEach(p => {
    newQtySet[p.id] = p.qty_set || p.qty_order || 0
  })
  qtySet.value = newQtySet
  
  // reset selection and costing
  selectedPremix.value = null
  costingList.value = []
}

const selectPremix = (item: any) => {
  selectedPremix.value = item
}

const loadCosting = async (id: number, qtyOrder: number) => {
  await fetchCostingList(id, qtyOrder, 1)
  
  // Initialize qtyTf with 0
  const newQtyTf: Record<string, number> = {}
  costingList.value.forEach(c => {
    newQtyTf[`${c.id_spk}_${c.id_component}`] = 0
  })
  qtyTf.value = newQtyTf
}

const handleCreatePremix = async (item: any) => {
  const currentQty = qtySet.value[item.id] || 0
  const res = await setPremixOrder({
    v_id_bom: item.id_bom,
    v_spk_id: item.id,
    v_qty_order: String(currentQty),
    v_start_date: spkDate.value,
    v_end_date: spkDate.value
  })
  
  if (res.success) {
    alert('Set Production Berhasil')
    loadPremix()
    if (selectedPremix.value?.id === item.id) {
      loadCosting(item.id, currentQty)
    }
  } else {
    alert('Set Production Gagal Silahkan Cek stock Material')
  }
}

const handleTransferAll = async (item: any) => {
  const currentQty = qtySet.value[item.id] || 0
  const res = await transferAll(item.id, 1, currentQty)
  if (res.success) {
    alert('Set Inventory Staging Berhasil')
    loadPremix()
    if (selectedPremix.value?.id === item.id) {
      loadCosting(item.id, currentQty)
    }
  } else {
    alert('Set Inventory Staging Gagal Silahkan Cek stock Material')
  }
}

const handleActionTf = async (item: any, idSet: number) => {
  const key = `${item.id_spk}_${item.id_component}`
  const tfQty = qtyTf.value[key] || 0
  
  if (idSet === 1 && (item.qty_inv - tfQty < 0)) {
    alert('Qty TF tidak boleh Melebihi Inventory')
    return
  }
  if (idSet === 2 && (item.qty_actual - tfQty < 0)) {
    alert('Qty Return tidak boleh Melebihi Actual')
    return
  }
  
  const res = await setActionInventory(item.id_spk, item.id_component, tfQty, idSet)
  
  if (res.success) {
    alert('Set Inventory Staging Berhasil')
    loadPremix()
    // reload costing
    if (selectedPremix.value) {
       loadCosting(selectedPremix.value.id, qtySet.value[selectedPremix.value.id] || selectedPremix.value.qty_order)
    }
  } else {
    alert('Set Inventory Staging Gagal Silahkan Cek stock Material')
  }
}

const handleOrder = async () => {
  if (confirm(`Anda yakin ingin memproses Order Produksi untuk tanggal ${spkDate.value}?`)) {
    const res = await orderToDc(spkDate.value)
    if (res.success) {
      alert('Order Berhasil')
    } else {
      alert('Order Gagal')
    }
  }
}

const handlePrint = async (idType: number) => {
  const rawData = await fetchPrintData(idType, spkDate.value)
  if (!rawData || rawData.length === 0) {
    alert('Tidak ada data untuk dicetak.')
    return
  }
  
  let tableRows = ''
  rawData.forEach((item: any) => {
    let dateObj = new Date(item.spk_date)
    let formattedDate = !isNaN(dateObj.getTime()) ? dateObj.toLocaleDateString('id-ID') : item.spk_date

    tableRows += `
      <tr>
          <td>${formattedDate}</td>
          <td>${item.name_produk}</td>
          <td>${item.matrial || item.material || ''}</td>
          <td>${item.name_prod_uom}</td>
          <td style="text-align:right;">${item.qty}</td>
      </tr>
    `
  })

  const printStyles = `
    <style>
        body { font-family: sans-serif; }
        table { width: 100%; border-collapse: collapse; }
        th, td {
            border: 1px solid #000;
            padding: 8px;
            font-size: 10pt;
            text-align: left;
        }
        th { background-color: #f2f2f2; }
        h2 { text-align: center; }
    </style>
  `
  
  const printContents = `
    <h2 style="text-align:center;">Laporan Kebutuhan Material (Detail)</h2>
    <table border="1">
        <thead>
            <tr>
                <th>TANGGAL SPK</th>
                <th>NAME PRODUK</th>
                <th>MATERIAL</th>
                <th>SATUAN</th>
                <th>QTY</th>
            </tr>
        </thead>
        <tbody>
            ${tableRows}
        </tbody>
    </table>
  `

  const printWindow = window.open('', '', 'height=600,width=800')
  if (printWindow) {
    printWindow.document.write('<html><head><title>Cetak Laporan</title>')
    printWindow.document.write(printStyles)
    printWindow.document.write('</head><body>')
    printWindow.document.write(printContents)
    printWindow.document.write('</body></html>')
    printWindow.document.close()
    
    printWindow.onload = function () {
        printWindow.focus()
        printWindow.print()
        printWindow.close()
    }
  }
}

watch(() => activeProdId.value, () => {
  loadPremix()
})

onMounted(() => {
  if (activeProdId.value) {
    loadPremix()
  }
})
</script>
