<template>
  <NuxtLayout name="dashboard">
    <div class="min-h-[calc(100vh-80px)] bg-slate-50 p-4 font-sans flex flex-col overflow-x-hidden">
      <div class="w-full flex-1 flex flex-col gap-4 min-w-0">
        
        <!-- HEADER -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200 shrink-0">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
              <UIcon name="i-heroicons-computer-desktop" class="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 class="text-xl font-black text-slate-800 tracking-tight leading-tight">Kasir Produksi</h1>
              <p class="text-xs font-semibold text-slate-500">Bazzar & Outlet Transaction System</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
             <div class="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-bold text-sm border border-indigo-100 flex items-center gap-2">
                <UIcon name="i-heroicons-map-pin" class="w-4 h-4" />
                Location ID: {{ prodId }}
             </div>
          </div>
        </div>

        <!-- MAIN CONTENT (2 COLUMNS) -->
        <div class="flex w-full items-stretch flex-1 min-h-0" style="display: flex; width: 100%;">
          
          <!-- LEFT SIDE: INPUT & GRID -->
          <div class="pr-2 flex flex-col gap-4 h-full min-h-0" style="width: 60%;">
            
            <!-- INPUT PANEL -->
            <UCard :ui="{ ring: 'ring-1 ring-slate-200', rounded: 'rounded-xl', shadow: 'shadow-sm', body: { padding: 'p-3' } }" class="shrink-0">
              <div class="flex flex-col xl:flex-row gap-3 items-stretch">
                <!-- Barcode Area -->
                <div class="flex-1 flex gap-2">
                  <UFormGroup label="Quantity" class="w-20">
                    <UInput v-model="barcodeQty" type="number" size="lg" class="text-center font-bold" :disabled="isSaving" @keyup.enter="focusBarcode" />
                  </UFormGroup>
                  <UFormGroup label="Scan Barcode (Enter)" class="flex-1">
                    <UInput 
                      ref="barcodeInput"
                      v-model="barcodeVal" 
                      placeholder="Scan Barcode..." 
                      size="lg"
                      icon="i-heroicons-qr-code"
                      :disabled="isSaving"
                      @keyup.enter="handleBarcodeScan" 
                      :ui="{ icon: { base: 'text-indigo-500' } }"
                      class="font-mono"
                    />
                  </UFormGroup>
                  <div class="pt-[22px]">
                    <UButton 
                      :color="showManual ? 'gray' : 'indigo'" 
                      :variant="showManual ? 'soft' : 'solid'"
                      size="lg" 
                      class="h-[38px] px-3 font-bold"
                      @click="toggleManual"
                    >
                      <UIcon :name="showManual ? 'i-heroicons-chevron-up' : 'i-heroicons-bars-3-bottom-left'" class="w-5 h-5 mr-1" />
                      Manual
                    </UButton>
                  </div>
                </div>
              </div>

              <!-- Manual Input Collapse -->
              <transition name="fade-slide">
                <div v-if="showManual" class="mt-3 pt-3 border-t border-slate-100 flex flex-wrap md:flex-nowrap items-end gap-2">
                  <UFormGroup label="Type/Grade" class="w-full md:w-40">
                    <USelect v-model="manualGrade" :options="gradeOptions" @change="handleGradeChange" />
                  </UFormGroup>
                  
                  <UFormGroup label="Pilih Item" class="flex-1 min-w-[200px]">
                    <USelectMenu v-model="manualSelectedItem" :options="manualItems" option-attribute="name_produk" value-attribute="id_produk" searchable placeholder="Search item..." @update:model-value="handleItemChange">
                      <template #label>
                        <span v-if="manualSelectedItem" class="truncate font-bold text-slate-700">{{ getSelectedName() }}</span>
                        <span v-else class="text-slate-400">Search item...</span>
                      </template>
                      <template #option="{ option }">
                        <span class="truncate font-medium">{{ option.kode_produk }} - {{ option.name_produk }}</span>
                      </template>
                    </USelectMenu>
                  </UFormGroup>
                  
                  <UFormGroup label="Price" class="w-28">
                    <UInput v-model="manualPrice" type="number" :readonly="manualGrade !== '1'" class="font-mono" />
                  </UFormGroup>
                  <UFormGroup label="Qty" class="w-20">
                    <UInput v-model="manualQty" type="number" class="text-center font-bold" @keyup.enter="handleAddManual" />
                  </UFormGroup>
                  
                  <UButton color="indigo" variant="solid" icon="i-heroicons-plus" label="Add" @click="handleAddManual" :loading="isSaving" class="h-[32px] px-4 font-bold shadow-sm" />
                </div>
              </transition>
            </UCard>

            <!-- DATA GRID (UTable) -->
            <UCard :ui="{ ring: 'ring-1 ring-slate-200', rounded: 'rounded-xl', shadow: 'shadow-sm', body: { padding: 'p-0 h-full flex flex-col' } }" class="flex-1 flex flex-col min-h-0 overflow-hidden">
              <div class="flex-1 overflow-auto custom-scrollbar">
              <UTable 
                :rows="cartList" 
                :columns="columns" 
                :loading="isLoading"
                class="w-full"
                :ui="{ 
                  wrapper: 'relative',
                  base: 'min-w-full table-fixed',
                  td: { padding: 'py-2.5 px-3', font: 'text-[13px] font-medium text-slate-700' },
                  th: { padding: 'py-3 px-3', font: 'text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-50/95 sticky top-0 z-10 backdrop-blur-sm border-b border-slate-200' }
                }"
              >
                <!-- Loading State -->
                <template #loading-state>
                  <div class="flex flex-col items-center justify-center py-12">
                    <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-indigo-500 mb-3" />
                    <span class="text-slate-500 font-semibold text-sm">Mengambil data...</span>
                  </div>
                </template>
                <!-- Empty State -->
                <template #empty-state>
                  <div class="flex flex-col items-center justify-center py-16 text-slate-400">
                    <UIcon name="i-heroicons-shopping-bag" class="w-12 h-12 mb-3 opacity-30" />
                    <span class="font-bold">Keranjang Kosong</span>
                    <span class="text-xs mt-1">Scan barcode untuk menambahkan item.</span>
                  </div>
                </template>

                <!-- Custom Cell Renderers -->
                <template #action-data="{ row }">
                  <UButton v-if="row.id !== 0" @click="handleDelete(row.id)" size="xs" color="rose" variant="soft" icon="i-heroicons-trash" label="DEL" class="font-bold text-[10px]" />
                </template>
                <template #barcode-data="{ row }">
                  <span class="font-mono text-slate-500">{{ row.barcode }}</span>
                </template>
                <template #name_produk-data="{ row }">
                  <span class="font-bold text-slate-800">{{ row.name_produk }}</span>
                </template>
                <template #price_origin-data="{ row }">
                  <span class="font-mono font-medium text-slate-600">{{ formatNumber(row.price_origin) }}</span>
                </template>
                <template #qty-data="{ row }">
                  <span class="font-bold px-2 py-0.5 bg-slate-100 rounded text-slate-800">{{ row.qty === 0 ? 'Disc' : row.qty }}</span>
                </template>
                <template #price-data="{ row }">
                  <span class="font-mono font-bold text-indigo-700">{{ formatNumber(row.price) }}</span>
                </template>
              </UTable>
              </div>
            </UCard>
          </div>

          <!-- RIGHT SIDE: PAYMENT TERMINAL -->
          <div class="pl-2 h-full flex flex-col min-h-0" style="width: 40%;">
            <UCard :ui="{ ring: 'ring-1 ring-slate-200', rounded: 'rounded-2xl', shadow: 'shadow-md', body: { padding: 'p-0 flex flex-col h-full' } }" class="overflow-hidden bg-white flex-1 flex flex-col">
              
              <!-- Total Display -->
              <div class="bg-indigo-600 p-4 text-center text-white shadow-inner relative overflow-hidden shrink-0">
                <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
                <h2 class="text-indigo-100 font-bold text-[10px] tracking-widest uppercase mb-1 relative z-10">Total Belanja</h2>
                <div class="text-2xl xl:text-3xl font-black font-mono tracking-tighter relative z-10">Rp {{ formatNumber(total) }}</div>
              </div>

              <div class="p-4 flex flex-col gap-4 flex-1 overflow-y-auto custom-scrollbar">
                <!-- Last Trx Dropdown -->
                <div class="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-100">
                  <UIcon name="i-heroicons-clock" class="w-4 h-4 text-slate-400" />
                  <USelect v-model="selectedLastTrx" :options="lastTrxOptions" option-attribute="trx_num" value-attribute="trx_num" size="xs" class="flex-1 mx-2" variant="none" :ui="{ font: 'font-mono text-xs font-bold text-slate-600' }" />
                  <UButton @click="handlePrint(selectedLastTrx)" size="2xs" color="indigo" variant="soft" icon="i-heroicons-printer" />
                </div>

                <!-- Calculation Fields -->
                <div class="space-y-3">
                  <!-- Sub Total & Potongan -->
                  <div class="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span class="text-xs font-bold text-slate-500">Sub Total</span>
                    <span class="font-mono font-bold text-slate-800 text-base">{{ formatNumber(subtotal) }}</span>
                  </div>
                  
                  <div class="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span class="text-xs font-bold text-rose-500">Potongan (-)</span>
                    <div class="w-28">
                      <UInput v-model="potonganInput" type="number" :disabled="potongan > 0" @keyup.enter="handlePotonganSubmit" size="sm" class="font-mono text-rose-600 font-bold" :ui="{ base: 'text-right bg-rose-50', color: { white: { outline: 'ring-0 focus:ring-1 focus:ring-rose-400' } } }" placeholder="0" />
                    </div>
                  </div>

                  <!-- Kembalian Display -->
                  <div class="flex items-center justify-between pt-1">
                    <span class="text-xs font-bold text-emerald-600">Kembalian</span>
                    <span class="font-mono font-black text-emerald-600 text-xl">{{ formatNumber(computedKembalian) }}</span>
                  </div>
                </div>

                <!-- Input Payment -->
                <div class="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <UFormGroup label="Nominal Bayar (ENTER)" class="mb-2">
                    <UInput v-model="bayarInput" type="number" :disabled="bayar > 0" @keyup.enter="handleBayarSubmit" size="lg" class="font-mono text-center font-black text-lg text-indigo-700" placeholder="0" />
                  </UFormGroup>
                  <UFormGroup label="Referensi (Non-Tunai)">
                    <UInput v-model="referenceText" @keyup.enter="enableNonTunaiBtn = true" placeholder="Input referensi..." icon="i-heroicons-document-text" size="sm" />
                  </UFormGroup>
                </div>

                <!-- Action Buttons -->
                <div class="flex flex-col gap-2 mt-auto pt-2">
                  <div class="flex gap-2">
                    <UButton color="blue" variant="solid" class="flex-1 justify-center font-black text-xs tracking-widest h-12 shadow-md" :disabled="!canPay" @click="handlePayTunai(1)">
                      TUNAI
                    </UButton>
                    <UButton color="emerald" variant="solid" class="flex-1 justify-center font-black text-xs tracking-widest h-12 shadow-md" :disabled="!canPay || (!referenceText && showReference)" @click="handlePayNonTunai">
                      NON TUNAI
                    </UButton>
                  </div>
                  <UButton color="amber" variant="solid" class="w-full justify-center font-black text-xs tracking-widest h-12 shadow-md text-amber-950" @click="qrisModalOpen = true">
                    BAYAR DENGAN QRIS
                  </UButton>
                </div>
              </div>
            </UCard>
          </div>
        </div>

      </div>
    </div>
    
    <!-- QRIS MODAL -->
    <UModal v-model="qrisModalOpen" prevent-close>
      <UCard :ui="{ ring: 'ring-1 ring-slate-200', rounded: 'rounded-2xl', divide: 'divide-y divide-slate-100' }">
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <UIcon name="i-heroicons-qr-code" class="w-6 h-6 text-amber-600" />
              </div>
              <h3 class="text-lg font-black text-slate-800">
                QRIS Payment
              </h3>
            </div>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="closeQrisModal" />
          </div>
        </template>
        
        <div class="py-4">
          <div class="mb-4">
            <label class="text-xs font-bold text-slate-500 uppercase mb-1 block">Order ID</label>
            <UInput v-model="qrisOrderId" readonly class="font-mono bg-slate-50" />
          </div>
          
          <div v-if="qrisLoading" class="flex flex-col items-center justify-center p-12">
            <UIcon name="i-heroicons-arrow-path" class="w-12 h-12 animate-spin text-amber-500 mb-4" />
            <span class="font-bold text-slate-600">Generating QR Code...</span>
          </div>
          <div v-else-if="qrisUrl" class="flex flex-col items-center p-4">
            <div class="p-3 bg-white rounded-2xl shadow-lg border border-slate-100 mb-4 inline-block">
              <img :src="qrisUrl" alt="QRIS" class="w-64 h-64" />
            </div>
            <UBadge :color="qrisStatusColor" size="lg" class="px-6 py-2 text-sm font-black tracking-wide shadow-sm" :class="{ 'animate-pulse': qrisStatus.includes('Waiting') }">{{ qrisStatus }}</UBadge>
          </div>
          <div v-else class="text-center p-12 text-slate-500">
            <UIcon name="i-heroicons-device-phone-mobile" class="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p class="font-semibold text-sm">Klik Generate QRIS untuk memunculkan kode QR ke pelanggan.</p>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-between items-center">
            <UButton color="amber" variant="solid" @click="generateQris" :loading="qrisLoading" :disabled="!bayar || !!qrisUrl" class="font-bold shadow-sm">Generate QRIS</UButton>
            <UButton v-if="qrisUrl" color="indigo" variant="soft" @click="checkQrisStatus(true)" class="font-bold">Check Status</UButton>
          </div>
        </template>
      </UCard>
    </UModal>
    
    <!-- HIDDEN PRINT AREA -->
    <div id="print-area" class="hidden">
      <!-- We will inject print content here dynamically -->
      <div v-html="printHtml" class="print-container"></div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useKasirProd } from '~/composables/useKasirProd'
