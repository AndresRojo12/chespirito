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
              @click.prevent="productsPage"
            >
            </v-list-item>
            <v-list-item
              title="Categorías"
              prepend-icon="mdi-shopping"
              @click.prevent="categoriesPage"
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
      :items="[10, 20, 30, 40, 50, 100]"
      @change="getSales"
    ></v-select>
  </div>
  <div class="table-container">
    <v-table style="width: 100%">
      <thead>
        <tr>
          <th class="text-left">ID Categoría</th>
          <th class="text-left">ID Producto</th>
          <th class="text-left">Cantidad</th>
          <th class="text-left">Total</th>
          <th class="text-left">Fecha</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="sal in combinedData" :key="sal.id">
          <td>{{ sal.categoryId }}</td>
          <td>{{ sal.productId }}</td>
          <td>{{ sal.quantitySold }}</td>
          <td>{{ sal.salePrice }}</td>
          <td>
            {{
              moment(sal.createdAt).tz("America/Bogota").format("DD/MM/YYYY")
            }}
          </td>
        </tr>
      </tbody>
    </v-table>
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
import moment from "moment-timezone";

const CONFIG = useRuntimeConfig();
const userStore = useAuth();
const router = useRouter();
const page = ref(1);
const pageSize = ref(10);
const filteredSales = ref({ data: [], totalPages: 1 });
const sales = ref([]);
const categories = ref([]);
const products = ref([]);
const combinedData = ref([]);

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
    combineData();
  } catch (error) {
    filteredSales.value = { data: [], totalPages: 1 };
  }
};

const getCategories = async () => {
  try {
    const { data } = await useFetch(`${CONFIG.public.API_BASE_URL}categories`, {
      method: "GET",
    });
    categories.value = data.value.data;
    combineData();
  } catch (error) {
    console.log(error);
  }
};

const getProducts = async () => {
  try {
    const { data } = await useFetch(`${CONFIG.public.API_BASE_URL}products`, {
      method: "GET",
    });
    products.value = data.value.data;
    combineData();
  } catch (error) {
    console.log(error);
  }
};

const combineData = () => {
  if (
    sales.value.length > 0 &&
    categories.value.length > 0 &&
    products.value.length > 0
  ) {
    combinedData.value = sales.value.map((sale) => {
      const category = categories.value.find(
        (category) => category.id === (sale ? sale.categoryId : ""),
      );
      const product = products.value.find(
        (product) => product.id === (sale ? sale.productId : ""),
      );

      return {
        ...sale,
        productName: product ? product.name : "Desconocido",
        categoryName: category ? category.name : "Desconocido",
      };
    });
  }
};

onMounted(async () => {
  await nextTick();
  await getSales();
  await getCategories();
  await getProducts();
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

const productsPage = () => {
  router.push("/product/list");
};

const categoriesPage = () => {
  router.push("/user/gestion");
};

const confirmLogout = () => {
  Swal.fire({
    text: "¿Está seguro que quiere cerrar sesión?",
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

<style scoped>
.table-container {
  max-height: 400px;
  overflow-y: auto;
  margin-left: 10%;
}
</style>
