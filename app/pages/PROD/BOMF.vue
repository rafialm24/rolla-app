<template>
  <NuxtLayout name="dashboard">
    <div class="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-50 via-gray-100 to-slate-200 p-4 lg:p-8 font-sans relative overflow-hidden">
      <!-- Decorative Background Elements -->
      <div class="absolute top-0 left-0 w-96 h-96 bg-blue-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div class="absolute top-0 right-0 w-96 h-96 bg-indigo-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

      <!-- Header Section -->
      <div class="relative backdrop-blur-xl bg-white/80 rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white mb-8 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <UIcon name="i-heroicons-cube" class="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 class="text-2xl font-black text-slate-800 tracking-tight">Bill Of Materials Finish</h1>
            <p class="text-xs font-semibold text-slate-500 tracking-wide mt-0.5 uppercase">Master Bill Of Materials (BOM) Finish Produksi</p>
          </div>
        </div>
      </div>

      <!-- CARD 1: Master Bill Of Materials -->
      <div class="backdrop-blur-md bg-white/90 rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden transition-all duration-300 hover:shadow-xl mb-8 relative z-10">
        <div class="bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-100 px-6 py-4 flex justify-between items-center cursor-pointer select-none" @click="isCard1Open = !isCard1Open">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><UIcon name="i-heroicons-circle-stack" class="w-4 h-4" /></div>
            <h2 class="text-sm font-extrabold text-slate-800 uppercase tracking-widest">Master Bill Of Materials Finish</h2>
          </div>
          <UIcon name="i-heroicons-chevron-down" :class="['w-5 h-5 text-slate-400 transition-transform duration-300', isCard1Open ? 'rotate-180' : '']" />
        </div>

        <div v-show="isCard1Open" class="p-6">
          <!-- Search Header -->
          <div class="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 bg-slate-50/50 p-4 rounded-2xl border border-slate-100 shadow-inner">
            <div class="flex-1 w-full max-w-sm relative">
              <UInput 
                v-model="searchHeader" 
                @keyup.enter="handleSearchHeader"
                icon="i-heroicons-magnifying-glass"
                placeholder="Cari kode/nama produk..."
                size="md"
                :ui="{ rounded: 'rounded-xl', base: 'font-semibold' }"
              />
            </div>
            <UButton @click="handleSearchHeader" size="md" color="blue" variant="solid" icon="i-heroicons-magnifying-glass" class="rounded-xl shadow-md shadow-blue-500/20 font-bold uppercase tracking-widest text-[10px] justify-center h-[38px]">
              Search
            </UButton>
          </div>

          <div class="border border-slate-100 rounded-2xl overflow-hidden shadow-sm bg-white">
            <div class="overflow-x-auto max-h-[400px] custom-scrollbar">
              <table class="w-full text-xs text-left min-w-[1800px]">
                <thead class="bg-slate-50/80 backdrop-blur-sm border-b border-slate-100 sticky top-0 z-10">
                  <tr>
                    <th class="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] w-16 text-center">Option</th>
                    <th class="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] whitespace-nowrap">Kode Produk</th>
                    <th class="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] whitespace-nowrap">Nama Produk</th>
                    <th class="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px]">UOM</th>
                    <th class="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] w-32">Kategori</th>
                    <th class="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] w-32">UOM Adonan</th>
                    <th class="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] text-right w-20">Daya Tahan</th>
                    <th class="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] text-right w-24">Labor Cost</th>
                    <th class="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] text-right w-24">Transport Cost</th>
                    <th class="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] text-right w-24">Cost Other</th>
                    <th class="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] text-right w-20">Std Hour</th>
                    <th class="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] text-right w-20">Std Qty Batch</th>
                    <th class="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] text-right w-20">Berat Bersih</th>
                    <th class="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] text-right w-20">Std RM</th>
                    <th class="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] text-right w-20">Std AD</th>
                    <th class="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] text-right w-20">Std SM</th>
                    <th class="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] w-20 text-center">Action</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-50">
                  <tr v-if="isLoadingHeader">
                    <td colspan="17" class="px-4 py-12 text-center text-slate-400"><UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin mx-auto mb-2 text-blue-500" /><p class="font-semibold text-[10px]">Memuat data...</p></td>
                  </tr>
                  <tr v-else-if="bomHeaderList.length === 0">
                    <td colspan="17" class="px-4 py-12 text-center text-slate-400"><UIcon name="i-heroicons-inbox" class="w-8 h-8 mx-auto mb-2 text-slate-300" /><p class="font-semibold text-[10px]">Tidak ada data</p></td>
                  </tr>
                  <tr 
                    v-else 
                    v-for="(row, idx) in bomHeaderList" 
                    :key="row.bom_id || idx"
                    class="hover:bg-slate-50/80 transition-colors"
                    :class="{'bg-blue-50/50 shadow-inner': selectedHeaderId === row.bom_id}"
                  >
                    <td class="px-3 py-2 text-center">
                      <UButton v-if="row.bom_id" @click="handleShowDetail(row)" size="2xs" color="indigo" variant="soft" icon="i-heroicons-eye" class="font-bold text-[9px] uppercase tracking-wider mx-auto">Show</UButton>
                    </td>
                    <td class="px-3 py-2 font-extrabold text-slate-700 whitespace-nowrap">{{ row.kode_produk || row.kode || '-' }}</td>
                    <td class="px-3 py-2 font-bold text-slate-600 whitespace-nowrap">{{ row.name_produk || row.name || '-' }}</td>
                    <td class="px-3 py-2 font-bold text-slate-500">{{ row.uom || '-' }}</td>
                    <!-- Inline Inputs -->
                    <td class="px-3 py-2">
                      <USelect v-model="row._kategory_artikel" :options="categoryBomList.map(c => ({label: c.name_prod_cate, value: c.id}))" placeholder="--Pilih--" size="xs" :ui="{ rounded: 'rounded-md', base: 'font-semibold text-xs' }" />
                    </td>
                    <td class="px-3 py-2">
                      <USelect v-model="row._dough_id" :options="(row._uomOptions || []).map(u => ({label: u.name_prod_cate, value: u.id}))" placeholder="--Pilih--" size="xs" :ui="{ rounded: 'rounded-md', base: 'font-semibold text-xs' }" />
                    </td>
                    <td class="px-3 py-2"><UInput type="number" v-model="row._durability" size="xs" :ui="{ base: 'text-right font-black', rounded: 'rounded-md' }" /></td>
                    <td class="px-3 py-2"><UInput type="number" v-model="row._labor_cost" size="xs" :ui="{ base: 'text-right font-black text-blue-600', rounded: 'rounded-md' }" /></td>
                    <td class="px-3 py-2"><UInput type="number" v-model="row._transport_cost" size="xs" :ui="{ base: 'text-right font-black text-blue-600', rounded: 'rounded-md' }" /></td>
                    <td class="px-3 py-2"><UInput type="number" v-model="row._cost_lain" size="xs" :ui="{ base: 'text-right font-black text-blue-600', rounded: 'rounded-md' }" /></td>
                    <td class="px-3 py-2"><UInput type="number" v-model="row._standart_hour" size="xs" :ui="{ base: 'text-right font-black text-purple-600', rounded: 'rounded-md' }" /></td>
                    <td class="px-3 py-2"><UInput type="number" v-model="row._standart_qty_batch" size="xs" :ui="{ base: 'text-right font-black text-purple-600', rounded: 'rounded-md' }" /></td>
                    <td class="px-3 py-2"><UInput type="number" v-model="row._standard_weight" size="xs" :ui="{ base: 'text-right font-black', rounded: 'rounded-md' }" /></td>
                    <td class="px-3 py-2"><UInput type="number" v-model="row._standard_rm" size="xs" :ui="{ base: 'text-right font-black text-emerald-600', rounded: 'rounded-md' }" /></td>
                    <td class="px-3 py-2"><UInput type="number" v-model="row._standard_ad" size="xs" :ui="{ base: 'text-right font-black text-emerald-600', rounded: 'rounded-md' }" /></td>
                    <td class="px-3 py-2"><UInput type="number" v-model="row._standard_sm" size="xs" :ui="{ base: 'text-right font-black text-emerald-600', rounded: 'rounded-md' }" /></td>
                    
                    <td class="px-3 py-2 text-center">
                      <UButton @click="handleSetHeader(row)" size="2xs" :color="row.bom_id ? 'blue' : 'emerald'" variant="solid" class="font-bold text-[9px] uppercase tracking-wider mx-auto w-full justify-center shadow-sm">
                        {{ row.bom_id ? 'UPDATE' : 'SET' }}
                      </UButton>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <!-- Pagination Master -->
          <div class="mt-5 flex items-center justify-between bg-slate-50/50 p-3 rounded-xl border border-slate-100">
            <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total: {{ totalBomHeader }} items</span>
            <div class="flex items-center gap-2">
              <UButton @click="changePageHeader(-1)" :disabled="pageHeader <= 1" size="xs" color="gray" variant="ghost" icon="i-heroicons-chevron-left" />
              <span class="text-[10px] font-bold text-slate-700 mx-2">Page {{ pageHeader }}</span>
              <UButton @click="changePageHeader(1)" size="xs" color="gray" variant="ghost" icon="i-heroicons-chevron-right" />
            </div>
          </div>
        </div>
      </div>

      <!-- CARD 2: List BOM Formula -->
      <div v-if="selectedHeaderId" class="backdrop-blur-md bg-white/90 rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden transition-all duration-300 hover:shadow-xl mb-8 relative z-10">
        <div class="bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-100 px-6 py-4 flex justify-between items-center cursor-pointer select-none" @click="isCard2Open = !isCard2Open">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center"><UIcon name="i-heroicons-beaker" class="w-4 h-4" /></div>
            <h2 class="text-sm font-extrabold text-slate-800 uppercase tracking-widest">
              List BOM Formula <UBadge color="blue" variant="subtle" size="sm" class="ml-2">{{ selectedHeaderName }}</UBadge>
            </h2>
          </div>
          <UIcon name="i-heroicons-chevron-down" :class="['w-5 h-5 text-slate-400 transition-transform duration-300', isCard2Open ? 'rotate-180' : '']" />
        </div>

        <div v-show="isCard2Open" class="p-6">
          <!-- TB Form Detail -->
          <div class="bg-slate-50/50 border border-slate-100 p-5 rounded-2xl flex flex-wrap items-end gap-4 mb-6 shadow-inner">
            <div class="flex-1 w-full min-w-[120px]">
              <label class="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Formula:</label>
              <USelect v-model="detailForm.formula" :options="[{label:'Formula 1', value:1},{label:'Formula 2', value:2}]" @change="handleFormulaChange" size="md" :ui="{ rounded: 'rounded-xl', base: 'font-semibold' }" />
            </div>
            <div class="flex-1 w-full min-w-[160px]">
              <label class="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Mix Kategory:</label>
              <USelect v-model="detailForm.mix_id" :options="[{label:'PREMIX', value:1},{label:'SUPPORTING MATERIAL', value:2},{label:'ADDITIVE', value:3}]" @change="handleMixChange" size="md" :ui="{ rounded: 'rounded-xl', base: 'font-semibold' }" />
            </div>
            <div class="flex-[2] w-full min-w-[200px]">
              <label class="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Item:</label>
              <USelect v-model="detailForm.id_item" :options="[{label:'--Pilih Item--', value:0}, ...comboMaterialList.map(i => ({label: i.name_produk, value: i.id}))]" size="md" :ui="{ rounded: 'rounded-xl', base: 'font-semibold' }" />
            </div>
            <div class="flex-1 w-full min-w-[100px]">
              <label class="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Qty:</label>
              <UInput type="number" v-model="detailForm.qty" size="md" :ui="{ rounded: 'rounded-xl', base: 'font-bold' }" />
            </div>
            <div class="flex-1 w-full min-w-[100px]">
              <label class="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Optional:</label>
              <USelect v-model="detailForm.optional" :options="[{label:'False', value:'false'},{label:'True', value:'true'}]" size="md" :ui="{ rounded: 'rounded-xl', base: 'font-semibold' }" />
            </div>
            <UButton @click="handleAddDetail" size="md" color="emerald" variant="solid" icon="i-heroicons-plus" class="rounded-xl shadow-md shadow-emerald-500/20 font-bold uppercase tracking-widest text-[10px] justify-center h-[38px] min-w-[100px]">
              SET
            </UButton>
          </div>

          <!-- Table Detail -->
          <div class="border border-slate-100 rounded-2xl overflow-hidden shadow-sm bg-white">
            <div class="overflow-x-auto custom-scrollbar">
              <table class="w-full text-xs text-left min-w-[1800px]">
                <thead class="bg-slate-50/80 backdrop-blur-sm border-b border-slate-100 sticky top-0">
                  <tr>
                    <th class="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] text-center w-20">Action</th>
                    <th class="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px]">Formula</th>
                    <th class="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] text-center w-16">Status</th>
                    <th class="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] whitespace-nowrap">Kode Produk</th>
                    <th class="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] whitespace-nowrap">Nama Produk</th>
                    <th class="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] whitespace-nowrap">BOM Konversi</th>
                    <th class="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] text-right w-24">Netto</th>
                    <th class="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] text-right w-24">Std Cost</th>
                    <th class="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] w-32">Mix ID</th>
                    <th class="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] text-center">Optional</th>
                    <th class="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] whitespace-nowrap">Create By</th>
                    <th class="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] whitespace-nowrap">Create Date</th>
                    <th class="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] whitespace-nowrap">Update By</th>
                    <th class="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] whitespace-nowrap">Update Date</th>
                    <th class="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] text-center w-20">Delete</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-50">
                  <tr v-if="isLoadingDetail">
                    <td colspan="15" class="px-4 py-12 text-center text-slate-400"><UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin mx-auto mb-2 text-indigo-500" /><p class="font-semibold text-[10px]">Memuat detail...</p></td>
                  </tr>
                  <tr v-else-if="bomDetailList.length === 0">
                    <td colspan="15" class="px-4 py-12 text-center text-slate-400"><UIcon name="i-heroicons-inbox" class="w-8 h-8 mx-auto mb-2 text-slate-300" /><p class="font-semibold text-[10px]">Tidak ada detail</p></td>
                  </tr>
                  <tr v-else v-for="(row, idx) in bomDetailList" :key="row.id || idx" class="hover:bg-slate-50/80 transition-colors">
                    <td class="px-3 py-2 text-center">
                      <UButton @click="handleActionDetail(row, 1)" size="2xs" color="blue" variant="soft" class="font-bold text-[9px] uppercase tracking-wider mx-auto w-full justify-center">UPDATE</UButton>
                    </td>
                    <td class="px-3 py-2 font-black text-indigo-600">{{ row.choice_num }}</td>
                    <td class="px-3 py-2 text-center">
                      <UCheckbox v-model="row._status" color="blue" />
                    </td>
                    <td class="px-3 py-2 font-bold text-slate-500">{{ row.kode_produk || row.kode || '-' }}</td>
                    <td class="px-3 py-2 font-extrabold text-slate-700">{{ row.name_produk || row.name || '-' }}</td>
                    <td class="px-3 py-2 font-bold text-slate-600">{{ row.uom_bom_konversi || '-' }}</td>
                    <td class="px-3 py-2"><UInput type="number" v-model="row._netto" size="xs" :ui="{ base: 'text-right font-black', rounded: 'rounded-md' }" /></td>
                    <td class="px-3 py-2"><UInput type="number" v-model="row._standart_cost" size="xs" :ui="{ base: 'text-right font-black text-emerald-600', rounded: 'rounded-md' }" /></td>
                    <td class="px-3 py-2">
                      <USelect v-model="row._mix_id" :options="[{label:'PREMIX', value:1},{label:'SUP. MATERIAL', value:2},{label:'ADDITIVE', value:3}]" size="xs" :ui="{ rounded: 'rounded-md', base: 'font-semibold text-xs' }" />
                    </td>
                    <td class="px-3 py-2 text-center">
                      <UBadge :color="(row.optional_set === true || row.optional_set === 'true') ? 'amber' : 'gray'" variant="subtle" size="xs" class="font-bold uppercase text-[9px] tracking-wider">
                        {{ row.optional_set }}
                      </UBadge>
                    </td>
                    <td class="px-3 py-2 text-[10px] font-bold text-slate-500">{{ row.create_by || '-' }}</td>
                    <td class="px-3 py-2 text-[10px] font-bold text-slate-400 whitespace-nowrap">{{ formatDateTime(row.create_date) }}</td>
                    <td class="px-3 py-2 text-[10px] font-bold text-slate-500">{{ row.update_by || '-' }}</td>
                    <td class="px-3 py-2 text-[10px] font-bold text-slate-400 whitespace-nowrap">{{ formatDateTime(row.update_date) }}</td>
                    <td class="px-3 py-2 text-center">
                      <UButton @click="handleActionDetail(row, 2)" size="2xs" color="rose" variant="soft" class="font-bold text-[9px] uppercase tracking-wider mx-auto w-full justify-center">DELETE</UButton>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <!-- Pagination Detail -->
          <div class="mt-5 flex items-center justify-between bg-slate-50/50 p-3 rounded-xl border border-slate-100">
            <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total: {{ totalBomDetail }} items</span>
            <div class="flex items-center gap-2">
              <UButton @click="changePageDetail(-1)" :disabled="pageDetail <= 1" size="xs" color="gray" variant="ghost" icon="i-heroicons-chevron-left" />
              <span class="text-[10px] font-bold text-slate-700 mx-2">Page {{ pageDetail }}</span>
              <UButton @click="changePageDetail(1)" :disabled="pageDetail * rowsDetail >= totalBomDetail" size="xs" color="gray" variant="ghost" icon="i-heroicons-chevron-right" />
            </div>
          </div>
        </div>
      </div>

      <!-- CARD 3: Costing Produksi -->
      <div v-if="selectedHeaderId" class="backdrop-blur-md bg-white/90 rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden transition-all duration-300 hover:shadow-xl relative z-10">
        <div class="bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4 flex justify-between items-center cursor-pointer select-none" @click="isCard3Open = !isCard3Open">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center backdrop-blur-sm"><UIcon name="i-heroicons-currency-dollar" class="w-4 h-4" /></div>
            <h2 class="text-sm font-extrabold text-white uppercase tracking-widest">List Costing Produksi</h2>
          </div>
          <UIcon name="i-heroicons-chevron-down" :class="['w-5 h-5 text-emerald-100 transition-transform duration-300', isCard3Open ? 'rotate-180' : '']" />
        </div>

        <div v-show="isCard3Open" class="p-6">
           <!-- TB Form Costing -->
           <div class="bg-slate-50/50 border border-slate-100 p-5 rounded-2xl flex flex-wrap items-end gap-4 mb-6 shadow-inner">
            <div class="flex-1 w-full min-w-[120px]">
              <label class="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Formula:</label>
              <USelect v-model="costingForm.formula" :options="[{label:'Formula 1', value:1},{label:'Formula 2', value:2}]" size="md" :ui="{ rounded: 'rounded-xl', base: 'font-semibold' }" />
            </div>
            <div class="flex-1 w-full min-w-[100px]">
              <label class="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Qty Order:</label>
              <UInput type="number" v-model="costingForm.qty_order" size="md" :ui="{ rounded: 'rounded-xl', base: 'font-bold text-emerald-600' }" />
            </div>
            <div class="flex-1 w-full min-w-[140px]">
              <label class="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Start Date:</label>
              <UInput type="date" v-model="costingForm.start_date" size="md" :ui="{ rounded: 'rounded-xl', base: 'font-bold' }" />
            </div>
            <div class="flex-1 w-full min-w-[140px]">
              <label class="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">End Date:</label>
              <UInput type="date" v-model="costingForm.end_date" size="md" :ui="{ rounded: 'rounded-xl', base: 'font-bold' }" />
            </div>
            
            <div class="flex gap-2 w-full sm:w-auto">
              <UButton @click="handleCheckCosting" size="md" color="emerald" variant="solid" icon="i-heroicons-calculator" class="flex-1 sm:flex-none rounded-xl shadow-md shadow-emerald-500/20 font-bold uppercase tracking-widest text-[10px] justify-center h-[38px]">
                CHECK
              </UButton>
              <UButton @click="handleSetProduction" size="md" color="amber" variant="solid" icon="i-heroicons-cog-8-tooth" class="flex-1 sm:flex-none rounded-xl shadow-md shadow-amber-500/20 font-bold uppercase tracking-widest text-[10px] justify-center h-[38px]">
                SET PRODUKSI
              </UButton>
            </div>
          </div>

          <!-- Table Costing -->
          <div class="border border-slate-100 rounded-2xl overflow-hidden shadow-sm bg-white">
            <div class="overflow-x-auto custom-scrollbar">
              <table class="w-full text-xs text-left">
                <thead class="bg-slate-50/80 backdrop-blur-sm border-b border-slate-100 sticky top-0">
                  <tr>
                    <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] whitespace-nowrap">Kode Produk</th>
                    <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] whitespace-nowrap">Component Name</th>
                    <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] text-center">Formula</th>
                    <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] whitespace-nowrap">UOM Komponen</th>
                    <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] text-right">Netto</th>
                    <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] text-right whitespace-nowrap">Netto Produksi</th>
                    <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] text-right">Price BOM</th>
                    <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] text-right">Sub Price</th>
                    <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[9px] text-right">Sub Cost Price</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-50">
                  <tr v-if="isLoadingCosting">
                    <td colspan="9" class="px-4 py-12 text-center text-slate-400"><UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin mx-auto mb-2 text-emerald-500" /><p class="font-semibold text-[10px]">Menghitung kalkulasi...</p></td>
                  </tr>
                  <tr v-else-if="bomCostingList.length === 0">
                    <td colspan="9" class="px-4 py-12 text-center text-slate-400"><UIcon name="i-heroicons-calculator" class="w-8 h-8 mx-auto mb-2 text-slate-300" /><p class="font-semibold text-[10px]">Lakukan CHECK untuk menampilkan kalkulasi.</p></td>
                  </tr>
                  <tr v-else v-for="(row, idx) in bomCostingList" :key="idx" class="hover:bg-slate-50/80 transition-colors">
                    <td class="px-4 py-3 font-bold text-slate-500 whitespace-nowrap">{{ row.kode_produk || '-' }}</td>
                    <td class="px-4 py-3 font-extrabold text-slate-700 whitespace-nowrap">{{ row.name_produk || '-' }}</td>
                    <td class="px-4 py-3 text-center font-black text-emerald-600">{{ row.choice_num || '-' }}</td>
                    <td class="px-4 py-3 font-bold text-slate-500">{{ row.uom_komponen || '-' }}</td>
                    <td class="px-4 py-3 text-right font-bold text-slate-600">{{ formatNumber(row.netto) }}</td>
                    <td class="px-4 py-3 text-right font-black text-indigo-600">{{ formatNumber(row.netto_qty_produksi) }}</td>
                    <td class="px-4 py-3 text-right font-bold text-slate-600">{{ formatNumber(row.price_bom) }}</td>
                    <td class="px-4 py-3 text-right font-bold text-slate-700">{{ formatNumber(row.sub_price) }}</td>
                    <td class="px-4 py-3 text-right font-black text-emerald-700">{{ formatNumber(row.sub_cost_price) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <!-- Footer Costing -->
            <div v-if="bomCostingList.length > 0" class="bg-emerald-50/50 border-t border-slate-100 p-4 flex flex-col sm:flex-row justify-between items-center text-[11px] font-bold text-slate-600 gap-2">
              <div class="flex items-center gap-2">
                <span class="uppercase tracking-widest text-[9px] text-slate-500">Article:</span>
                <UBadge color="blue" variant="soft" class="font-black">{{ footerData.article }}</UBadge>
              </div>
              <div class="flex items-center gap-2">
                <span class="uppercase tracking-widest text-[9px] text-slate-500">Cost:</span>
                <span class="text-emerald-700 font-black text-base">{{ formatNumber(footerData.cost) }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="uppercase tracking-widest text-[9px] text-slate-500">Expired Date:</span>
                <UBadge color="red" variant="soft" class="font-black">{{ footerData.expDate }}</UBadge>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useProduksi } from '../../composables/useProduksi'
import { useBom } from '../../composables/useBom'

const { activeProdId } = useProduksi()
const {
  isLoadingHeader,
  isLoadingDetail,
  isLoadingCosting,
  bomHeaderList,
  totalBomHeader,
  bomDetailList,
  totalBomDetail,
  bomCostingList,
  comboMaterialList,
  categoryBomList,
  fetchBomHeader,
  actionBomHeader,
  fetchBomDetail,
  saveBomDetail,
  actionBomDetail,
  fetchComboMaterial,
  fetchCostingView,
  saveProductionOrder,
  fetchUomKonversi,
  fetchCategoryBom
} = useBom()

// Toggle Cards
const isCard1Open = ref(true)
const isCard2Open = ref(true)
const isCard3Open = ref(true)

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
  return d.toLocaleString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/\./g, ':')
}

