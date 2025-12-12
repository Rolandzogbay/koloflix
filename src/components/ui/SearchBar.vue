<template>
    
    <!-- Search Bar (hidden on mobile) -->
    <div class="hidden md:flex flex-1 mx-6 relative">
      <input
        type="text"
        placeholder="Search for your favourite movies..."
        class="w-full px-4 py-2 pr-12 rounded-lg
              bg-(--color-search-bg)
              text-(--color-text)
              focus:outline-none focus:ring-1 focus:ring-(--color-text)"
      />

    <!-- Search Icon Button -->
      <button
        class="absolute right-6  top-1/2 -translate-y-1/2
              text-(--color-text)
              hover:text-(--color-btn) cursor-pointer"
      >
        <i class="fa-solid fa-magnifying-glass text-xl"></i>
      </button>
    </div>
</template>