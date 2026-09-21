<template>
  <NuxtLayout name="dashboard">
    <div class="min-h-screen bg-slate-50/50 p-4 lg:p-8">
    <div class="max-w-[1600px] mx-auto">
      
      <!-- HEADER -->
      <div class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <UIcon name="i-heroicons-currency-dollar" class="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 class="text-2xl font-black text-slate-800 tracking-tight">Master Price & Discount</h1>
            <p class="text-xs font-semibold text-slate-500 tracking-wide mt-0.5 uppercase">
              {{ viewMode === 'master' ? 'Kelola Data Master' : `Detail: ${selectedHeader?.journal_name || 'Set'}` }}
            </p>
          </div>
        </div>
        
        <div v-if="viewMode === 'detail'" class="flex gap-2">
          <UButton @click="goBackToMaster" size="sm" color="gray" variant="soft" icon="i-heroicons-arrow-left" class="rounded-xl font-bold uppercase tracking-wider text-[10px]">Back to Master</UButton>
        </div>
      </div>

      <!-- MASTER VIEW -->
      <div v-if="viewMode === 'master'" class="grid grid-cols-1 gap-6">
        <div class="backdrop-blur-md bg-white/90 rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden flex flex-col">
          <div class="bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-100 px-6 py-4 flex flex-wrap items-center gap-4">
            
            <USelect v-model="masterForm.txtset" :options="setOptions" option-attribute="label" value-attribute="value" class="w-32" />
            
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-slate-500 uppercase">Name:</span>
              <UInput v-model="masterForm.txtnameset" placeholder="Name Set" class="w-40" />
            </div>
            
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-slate-500 uppercase">Start:</span>
              <UInput v-model="masterForm.txtstartdate" type="date" class="w-36" />
            </div>
            
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-slate-500 uppercase">End:</span>
              <UInput v-model="masterForm.txtenddate" type="date" class="w-36" />
            </div>

            <UButton @click="handleSaveNewMaster" :loading="isSaving" size="sm" color="indigo" variant="solid" icon="i-heroicons-plus" class="rounded-xl shadow-md shadow-indigo-500/20 font-bold uppercase tracking-wider text-[10px]">NEW SET</UButton>
            
            <div class="flex-1 flex justify-end">
              <UInput v-model="masterKeyword" @keyup.enter="loadMasterList" icon="i-heroicons-magnifying-glass" placeholder="Search journal..." class="w-48" />
            </div>
          </div>
          
          <div class="p-6 flex-1">
            <div class="border border-slate-100 rounded-2xl overflow-hidden shadow-sm bg-white min-h-[300px]">
              <div class="overflow-x-auto custom-scrollbar">
                <table class="w-full text-sm text-left">
                  <thead class="bg-slate-50/80 backdrop-blur-sm border-b border-slate-100">
                    <tr>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px] w-24">Option</th>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Set On</th>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Journal Code</th>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Journal Name</th>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Start Date</th>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px]">End Date</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-50">
                    <tr v-if="isLoadingMaster">
                      <td colspan="6" class="px-4 py-12 text-center text-slate-400 font-medium">
                        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 mx-auto mb-3 animate-spin text-indigo-400" />
                        <p class="text-xs uppercase tracking-widest">Loading Master Data...</p>
                      </td>
                    </tr>
                    <tr v-else-if="masterPriceList.length === 0">
                      <td colspan="6" class="px-4 py-12 text-center text-slate-400 font-medium">
                        <UIcon name="i-heroicons-document-magnifying-glass" class="w-8 h-8 mx-auto mb-3 text-slate-300" />
                        <p class="text-xs uppercase tracking-widest">No data found</p>
                      </td>
                    </tr>
                    <tr v-else v-for="item in masterPriceList" :key="item.id" class="hover:bg-indigo-50/50 transition-colors group">
                      <td class="px-4 py-2">
                        <UButton @click="openDetail(item)" size="xs" color="indigo" variant="soft" class="font-bold text-[10px] rounded-lg">UPDATE</UButton>
                      </td>
                      <td class="px-4 py-2 font-semibold text-slate-700">
                        <UBadge :color="item.set_on === 1 ? 'emerald' : 'orange'" variant="subtle" size="xs">{{ item.set_on === 1 ? 'Price' : 'Discount' }}</UBadge>
                      </td>
                      <td class="px-4 py-2 font-mono text-xs">
                        <button @click="openDetail(item)" class="text-blue-600 hover:text-blue-800 hover:underline font-semibold transition-colors">
                          {{ item.journal_code }}
                        </button>
                      </td>
                      <td class="px-4 py-2 font-medium text-slate-800">{{ item.journal_name }}</td>
                      <td class="px-4 py-2 text-slate-500 text-xs">{{ formatDate(item.start_date) }}</td>
                      <td class="px-4 py-2 text-slate-500 text-xs">{{ formatDate(item.end_date) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <!-- Pagination -->
              <div class="px-4 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Rows:</span>
                  <USelectMenu v-model="masterPerPage" :options="pageSizeOptions" value-attribute="value" option-attribute="label" class="w-20" size="xs" @change="masterPage = 1; loadMasterList()" />
                </div>
                <div class="flex flex-1 justify-center">
                  <UPagination v-model="masterPage" :page-count="masterPerPage" :total="totalMasterPrice" size="sm" @update:model-value="loadMasterList" />
                </div>
                <div class="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Total: {{ totalMasterPrice }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- DETAIL VIEW -->
      <div v-else-if="viewMode === 'detail'" class="grid grid-cols-1 gap-6">
        <!-- FORM HEADER -->
        <div class="backdrop-blur-md bg-white/90 rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-6 relative z-20">
          <div class="flex flex-wrap gap-4 items-end">
            <!-- COMMON SETTINGS -->
            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Set On</label>
              <div class="flex items-center gap-2">
                <USelect v-model="detailForm.txtset" :options="setOnTypeOptions" option-attribute="label" value-attribute="value" placeholder="Select Type" class="w-32" @update:model-value="handleSetOnTypeChange" />
                <USelect v-model="detailForm.txtvalueseton" :options="setOnValueOptions" option-attribute="name" value-attribute="id" placeholder="Select Value" class="w-40" :disabled="!detailForm.txtset" />
              </div>
            </div>

            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Kategory</label>
              <USelect v-model="detailForm.txtkategory" :options="kategoryOptions" option-attribute="name_prod_cate" value-attribute="id" placeholder="Select Kategory" class="w-40" @update:model-value="handleKategoryChange" />
            </div>

            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Item</label>
              <USelectMenu v-model="detailForm.txtitem" :options="itemOptions" option-attribute="name_produk" value-attribute="id" placeholder="Select Item" class="w-48" :disabled="!detailForm.txtkategory" searchable />
            </div>

            <!-- PRICE SPECIFIC -->
            <template v-if="selectedHeader?.set_on === 1">
              <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Amount</label>
                <UInput v-model="detailForm.txtvalue" type="number" placeholder="Price Amount" class="w-32" />
              </div>
              <UButton @click="handleSaveDetail" :loading="isSaving" size="sm" color="emerald" variant="solid" icon="i-heroicons-check" class="rounded-xl shadow-md shadow-emerald-500/20 font-bold uppercase tracking-wider text-[10px]">SET PRICE</UButton>
            </template>
            
            <!-- DISCOUNT SPECIFIC -->
            <template v-if="selectedHeader?.set_on === 2">
              <div class="w-full h-px bg-slate-100 my-2 lg:hidden"></div>
              
              <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Type</label>
                <USelect v-model="detailForm.txtdistype" :options="discountTypeOptions" option-attribute="label" value-attribute="value" placeholder="Type" class="w-40" @update:model-value="handleDiscountTypeChange" />
              </div>

              <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Min / Max Qty</label>
                <div class="flex items-center gap-2">
                  <UInput v-model="detailForm.txtminqty" type="number" placeholder="Min" class="w-20" />
                  <span class="text-slate-400">-</span>
                  <UInput v-model="detailForm.txtmaxqty" type="number" placeholder="Max" class="w-20" />
                </div>
              </div>

              <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Value (Amount)</label>
                <UInput v-model="detailForm.txtvalue" type="number" placeholder="Value" class="w-32" :disabled="detailForm.txtdistype === 1 || detailForm.txtdistype === 3" />
              </div>

              <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Multi</label>
                <USelect v-model="detailForm.txtkelipatan" :options="[{label:'Yes', value:'false'}, {label:'No', value:'true'}]" option-attribute="label" value-attribute="value" class="w-20" />
              </div>
              
              <UButton @click="handleSaveDetail" :loading="isSaving" size="sm" color="orange" variant="solid" icon="i-heroicons-plus" class="rounded-xl shadow-md shadow-orange-500/20 font-bold uppercase tracking-wider text-[10px]">ADD DISC</UButton>
            </template>
          </div>
        </div>

        <!-- DETAIL GRID -->
        <div class="backdrop-blur-md bg-white/90 rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden">
          <div class="bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-100 px-6 py-4 flex justify-between items-center">
            <h3 class="text-sm font-extrabold text-slate-800 uppercase tracking-widest">Detail Records</h3>
            <div class="flex items-center gap-2">
               <UInput v-model="detailKeyword" @keyup.enter="loadDetailList" icon="i-heroicons-magnifying-glass" placeholder="Search..." size="xs" class="w-48" />
            </div>
          </div>
          <div class="p-6">
            <div class="border border-slate-100 rounded-2xl overflow-hidden shadow-sm bg-white min-h-[300px]">
              <div class="overflow-x-auto custom-scrollbar">
                
                <!-- TABLE FOR PRICE -->
                <table v-if="selectedHeader?.set_on === 1" class="w-full text-sm text-left">
                  <thead class="bg-slate-50/80 backdrop-blur-sm border-b border-slate-100">
                    <tr>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px] w-20">Option</th>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px]">SET ON</th>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Kode Produk</th>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Produk Name</th>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Kategory</th>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Konversi UOM</th>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px] text-right">Amount</th>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Create Date</th>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Update Date</th>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Update By</th>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px] text-center">Active</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-50">
                    <tr v-if="isLoadingDetail">
                      <td colspan="6" class="px-4 py-12 text-center text-slate-400">Loading...</td>
                    </tr>
                    <tr v-else-if="detailList.length === 0">
                      <td colspan="11" class="px-4 py-12 text-center text-slate-400">No records found</td>
                    </tr>
                    <tr v-else v-for="item in detailList" :key="item.id" class="hover:bg-slate-50 transition-colors">
                      <td class="px-4 py-2">
                        <UButton @click="openUpdatePriceModal(item)" size="xs" color="indigo" variant="soft" class="font-bold text-[10px] rounded-lg">UPDATE</UButton>
                      </td>
                      <td class="px-4 py-2 text-slate-600 text-xs font-semibold">{{ item.set_on }}</td>
                      <td class="px-4 py-2 font-mono text-xs text-slate-600">{{ item.kode_produk }}</td>
                      <td class="px-4 py-2 font-medium text-slate-800 text-xs">{{ item.name_produk }}</td>
                      <td class="px-4 py-2 text-slate-500 text-[10px]">{{ item.name_prod_cate }}</td>
                      <td class="px-4 py-2 text-slate-500 text-[10px]">{{ item.uom }}</td>
                      <td class="px-4 py-2 text-slate-800 font-semibold text-right">{{ formatNumber(item.amount) }}</td>
                      <td class="px-4 py-2 text-slate-500 text-[10px] whitespace-nowrap">{{ formatDateTime(item.create_date) }}</td>
                      <td class="px-4 py-2 text-slate-500 text-[10px] whitespace-nowrap">{{ formatDateTime(item.update_date) }}</td>
                      <td class="px-4 py-2 text-slate-500 text-[10px]">{{ item.usrnm }}</td>
                      <td class="px-4 py-2 text-center">
                        <UIcon :name="item.active ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'" :class="item.active ? 'text-emerald-500' : 'text-rose-500'" class="w-5 h-5" />
                      </td>
                    </tr>
                  </tbody>
                </table>

                <!-- TABLE FOR DISCOUNT -->
                <table v-if="selectedHeader?.set_on === 2" class="w-full text-sm text-left">
                  <thead class="bg-slate-50/80 backdrop-blur-sm border-b border-slate-100">
                    <tr>
                      <th class="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px] w-20">Option</th>
                      <th class="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Produk</th>
                      <th class="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Type</th>
                      <th class="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px] text-center w-20">Min</th>
                      <th class="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px] text-center w-20">Max</th>
                      <th class="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px] text-center w-24">Disc Amt</th>
                      <th class="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px] text-center w-20">Multi</th>
                      <th class="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px] text-center w-20">Active</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-50">
                    <tr v-if="isLoadingDetail">
                      <td colspan="8" class="px-4 py-12 text-center text-slate-400">Loading...</td>
                    </tr>
                    <tr v-else-if="detailList.length === 0">
                      <td colspan="8" class="px-4 py-12 text-center text-slate-400">No records found</td>
                    </tr>
                    <tr v-else v-for="item in detailList" :key="item.id" class="hover:bg-slate-50 transition-colors">
                      <td class="px-3 py-2">
                        <UButton @click="handleUpdateDiscountRow(item)" size="xs" color="indigo" variant="soft" class="font-bold text-[10px] rounded-lg">SAVE</UButton>
                      </td>
                      <td class="px-3 py-2">
                        <div class="font-medium text-slate-800 text-xs">{{ item.name_produk }}</div>
                        <div class="font-mono text-[10px] text-slate-500">{{ item.kode_produk }}</div>
                      </td>
                      <td class="px-3 py-2 text-slate-500 text-xs">{{ formatDiscountType(item.dc_set) }}</td>
                      
                      <!-- Editable Fields for Discount -->
                      <td class="px-3 py-2 text-center">
                        <UInput v-model="item.min_qty" type="number" size="xs" class="w-16 mx-auto text-center font-semibold" />
                      </td>
                      <td class="px-3 py-2 text-center">
                        <UInput v-model="item.max_qty" type="number" size="xs" class="w-16 mx-auto text-center font-semibold" />
                      </td>
                      <td class="px-3 py-2 text-center">
                        <UInput v-model="item.amount" type="number" size="xs" class="w-20 mx-auto text-center font-semibold" />
                      </td>
                      <td class="px-3 py-2 text-center">
                        <UToggle v-model="item.multi" size="sm" color="indigo" />
                      </td>
                      <td class="px-3 py-2 text-center">
                        <UToggle v-model="item.active" size="sm" color="emerald" />
                      </td>
                    </tr>
                  </tbody>
                </table>

              </div>
              
              <!-- Pagination Detail -->
              <div class="px-4 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Rows:</span>
                  <USelectMenu v-model="detailPerPage" :options="pageSizeOptions" value-attribute="value" option-attribute="label" class="w-20" size="xs" @change="detailPage = 1; loadDetailList()" />
                </div>
                <div class="flex flex-1 justify-center">
                  <UPagination v-model="detailPage" :page-count="detailPerPage" :total="totalDetail" size="sm" @update:model-value="loadDetailList" />
                </div>
                <div class="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Total: {{ totalDetail }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
    
    <!-- MODAL UPDATE PRICE DETAIL -->
    <UModal v-model="isUpdatePriceModalOpen">
      <div class="p-6">
        <h3 class="text-lg font-bold text-slate-800 mb-4">Update Price Detail</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Product</label>
            <div class="font-medium text-slate-800">{{ updatePriceForm.name_produk }}</div>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Amount</label>
            <UInput v-model="updatePriceForm.amount" type="number" />
          </div>
          <div class="flex items-center justify-between">
            <label class="block text-xs font-semibold text-slate-600">Active</label>
            <UToggle v-model="updatePriceForm.active" color="emerald" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Password</label>
            <UInput v-model="updatePriceForm.password" type="password" placeholder="Confirm password" />
          </div>
        </div>
        <div class="mt-6 flex justify-end gap-3">
          <UButton @click="isUpdatePriceModalOpen = false" color="gray" variant="soft">Cancel</UButton>
          <UButton @click="submitUpdatePrice" :loading="isSaving" color="indigo">Save Changes</UButton>
        </div>
      </div>
    </UModal>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useMasterPrice } from '~/composables/useMasterPrice'

