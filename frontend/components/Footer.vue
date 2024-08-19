<script setup>
const config = useRuntimeConfig()
const googleMapsApiKey = config.public.googleMapsApiKey

const hospitalLocation = {
  lat: 41.67511757577444,
  lng: -91.5795230123071,
}

onMounted(() => {
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
  const map = new google.maps.Map(document.getElementById('map'), {
    center: hospitalLocation,
    zoom: 14,
  })

  const marker = new google.maps.Marker({
    position: hospitalLocation,
    map: map,
    title: 'Hello World!',
  })
}
</script>

<template>
  <div class="footer-content pt-30">
    <!-- Header -->
    <header class="footer-header max-w-6xl px-40 py-14 mx-auto flex flex-col lg:flex-row justify-between items-center text-center lg:text-justify">
      <div class="col-1 flex flex-col gap-y-14">
        <img src="@/assets/img/footer-logo.png" />
        <div>
          <h1 class="text-2xl" style="font-family: Montserrat-Regular-SemiBold">AVERAGE RATING</h1>
          <div class="flex justify-center lg:justify-start items-center space-x-1">
            <span class="text-black font-700 text-2xl ml-1">4.8</span>
            <div v-for="i in 5" :key="i" class="i-mdi-star text-yellow-400 text-2xl"></div>
          </div>
          <div class="flex justify-center lg:justify-start gap-2">
            <div class="i-mdi-wechat text-blue text-3xl"></div>
            <span class="text-lg">339 Reviews</span>
          </div>
        </div>
        <a class="text-primary hover:text-blue-4 transition-all transition-duration-700" href="https://www.drandrewsplasticsurgery.com/our-reviews/" traget="blank">Read Testimonials >> </a>
        <SocialIcons class="flex justify-center lg:justify-start" />
      </div>
      <div class="col-2 flex flex-col gap-y-7 mt-6 lg:mt-0">
        <div>
          <h1>PHONE</h1>
          <a href="#">319.800.6877</a>
        </div>
        <div>
          <h1>ADDRESS</h1>
          <a
            target="blank"
            href="https://www.google.com/maps/place/Dr.+Andrews+Plastic+Surgery/@41.675111,-91.5795316,15z/data=!4m2!3m1!1s0x0:0xcbf6c27b124bc743?sa=X&ved=2ahUKEwim4o-FsJPeAhWHilQKHYqsDdQQ_BIwDXoECAcQCw"
            >1100 5th St #210 <br />
            Coralville, IA 52241
          </a>
        </div>
        <div>
          <h1>HOURS</h1>
          <span>M–F: 8:00AM–4:00PM</span>
        </div>
      </div>
      <div class="col-3 flex flex-col gap-y-4.5 mt-6 lg:mt-0">
        <h1>QUICKLINKS</h1>
        <a target="blank" href="https://www.drandrewsplasticsurgery.com/contact-us/">Contact Us</a>
        <a target="blank" href="https://www.drandrewsplasticsurgery.com/gallery/">Gallery</a>
        <a target="blank" href="https://www.drandrewsplasticsurgery.com/patient-resources/financing/">Financing</a>
        <a target="blank" href="https://www.drandrewsplasticsurgery.com/blog/">Blog</a>
        <a target="blank" href="https://www.drandrewsplasticsurgery.com/patient-resources/specials/">Specials</a>
        <a target="blank" href="https://squareup.com/gift/15YZSR168YTVA/order">Gift Cards</a>
      </div>
    </header>

    <!-- Map -->
    <div class="relative mb-0 w-full">
      <div class="info-card absolute top-2 left-2 bg-white shadow-lg p-4 rounded-lg z-10">
        <h2 class="text-lg font-bold">Dr. Andrews Plastic Surgery</h2>
        <p>1100 5th St #210, Coralville, IA 52241</p>
        <div class="flex lg:justify-start items-center space-x-1">
          <span class="text-black font-700 text-lg ml-1">4.8</span>
          <div v-for="i in 5" :key="i" class="i-mdi-star text-yellow-400 text-2xl"></div>
          <span class="ml-2 text-sm text-blue-500">(339 reviews)</span>
        </div>
        <a
          target="blank"
          href="https://www.google.com/maps/dir//Dr.+Andrews+Plastic+Surgery+1100+5th+St+%23210+Coralville,+IA+52241/@41.675113,-91.579521,14z/data=!4m5!4m4!1m0!1m2!1m1!1s0x87e4f74a3779e921:0xcbf6c27b124bc743"
          class="text-blue-500 hover:underline"
          >Directions</a
        >
        <br />
        <a target="blank" href="https://www.google.com/maps?ll=41.675113,-91.579521&z=14&t=m&hl=en&gl=US&mapclient=embed&cid=14697148267813914435" class="text-blue-500 hover:underline"
          >View larger map</a
        >
      </div>
      <div
        id="map"
        class="w-screen h-100 border-0"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3087.530514587656!2d-91.57809268463408!3d41.68816497923769!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87e44172f82fb9a1%3A0xd3e4f84ed42cfba7!2sDr.%20Andrews%20Plastic%20Surgery!5e0!3m2!1sen!2sus!4v1601359241234!5m2!1sen!2sus"
        allowfullscreen=""
        aria-hidden="false"
        tabindex="0"></div>
    </div>

    <!-- Copyright -->
    <footer class="lg:shadow-md py-5 mb-20">
      <div class="flex flex-col lg:flex-row gap-y-4 justify-between max-w-300 mx-auto items-center text-sm">
        <span>© 2024 Dr. Andrews Plastic Surgery</span>
        <div class="copyright-section">
          <a href="https://www.drandrewsplasticsurgery.com/privacy-policy/" target="_blank">Privacy Policy</a>
          |
          <a href="https://www.drandrewsplasticsurgery.com/cookie-policy/" target="_blank">Cookie Policy</a>
          |
          <a href="https://www.drandrewsplasticsurgery.com/accessibility-statement/" target="_blank">Accessibility</a>
          |
          <a href="https://www.drandrewsplasticsurgery.com/sitemap/" target="_blank">Sitemap</a>
          |
          <a href="https://www.drandrewsplasticsurgery.com/wp-content/uploads/2023/11/HIPAA-Policy_Dr.-Andrews-Plastic-Surgery.pdf" target="_blank">HIPAA Policy</a>
        </div>
        <div class="items-center flex">
          <span>Plastic Surgery Website by</span>
          <a href="https://dlmconversion.com/" target="blank"><img src="@/assets/img/dlm.png" alt="DLM" /></a>
        </div>
      </div>
    </footer>

    <!-- Contact Us Fixed Button -->
    <a
      class="flex lg:hidden position-fixed bottom-0 w-full justify-between items-center bg-[#CCB379] text-white text-md rounded font-600 py-3 z-500"
      href="https://www.drandrewsplasticsurgery.com/contact-us/"
      target="_blank">
      <span class="flex-1 text-center">CONTACT US</span>
      |
      <div class="i-mdi-call px-20 text-3xl"></div>
    </a>
  </div>
</template>

<style scoped lang="scss">
.footer-header {
  .col-2,
  .col-3 {
    h1 {
      @apply text-size-lg;
      font-family: 'Montserrat-Regular-SemiBold';
    }

    a {
      @apply text-primary hover:text-black transition-all transition-duration-400;
    }
  }

  .col-2 h1 {
    @apply mb-4;
  }
}

.copyright-section a {
  @apply text-black hover:text-primary transition-alll transition-duration-400;
}
</style>
