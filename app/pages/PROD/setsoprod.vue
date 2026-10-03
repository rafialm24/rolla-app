<template>
  <NuxtLayout name="dashboard">
    <div class="min-h-screen bg-slate-50/50 p-4 lg:p-8">
      <div class="max-w-[1600px] mx-auto">
        
        <!-- HEADER -->
        <div class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <UIcon name="i-heroicons-clipboard-document-list" class="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 class="text-2xl font-black text-slate-800 tracking-tight">Set Stock Opname Produksi</h1>
              <p class="text-xs font-semibold text-slate-500 tracking-wide mt-0.5 uppercase">Kelola Data Set Stock Opname</p>
            </div>
          </div>
        </div>

        <!-- MAIN CONTENT -->
        <div class="grid grid-cols-1 gap-6">
          <!-- CARD 1: OLD API -->
          <div class="backdrop-blur-md bg-white/90 rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden flex flex-col">
            <div class="px-6 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-bold uppercase tracking-wider text-sm flex items-center justify-between">
              <span>Set Stock Opname (Produksi)</span>
            </div>
            
            <!-- TOOLBAR / FORM -->
            <div class="bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-100 px-6 py-4 flex flex-wrap items-center gap-4 relative z-20">
              
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold text-slate-500 uppercase">Qty:</span>
                <UInput v-model="formQty" type="number" placeholder="QTY" class="w-24" :disabled="isSaving" @keyup.enter="handleBarcodeSubmit" />
              </div>
              
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold text-slate-500 uppercase">Barcode:</span>
                <UInput 
                  ref="barcodeInput"
                  v-model="formBarcode" 
                  placeholder="Scan Barcode" 
                  class="w-64" 
                  icon="i-heroicons-qr-code"
                  :disabled="isSaving"
                  @keyup.enter="handleBarcodeSubmit" 
                />
              </div>

              <div class="h-8 w-px bg-slate-200 hidden md:block mx-2"></div>

              <UButton @click="handlePosting" :loading="isSaving" size="sm" color="indigo" variant="solid" icon="i-heroicons-arrow-up-on-square" class="rounded-xl shadow-md shadow-indigo-500/20 font-bold uppercase tracking-wider text-[10px]">
                POSTING
              </UButton>
              
              <div class="flex-1 flex justify-end">
                <UInput v-model="keyword" @keyup.enter="loadData" icon="i-heroicons-magnifying-glass" placeholder="Cari produk..." class="w-48" />
              </div>

            </div>
            
            <!-- DATA GRID -->
            <div class="p-6 flex-1 relative z-10">
              <div class="border border-slate-100 rounded-2xl overflow-hidden shadow-sm bg-white min-h-[400px]">
                <div class="overflow-x-auto custom-scrollbar">
                  <table class="w-full text-sm text-left">
                    <thead class="bg-slate-50/80 backdrop-blur-sm border-b border-slate-100">
                      <tr>
                        <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px] w-24">Action</th>
                        <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Nama Produk</th>
                        <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px]">UOM SO</th>
                        <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px] text-right">Qty Actual</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-50">
                      <tr v-if="isLoading">
                        <td colspan="4" class="px-4 py-12 text-center text-slate-400 font-medium">
                          <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 mx-auto mb-3 animate-spin text-indigo-400" />
                          <p class="text-xs uppercase tracking-widest">Loading Data...</p>
                        </td>
                      </tr>
                      <tr v-else-if="listData.length === 0">
                        <td colspan="4" class="px-4 py-12 text-center text-slate-400 font-medium">
                          <UIcon name="i-heroicons-document-magnifying-glass" class="w-8 h-8 mx-auto mb-3 text-slate-300" />
                          <p class="text-xs uppercase tracking-widest">No data found</p>
                        </td>
                      </tr>
                      <tr v-else v-for="item in listData" :key="item.id" class="hover:bg-indigo-50/50 transition-colors group">
                        <td class="px-4 py-2">
                          <UButton @click="handleDelete(item)" size="xs" color="rose" variant="soft" icon="i-heroicons-trash" class="font-bold text-[10px] rounded-lg">DELETE</UButton>
                        </td>
                        <td class="px-4 py-2 font-semibold text-slate-800 text-xs">{{ item.name_produk }}</td>
                        <td class="px-4 py-2 text-slate-500 text-[10px]">{{ item.name_prod_uom }}</td>
                        <td class="px-4 py-2 text-emerald-600 font-bold text-right text-xs">{{ formatNumber(item.qty_so) }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <!-- Pagination -->
                <div class="px-4 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Rows:</span>
                    <USelect v-model="perPage" :options="[10, 20, 50, 100]" class="w-20" size="xs" @change="page = 1; loadData()" />
                  </div>
                  <div class="flex flex-1 justify-center">
                    <UPagination v-model="page" :page-count="perPage" :total="totalRows" size="sm" @update:model-value="loadData" />
                  </div>
                  <div class="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Total: {{ totalRows }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- CARD 2: ROLLA DC -->
          <div class="backdrop-blur-md bg-white/90 rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden flex flex-col">
            <div class="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold uppercase tracking-wider text-sm flex items-center justify-between">
              <span>Set Stock Opname (Rolla DC)</span>
            </div>
            
            <!-- TOOLBAR / FORM -->
            <div class="bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-100 px-6 py-4 flex flex-wrap items-center gap-4 relative z-20">
              
              <UButton @click="handlePostingRolla" :loading="isSavingRolla" size="sm" color="emerald" variant="solid" icon="i-heroicons-arrow-up-on-square" class="rounded-xl shadow-md shadow-emerald-500/20 font-bold uppercase tracking-wider text-[10px]">
                POSTING ROLLA DC
              </UButton>
              
              <div class="flex-1 flex justify-end">
                <UInput v-model="keywordRolla" @keyup.enter="loadDataRolla" icon="i-heroicons-magnifying-glass" placeholder="Cari produk..." class="w-48" />
              </div>
            </div>
            
            <!-- DATA GRID -->
            <div class="p-6 flex-1 relative z-10">
              <div class="border border-slate-100 rounded-2xl overflow-hidden shadow-sm bg-white min-h-[400px]">
                <div class="overflow-x-auto custom-scrollbar">
                  <table class="w-full text-sm text-left">
                    <thead class="bg-slate-50/80 backdrop-blur-sm border-b border-slate-100">
                      <tr>
                        <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Nama Produk</th>
                        <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px]">UOM SO</th>
                        <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px] text-right">Qty Actual</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-50">
                      <tr v-if="isLoadingRolla">
                        <td colspan="3" class="px-4 py-12 text-center text-slate-400 font-medium">
                          <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 mx-auto mb-3 animate-spin text-emerald-400" />
                          <p class="text-xs uppercase tracking-widest">Loading Data...</p>
                        </td>
                      </tr>
                      <tr v-else-if="listDataRolla.length === 0">
                        <td colspan="3" class="px-4 py-12 text-center text-slate-400 font-medium">
                          <UIcon name="i-heroicons-document-magnifying-glass" class="w-8 h-8 mx-auto mb-3 text-slate-300" />
                          <p class="text-xs uppercase tracking-widest">No data found</p>
                        </td>
                      </tr>
                      <tr v-else v-for="item in listDataRolla" :key="item.id" class="hover:bg-emerald-50/50 transition-colors group">
                        <td class="px-4 py-2 font-semibold text-slate-800 text-xs">{{ item.name_produk }}</td>
                        <td class="px-4 py-2 text-slate-500 text-[10px]">{{ item.name_prod_uom }}</td>
                        <td class="px-4 py-2 text-emerald-600 font-bold text-right text-xs">{{ formatNumber(item.qty_so) }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <!-- Pagination -->
                <div class="px-4 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Rows:</span>
                    <USelect v-model="perPageRolla" :options="[10, 20, 50, 100]" class="w-20" size="xs" @change="pageRolla = 1; loadDataRolla()" />
                  </div>
                  <div class="flex flex-1 justify-center">
                    <UPagination v-model="pageRolla" :page-count="perPageRolla" :total="totalRowsRolla" size="sm" @update:model-value="loadDataRolla" />
                  </div>
                  <div class="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Total: {{ totalRowsRolla }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useSetSoProd } from '~/composables/useSetSoProd'

definePageMeta({ layout: false })

const { 
  listData, totalRows, isLoading, isSaving,
  fetchListAudit, cekBarcodeItem, setSo, deleteRowSo, postingListSo 
} = useSetSoProd()

const {
  listData: listDataRolla, totalRows: totalRowsRolla, isLoading: isLoadingRolla, isSaving: isSavingRolla,
  fetchListRolla, postingRollaDc
} = useSetSoProd()

const toast = useToast()

// State
const keyword = ref('')
const page = ref(1)
const perPage = ref(10)

const keywordRolla = ref('')
const pageRolla = ref(1)
const perPageRolla = ref(10)

const formQty = ref('')
const formBarcode = ref('')
const barcodeInput = ref<any>(null)

const loadData = async () => {
  await fetchListAudit(keyword.value, page.value, perPage.value)
}

const loadDataRolla = async () => {
  await fetchListRolla(keywordRolla.value, pageRolla.value, perPageRolla.value)
}

const focusBarcode = () => {
  nextTick(() => {
    if (barcodeInput.value && barcodeInput.value.$el) {
      const input = barcodeInput.value.$el.querySelector('input')
      if (input) input.focus()
    }
  })
}

const handleBarcodeSubmit = async () => {
  if (!formBarcode.value) return

  let finalBarcode = ""
  let finalQty: string | number = 1

  const barcodeStr = formBarcode.value.trim()
  const qtyStr = formQty.value

  // Legacy logic implementation
  if (barcodeStr.substring(0, 3) === '570') {
    finalBarcode = barcodeStr.substring(0, 7)
    if (barcodeStr.length === 7) {
      finalQty = qtyStr || 1
    } else {
      // 570 weight barcode (ex: 5701234001250)
      const weightStr = barcodeStr.substring(8) // length depends on format, using legacy substring(8)
      const weight = parseInt(weightStr)
      if (!isNaN(weight)) {
        finalQty = weight / 1000
      }
    }
  } else {
    finalBarcode = barcodeStr
    if (qtyStr === '') {
      finalQty = 1
    } else {
      finalQty = qtyStr
    }
  }

  if (isNaN(Number(finalQty)) || finalQty === '') {
    toast.add({ title: 'Error', description: 'Invalid QTY', color: 'red' })
    return
  }

  // 1. Cek Barcode
  const cekRes = await cekBarcodeItem(finalBarcode)
  if (cekRes.success && cekRes.data?.result !== 0) {
    const idProduk = cekRes.data.result.toString()
    
    // 2. Set SO
    const setRes = await setSo(idProduk, finalQty.toString(), formBarcode.value)
    if (setRes.success && setRes.data?.result !== 0) {
      // Success
      formQty.value = ''
      formBarcode.value = ''
      await loadData()
      focusBarcode()
    } else {
      toast.add({ title: 'Gagal', description: 'Data Gagal Di Set', color: 'red' })
    }
  } else {
    toast.add({ title: 'Gagal', description: 'Barcode Tidak Ditemukan', color: 'red' })
  }
}

const handleDelete = async (row: any) => {
  if (confirm(`Yakin ingin menghapus data SO untuk produk ${row.name_produk}?`)) {
    const res = await deleteRowSo(row.id)
    if (res.success) {
      toast.add({ title: 'Berhasil', description: 'Data berhasil dihapus', color: 'green' })
      loadData()
    } else {
      toast.add({ title: 'Gagal', description: 'Data gagal dihapus', color: 'red' })
    }
  }
}

const handlePosting = async () => {
  if (confirm('Yakin ingin memposting data Set Stock Opname ini?')) {
    const res = await postingListSo()
    if (res.success) {
      toast.add({ title: 'Berhasil', description: 'Data Set SO berhasil diposting', color: 'green' })
      loadData()
    } else {
      toast.add({ title: 'Gagal', description: 'Data gagal diposting', color: 'red' })
    }
  }
}

const handlePostingRolla = async () => {
  if (confirm('Yakin ingin memposting data Set Stock Opname Rolla DC ini?')) {
    const res = await postingRollaDc()
    if (res.success) {
      toast.add({ title: 'Berhasil', description: 'Data Set SO Rolla DC berhasil diposting', color: 'green' })
      loadDataRolla()
    } else {
      toast.add({ title: 'Gagal', description: 'Data gagal diposting', color: 'red' })
    }
  }
}

const formatNumber = (num: any) => {
  if (num === null || num === undefined) return '0'
  return Number(num).toLocaleString('id-ID')
}

onMounted(() => {
  loadData()
  loadDataRolla()
  focusBarcode()
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  height: 8px;
  width: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
