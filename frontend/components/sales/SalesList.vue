<template>
  <div>
    <v-card style="max-height: 10rem">
      <h1
        style="
          display: flex;
          background-color: #aeb0b3;
          justify-content: center;
        "
      >
        Chespirito
      </h1>
      <v-data-iterator :items="filteredSales.data || []" style="margin-top: 2%">
        <template v-slot:header>
          <v-text-field
            v-model="search"
            density="comfortable"
            placeholder="Buscar"
            prepend-inner-icon="mdi-magnify"
            style="max-width: 300px; margin-left: 75%"
            variant="solo"
            clearable
            hide-details
          ></v-text-field>
          <v-row>
            <v-btn @click.prevent="salesRegister" style="margin-left: 10%"
              >Registrar ventas</v-btn
            >
          </v-row>
        </template>
      </v-data-iterator>
      <v-layout>
        <v-navigation-drawer
          style="background-color: #aeb0b3; max-width: 155px"
          expand-on-hover
          rail
        >
          <v-list>
            <v-list-item
              :title="`${userStore ? userStore.user.role : 'Usuario'}`"
              prepend-icon="mdi-account-circle"
            ></v-list-item>
          </v-list>
          <v-divider></v-divider>
          <v-list density="compact" nav>
            <v-list-item
              title="Inicio"
              prepend-icon="mdi-home-city"
              @click.prevent="goHome"
            >
            </v-list-item>
            <v-list-item
              title="Productos"
              prepend-icon="mdi-cash"
              @click.prevent="products"
            >
            </v-list-item>
            <v-list-item
              title="Categorías"
              prepend-icon="mdi-shopping"
              @click.prevent="categories"
            >
            </v-list-item>
            <v-list-item
              title="Salir"
              prepend-icon="mdi-logout"
              @click.prevent="confirmLogout"
            >
            </v-list-item>
          </v-list>
        </v-navigation-drawer>
        <v-main style="height: 250px"></v-main>
      </v-layout>
    </v-card>
    <v-select
      label="Seleccionar número de items por página"
      style="max-width: 300px; margin-left: 12%; margin-top: 2%"
      v-model="pageSize"
      :items="[10, 20, 30, 40, 50]"
      @change="getSales"
    ></v-select>
  </div>
  <div style="margin-left: 10%; margin-top: 2%; display: flex; flex-wrap: wrap">
    <div
      v-for="sale in filteredSales.data || []"
      :key="sale.id"
      style="
        flex: 1 1 22%;
        max-width: 22%;
        margin: 1%;
        box-sizing: border-box;
        text-align: center;
      "
    >
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
        <h3 style="margin: 0">Cantidad: {{ sale.quantitySold }}</h3>
        <p style="margin: 0">Total: {{ sale.salePrice }}</p>
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
              :length="filteredSales.totalPages || 1"
              class="my-4"
              @input="getSales"
            ></v-pagination>
          </v-container>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { onMounted, watch, nextTick } from "vue";
import { useAuth } from "~/store/auth";
import Swal from "sweetalert2";

const CONFIG = useRuntimeConfig();
const userStore = useAuth();
const router = useRouter();
const page = ref(1);
const pageSize = ref(10);
const sales = ref([]);
const filteredSales = ref({ data: [], totalPages: 1 });
const search = ref("");

const getSales = async () => {
  try {
    const { data } = await useFetch(
      `${CONFIG.public.API_BASE_URL}sales?page=${page.value}&pageSize=${pageSize.value}`,
      {
        method: "GET",
      },
    );
    sales.value = data.value.data;
    filteredSales.value = {
      data: data.value.data,
      totalPages: data.value.totalPages,
    };
  } catch (error) {
    filteredSales.value = { data: [], totalPages: 1 };
  }
};

onMounted(async () => {
  await nextTick();
  await getSales();
});

watch(search, async (newSearch) => {
  if (!newSearch.trim()) {
    filteredSales.value = {
      data: sales.value,
      totalPages: filteredSales.value.totalPages,
    };
    return;
  }

  try {
    const response = await fetch(
      `${CONFIG.public.API_BASE_URL}sales/search?query=${encodeURIComponent(newSearch.trim())}`,
    );
    const data = await response.json();
    filteredSales.value = { data, totalPages: 1 };
  } catch (error) {
    filteredSales.value = { data: [], totalPages: 1 };
  }
});

watch(page, async () => {
  await getSales();
});

watch(pageSize, async () => {
  await getSales();
});

const salesRegister = () => {
  router.push("/sales/register");
};

const goHome = () => {
  router.push("/user/gestion");
};

const products = () => {
  router.push("/product/list");
};

const categories = () => {
  router.push("/user/gestion");
};

const confirmLogout = () => {
  Swal.fire({
    text: "Seguro quiere cerrar sesión",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Si",
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
