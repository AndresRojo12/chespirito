<template>
  <div class="card">
    <img :src="imageUrl" :alt="altText" />
    <h2>{{ title }}</h2>
  </div>
</template>

<script>
export default {
  props: {
    imageUrl: {
      type: String,
      required: true
    },
    altText: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    }
  }
};
</script>

<style scoped>
.card {
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow: hidden;
  text-align: center;
}

img {
  max-width: 100%;
  height: auto;
}
</style>
