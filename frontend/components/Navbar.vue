<template>
  <div style="box-shadow: #00000063 0px 3px 6px">
    <nav class="flex justify-between items-center px-12 max-w-6xl mx-auto py-5">
      <div class="flex flex-row items-center justify-center">
        <a href="#"><img src="@/assets/img/logo.png" alt="" /></a>
      </div>
      <ul class="social flex flex-row gap-3 text-4xl cursor-pointer">
        <a target="blank" href="https://www.facebook.com/DrAndrewsPlasticSurgery"><li class="i-mdi-facebook"></li></a>
        <a target="blank" href="https://www.instagram.com/drkahlilandrews/"><li class="i-mdi-instagram"></li></a>
        <a target="blank" href="https://www.youtube.com/channel/UCpc-Z5ROkeYrWzP_E-CNOeA"><li class="i-mdi-youtube"></li></a>
        <a target="blank" href="https://podcasts.apple.com/us/podcast/the-aesthetic-angle/id1706562661"><li class="i-mdi-podcast"></li></a>
      </ul>
      <div class="phone-location">
        <a href="#">319.409.6420</a>
        <a
          href="https://www.google.com/maps/place/Dr.+Andrews+Plastic+Surgery/@41.675111,-91.5795316,15z/data=!4m2!3m1!1s0x0:0xcbf6c27b124bc743?sa=X&ved=2ahUKEwim4o-FsJPeAhWHilQKHYqsDdQQ_BIwDXoECAcQCw"
          target="blank"
          >CORALVILLE, IA</a
        >
      </div>
      <div>
        <a href="https://www.drandrewsplasticsurgery.com/contact-us/" target="blank"><button class="btn-primary">CONTACT US</button> </a>
      </div>
    </nav>
  </div>
</template>

<style lang="scss" scoped>
.social {
  a {
    @apply text-primary hover:opacity-70 transition-all transition-duration-all;
  }
}

.phone-location {
  @apply flex items-center;

  a {
    @apply text-black hover:text-primary transition-all transition-duration-500 font-500 border-primary;
  }

  a:first-child {
    @apply border-r-solid border-r-2 pr-3;
  }

  a:nth-child(2) {
    @apply pl-3;
  }
}
</style>
