<template>
  <v-container style="margin-top:0px ;">
    <v-layout>
      <v-navigation-drawer
        style="background-color: #aeb0b3; max-width: 155px"
        expand-on-hover
        rail
      >
        <v-list>
          <v-list-item prepend-icon="mdi-account-circle"
          :title="`${userStore.user ? userStore.user.role : 'Usuario'}`"
          ></v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list density="compact" nav>
          <v-list-item
            prepend-icon="mdi-home-city"
            title="Inicio"
            @click="goHome"
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
    <v-select
      v-model="pageSize"
      style="max-width:300px;
      margin-left: 12%;"
      :items="[5,10,20,30,40,50,100]"
      label="Seleccionar categorias por Página"
      @change="getInventories">

    </v-select>
    <div class="table-container">
      <v-table style=" width: 100%;">
        <thead>
          <tr>
            <th class="text-left">Ventas</th>
            <th class="text-left">Producto vendido</th>
            <th class="text-left">Estado de producto</th>
            <th class="text-left">Fecha de registro</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="inve in combinedData" :key="inve.id">
            <td>{{ inve.salesId }}</td>
            <td>{{ inve.productName }}</td>
            <td>{{ inve.status }}</td>
            <td>{{ moment(inve.createdAt).tz('America/Bogota').format('DD/MM/YYYY') }}</td>
          </tr>
        </tbody>
      </v-table>
    </div>
    <v-pagination
      v-model="page"
        :length="totalPages"
        @input="getInventories"
        class="my-4"
    ></v-pagination>
  </v-container>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import { useAuth } from "~/store/auth";
import Swal from "sweetalert2";
import moment from 'moment-timezone';

const inventories = ref([]);
const sales = ref([]);
const combinedData = ref([]);
const CONFIG = useRuntimeConfig();
const router = useRouter();
const userStore = useAuth();
const page = ref(1);
const pageSize = ref(10);
const totalPages = ref(1);



const getInventories = async () => {
  try {
    const { data, error } = await useFetch(
      `${CONFIG.public.API_BASE_URL}inventories?page=${page.value}&pageSize=${pageSize.value}`,
      {
        method: "GET",
      },
    );
    inventories.value = data.value.data;
    totalPages.value = data.value.totalPages;
    combineData();
  } catch (error) {
    console.log(error);
  }
};

const getSales = async () => {
  try {
    const { data, error } = await useFetch(
      `${CONFIG.public.API_BASE_URL}sales`,
      {
        method: "GET",
      },
    );
    sales.value = data.value.data;
    combineData();
  } catch (error) {
    console.log(error);
  }
};

const combineData = () => {
  if (inventories.value.length > 0 && sales.value.length > 0) {
    combinedData.value = inventories.value.map((inventory) => {
      const sale = sales.value.find((sale) => sale.id === inventory.salesId);
      return {
        ...inventory,
        productName: sale ? sale.products.name : "Desconocido",
      };
    });
  }
};

onMounted(async () => {
  await nextTick();
  await getInventories();
  await getSales();
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

watch([page, pageSize], () => {
  getInventories();
});

const handleLogout = () => {
  userStore.logout();
  router.push("/");
};

const goHome = () => {
  router.push('/user/gestion')
}
</script>

<style scoped>
.table-container {
  max-height: 400px;
  overflow-y: auto; 
  margin-left: 10%;
}
</style>
