<template>
  <form @submit.prevent="handleSubmit" class="p-5 max-w-md mx-auto">
    <div class="mb-4">
      <label for="name" class="block mb-2 font-medium">Category Name:</label>
      <input
        id="name"
        v-model="formData.name"
        type="text"
        required
        class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
      />
    </div>

    <div class="mb-4" v-if="!editMode">
      <label for="parent" class="block mb-2 font-medium">Parent Category:</label>
      <select
        id="parent"
        v-model="formData.parentId"
        class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
      >
        <option :value="null">None</option>
        <option v-for="category in categories" :key="category.id" :value="category.id">
          {{ category.name }}
        </option>
      </select>
    </div>

    <div class="flex justify-end gap-2 mt-5">
      <button
        type="submit"
        class="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      >
        {{ editMode ? "Update" : "Create" }} Category
      </button>
      <button
        type="button"
        @click="$emit('cancel')"
        class="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
      >
        Cancel
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, onMounted } from "vue";

const props = defineProps({
  category: {
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
});

const emit = defineEmits(["submit", "cancel"])

const formData = ref({
  name: "",
  parentId: null,
});

onMounted(() => {
  if (props.category) {
    formData.value = {
      name: props.category.name,
      parentId: props.category.parent_id,
    };
  }
});

const handleSubmit = () => {
  emit("submit", {
    name: formData.value.name,
    parentId: formData.value.parentId,
  });
};
</script>