const pageSizeOptions = [10, 20, 50, 100].map(value => ({ label: String(value), value }))

definePageMeta({ layout: false })

const { 
  masterPriceList, totalMasterPrice, detailList, totalDetail,
  isLoadingMaster, isLoadingDetail, isSaving,
  fetchMasterPrice, saveNewMasterPrice, fetchPriceDetail,
  fetchSetOnOptions, fetchKategory, fetchItemsByKategory,
  savePriceDetail, updatePriceDisc, updatePriceDetail
} = useMasterPrice()

const toast = useToast()

// View State
const viewMode = ref<'master' | 'detail'>('master')
const selectedHeader = ref<any>(null)

// --- MASTER LIST STATE ---
const masterKeyword = ref('')
const masterPage = ref(1)
const masterPerPage = ref(10)
const setOptions = [
  { label: 'Price', value: 1 },
  { label: 'Discount', value: 2 }
]
const masterForm = ref({
  txtset: 1,
  txtnameset: '',
  txtstartdate: '',
  txtenddate: ''
})

const loadMasterList = async () => {
  await fetchMasterPrice(masterKeyword.value, masterPage.value, masterPerPage.value)
}

const handleSaveNewMaster = async () => {
  if (!masterForm.value.txtnameset || !masterForm.value.txtstartdate || !masterForm.value.txtenddate) {
    toast.add({ title: 'Validation Error', description: 'Please fill all fields', color: 'red' })
    return
  }
  const res = await saveNewMasterPrice({
    v_id: 0,
    v_option: 0,
    v_txtset: masterForm.value.txtset,
    v_txtnameset: masterForm.value.txtnameset,
    v_txtstartdate: masterForm.value.txtstartdate,
    v_txtenddate: masterForm.value.txtenddate
  })
  if (res.success) {
    toast.add({ title: 'Success', description: 'Master saved successfully', color: 'green' })
    masterForm.value.txtnameset = ''
    loadMasterList()
  } else {
    toast.add({ title: 'Error', description: 'Failed to save data', color: 'red' })
  }
}

