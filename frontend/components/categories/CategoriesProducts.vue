<template>
  <div v-if="category">
    <v-icon class="exit-icon" @click="router.back()">mdi-arrow-left</v-icon>
    <v-card>
      <h1 class="title">{{ category.name }}</h1>
    </v-card>
    <div class="subtitle">
      <h2>Productos</h2>
    </div>
    <div class="product-container">
      <div
        class="product-item"
        v-for="product in filteredProducts"
        :key="product.id"
      >
        <div>
          <img class="product-image" :src="getImageUrl(product.imagePath1)" />
        </div>
        <h1 class="name-text">{{ product.name }}</h1>
        <p class="status-text">Estado {{ product.status }}</p>
        <p class="description-text">{{ product.description }}</p>
        <p class="price-text">{{ product.price }}</p>
      </div>
    </div>
  </div>
  <v-container v-else>
    <LoadingSpinner />
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import LoadingSpinner from "../LoadingSpinner.vue";

const CONFIG = useRuntimeConfig();

const route = useRoute();
const router = useRouter();
const { id } = route.params;
const category = ref(null);
const error = ref(null);

// Método para buscar la categoría
const fetchCategory = async () => {
  try {
    const { data } = await useFetch(
      `${CONFIG.public.API_BASE_URL}/categories/${id}`
    );

    category.value = data.value;
  } catch (err) {
    error.value = err;
  }
};

const filteredProducts = computed(() => {
  return category.value?.products.filter(product => !product.deleted) || [];
});

const getImageUrl = (imagePath) => {
  return imagePath;
};

onMounted(async () => {
  await fetchCategory();
});

const back = () => {
  router.back();
};
</script>

<style scoped>
.exit-icon {
  display: none;
}
.title {
  background: linear-gradient(to bottom, #009c8c, #00b7a2);
  color: white;
  font-family: "Arial", sans-serif;
  text-align: center;
}
.subtitle {
  font-family: "Arial", sans-serif;
  margin-top: 2%;
  text-align: center;
}
.product-container {
  display: flex;
  flex-wrap: wrap;
}
.product-item {
  flex: 1 1 22%;
  max-width: 22%;
  margin: 1%;
  box-sizing: border-box;
  text-align: start;
}
.product-image {
  width: 100%;
}
.name-text {
  margin-top: 1%;
  font-family: "Arial", sans-serif;
  text-align: center;
  font-size: 15px;
}
.status-text,
.description-text {
  font-size: 13px;
  text-align: center;
  color: #b0b0b0;
}
.price-text {
  font-size: 13px;
  text-align: center;
}
@media (max-width: 540px) {
  .exit-icon {
    display: flex;
    font-size: 4vw;
    margin-bottom: 4%;
  }
  .product-container {
    display: inline;
    max-width: 100%;
  }
  .product-item {
    display: inline;
  }
}

@media (max-width: 430px) {
  .exit-icon {
    display: flex;
    font-size: 5vw;
    margin-bottom: 3%;
  }
  .title {
    font-size: 8vw;
  }
  .subtitle {
    font-size: 4vw;
  }
  .product-container {
    display: inline;
    max-width: 100%;
  }
  .product-item {
    max-width: 100%;
    margin-top: 5%;
  }
  .text {
    font-size: 5vw;
  }
}
</style>
