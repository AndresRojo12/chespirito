<template>
  <div v-if="isAuthenticated">
    <v-btn
      @click.prevent="registerInve"
      style="margin-left: 10%;
      background-color: white; color:#009c8c; margin-top: 2%"
    >
      Registrar Inventario
    </v-btn>
    <v-container style="margin-top: 0px">
      <v-layout>
        <v-navigation-drawer
          style="background-color: white; max-width: 155px"
          expand-on-hover
          rail
        >
          <v-list>
            <v-list-item
              style="color:#009c8c"
              prepend-icon="mdi-account-circle"
              :title="`${userStore.user ? userStore.user.role : 'Usuario'}`"
            ></v-list-item>
          </v-list>

          <v-divider></v-divider>

          <v-list density="compact" nav>
            <v-list-item
              style="color:#009c8c"
              prepend-icon="mdi-home-city"
              title="Inicio"
              @click="goHome"
            ></v-list-item>

            <v-list-item
              style="color:#009c8c"
              @click.prevent="confirmLogout"
              prepend-icon="mdi-logout"
              title="Salir"
            ></v-list-item>
          </v-list>
        </v-navigation-drawer>

        <v-main style="height: 100px"></v-main>
      </v-layout>
      <v-select
        v-model="pageSize"
        style="max-width: 300px;
        color:#009c8c; margin-left: 12%"
        :items="[5, 10, 20, 30, 40, 50, 100]"
        label="Seleccionar datos por Página"
        @change="getInventories"
      >
      </v-select>
      <div class="table-container">
        <v-table style="width: 100%;
        color: #009c8c;">
          <thead>
            <tr>
              <th class="text-left">
                <v-col>
                  <v-text-field
                    style="width: 200px"
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
                    style="width: 200px"
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
                    style="width: 200px"
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
                    style="width: 200px"
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
                    style="width: 200px"
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
              <td>{{ inve.status }}</td>
              <td>
                {{
                  moment(inve.createdAt)
                    .tz("America/Bogota")
                    .format("DD/MM/YYYY/ hh:mm A")
                }}
              </td>
              <td>
                {{
                  moment(inve.updatedAt)
                    .tz("America/Bogota")
                    .format("DD/MM/YYYY/ hh:mm A")
                }}
              </td>
              <v-tooltip text="Editar">
                <template v-slot:activator="{ props }">
                  <v-icon style="color: rgba(228, 192, 11, 0.663);" v-bind="props" @click="editInventory(inve)">
                    mdi-pencil
                  </v-icon>
                </template>
              </v-tooltip>
              <v-icon style="color:darkslategrey"> mdi-delete </v-icon>
            </tr>
          </tbody>
        </v-table>
        <div v-if="noRecordsFound" style="text-align: center; margin-top: 20px">
          <v-alert color="blue" type="warning"
            >No se encontraron registros.</v-alert
          >
        </div>
      </div>
      <v-pagination
        style="color:#009c8c;"
        v-model="page"
        :length="totalPages"
        @input="getInventories"
        class="my-4"
      ></v-pagination>
    </v-container>
    <v-dialog v-model="showEditDialog" max-width="300px">
      <v-card style="border-radius:6%;
      background-color:white">
        <v-card-title style="color:#009c8c;" class="headline"
          >Editar el estado de Inventario</v-card-title
        >
        <v-card-text>
          <InventoryUpdate :inventory="editingInventory" @save="handleSave" />
        </v-card-text>
        <v-card-actions>
          <v-btn style="background-color:white; color: #009c8c;" text @click="showEditDialog = false">
            Cancelar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
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
  updated_at: "",
});

const noRecordsFound = ref(false);
const isAuthenticated = ref(false);

const getInventories = async () => {
  noRecordsFound.value = false;
  try {
    const { data, error } = await useFetch(
      `${CONFIG.public.API_BASE_URL}inventories?page=${page.value}
      &pageSize=${pageSize.value}&status=${filters.value.status}&salesId=${filters.value.salesId}&productName=${filters.value.productName}&createdAt=${filters.value.created_at}&updatedAt=${filters.value.updated_at}`,
      {
        method: "GET",
      },
    );

    // if(error.value){
    //   if(error.value.status === 404) {
    //     noRecordsFound.value = true;
    //     combinedData.value = [];
    //   }
    //   return;
    // }

    inventories.value = data.value.data;
    totalPages.value = data.value.totalPages;
    combineData();

    if (combinedData.value === null) {
      noRecordsFound.value = true;
      combinedData.value = [];
    }
  } catch (error) {
    console.log(error);
    noRecordsFound.value = true;
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
  if (!userStore.user) {
    Swal.fire({
      icon: 'error',
      title: 'Acceso denegado',
      text: 'Debe iniciar sesión primero',
      confirmButtonText: 'Aceptar'
    }).then(()=>{
      router.push('/')
    });
  } else {
    isAuthenticated.value = true;
    await nextTick();
    await getInventories();
    await getSales();
  }
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
  if (inve && inve.id) {
    editingInventory.value = { ...inve };
    showEditDialog.value = true;
  } else {
    console.error("No se puede editar");
  }
};

const handleSave = async (updatedInventory) => {
  if (updatedInventory) {
    const index = inventories.value.findIndex(
      (item) => item.id === updatedInventory.id,
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
  router.push("/inventory/register");
};
</script>

<style scoped>
.table-container {
  max-height: 400px;
  overflow-y: auto;
  margin-left: 10%;
}

.footer-bottom {
  margin-top: 10px;
  font-size: 14px;
}

.footer {
  display: flex;
  justify-content: center;
  margin-top: 2%;
  color:#009c8c
}
</style>