// --- DETAIL LIST STATE ---
const detailKeyword = ref('')
const detailPage = ref(1)
const detailPerPage = ref(10)

const setOnTypeOptions = [
  { label: 'Type', value: 'type_set' },
  { label: 'Group', value: 'group_set' },
  { label: 'Store', value: 'store_set' },
  { label: 'DC', value: 'dc_set' },
  { label: 'PROD', value: 'prod_set' }
]

const discountTypeOptions = [
  { label: 'Buy Set Get One', value: 1 },
  { label: 'Buy Set Get Amount', value: 2 },
  { label: 'Discount Percent Price', value: 3 }
]

const setOnValueOptions = ref<any[]>([])
const kategoryOptions = ref<any[]>([])
const itemOptions = ref<any[]>([])

const detailForm = ref({
  txtset: '',
  txtvalueseton: null as any,
  txtkategory: null as any,
  txtitem: null as any,
  txtvalue: '0',
  txtdistype: null as any,
  txtminqty: '0',
  txtmaxqty: '0',
  txtkelipatan: 'false'
})

const goBackToMaster = () => {
  viewMode.value = 'master'
  selectedHeader.value = null
  detailList.value = []
}

const openDetail = async (item: any) => {
  selectedHeader.value = item
  viewMode.value = 'detail'
  detailKeyword.value = ''
  detailPage.value = 1
  
  // reset form
  detailForm.value = {
    txtset: '', txtvalueseton: null, txtkategory: null, txtitem: null,
    txtvalue: '0', txtdistype: null, txtminqty: '0', txtmaxqty: '0', txtkelipatan: 'false'
  }
  setOnValueOptions.value = []
  itemOptions.value = []

  // Load dropdowns
  kategoryOptions.value = await fetchKategory()
  
  await loadDetailList()
}

