<template>
    <div class="semi-circle" v-waves @click="goHome()">
             <img src="@/assets/images/home.png" alt="" class="w-48px h-48px mt-36px ml-16px">
      </div>
</template>

<script lang="ts" setup>
    import vWaves from "@/utils/directive/waves";
    import { useRouter } from "vue-router";
    const router = useRouter();
    const goHome = ()=>{
         router.push("/index");
    }
</script>