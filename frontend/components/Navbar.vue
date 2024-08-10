<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

const { isAuthenticated, userInfo, logout, updateUserInfo } = useAuth()

// Force an update of user info when the component mounts
onMounted(async () => {
  await updateUserInfo()
})

const handleLogout = async () => {
  await logout()
  navigateTo('/auth')
}
</script>

<template>
  <div class="position-fixed z-99 w-full bg-white" style="box-shadow: #00000063 0px 3px 6px">
    <nav class="flex justify-between items-center px-10 md:px-16 max-w-6xl mx-auto py-3 pb-1 lg:py-5 lg:pb-1.5">
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
        <a href="#"><img src="@/assets/img/logo.png" /></a>
      </div>
      <div>
        <a class="hidden lg:block" href="https://www.drandrewsplasticsurgery. com/contact-us/" target="blank"><button class="btn-primary btn">CONTACT US</button> </a>
      </div>
    </nav>
    <nav class="w-full flex justify-end items-center px-10 md:px-16 max-w-6xl mx-auto pb-4">
      <div v-if="isAuthenticated" class="flex justify-between items-center gap-x-4">
        <div v-if="userInfo" class="flex flex-col">
          <span class="font-bold text-lg">{{ userInfo.name }} {{ userInfo.surname }}</span>
          <span class="text-sm">{{ userInfo.role[0].toUpperCase() + userInfo.role.slice(1) }}</span>
        </div>
        <div v-else class="flex items-center gap-x-2">
          <span>Loading user</span>
          <div class="i-eos-icons:bubble-loading"></div>
        </div>
        <button class="btn btn-danger" @click="handleLogout">Logout</button>
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
