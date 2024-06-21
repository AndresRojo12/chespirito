<template>
  <div class="page">
    <h1>Lista de Imágenes</h1>
    <div class="card-container">
      <Card
        v-for="image in images"
        :key="image.id"
        :image-url="image.path"
        :alt-text="image.alt"
        :title="image.name"
      />
    </div>
  </div>
</template>

<script>
import Card from "~/components/Card.vue";

export default {
  components: {
    Card,
  },
  data() {
    return {
      images: [],
    };
  },
  async mounted() {
    try {
      const response = await fetch("http://localhost:8000/api/v1/categories");
      const data = await response.json();

      const images = data.map(item => {
        return {
          id: item.id,
          path: item.imagePath,
          alt: item.alt,
          name: item.name
        };
      });

      this.images = images;
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  }
};
</script>

<style scoped>
.page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.card-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}
</style>