// ==========================================
// CARD 1: MASTER BOM
// ==========================================
const searchHeader = ref('')
const pageHeader = ref(1)
const rowsHeader = 10

const loadHeader = async () => {
  if (!activeProdId.value) return
  const res = await fetchBomHeader({
    var_where: searchHeader.value,
    var_page_number: pageHeader.value,
    var_row_page: rowsHeader,
    v_class: 1,
    v_id_produksi: activeProdId.value
  })

  // Populate interactive fields in table for editing inline
  if (bomHeaderList.value && bomHeaderList.value.length > 0) {
    for (const item of bomHeaderList.value) {
      item._kategory_artikel = item.kategory_artikel || null
      item._dough_id = item.dough_id || null
      item._durability = item.durability || 0
      item._labor_cost = item.labor_cost || 0
      item._transport_cost = item.transport_cost || 0
      item._cost_lain = item.cost_lain || 0
      item._standart_hour = item.standart_hour || 0
      item._standart_qty_batch = item.standart_qty_batch || 0
      item._standard_weight = item.standard_weight || 0
      item._standard_rm = item.rm_standart || 0
      item._standard_ad = item.ad_standart || 0
      item._standard_sm = item.sm_standart || 0

      // fetch UOM options for this specific item (UOM Adonan combo)
      if (item.id_produk) {
        item._uomOptions = await fetchUomKonversi(item.id_produk, activeProdId.value)
      }
    }
  }
}