import { useProduksi } from '~/composables/useProduksi'

definePageMeta({ layout: false })

const toast = useToast()
const { activeProdId: prodId } = useProduksi()
const {
  cartList, lastTrxOptions, manualItems, subtotal, potongan, voucher, poin, total, bayar, kembalian,
  reference, isLoading, isSaving, fetchLastTrx, fetchListTrx, fetchItemStock, fetchItemPrice,
  addTrxBarcode, addTrxManual, deleteTrx, addPotongan, setBayar, payTunai, getPrintData
} = useKasirProd()

// Table Columns for UTable
const columns = [
  { key: 'baris', label: 'No' },
  { key: 'action', label: 'Action' },
  { key: 'barcode', label: 'Barcode' },
  { key: 'name_produk', label: 'Nama Item' },
  { key: 'name_prod_uom', label: 'UOM' },
  { key: 'price_origin', label: 'Harga' },
  { key: 'qty', label: 'Qty' },
  { key: 'price', label: 'Total' }
]

// UI State
const showManual = ref(false)
const barcodeQty = ref<number | string>(1)
const barcodeVal = ref('')
const barcodeInput = ref<any>(null)
const selectedLastTrx = ref<string>('')

// Manual Input State
const manualGrade = ref('1')
const gradeOptions = [
  { label: 'Finish Good', value: '1' },
  { label: 'B Grade/Reject', value: '2' },
  { label: 'Jasa', value: '3' },
  { label: 'Material', value: '4' }
]
const manualSelectedItem = ref<any>(null)
const manualPrice = ref<number | string>('')
const manualQty = ref<number | string>('')

