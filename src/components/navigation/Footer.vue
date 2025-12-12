<template>
  <footer class="bg-gray-900 border-t border-gray-800 text-gray-300 mt-20">
    <div class="container mx-auto px-6 py-12">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        <div>
          <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span class="text-red-600 text-3xl">▶</span> MovieFinder
          </h2>
          <p class="text-sm text-gray-400 mb-6 leading-relaxed">
            Your ultimate destination for discovering the latest blockbusters, timeless classics, and trending TV shows.
          </p>
          <div class="flex space-x-4">
            <a href="#" class="hover:text-red-500 transition"><i class="fab fa-twitter"></i> Twitter</a>
            <a href="#" class="hover:text-red-500 transition"><i class="fab fa-instagram"></i> Insta</a>
          </div>
        </div>

        <div>
          <h3 class="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Discover</h3>
          <ul class="space-y-2 text-sm">
            <li><router-link to="/" class="hover:text-red-500 transition">Home</router-link></li>
            <li><a href="#" class="hover:text-red-500 transition">Movies</a></li>
            <li><a href="#" class="hover:text-red-500 transition">TV Shows</a></li>
            <li><a href="#" class="hover:text-red-500 transition">New Arrivals</a></li>
          </ul>
        </div>

        <div>
          <h3 class="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Support</h3>
          <ul class="space-y-2 text-sm">
            <li><a href="#" class="hover:text-red-500 transition">FAQ</a></li>
            <li><a href="#" class="hover:text-red-500 transition">Privacy Policy</a></li>
            <li><a href="#" class="hover:text-red-500 transition">Terms of Service</a></li>
            <li><a href="#" class="hover:text-red-500 transition">Contact Us</a></li>
          </ul>
        </div>

        <div>
          <h3 class="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Stay Updated</h3>
          <p class="text-xs text-gray-500 mb-4">Subscribe to our newsletter for the latest updates.</p>
          <form class="flex flex-col gap-2">
            <input 
              type="email" 
              placeholder="Enter your email" 
              class="bg-gray-800 text-white px-4 py-2 rounded focus:outline-none focus:ring-1 focus:ring-red-600"
            />
            <button class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold transition">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div class="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
        <p>&copy; {{ new Date().getFullYear() }} MovieFinder App. All rights reserved.</p>
        <p>Designed with Vue & Tailwind</p>
      </div>
    </div>
  </footer>
</template>