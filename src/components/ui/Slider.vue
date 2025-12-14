<template>
  <div class="flex flex-col items-center justify-center py-10 overflow-hidden">
    <div class="relative w-full max-w-5xl h-96 flex items-center justify-center">
      
      <div 
        class="flex justify-center items-center w-full h-full relative"
        @mouseenter="stopAutoplay"
        @mouseleave="startAutoplay"
        @touchstart="stopAutoplay"
      >
        <div 
          v-for="(item, index) in items" 
          :key="item.id || index"
          :class="getSlideClass(index)"
          :style="{ transform: getTransformStyle(index) }"
          class="absolute rounded-xl transition-all duration-700 ease-in-out cursor-pointer shadow-2xl overflow-hidden will-change-transform"
          @click="goToSlide(index)"
        >
          <slot :item="item" :index="index"></slot>
        </div>
      </div>
      
      <button 
        @click="prevSlide" 
        class="absolute left-8 transform -translate-x-1/2 z-20 w-12 h-12 bg-gray-900/50 backdrop-blur-sm hover:bg-red-600 rounded-full flex items-center justify-center transition focus:outline-none shadow-lg text-white"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
      </button>

      <button 
        @click="nextSlide" 
        class="absolute right-8 transform translate-x-1/2 z-20 w-12 h-12 bg-gray-900/50 backdrop-blur-sm hover:bg-red-600 rounded-full flex items-center justify-center transition focus:outline-none shadow-lg text-white"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
      </button>
    </div>
    
    <div class="flex space-x-2 mt-8">
      <div 
        v-for="(item, index) in items" 
        :key="item.id || index"
        @click="goToSlide(index)"
        :class="index === currentIndex ? 'bg-red-600 w-3 h-3' : 'bg-gray-600 w-2 h-2 hover:bg-gray-500'"
        class="rounded-full cursor-pointer transition-all duration-300"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  autoplay: {
    type: Boolean,
    default: true,
  },
  interval: {
    type: Number,
    default: 5000, // 5 seconds
  },
});

const currentIndex = ref(0);
const totalItems = computed(() => props.items.length);
let autoplayTimer = null;

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % totalItems.value;
};

const prevSlide = () => {
  currentIndex.value = (currentIndex.value - 1 + totalItems.value) % totalItems.value;
};

const goToSlide = (index) => {
  currentIndex.value = index;
  // Handle user interaction: restart timer
  stopAutoplay();
  startAutoplay();
};

// --- AUTOPLAY LOGIC ---
const startAutoplay = () => {
  if (props.autoplay && totalItems.value > 1) {
    stopAutoplay();
    autoplayTimer = setInterval(nextSlide, props.interval);
  }
};

const stopAutoplay = () => {
  if (autoplayTimer) {
    clearInterval(autoplayTimer);
    autoplayTimer = null;
  }
};

onMounted(() => {
  startAutoplay();
});

onUnmounted(() => {
  stopAutoplay();
});

// --- CORE LOGIC FOR 3D EFFECT AND POSITIONING ---

const getTransformStyle = (index) => {
  let diff = index - currentIndex.value;

  // Handle wrapping (for infinite loop)
  if (diff > totalItems.value / 2) {
    diff -= totalItems.value;
  } else if (diff < -totalItems.value / 2) {
    diff += totalItems.value;
  }
  
  // Base scale and position offsets
  const baseScale = 0.8;
  const baseOffset = 300; 

  if (diff === 0) {
    return 'translateX(0) scale(1)';
  } else if (diff === 1) {
    return `translateX(${baseOffset}px) scale(${baseScale})`;
  } else if (diff === -1) {
    return `translateX(-${baseOffset}px) scale(${baseScale})`;
  }
  
  // Hide all other slides further away
  return 'translateX(0) scale(0)';
};

const getSlideClass = (index) => {
  const isCenter = index === currentIndex.value;
  const isPrev = index === (currentIndex.value - 1 + totalItems.value) % totalItems.value;
  const isNext = index === (currentIndex.value + 1) % totalItems.value;
  
  if (isCenter) {
    return 'w-1/2 h-full z-10 shadow-red-900/50';
  } else if (isPrev || isNext) {
    return 'w-1/3 h-5/6 z-0 opacity-70';
  }
  return 'opacity-0 pointer-events-none';
};
</script>

<style>
.will-change-transform {
  will-change: transform;
  transform: translate3d(0, 0, 0); 
}
</style>