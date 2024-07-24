<script setup>
const config = useRuntimeConfig()
const googleMapsApiKey = config.public.googleMapsApiKey

const hospitalLocation = {
  lat: 41.67511757577444,
  lng: -91.5795230123071,
}

onMounted(() => {
  console.log('API Key:', googleMapsApiKey) // Debug line
  loadMapScript()
})

function loadMapScript() {
  if (!window.google) {
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&callback=initMap`
    script.async = true
    script.defer = true
    script.onload = initMap
    document.head.appendChild(script)
  } else {
    initMap()
  }
}

function initMap() {
  const map = new google.maps.Map(document.querySelector('#map'), {
    center: hospitalLocation,
    zoom: 15,
  })

  new google.maps.Marker({
    position: hospitalLocation,
    map,
    title: 'Dr. Andrews Plastic Surgery',
  })
}
</script>

<template>
  <div class="container flex flex-col items-center p-8">
    <header class="text-center mb-8">
      <img src="@/assets/img/footer-logo.png" alt="Logo" class="w-24 mb-4" />
      <h1 class="text-4xl font-bold">Dr. Andrews Plastic Surgery</h1>
    </header>
    <div class="rating text-center mb-8">
      <p class="text-lg font-medium">AVERAGE RATING</p>
      <div class="stars text-yellow-400 text-2xl">
        <span class="star" v-for="i in 5" :key="i">&#9733;</span>
      </div>
      <p class="text-4xl font-bold mt-2">4.8</p>
      <p class="text-sm text-gray-500">(339 Reviews)</p>
      <a href="#" class="text-blue-500 hover:underline">Read Testimonials &gt;&gt;</a>
    </div>
    <div class="contact text-center mb-8">
      <p class="font-bold">PHONE</p>
      <p>319.800.6877</p>
      <p class="font-bold mt-4">ADDRESS</p>
      <p>1100 5th St #210, Coralville, IA 52241</p>
      <p class="font-bold mt-4">HOURS</p>
      <p>M-F: 8:00AM-4:00PM</p>
      <div class="social flex justify-center space-x-4 mt-4">
        <a href="#" class="text-gray-700"><i class="fab fa-facebook"></i></a>
        <a href="#" class="text-gray-700"><i class="fab fa-instagram"></i></a>
        <a href="#" class="text-gray-700"><i class="fab fa-youtube"></i></a>
        <a href="#" class="text-gray-700"><i class="fab fa-podcast"></i></a>
      </div>
    </div>
    <div class="map-container relative mb-8 w-full max-w-4xl">
      <div class="info-card absolute top-4 left-4 bg-white shadow-lg p-4 rounded-lg z-10">
        <h2 class="text-lg font-bold">Dr. Andrews Plastic Surgery</h2>
        <p>1100 5th St #210, Coralville, IA 52241</p>
        <p class="text-lg font-semibold flex items-center">
          4.8
          <span class="text-yellow-400 text-xl ml-1">
            <span v-for="i in 5" :key="i">&#9733;</span>
          </span>
          <span class="ml-2 text-sm text-blue-500">(333 reviews)</span>
        </p>
        <a href="https://www.google.com/maps/dir/?api=1&destination=1100+5th+St+%23210%2C+Coralville%2C+IA+52241" class="text-blue-500 hover:underline">Directions</a>
        <br />
        <a href="https://www.google.com/maps/search/?api=1&query=1100+5th+St+%23210%2C+Coralville%2C+IA+52241" class="text-blue-500 hover:underline">View larger map</a>
      </div>
      <div
        id="map"
        class="w-screen h-100 border-0"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3087.530514587656!2d-91.57809268463408!3d41.68816497923769!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87e44172f82fb9a1%3A0xd3e4f84ed42cfba7!2sDr.%20Andrews%20Plastic%20Surgery!5e0!3m2!1sen!2sus!4v1601359241234!5m2!1sen!2sus"
        allowfullscreen=""
        aria-hidden="false"
        tabindex="0"></div>
    </div>
    <footer class="text-center text-sm text-gray-500">
      <p>&copy; 2024 Dr. Andrews Plastic Surgery</p>
      <p>
        <a href="#" class="text-blue-500 hover:underline">Privacy Policy</a> | <a href="#" class="text-blue-500 hover:underline">Cookie Policy</a> |
        <a href="#" class="text-blue-500 hover:underline">Accessibility</a> | <a href="#" class="text-blue-500 hover:underline">Sitemap</a> |
        <a href="#" class="text-blue-500 hover:underline">HIPAA Policy</a>
      </p>
    </footer>
  </div>
</template>

<style scoped lang="scss">
.stars {
  @apply flex justify-center space-x-1;
}

.social a {
  @apply text-lg;
}

.map-container {
  @apply relative mb-8 w-full max-w-4xl;
}

.info-card {
  @apply absolute top-4 left-4 bg-white shadow-lg p-4 rounded-lg z-10;
}
</style>
