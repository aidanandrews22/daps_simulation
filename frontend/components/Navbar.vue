<template>
  <div class="position-fixed z-99 w-full bg-white" style="box-shadow: #00000063 0px 3px 6px">
    <nav class="flex justify-between items-center px-16 max-w-6xl mx-auto py-3 lg:py-5">
      <div class="hidden lg:block">
        <NuxtLink to="/"><img src="@/assets/img/logo.png" alt="" /></NuxtLink>
      </div>
      <a
        class="block lg:hidden i-mdi-location text-3xl text-dark"
        target="_blank"
        href="https://www.google.com/maps/place/Dr.+Andrews+Plastic+Surgery/@41.675111,-91.5795316,15z/data=!4m2!3m1!1s0x0:0xcbf6c27b124bc743?sa=X&ved=2ahUKEwim4o-FsJPeAhWHilQKHYqsDdQQ_BIwDXoECAcQCw"></a>
      <SocialIcons class="hidden lg:flex" />
      <div class="phone-location items-center hidden lg:flex">
        <a href="#">319.409.6420</a>
        <a
          href="https://www.google.com/maps/place/Dr.+Andrews+Plastic+Surgery/@41.675111,-91.5795316,15z/data=!4m2!3m1!1s0x0:0xcbf6c27b124bc743?sa=X&ved=2ahUKEwim4o-FsJPeAhWHilQKHYqsDdQQ_BIwDXoECAcQCw"
          target="blank"
          >CORALVILLE, IA</a
        >
      </div>
      <div class="block lg:hidden">
        <a href="#"><img src="@/assets/img/logo.png" alt="" /></a>
      </div>
      <div>
        <a class="hidden lg:block" href="https://www.drandrewsplasticsurgery.com/contact-us/" target="blank"><button class="btn-primary">CONTACT US</button> </a>
      </div>
    </nav>
  </div>
</template>

<style lang="scss" scoped>
.phone-location {
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