// Checkout State
const potonganInput = ref<number | string>('')
const bayarInput = ref<number | string>('')
const showReference = ref(false)
const enableNonTunaiBtn = ref(false)
const referenceText = ref('')

// QRIS State
const qrisModalOpen = ref(false)
const qrisOrderId = ref('')
const qrisUrl = ref('')
const qrisStatus = ref('')
const qrisLoading = ref(false)
let qrisCheckInterval: any = null
let qrisCheckTimeout: any = null

const computedKembalian = computed(() => {
  if (cartList.value.length > 0) {
    if (kembalian.value !== 0) return kembalian.value
    // If not posted to API yet but user typing
    const b = Number(bayarInput.value) || 0
    return b - total.value
  }
  return 0
})

const canPay = computed(() => {
  const b = Number(bayarInput.value) || bayar.value
  return b > 0 && b >= total.value && total.value > 0
})

const qrisStatusColor = computed(() => {
  if (qrisStatus.value.includes('Waiting')) return 'blue'
  if (qrisStatus.value.includes('Berhasil') || qrisStatus.value.includes('settlement')) return 'emerald'
  return 'orange'
})

const focusBarcode = () => {
  nextTick(() => {
    if (barcodeInput.value && barcodeInput.value.$el) {
      const input = barcodeInput.value.$el.querySelector('input')
      if (input) input.focus()
    }
  })
}