const handleSearchHeader = () => {
  pageHeader.value = 1
  loadHeader()
}

const changePageHeader = (offset: number) => {
  pageHeader.value += offset
  loadHeader()
}

const handleSetHeader = async (row: any) => {
  if (!activeProdId.value) return
  const isUpdate = row.bom_id && row.bom_id !== 0
  
  const payload = {
    v_id: isUpdate ? row.bom_id : 0,
    v_id_produk: row.id_produk,
    v_id_action: isUpdate ? 2 : 1, // 1: SET, 2: UPDATE
    v_kategory: row._kategory_artikel || 0,
    v_adon: row._dough_id || 0,
    v_durab: row._durability || 0,
    v_id_prod: activeProdId.value,
    v_costothr: row._cost_lain || 0,
    v_costlabor: row._labor_cost || 0,
    v_costtransport: row._transport_cost || 0,
    v_costhour: row._standart_hour || 0,
    v_costqtybatch: row._standart_qty_batch || 0,
    v_stdweight: row._standard_weight || 0,
    v_stdrm: row._standard_rm || 0,
    v_stdad: row._standard_ad || 0,
    v_stdsm: row._standard_sm || 0
  }

  const result = await actionBomHeader(payload)
  if (result.success) {
    alert(isUpdate ? 'BOM Header updated' : 'BOM Header set')
    loadHeader()
  } else {
    alert('Failed to process action')
  }
}

