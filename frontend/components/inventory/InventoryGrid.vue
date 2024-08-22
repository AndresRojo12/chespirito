<template>
  <v-card style="max-height: 10rem">
    <h1
      style="display: flex; background-color: #aeb0b3; justify-content: center"
    >
      Chespirito
    </h1>
  </v-card>

    <v-btn @click.prevent="registerInve"
      style="margin-left: 10%;
      margin-top: 2%;"> Registrar Inventario
    </v-btn>
  <v-container style="margin-top: 0px">
    <v-layout>
      <v-navigation-drawer
        style="background-color: #aeb0b3; max-width: 155px"
        expand-on-hover
        rail
      >
        <v-list>
          <v-list-item
            prepend-icon="mdi-account-circle"
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
      style="max-width: 300px; margin-left: 12%"
      :items="[5, 10, 20, 30, 40, 50, 100]"
      label="Seleccionar datos por Página"
      @change="getInventories"
    >
    </v-select>
    <div class="table-container">
      <v-table style="width: 100%">
        <thead>
          <tr>
            <th class="text-left">
              <v-col>
                <v-text-field
                  style="width:200px ;"
                  v-model="filters.salesId"
                  clearable
                  @input="updatePage(1)"
                  label="ventas"
                >
                </v-text-field>
              </v-col>
            </th>
            <th class="text-left">
              <v-col>
                <v-text-field
                  style="width:200px ;"
                  v-model="filters.productName"
                  clearable
                  @input="updatePage(1)"
                  label="Producto vendido"
                ></v-text-field>
              </v-col>
            </th>
            <th class="text-left">
              <v-col>
                <v-text-field
                  style="width:200px ;"
                  v-model="filters.status"
                  clearable
                  @input="updatePage(1)"
                  label="Estado de producto"
                ></v-text-field>
              </v-col>
            </th>
            <th class="text-left">
              <v-col>
                <v-text-field
                style="width:200px ;"
                v-model="filters.created_at"
                clearable
                @input="updatePage(1)"
                label="Fecha de registro"
                ></v-text-field>
              </v-col>
            </th>
            <th class="text-left">
              <v-col>
                <v-text-field
                style="width:200px ;"
                v-model="filters.updated_at"
                clearable
                @input="updatePage(1)"
                label="Fecha actualización"
                ></v-text-field>
              </v-col>
            </th>
            <th class="text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="inve in combinedData" :key="inve.id">
            <td>{{ inve.salesId }}</td>
            <td>{{ inve.productName }}</td>
            <td>{{ inve.status }}
            </td>
            <td>
              {{
                moment(inve.createdAt).tz("America/Bogota").format("DD/MM/YYYY/ hh:mm A")
              }}
            </td>
            <td>
              {{
                moment(inve.updatedAt).tz("America/Bogota").format("DD/MM/YYYY/ hh:mm A")
              }}
            </td>
            <v-tooltip text="Editar">
              <template v-slot:activator="{ props }">
                <v-icon v-bind="props" @click="editInventory(inve)">
                  mdi-pencil
                </v-icon>
              </template>
            </v-tooltip>
              <v-icon>
                mdi-delete
              </v-icon>
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
  <v-dialog v-model="showEditDialog" max-width="600px">
      <v-card>
        <v-card-title class="headline">Editar el estado de Inventario</v-card-title>
        <v-card-text>
          <InventoryUpdate :inventory="editingInventory" @save="handleSave"/>
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue darken-1" text @click="showEditDialog = false">
            Cancelar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import { useAuth } from "~/store/auth";
import Swal from "sweetalert2";
import moment from "moment-timezone";
import InventoryUpdate from "./InventoryUpdate.vue";


const inventories = ref([]);
const sales = ref([]);
const combinedData = ref([]);
const CONFIG = useRuntimeConfig();
const router = useRouter();
const userStore = useAuth();
const showEditDialog = ref(false);
const editingInventory = ref(null);
const page = ref(1);
const pageSize = ref(10);
const totalPages = ref(1);
const filters = ref({
  salesId: "",
  productName: "",
  status: "",
  created_at: "",
});

const noRecordsFound = ref(false);

const getInventories = async () => {
  try {
    const { data, error } = await useFetch(
      `${CONFIG.public.API_BASE_URL}inventories?page=${page.value}&pageSize=${pageSize.value}&status=${filters.value.status}&salesId=${filters.value.salesId}&productName=${filters.value.productName}&createdAt=${filters.value.created_at}`,
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

const updatePage = (newPage) => {
  page.value = newPage;
  getInventories();
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

watch([page, pageSize, filters], () => {
  getInventories();
});

const editInventory = (inve) => {
  if(inve && inve.id) {
    editingInventory.value = { ...inve };
    showEditDialog.value = true;
  } else {
    console.error("No se puede editar");
  }
}

const handleSave = async (updatedInventory) => {
  if (updatedInventory) {
    const index = inventories.value.findIndex(
      (item) => item.id === updatedInventory.id
    );
    if (index !== -1) {
      inventories.value[index] = updatedInventory;
    }
  }
  await getInventories();
  showEditDialog.value = false;
};


const handleLogout = () => {
  userStore.logout();
  router.push("/");
};

const goHome = () => {
  router.push("/user/gestion");
};

const registerInve = () => {
  router.push("/inventory/register")
}
</script>

<style scoped>
.table-container {
  max-height: 400px;
  overflow-y: auto;
  margin-left: 10%;
}
</style>
