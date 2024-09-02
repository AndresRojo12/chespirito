<template>
  <InterfazUser></InterfazUser>
</template>

<script setup>
import InterfazUser from "~/components/user/InterfazUser";
definePageMeta({
  middleware:'auth'
})
</script>