// ==========================================
// CARD 2 & 3: Selection state
// ==========================================
const selectedHeaderId = ref<number | null>(null)
const selectedHeaderName = ref<string>('')
const selectedHeaderIdProduk = ref<number | null>(null)

const handleShowDetail = (row: any) => {
  selectedHeaderId.value = row.bom_id
  selectedHeaderIdProduk.value = row.id_produk
  selectedHeaderName.value = row.name_produk || row.name || ''
  
  // Reset details
  bomCostingList.value = []
  pageDetail.value = 1
  
  // Load detail list
  loadDetail()
  
  // Also pre-fetch combo material for the default formula/mix
  loadComboMaterial()
}

// ==========================================
// CARD 2: LIST BOM FORMULA
// ==========================================
const detailForm = ref({
  formula: 1,
  mix_id: 1,
  id_item: 0,
  qty: '',
  optional: 'false'
})

const pageDetail = ref(1)
const rowsDetail = 10

const loadDetail = async () => {
  if (!selectedHeaderId.value || !activeProdId.value) return
  const res = await fetchBomDetail({
    var_where: '',
    var_page_number: pageDetail.value,
    var_row_page: rowsDetail,
    v_id_header: selectedHeaderId.value,
    v_id_prod: activeProdId.value
  })

  // Map state for inline editing
  if (res && res.rows) {
    for (const item of bomDetailList.value) {
      item._status = item.status === true || item.status === 'true'
      item._netto = item.netto || 0
      item._standart_cost = item.standart_cost || 0
      item._mix_id = item.mix_id || 1
    }
  }
}

