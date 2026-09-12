<template>
  <div class="relative" ref="container">
    <div 
      @click="toggle"
      class="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 dark:text-white cursor-pointer flex justify-between items-center h-full min-h-[32px]"
      :class="{'ring-2 ring-cyan-500': isOpen}"
    >
      <span class="truncate text-gray-700 dark:text-gray-200 select-none">{{ selectedLabel || placeholder }}</span>
      <svg class="w-4 h-4 text-gray-400 shrink-0 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
    </div>

    <div v-if="isOpen" class="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg flex flex-col" style="max-height: 250px;">
      <div class="p-2 border-b border-gray-200 dark:border-gray-700 shrink-0">
        <input 
          ref="searchInput"
          type="text" 
          v-model="search" 
          class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500 bg-gray-50 dark:bg-gray-700 dark:text-white"
          placeholder="Search..."
          @keydown.enter.prevent="selectFirst"
        />
      </div>
      <ul class="overflow-y-auto flex-1 p-1 m-0 list-none">
        <li 
          v-for="opt in filteredOptions" 
          :key="opt[valueKey]" 
          @click="selectOption(opt)"
          class="px-2 py-1.5 text-sm cursor-pointer hover:bg-cyan-50 dark:hover:bg-cyan-900/30 rounded text-gray-700 dark:text-gray-200 select-none"
          :class="{'bg-cyan-100 dark:bg-cyan-900/50 font-medium': opt[valueKey] === modelValue}"
        >
          {{ getLabel(opt) }}
        </li>
        <li v-if="filteredOptions.length === 0" class="px-2 py-2 text-sm text-gray-500 text-center">
          No results found
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number, null],
    default: ''
  },
  options: {
    type: Array,
    default: () => []
  },
  placeholder: {
    type: String,
    default: '--Select--'
  },
  labelKey: {
    type: [String, Function],
    default: 'text'
  },
  valueKey: {
    type: String,
    default: 'id'
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const isOpen = ref(false)
const search = ref('')
const container = ref(null)
const searchInput = ref(null)

const getLabel = (opt) => {
  if (!opt) return ''
  if (typeof props.labelKey === 'function') {
    return props.labelKey(opt)
  }
  return opt[props.labelKey] || opt.text || opt.building_name || opt.building || opt.act || opt.nama_shift || opt.nama || opt.id || 'Unnamed'
}

const selectedLabel = computed(() => {
  if (props.modelValue === '' || props.modelValue === null) return ''
  const selected = props.options.find(opt => String(opt[props.valueKey]) === String(props.modelValue))
  return getLabel(selected)
})

const filteredOptions = computed(() => {
  if (!search.value) return props.options
  const q = search.value.toLowerCase()
  return props.options.filter(opt => {
    return getLabel(opt).toLowerCase().includes(q)
  })
})

const toggle = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    search.value = ''
    nextTick(() => {
      searchInput.value?.focus()
    })
  }
}

const selectOption = (opt) => {
  emit('update:modelValue', opt[props.valueKey])
  emit('change', opt[props.valueKey])
  isOpen.value = false
}

const selectFirst = () => {
  if (filteredOptions.value.length > 0) {
    selectOption(filteredOptions.value[0])
  }
}

const handleClickOutside = (e) => {
  if (container.value && !container.value.contains(e.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
