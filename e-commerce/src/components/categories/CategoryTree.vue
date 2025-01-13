<template>
  <div class="pl-5">
    <div v-for="category in categories" :key="category.id" class="mb-4 p-4 border border-gray-300 rounded">
      <div class="flex justify-between items-center mb-4">
        <span class="font-medium">{{ category.name }}</span>
        <div class="text-sm text-gray-600">Total: ${{ calculateTotal(category.id).toFixed(2) }}</div>
        <div class="flex gap-2">
          <button @click="editCategory(category)" class="px-2 py-1 text-white bg-blue-500 rounded hover:bg-blue-600">Edit</button>
          <button @click="deleteCategory(category.id)" class="px-2 py-1 text-white bg-red-500 rounded hover:bg-red-600">Delete</button>
          <button @click="addSubcategory(category)" class="px-2 py-1 text-white bg-green-500 rounded hover:bg-green-600">Add Subcategory</button>
        </div>
      </div>

      <div v-if="getProductsByCategory(category.id).length" class="mb-4 p-4 bg-gray-100 rounded">
        <h4 class="font-medium mb-2">Products:</h4>
        <ul class="list-disc list-inside">
          <li v-for="product in getProductsByCategory(category.id)" :key="product.id">
            {{ product.name }} - ${{ product.price }}
          </li>
        </ul>
      </div>

      <div v-if="category.children && category.children.length" class="pl-5">
        <CategoryTree
          :categories="category.children"
          @edit="$emit('edit', $event)"
          @delete="$emit('delete', $event)"
          @add-subcategory="$emit('add-subcategory', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useProductStore } from "../../stores/product";
import { computed } from "vue";

const props = defineProps({
  categories: {
    type: Array,
    required: true,
  },
})

defineEmits(["edit", "delete", "add-subcategory"])

const productStore = useProductStore()
const getProductsByCategory = computed(() => productStore.getProductsByCategory)
const calculateTotal = (categoryId) => {
  return productStore.calculateCategoryTotal(categoryId, props.categories)
}

const editCategory = (category) => {
  emit("edit", category)
}

const deleteCategory = (id) => {
  emit("delete", id)
}

const addSubcategory = (parentCategory) => {
  emit("add-subcategory", parentCategory)
}
</script>