const changePageDetail = (offset: number) => {
  pageDetail.value += offset
  loadDetail()
}

const loadComboMaterial = async () => {
  if (!selectedHeaderId.value || !activeProdId.value) return
  await fetchComboMaterial({
    var_where: '',
    var_page_number: 1,
    var_row_page: 50,
    v_id_header: selectedHeaderId.value,
    v_id_formula: detailForm.value.formula,
    v_mix_id: detailForm.value.mix_id,
    v_id_prod: activeProdId.value
  })
}

const handleFormulaChange = () => loadComboMaterial()
const handleMixChange = () => loadComboMaterial()

const handleAddDetail = async () => {
  if (!selectedHeaderId.value || !activeProdId.value) return
  if (detailForm.value.id_item === 0) {
    alert('Pilih Item terlebih dahulu')
    return
  }
  
  const payload = {
    v_id_header: selectedHeaderId.value,
    v_id_formula: detailForm.value.formula,
    v_mix_id: detailForm.value.mix_id,
    v_id_prod: activeProdId.value,
    v_id_item: detailForm.value.id_item,
    v_qty: String(detailForm.value.qty || 0),
    v_optional: detailForm.value.optional
  }

  const res = await saveBomDetail(payload)
  if (res.success) {
    detailForm.value.id_item = 0
    detailForm.value.qty = ''
    detailForm.value.optional = 'false'
    pageDetail.value = 1
    loadDetail()
  } else {
    alert('Gagal menambah detail BOM')
  }
}