const loadDetailList = async () => {
  if (!selectedHeader.value) return
  await fetchPriceDetail(selectedHeader.value.id, selectedHeader.value.set_on, detailKeyword.value, detailPage.value, detailPerPage.value)
}

// Dropdown change handlers
const handleSetOnTypeChange = async (val: string) => {
  detailForm.value.txtvalueseton = null
  if (val) {
    setOnValueOptions.value = await fetchSetOnOptions(val)
  } else {
    setOnValueOptions.value = []
  }
}

const handleKategoryChange = async (val: number) => {
  detailForm.value.txtitem = null
  if (val) {
    itemOptions.value = await fetchItemsByKategory(val)
  } else {
    itemOptions.value = []
  }
}

const handleDiscountTypeChange = (val: number) => {
  if (val === 1 || val === 3) {
    detailForm.value.txtvalue = '0'
  }
}

const handleSaveDetail = async () => {
  if (!selectedHeader.value) return
  if (!detailForm.value.txtvalueseton || !detailForm.value.txtitem) {
    toast.add({ title: 'Validation', description: 'Please select Set On Value and Item', color: 'orange' })
    return
  }

  const payload = {
    v_id_header: selectedHeader.value.id,
    v_option: selectedHeader.value.set_on,
    v_id_item: Number(detailForm.value.txtitem),
    name_set: detailForm.value.txtset,
    v_set: Number(detailForm.value.txtvalueseton),
    v_amount: String(detailForm.value.txtvalue || 0),
    v_distype: detailForm.value.txtdistype ? Number(detailForm.value.txtdistype) : 0,
    v_minqty: String(detailForm.value.txtminqty || 0),
    v_maxqty: String(detailForm.value.txtmaxqty || 0),
    v_kelipatan: detailForm.value.txtkelipatan
  }

  const res = await savePriceDetail(payload)
  if (res.success) {
    toast.add({ title: 'Success', description: 'Detail added successfully', color: 'green' })
    // reset form some fields
    detailForm.value.txtitem = null
    detailForm.value.txtvalue = '0'
    await loadDetailList()
  } else {
    toast.add({ title: 'Error', description: 'Failed to add detail', color: 'red' })
  }
}

