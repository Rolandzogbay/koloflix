<template>
  <footer class="bg-(--color-bg) text-gray-400 mt-25">
    <div class="container mx-auto px-6 py-12">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        <div>
          <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span class="text-(--color-text) text-4xl">Kolo<span class="text-(--color-accent)">flix</span></span>
          </h2>
          <p class="text-sm text-(--color-text) mb-6 leading-relaxed">
            Your ultimate destination for discovering the latest blockbusters, timeless classics, and trending TV shows.
          </p>
          <div class="flex space-x-4">
            <a href="#" class="hover:text-red-500 transition"><i class="fab fa-twitter"></i> Twitter</a>
            <a href="#" class="hover:text-red-500 transition"><i class="fab fa-instagram"></i> Insta</a>
          </div>
        </div>

        <div>
          <h3 class="text-(--color-text) font-semibold mb-4 uppercase tracking-wider text-xl">Discover</h3>
          <ul class="space-y-2 text-base text-(--color-text)">
            <li><router-link to="/" class="hover:text-red-500 transition">Home</router-link></li>
            <li><router-link to="/popular" class="hover:text-red-500 transition">Popular Movies</router-link></li>
            <li><router-link to="/trending" class="hover:text-red-500 transition">Trending Movies</router-link></li>
            <li><router-link to="/upcoming" class="hover:text-red-500 transition">Upcoming Movies</router-link></li>
          </ul>
        </div>

        <div>
          <h3 class="text-(--color-text) font-semibold mb-4 uppercase tracking-wider text-xl">Support</h3>
          <ul class="space-y-2 text-base text-(--color-text)">
            <li><a href="#" class="hover:text-red-500 transition">FAQ</a></li>
            <li><a href="#" class="hover:text-red-500 transition">Privacy Policy</a></li>
            <li><a href="#" class="hover:text-red-500 transition">Terms of Service</a></li>
            <li><a href="#" class="hover:text-red-500 transition">Contact Us</a></li>
          </ul>
        </div>

        <div>
          <h3 class="text-(--color-text) font-semibold mb-4 uppercase tracking-wider text-xl">Stay Updated</h3>
          <p class="text-base text-(--color-text) mb-4">Subscribe to our newsletter for the latest updates.</p>
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

      <div class="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-base text-(--color-text)">
        <p>&copy; {{ new Date().getFullYear() }} Koloflix Your Ultimate Choice. All rights reserved.</p>
        <p>Designed with Vue & Tailwind - <i>Roland Zogbay</i></p>
      </div>
    </div>
  </footer>
</template>