const handleActionDetail = async (row: any, action: number) => {
  // action 1 = UPDATE, 2 = DELETE
  if (!selectedHeaderId.value || !activeProdId.value) return
  
  const payload = {
    v_id_header: selectedHeaderId.value,
    v_id_detail: row.id,
    v_action: action,
    v_netto: String(row._netto || 0),
    v_mix_id: row._mix_id || 1,
    v_cost_std: String(row._standart_cost || 0),
    v_status_bool: row._status,
    v_id_prod: activeProdId.value
  }

  const res = await actionBomDetail(payload)
  if (res.success) {
    loadDetail()
  } else {
    alert('Gagal memproses aksi pada detail')
  }
}

// ==========================================
// CARD 3: COSTING PRODUKSI
// ==========================================
// Default to today using Local Time to avoid UTC shift and TS array indexing warnings
const getLocalToday = () => {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
const today = getLocalToday()
const costingForm = ref({
  formula: 1,
  qty_order: 0,
  start_date: today,
  end_date: today
})

const footerData = computed(() => {
  if (bomCostingList.value.length === 0) return { article: '-', cost: 0, expDate: '-' }
  const firstRow = bomCostingList.value[0]
  return {
    article: `${firstRow.artikel || ''} ${firstRow.artikel_name || ''} ${firstRow.qty_produksi || ''} ${firstRow.uom_article || ''}`,
    cost: firstRow.cost_produksi || 0,
    expDate: firstRow.expried_date || '-'
  }
})

const handleCheckCosting = async () => {
  if (!selectedHeaderId.value || !activeProdId.value) return
  
  await fetchCostingView({
    v_id_prod: activeProdId.value,
    v_id_bom: selectedHeaderId.value,
    v_formula: costingForm.value.formula,
    v_qty_order: costingForm.value.qty_order,
    v_start_date: costingForm.value.start_date,
    v_end_date: costingForm.value.end_date
  })
}

const handleSetProduction = async () => {
  if (!selectedHeaderId.value || !activeProdId.value) return
  
  const payload = {
    v_id_prod: activeProdId.value,
    v_id_bom: selectedHeaderId.value,
    v_formula: costingForm.value.formula,
    v_qty_order: costingForm.value.qty_order,
    v_start_date: costingForm.value.start_date,
    v_end_date: costingForm.value.end_date
  }

  const res = await saveProductionOrder(payload)
  if (res.success) {
    // According to legacy logic, if status = 1 it's success.
    if (res.data?.status === 1 || res.data === 1) {
      alert('Pembuatan Production Order Berhasil')
      handleCheckCosting() // Reload costing
    } else {
      alert('Qty material inventory melebihi stock produksi')
    }
  } else {
    alert('Gagal memproses Production Order')
  }
}

// ==========================================
// INIT
// ==========================================
onMounted(async () => {
  await fetchCategoryBom()
  if (activeProdId.value) {
    loadHeader()
  }
})

// Auto reload if location changes
watch(activeProdId, () => {
  if (activeProdId.value) {
    selectedHeaderId.value = null
    loadHeader()
  }
})

</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { height: 8px; width: 8px; }
.custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
</style>
