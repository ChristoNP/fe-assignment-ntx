<template>
  <div class="products-view container mx-auto p-5">
    <div class="page-header flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Products</h1>
      <button
        @click="showAddForm = true"
        class="bg-green-500 text-white px-4 py-2 rounded"
      >
        Add New Product
      </button>
    </div>

    <!-- Filters Section -->
    <div class="filters-section grid gap-4 md:grid-cols-3 items-center mb-6">
      <div class="search-box">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search products..."
          class="w-full p-2 border border-gray-300 rounded"
          @input="filterProducts"
        />
      </div>

      <div class="category-filter">
        <select
          v-model="selectedCategory"
          @change="filterProducts"
          class="w-full p-2 border border-gray-300 rounded"
        >
          <option value="">All Categories</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
      </div>

      <div class="sort-control flex gap-2 items-center">
        <select
          v-model="sortBy"
          @change="filterProducts"
          class="p-2 border border-gray-300 rounded"
        >
          <option value="name">Name</option>
          <option value="price">Price</option>
          <option value="category">Category</option>
        </select>
        <button
          @click="sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'"
          class="p-2 border border-gray-300 rounded bg-white"
        >
          {{ sortOrder === "asc" ? "↑" : "↓" }}
        </button>
      </div>
    </div>

    <!-- Loading and Error States -->
    <div v-if="loading" class="loading-state text-center py-10 text-gray-500">
      Loading products...
    </div>

    <div v-else-if="error" class="error-state text-center py-10 text-red-500">
      {{ error }}
    </div>

    <!-- Products Grid -->
    <div v-else class="products-grid grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        class="product-card border border-gray-300 rounded-lg p-4 bg-white"
      >
        <div class="product-content mb-4">
          <h3 class="text-lg font-semibold">{{ product.name }}</h3>
          <p class="price text-xl font-bold text-gray-800 my-2">
            ${{ product.price.toFixed(2) }}
          </p>
          <p class="category text-gray-500 text-sm">
            {{ getCategoryName(product.category_id) }}
          </p>
        </div>
        <div class="product-actions flex gap-2">
          <button
            @click="editProduct(product)"
            class="bg-blue-500 text-white px-3 py-2 rounded"
          >
            Edit
          </button>
          <button
            @click="confirmDelete(product.id)"
            class="bg-red-500 text-white px-3 py-2 rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Product Form Dialog -->
    <dialog
      :open="showAddForm || !!selectedProduct"
      class="product-dialog border-none rounded-lg p-6 bg-white shadow-lg"
    >
      <ProductForm
        v-if="showAddForm || !!selectedProduct"
        :product="selectedProduct"
        :categories="categories"
        :edit-mode="!!selectedProduct"
        @submit="handleFormSubmit"
        @cancel="closeForm"
      />
    </dialog>

    <!-- Confirmation Dialog -->
    <dialog
      :open="!!productToDelete"
      class="confirm-dialog border-none rounded-lg p-6 bg-white shadow-lg"
    >
      <div v-if="productToDelete" class="confirm-content text-center">
        <p class="mb-4">Are you sure you want to delete this product?</p>
        <div class="confirm-actions flex justify-center gap-4">
          <button
            @click="deleteProduct(productToDelete)"
            class="bg-red-500 text-white px-4 py-2 rounded"
          >
            Yes, Delete
          </button>
          <button
            @click="productToDelete = null"
            class="bg-gray-300 text-black px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useProductStore } from "../stores/product";
import { useCategoryStore } from "../stores/category";
import ProductForm from "../components/products/ProductForm.vue";

const productStore = useProductStore();
const categoryStore = useCategoryStore();
const { products, loading, error } = storeToRefs(productStore);
const { categories } = storeToRefs(categoryStore);

const showAddForm = ref(false);
const selectedProduct = ref(null);
const productToDelete = ref(null);
const searchQuery = ref("");
const selectedCategory = ref("");
const sortBy = ref("name");
const sortOrder = ref("asc");

onMounted(async () => {
  await Promise.all([productStore.fetchProducts(), categoryStore.fetchCategories()]);
});

const filteredProducts = computed(() => {
  let filtered = [...products.value];
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter((product) => product.name.toLowerCase().includes(query));
  }

  if (selectedCategory.value) {
    filtered = filtered.filter(
      (product) => product.category_id === selectedCategory.value
    );
  }

  filtered.sort((a, b) => {
    let compareA, compareB;

    switch (sortBy.value) {
      case "price":
        compareA = a.price;
        compareB = b.price;
        break;
      case "category":
        compareA = getCategoryName(a.category_id);
        compareB = getCategoryName(b.category_id);
        break;
      default:
        compareA = a.name;
        compareB = b.name;
    }

    if (sortOrder.value === "asc") {
      return compareA > compareB ? 1 : -1;
    } else {
      return compareA < compareB ? 1 : -1;
    }
  });

  return filtered;
});

const getCategoryName = (categoryId) => {
  const category = categories.value.find((c) => c.id === categoryId);
  return category ? category.name : "Unknown Category";
};

const editProduct = (product) => {
  selectedProduct.value = product;
};

const confirmDelete = (productId) => {
  productToDelete.value = productId;
};

const deleteProduct = async (productId) => {
  await productStore.deleteProduct(productId);
  productToDelete.value = null;
};

const handleFormSubmit = async (formData) => {
  if (selectedProduct.value) {
    await productStore.updateProduct({
      id: selectedProduct.value.id,
      ...formData,
    });
  } else {
    await productStore.addProduct(formData);
  }
  closeForm();
};

const closeForm = () => {
  showAddForm.value = false;
  selectedProduct.value = null;
};
</script>

<style>
dialog {
  max-width: 500px;
  margin: auto;
}
</style>