const toggleManual = () => {
  showManual.value = !showManual.value
  if (showManual.value) {
    fetchItemStock(Number(manualGrade.value))
  } else {
    focusBarcode()
  }
}

const handleGradeChange = () => {
  fetchItemStock(Number(manualGrade.value))
  manualSelectedItem.value = null
  manualPrice.value = ''
  if (manualGrade.value !== '1') {
    manualPrice.value = ''
  }
}

const getSelectedName = () => {
  if (!manualSelectedItem.value) return 'Search item...'
  const item = manualItems.value.find(i => i.id_produk === manualSelectedItem.value)
  return item ? `${item.name_produk}` : 'Search item...'
}

const handleItemChange = async () => {
  if (manualGrade.value === '1' || manualGrade.value === '2') {
    if (manualSelectedItem.value) {
      const res = await fetchItemPrice(manualSelectedItem.value)
      // Attempt to extract price from hmt-prod response
      if (res && res.length > 0) {
        manualPrice.value = res.data[0].price || 0
      }
    }
  }
}

const handleBarcodeScan = async () => {
  if (!barcodeVal.value) return
  try {
    const res = await addTrxBarcode(barcodeVal.value, Number(barcodeQty.value) || 1)
    if (res?.status === 1) {
      potonganInput.value = ''
      bayarInput.value = ''
      await fetchListTrx()
    } else if (res?.status === 99) {
      toast.add({ title: 'Gagal', description: 'Stok Kosong / Melebihi', color: 'red' })
    } else {
      toast.add({ title: 'Gagal', description: 'Barcode tidak ditemukan', color: 'red' })
    }
  } catch (e) {
    toast.add({ title: 'Error', description: 'Gagal scan barcode', color: 'red' })
  } finally {
    barcodeVal.value = ''
    barcodeQty.value = 1
    focusBarcode()
  }
}

