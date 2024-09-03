<template>
  <div v-if="category">
    <v-list-item class="exit-icon" prepend-icon="mdi-arrow-left" @click="back"></v-list-item>
    <v-card>
      <h1 class="title">{{ category.name }}</h1>
    </v-card>
    <div class="subtitle">
      <h2>Productos</h2>
    </div>
    <div class="product-container">
      <div
        class="product-item"
        v-for="product in category.products"
        :key="product.id"
      >
        <div>
          <img class="product-image" :src="getImageUrl(product.imagePath)" />
        </div>
        <h3 class="text">{{ product.name }}</h3>
        <p class="text">{{ product.description }}</p>
        <p class="text"><h4>Precio:</h4> {{ product.price }}</p>
      </div>
    </div>
  </div>
  <v-container v-else>
    <p>Loading...</p>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute,useRouter } from "vue-router";

const CONFIG = useRuntimeConfig();

const route = useRoute();
const router = useRouter()
const { id } = route.params;
const category = ref(null);
const error = ref(null);

const fetchCategory = async () => {
  try {
    const { data } = await useFetch(
      `${CONFIG.public.API_BASE_URL}/categories/${id}`,
    );
    console.log("dta:", data);
    category.value = data.value;
  } catch (err) {
    error.value = err;
  }
};

const getImageUrl = (imagePath) => {
  return imagePath;
};

onMounted(async () => {
  await fetchCategory();
});

const back = () => {
  router.back()
}
</script>

<style scoped>
.exit-icon{
  display: none;
}
.title {
  background: linear-gradient(to bottom, #009c8c, #00b7a2);
  color: white;
  font-family: "Arial", sans-serif;
  text-align: center;
  background-color: #009c8c;
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
.text {
  margin-top: 1%;
  font-family: "Arial", sans-serif;
}

@media (max-width:540px){
  .exit-icon{
    display: flex;
    font-size: 4vw;
    margin-bottom: 4%;
  }
  .product-container{
    display: inline;
    max-width: 100%;
  }
  .product-item{
    display: inline;
  }
}

@media (max-width: 430px) {
  .exit-icon{
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
