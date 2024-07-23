<template>
  <div class="flex flex-col items-center p-4">
    <header class="text-center mb-8">
      <img src="@/assets/img/footer-logo.png" alt="Logo" class="w-24" />
      <h1 class="text-3xl font-bold mt-2">Dr. Andrews Plastic Surgery</h1>
    </header>
    <div class="text-center mb-8">
      <p class="text-lg font-semibold">AVERAGE RATING</p>
      <div class="text-yellow-500 text-2xl mt-1">
        <span class="inline-block">&#9733;</span>
        <span class="inline-block">&#9733;</span>
        <span class="inline-block">&#9733;</span>
        <span class="inline-block">&#9733;</span>
        <span class="inline-block">&#9733;</span>
      </div>
      <p class="text-4xl font-bold mt-1">4.8</p>
      <p class="text-sm mt-1">(339 Reviews)</p>
      <a href="#" class="text-blue-500 mt-2 inline-block">Read Testimonials >></a>
    </div>
    <div class="text-center mb-8">
      <p class="text-lg">Phone: 319.800.6877</p>
      <p class="text-lg">Address: 1100 5th St #210, Coralville, IA 52241</p>
      <p class="text-lg">Hours: M-F: 8:00AM-4:00PM</p>
      <div class="mt-2 flex justify-center space-x-4">
        <a href="#" class="text-blue-500 text-xl"><i class="fab fa-facebook"></i></a>
        <a href="#" class="text-pink-500 text-xl"><i class="fab fa-instagram"></i></a>
        <a href="#" class="text-red-500 text-xl"><i class="fab fa-youtube"></i></a>
        <a href="#" class="text-gray-500 text-xl"><i class="fab fa-podcast"></i></a>
      </div>
    </div>
    <div class="mb-8">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509656!2d144.95373531590424!3d-37.81720987975171!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d43f3f2d6c5%3A0x2e4d30b6c2a6e1f4!2sDr.%20Andrews%20Plastic%20Surgery!5e0!3m2!1sen!2sus!4v1601359241234!5m2!1sen!2sus"
        width="600"
        height="450"
        style="border: 0"
        aria-hidden="false"
        tabindex="0"
        class="rounded-md shadow-md"></iframe>
    </div>
    <footer class="text-center mt-8">
      <p>&copy; 2024 Dr. Andrews Plastic Surgery</p>
      <p>
        <a href="#" class="text-blue-500">Privacy Policy</a> | <a href="#" class="text-blue-500">Cookie Policy</a> | <a href="#" class="text-blue-500">Accessibility</a> |
        <a href="#" class="text-blue-500">Sitemap</a> |
        <a href="#" class="text-blue-500">HIPAA Policy</a>
      </p>
    </footer>
  </div>
</template>

<style lang="scss" scoped>
/* Using @apply to create custom styles */
.header {
  @apply text-center mb-8;
}

.rating {
  @apply text-center mb-8;
}

.contact {
  @apply text-center mb-8;
}

.map {
  @apply mb-8;
}

.footer {
  @apply text-center mt-8;
}

.social a {
  @apply text-xl;
}
</style>