const handleAddManual = async () => {
  if (!manualSelectedItem.value || !manualQty.value) {
    toast.add({ title: 'Warning', description: 'Lengkapi item dan qty', color: 'orange' })
    return
  }
  
  // Find stock id
  const itemData = manualItems.value.find(i => i.id_produk === manualSelectedItem.value)
  if (!itemData) return
  
  try {
    const res = await addTrxManual(itemData.id_stock, manualSelectedItem.value, Number(manualQty.value), Number(manualPrice.value) || 0)
    if (res?.status === 1) {
      potonganInput.value = ''
      bayarInput.value = ''
      await fetchListTrx()
      manualQty.value = ''
    } else {
      toast.add({ title: 'Gagal', description: 'Stok Kosong / Melebihi', color: 'red' })
    }
  } catch (e) {
    toast.add({ title: 'Error', description: 'Gagal tambah item', color: 'red' })
  }
}

const handleDelete = async (id: number) => {
  try {
    const res = await deleteTrx(id)
    if (res?.status === 1) {
      potonganInput.value = ''
      bayarInput.value = ''
      await fetchListTrx()
    }
  } catch (e) {
    toast.add({ title: 'Error', description: 'Gagal hapus item', color: 'red' })
  }
}

const handlePotonganSubmit = async () => {
  const p = Number(potonganInput.value) || 0
  if (p > 500000) {
    toast.add({ title: 'Gagal', description: 'Potongan melebihi limit', color: 'red' })
    return
  }
  try {
    const res = await addPotongan(p)
    if (res?.status === 1) {
      await fetchListTrx()
    } else {
      toast.add({ title: 'Gagal', description: 'Gagal input potongan', color: 'red' })
    }
  } catch (e) {
    toast.add({ title: 'Error', description: 'Gagal server potongan', color: 'red' })
  }
}

const handleBayarSubmit = async () => {
  const b = Number(bayarInput.value) || 0
  if (b < total.value) {
    toast.add({ title: 'Warning', description: 'Uang kurang', color: 'orange' })
    return
  }
  const kem = b - total.value
  try {
    const res = await setBayar(b, kem)
    if (res?.status === 1) {
      await fetchListTrx()
    } else {
      toast.add({ title: 'Gagal', description: 'Gagal set bayar', color: 'red' })
    }
  } catch (e) {
    toast.add({ title: 'Error', description: 'Gagal server set bayar', color: 'red' })
  }
}

