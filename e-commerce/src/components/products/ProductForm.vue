<template>
  <form @submit.prevent="handleSubmit" class="max-w-md mx-auto p-4 border rounded shadow">
    <div class="mb-4">
      <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Product Name:</label>
      <input 
        id="name" 
        v-model="formData.name" 
        type="text" 
        required 
        class="block w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
      />
    </div>

    <div class="mb-4">
      <label for="price" class="block text-sm font-medium text-gray-700 mb-1">Price:</label>
      <input 
        id="price" 
        v-model="formData.price" 
        type="number" 
        step="0.01" 
        min="0" 
        required 
        class="block w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
      />
    </div>

    <div class="mb-4">
      <label for="category" class="block text-sm font-medium text-gray-700 mb-1">Category:</label>
      <select 
        id="category" 
        v-model="formData.categoryId" 
        required 
        class="block w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
      >
        <option value="">Select a category</option>
        <option v-for="category in categories" :key="category.id" :value="category.id">
          {{ category.name }}
        </option>
      </select>
    </div>

    <div class="flex justify-end gap-4 mt-6">
      <button 
        type="submit" 
        class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      >
        {{ editMode ? "Update" : "Create" }} Product
      </button>
      <button 
        type="button" 
        @click="$emit('cancel')" 
        class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
      >
        Cancel
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, onMounted } from "vue";

const props = defineProps({
  product: {
    type: Object,
    default: null,
  },
  categories: {
    type: Array,
    required: true,
  },
  editMode: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(["submit", "cancel"])

const formData = ref({
  name: "",
  price: "",
  categoryId: "",
})

onMounted(() => {
  if (props.product) {
    formData.value = {
      name: props.product.name,
      price: props.product.price,
      categoryId: props.product.category_id,
    }
  }
})

const handleSubmit = () => {
  emit("submit", {
    name: formData.value.name,
    price: parseFloat(formData.value.price),
    categoryId: parseInt(formData.value.categoryId),
  })
}
</script>