const handleUpdateDiscountRow = async (row: any) => {
  const res = await updatePriceDisc({
    v_id: row.id,
    v_qty_min: String(row.min_qty),
    v_qty_max: String(row.max_qty),
    v_free_i: String(row.amount), // free item amount is mapped to amount
    v_multi: row.multi,
    v_active: row.active
  })
  if (res.success) {
    toast.add({ title: 'Success', description: 'Row updated', color: 'green' })
  } else {
    toast.add({ title: 'Error', description: 'Failed to update row', color: 'red' })
  }
}

// Update Price Detail (Modal)
const isUpdatePriceModalOpen = ref(false)
const updatePriceForm = ref({
  id: 0,
  name_produk: '',
  amount: '0',
  active: true,
  password: ''
})

const openUpdatePriceModal = (item: any) => {
  updatePriceForm.value = {
    id: item.id,
    name_produk: item.name_produk,
    amount: String(item.amount),
    active: item.active,
    password: ''
  }
  isUpdatePriceModalOpen.value = true
}

const submitUpdatePrice = async () => {
  if (!updatePriceForm.value.password) {
    toast.add({ title: 'Validation', description: 'Password is required to update price', color: 'orange' })
    return
  }
  const res = await updatePriceDetail({
    v_id: updatePriceForm.value.id,
    v_amount: String(updatePriceForm.value.amount),
    v_active: updatePriceForm.value.active ? '1' : '0',
    txtpassword: updatePriceForm.value.password
  })
  if (res.success && res.data?.status === 1) {
    toast.add({ title: 'Success', description: 'Price updated successfully', color: 'green' })
    isUpdatePriceModalOpen.value = false
    loadDetailList()
  } else {
    toast.add({
      title: 'Error',
      description: typeof res.message === 'string' ? res.message : 'Failed to update price or wrong password',
      color: 'red'
    })
  }
}


// Formatters
const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })
}

const formatDateTime = (dateStr: string) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString('id-ID', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

const formatNumber = (num: any) => {
  return Number(num || 0).toLocaleString('id-ID')
}

const formatDiscountType = (val: number) => {
  if (val === 1) return 'Buy Set Get One'
  if (val === 2) return 'Buy Set Get Amount'
  if (val === 3) return 'Discount Percent Price'
  return '-'
}

onMounted(() => {
  loadMasterList()
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  height: 6px;
  width: 6px;
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
