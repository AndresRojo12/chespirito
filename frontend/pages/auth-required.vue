<template>
  <AuthRequired></AuthRequired>
</template>

<script setup>
import AuthRequired from "~/components/AuthRequired.vue";

definePageMeta({
  layout: false,
});
</script>
