<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Categories</h1>
      <button 
        @click="showAddForm = true" 
        class="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
      >
        Add Root Category
      </button>
    </div>

    <div v-if="loading" class="text-center text-gray-500">Loading categories...</div>

    <div v-else-if="error" class="text-center text-red-500">{{ error }}</div>

    <div v-else>
      <CategoryTree
        :categories="categoryTree"
        @edit="editCategory"
        @delete="deleteCategory"
        @add-subcategory="addSubcategory"
      />
    </div>

    <dialog :open="showAddForm || !!selectedCategory" class="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <CategoryForm
          :category="selectedCategory"
          :categories="categories"
          :edit-mode="!!selectedCategory"
          @submit="handleFormSubmit"
          @cancel="closeForm"
        />
      </div>
    </dialog>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { useCategoryStore } from "../stores/category";
import CategoryTree from "../components/categories/CategoryTree.vue";
import CategoryForm from "../components/categories/CategoryForm.vue";

const categoryStore = useCategoryStore()
const { categories, loading, error } = storeToRefs(categoryStore)
const categoryTree = computed(() => categoryStore.categoryTree)

const showAddForm = ref(false)
const selectedCategory = ref(null)
const selectedParentCategory = ref(null)

const editCategory = (category) => {
  selectedCategory.value = category
}

const addSubcategory = (parentCategory) => {
  selectedParentCategory.value = parentCategory
  showAddForm.value = true
}

const deleteCategory = async (id) => {
  if (confirm("Are you sure you want to delete this category?")) {
    await categoryStore.deleteCategory(id)
  }
}

const handleFormSubmit = async (formData) => {
  if (selectedCategory.value) {
    await categoryStore.updateCategory({
      id: selectedCategory.value.id,
      ...formData,
    })
  } else {
    await categoryStore.addCategory({
      ...formData,
      parentId: selectedParentCategory.value?.id || null,
    })
  }
  closeForm()
}

const closeForm = () => {
  showAddForm.value = false
  selectedCategory.value = null
  selectedParentCategory.value = null
}
</script>