const handlePayNonTunai = () => {
  if (!showReference.value) {
    showReference.value = true
    toast.add({ title: 'Info', description: 'Silahkan isi No Referensi terlebih dahulu.', color: 'blue' })
  } else {
    handlePayTunai(2) // Type buy = 2 for Non Tunai
  }
}

const handlePayTunai = async (typeBuy: number) => {
  if (!bayarInput.value && bayar.value === 0) {
    toast.add({ title: 'Warning', description: 'Selesaikan pembayaran (Input Bayar) dulu', color: 'orange' })
    return
  }
  
  reference.value = referenceText.value
  try {
    const res = await payTunai(1, typeBuy, Number(manualGrade.value))
    if (res?.status !== 0) {
      toast.add({ title: 'Sukses', description: 'Transaksi Berhasil Disimpan', color: 'emerald' })
      // Print immediately
      const insertedTrxNum = res.status // assuming status returns the ID or we get it from lastTrx
      // Workaround: re-fetch lastTrx, grab the newest, print it.
      await fetchLastTrx()
      if (lastTrxOptions.value.length > 0) {
        selectedLastTrx.value = lastTrxOptions.value[0].trx_num
        handlePrint(selectedLastTrx.value)
      }
      
      // Clean up
      referenceText.value = ''
      showReference.value = false
      bayarInput.value = ''
      potonganInput.value = ''
      await fetchListTrx()
    } else {
      toast.add({ title: 'Gagal', description: 'Stok Tidak Cukup atau Transaksi Gagal', color: 'red' })
    }
  } catch (e) {
    toast.add({ title: 'Error', description: 'Terjadi Kesalahan', color: 'red' })
  }
}

// QRIS logic
const generateQris = () => {
  if (!bayarInput.value && !bayar.value) {
    toast.add({ title: 'Warning', description: 'Harap input nominal bayar', color: 'orange' })
    return
  }
  
  if (!confirm('Apakah pelanggan sudah siap membayar?')) return
  
  const b = Number(bayarInput.value) || bayar.value
  const trxNum = selectedLastTrx.value || "0"
  qrisOrderId.value = `QRIS-PROD-${trxNum}-${Date.now().toString().slice(-6)}`
  
  qrisLoading.value = true
  qrisStatus.value = 'Generating...'
  
  // MOCKING QRIS API CALL
  setTimeout(() => {
    qrisLoading.value = false
    qrisUrl.value = 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=' + encodeURIComponent(qrisOrderId.value)
    qrisStatus.value = 'Waiting for payment...'
    
    qrisCheckInterval = setInterval(() => checkQrisStatus(false), 3000)
    qrisCheckTimeout = setTimeout(() => {
      clearInterval(qrisCheckInterval)
      qrisStatus.value = 'Timeout. Coba lagi.'
    }, 180000)
    
  }, 1500)
}

const checkQrisStatus = (isManual = false) => {
  // MOCKING QRIS CHECK
  if (isManual) {
    qrisStatus.value = 'Checking...'
    setTimeout(() => {
      // Simulate success after manual check for demo
      qrisStatus.value = 'Pembayaran Berhasil! settlement'
      clearInterval(qrisCheckInterval)
      clearTimeout(qrisCheckTimeout)
      
      referenceText.value = qrisOrderId.value
      setTimeout(() => {
        closeQrisModal()
        handlePayTunai(2)
      }, 1000)
    }, 800)
  }
}

const closeQrisModal = () => {
  qrisModalOpen.value = false
  if (qrisCheckInterval) clearInterval(qrisCheckInterval)
  if (qrisCheckTimeout) clearTimeout(qrisCheckTimeout)
  qrisUrl.value = ''
  qrisStatus.value = ''
}

