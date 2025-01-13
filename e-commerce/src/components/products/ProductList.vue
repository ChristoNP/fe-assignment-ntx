<template>
  <div class="p-5">
    <div class="flex justify-between items-center mb-5">
      <h2 class="text-xl font-semibold">Products</h2>
      <button 
        @click="showAddForm = true" 
        class="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
      >
        Add Product
      </button>
    </div>

    <div v-if="loading" class="text-center text-gray-500">Loading products...</div>

    <div v-else-if="error" class="text-center text-red-500">{{ error }}</div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
        @edit="editProduct"
        @delete="deleteProduct"
      />
    </div>

    <dialog :open="showAddForm || showEditForm" class="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <ProductForm
          :product="selectedProduct"
          :categories="categories"
          :edit-mode="!!selectedProduct"
          @submit="handleFormSubmit"
          @cancel="closeForm"
        />
      </div>
    </dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useProductStore } from "../../stores/product";
import { useCategoryStore } from "../../stores/category";
import ProductCard from "./ProductCard.vue";
import ProductForm from "./ProductForm.vue";

const productStore = useProductStore()
const categoryStore = useCategoryStore()

const showAddForm = ref(false)
const showEditForm = ref(false)
const selectedProduct = ref(null)

const { products, loading, error } = storeToRefs(productStore)
const { categories } = storeToRefs(categoryStore)

onMounted(async () => {
  await Promise.all([productStore.fetchProducts(), categoryStore.fetchCategories()])
})

const editProduct = (product) => {
  selectedProduct.value = product
  showEditForm.value = true
}

const deleteProduct = async (id) => {
  if (confirm("Are you sure you want to delete this product?")) {
    await productStore.deleteProduct(id)
  }
}

const handleFormSubmit = async (formData) => {
  if (selectedProduct.value) {
    await productStore.updateProduct({
      id: selectedProduct.value.id,
      ...formData,
    })
  } else {
    await productStore.addProduct(formData)
  }
  closeForm()
}

const closeForm = () => {
  showAddForm.value = false
  showEditForm.value = false
  selectedProduct.value = null
}
</script>
