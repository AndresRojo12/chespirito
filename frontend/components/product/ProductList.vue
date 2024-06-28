<template>
  <div>
    <v-card style="max-height:10rem ;">
      <h1 style="display: flex; background-color: #007bff; justify-content: center">Chespirito</h1>
      <v-data-iterator :items="filteredProducts.data" style="margin-top: 2%">
        <template v-slot:header>
          <v-text-field
            v-model="search"
            density="comfortable"
            placeholder="Search"
            prepend-inner-icon="mdi-magnify"
            style="max-width: 300px; margin-left: 75%"
            variant="solo"
            clearable
            hide-details
          ></v-text-field>
        </template>
      </v-data-iterator>
      <v-layout>
        <v-navigation-drawer
          v-model="drawer"
          style="background-color: #007bff;"
          :rail="rail"
          permanent
          @click="rail = false"
        >
          <v-list-item
            prepend-icon="mdi-account-circle"
            :title="`${userStore.user ? userStore.user.role : 'Usuario'}`"
            nav
          >
            <template v-slot:append>
              <v-btn
                icon="mdi-chevron-left"
                variant="text"
                @click.stop="rail = !rail"
              ></v-btn>
            </template>
          </v-list-item>

          <v-divider></v-divider>

          <v-list density="compact" nav>
            <v-list-item
              prepend-icon="mdi-home-city"
              title="Home"
              value="home"
            ></v-list-item>
            <v-list-item
              prepend-icon="mdi-account"
              title="My Account"
              value="account"
            ></v-list-item>
            <v-list-item
              @click.prevent="confirmLogout"
              prepend-icon="mdi-logout"
              title="Salir"
            ></v-list-item>
          </v-list>
        </v-navigation-drawer>
        <v-main style="height: 250px"></v-main>
      </v-layout>
    </v-card>
    <v-select
      v-model="pageSize"
      style="max-width: 300px;
      margin-left: 12%;
      margin-top: 2%"
      :items="[10, 20, 30, 40, 50]"
      label="Seleccionar datos por página"
      @change="getCategories"
    ></v-select>
  </div>
  <div style="margin-left: 10%; margin-top: 2%; display: flex; flex-wrap: wrap">
    <div
      v-for="pro in filteredProducts.data"
      :key="pro.id"
      style="
        flex: 1 1 22%;
        max-width: 22%;
        margin: 1%;
        box-sizing: border-box;
        text-align: center;
      "
    >
      <div>
        <img style="width: 100%" :src="getImageUrl(pro.imagePath)" />
      </div>
      <button
        style="
          width: 100%;
          padding: 10px;
          margin-top: 10px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        "
      >
        <h3 style="margin: 0">{{ pro.name }}</h3>
        <p style="margin: 0">{{ pro.description }}</p>
        <p style="margin: 0">{{ pro.price }}</p>

      </button>
    </div>
  </div>
  <div class="text-center">
    <v-container>
      <v-row justify="center">
        <v-col cols="8">
          <v-container class="max-width">
            <v-pagination
              v-model="page"
              :length="filteredProducts.totalPages"
              class="my-4"
              @input="getProducts"
            ></v-pagination>
          </v-container>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useAuth } from "~/store/auth";
import Swal from "sweetalert2";
const CONFIG = useRuntimeConfig();

const drawer = ref(true);
const rail = ref(true);
const page = ref(1);
const pageSize = ref(10);
const router = useRouter();
const userStore = useAuth();

const products = ref([]);
const filteredProducts = ref({ data: [], totalPages: 1 });
const search = ref("");

const getProducts = async () => {
  try {
    const { data } = await useFetch(
      `${CONFIG.public.API_BASE_URL}products?page=${page.value}&pageSize=${pageSize.value}`,
      {
        method: "GET",
      },
    );
    products.value = data.value.data;
    filteredProducts.value = data.value;
  } catch (error) {
    console.error("Error fetching categories:", error);
    filteredProducts.value = { data: [], totalPages: 1 };
  }
};

const getImageUrl = (imagePath) => {
  return imagePath;
};

onMounted(async () => {
  await getProducts();
});

watch(search, async (newSearch) => {
  if (!newSearch.trim()) {
    filteredProducts.value = {
      data: products.value,
      totalPages: filteredProducts.value.totalPages,
    };
    return;
  }

  try {
    const response = await fetch(
      `${CONFIG.public.API_BASE_URL}products/search?query=${encodeURIComponent(newSearch.trim())}`,
    );
    const data = await response.json();
    filteredProducts.value = { data, totalPages: 1 };
  } catch (error) {
    console.error("Error fetching filtered products:", error);
    filteredProducts.value = { data: [], totalPages: 1 };
  }
});

watch(page, async () => {
  await getProducts();
});

watch(pageSize, async () => {
  await getProducts();
});

const confirmLogout = () => {
  Swal.fire({
    title: "¿Estás seguro?",
    text: "¿Quieres cerrar sesión?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Sí, cerrar sesión",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      handleLogout();
    }
  });
};

const handleLogout = () => {
  userStore.logout();
  router.push("/");
};
</script>