// PRINT LOGIC
const printHtml = ref('')
const handlePrint = async (trxNum: string) => {
  if (!trxNum) return
  const res = await getPrintData(trxNum)
  if (res && res.length > 0) {
    const data = res.data[0]
    
    // Construct HTML template for printJS
    let itemsHtml = ''
    res.data.forEach((item: any) => {
      const v_list = (item.discount === 0) ? `${item.qty} x ${item.price_origin.toLocaleString('id-ID')}` : 'Discount'
      const v_sub = (item.discount !== 0) ? `-${item.sub_price.toLocaleString('id-ID')}` : item.sub_price.toLocaleString('id-ID')
      itemsHtml += `<tr><td align="left" valign="top" style="font-size:12px;">${item.name_produk}</td><td align="right" valign="top"></td></tr>
                    <tr><td align="left" valign="top" style="font-size:12px;">${v_list}</td><td align="right" valign="top" style="font-size:12px;">${v_sub}</td></tr>`
    })
    
    let promoMsg = ''
    if (data.foarmem === true) {
      promoMsg = `<div style="margin-top: 10px; font-weight: bold; font-size: 11px; border: 1px dashed black; padding: 3px;">KODE: ${data.kode_member || ''}</div>`
    }

    printHtml.value = `
      <div style="width:100%; font-family:Arial; padding: 10px; color: black;">
        <table border="0" style="width: 100%;">
          <tr>
            <td style="width: 20%; text-align:left; vertical-align:top;">
              <div style="width:60px; height:60px; background:#ddd; display:flex; align-items:center; justify-content:center; font-size:10px;">LOGO</div>
            </td>
            <td style="width: 80%; text-align:left; vertical-align:middle; padding-left:10px;">
              <div style="font-size:18px; font-weight:bold;">${data.name_prod || ''}</div>
              <div style="font-size:12px;">${data.slogan || ''}</div>
              <div style="font-size:10px;">${data.alamat_prod || ''}</div>
            </td>
          </tr>
          <tr>
            <td colspan="2" style="font-size:10px; padding-top:8px;">
              <table border="0" style="width: 100%;">
                <tr><td>No</td><td>: ${data.trx_num || ''}</td><td></td></tr>
                <tr><td>OPR</td><td>: ${data.usrnm || ''}</td><td align="right">${data.create_date || ''}</td></tr>
              </table>
            </td>
          </tr>
          <tr><td colspan="2"><hr style="border-top:1px dashed black;"></td></tr>
          <tr>
            <td colspan="2" align="left" valign="top">
              <table border="0" style="width: 100%;">
                ${itemsHtml}
              </table>
              <br/>
              <table border="0" style="width: 100%; font-size:12px;" align="right">
                <tr><td align="right">Subtotal:</td><td align="right" style="width:80px;">${(data.sub_total || 0).toLocaleString('id-ID')}</td></tr>
                <tr><td align="right">Potongan:</td><td align="right">-${(data.potongan || 0).toLocaleString('id-ID')}</td></tr>
                <tr><td align="right">Total:</td><td align="right"><b>${(data.total || 0).toLocaleString('id-ID')}</b></td></tr>
                <tr><td align="right">Bayar:</td><td align="right">${(data.bayar || 0).toLocaleString('id-ID')}</td></tr>
                <tr><td align="right">Kembalian:</td><td align="right">${(data.kembalian || 0).toLocaleString('id-ID')}</td></tr>
              </table>
            </td>
          </tr>
          <tr><td colspan="2"><hr style="border-top:1px dashed black;"></td></tr>
          <tr>
            <td colspan="2" align="center" style="font-size: 10px; padding-top: 10px;">
              Terimakasih<br>Barang yang sudah dibeli tidak dapat dikembalikan
              ${promoMsg}
            </td>
          </tr>
        </table>
      </div>
    `
    
    // Print JS call
    setTimeout(async () => {
      const printJS = (await import('print-js')).default
      printJS({
        printable: 'print-area',
        type: 'html',
        targetStyles: ['*']
      })
    }, 200)
  }
}

const formatNumber = (num: any) => {
  if (num === null || num === undefined || isNaN(num)) return '0'
  return Number(num).toLocaleString('id-ID')
}

watch(cartList, (newVal) => {
  if (newVal.length > 0) {
    if (potongan.value > 0) potonganInput.value = potongan.value
    if (bayar.value > 0) bayarInput.value = bayar.value
  }
})

onMounted(async () => {
  await fetchLastTrx()
  if (lastTrxOptions.value.length > 0) {
    selectedLastTrx.value = lastTrxOptions.value[0].trx_num
  }
  await fetchListTrx()
  focusBarcode()
})

onUnmounted(() => {
  if (qrisCheckInterval) clearInterval(qrisCheckInterval)
  if (qrisCheckTimeout) clearTimeout(qrisCheckTimeout)
})
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>
