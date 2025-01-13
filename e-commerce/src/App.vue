<template>
  <div id="app">
    <nav class="px-5 py-5 bg-gray-50 border-b border-gray-200">
      <a
        type="button"
        href="/"
        class="mr-5 no-underline text-gray-700 hover:text-gray-900 router-link-active:text-blue-600 router-link-active:font-bold"
      >
        Categories
      </a>
      <a
        type="button"
        href="/products"
        class="mr-5 no-underline text-gray-700 hover:text-gray-900 router-link-active:text-blue-600 router-link-active:font-bold"
      >
        Products
      </a>
    </nav>

    <main class="p-5 max-w-7xl mx-auto">
      <RouterView />
    </main>
  </div>
</template>
