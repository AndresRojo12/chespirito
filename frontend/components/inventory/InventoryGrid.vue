<template>
  <div class="header-container">
    <v-btn class="register-button" @click.prevent="inventoryRegister">
      Registrar Inventario
    </v-btn>
    <v-select
      class="page-select"
      v-model="pageSize"
      :items="[5, 10, 20, 30, 40, 50, 100]"
      label="Seleccionar datos por Página"
      @change="getInventories"
    >
    </v-select>
  </div>

  <v-table v-if="!isMdAndUp">
    <v-text-field
      v-model="filters.productName"
      label="Producto vendido"
      clearable
      @input="updatePage(1)"
      @click:clear="clearFilter('productName')"
    ></v-text-field>
    <v-col v-for="inve in combinedData" :key="inve.id">
      <v-row
        ><v-col>{{ inve.productName }}</v-col>
        <v-col class="d-flex justify-end">
          <v-tooltip text="Editar">
            <template v-slot:activator="{ props }">
              <v-icon
                style="color: #009c8c"
                v-bind="props"
                @click="editInventory(inve)"
              >
                mdi-pencil
              </v-icon>
            </template>
          </v-tooltip>
        </v-col></v-row
      >
    </v-col>

    <v-text-field
      v-model="filters.status"
      label="Estado de producto"
      clearable
      @input="updatePage(1)"
      @click:clear="clearFilter('status')"
    ></v-text-field>
    <v-col v-for="inve in combinedData" :key="inve.id">
      <v-row
        ><v-col>{{ inve.status }}</v-col>
        <v-col class="d-flex justify-end">
          <v-tooltip text="Editar">
            <template v-slot:activator="{ props }">
              <v-icon
                style="color: #009c8c"
                v-bind="props"
                @click="editInventory(inve)"
              >
                mdi-pencil
              </v-icon>
            </template>
          </v-tooltip>
        </v-col></v-row
      >
    </v-col>

    <v-text-field
      v-model="filters.created_at"
      label="Fecha de registro"
      clearable
      @input="updatePage(1)"
      @click:clear="clearFilter('created_at')"
    ></v-text-field>
    <v-col v-for="inve in combinedData" :key="inve.id">
      <v-row
        ><v-col>
          {{
            moment(inve.createdAt)
              .tz("America/Bogota")
              .format("DD/MM/YYYY/ hh:mm A")
          }}
        </v-col>

        <v-col class="d-flex justify-end">
          <v-tooltip text="Editar">
            <template v-slot:activator="{ props }">
              <v-icon
                style="color: #009c8c"
                v-bind="props"
                @click="editInventory(inve)"
              >
                mdi-pencil
              </v-icon>
            </template>
          </v-tooltip>
        </v-col></v-row
      >
    </v-col>

    <v-text-field
      v-model="filters.updated_at"
      label="Fecha actualización"
      clearable
      @input="updatePage(1)"
      @click:clear="clearFilter('updated_at')"
    ></v-text-field>
    <v-col v-for="inve in combinedData" :key="inve.id">
      <v-row>
        <v-col>
          {{
            inve.updatedAt
              ? moment(inve.updatedAt)
                  .tz("America/Bogota")
                  .format("DD/MM/YYYY hh:mm A")
              : "No actualizado"
          }}
        </v-col>
        <v-col class="d-flex justify-end">
          <v-tooltip text="Editar">
            <template v-slot:activator="{ props }">
              <v-icon
                style="color: #009c8c"
                v-bind="props"
                @click="editInventory(inve)"
              >
                mdi-pencil
              </v-icon>
            </template>
          </v-tooltip>
        </v-col>
      </v-row>
    </v-col>
  </v-table>

  <v-table v-if="isMdAndUp">
    <thead>
      <tr>
        <th class="text-left">
          <v-text-field
            v-model="filters.productName"
            label="Producto vendido"
            clearable
            @input="updatePage(1)"
            @click:clear="clearFilter('productName')"
          ></v-text-field>
        </th>
        <th class="text-left">
          <v-text-field
            v-model="filters.status"
            label="Estado de producto"
            clearable
            @input="updatePage(1)"
            @click:clear="clearFilter('status')"
          ></v-text-field>
        </th>
        <th class="text-left">
          <v-text-field
            v-model="filters.created_at"
            label="Fecha de registro"
            clearable
            @input="updatePage(1)"
            @click:clear="clearFilter('created_at')"
          ></v-text-field>
        </th>
        <th class="text-left">
          <v-text-field
            v-model="filters.updated_at"
            label="Fecha actualización"
            clearable
            @input="updatePage(1)"
            @click:clear="clearFilter('updated_at')"
          ></v-text-field>
        </th>
        <th class="text-left">Acciones</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="inve in combinedData" :key="inve.id">
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
            inve.updatedAt
              ? moment(inve.updatedAt)
                  .tz("America/Bogota")
                  .format("DD/MM/YYYY hh:mm A")
              : "No actualizado"
          }}
        </td>
        <td>
          <v-tooltip text="Editar">
            <template v-slot:activator="{ props }">
              <v-icon
                style="color: #009c8c"
                v-bind="props"
                @click="editInventory(inve)"
              >
                mdi-pencil
              </v-icon>
            </template>
          </v-tooltip>
        </td>
      </tr>
    </tbody>
  </v-table>
  <div v-if="noRecordsFound" style="text-align: center; margin-top: 20px">
    <v-alert color="#009c8c" type="warning"
      >No se encontraron registros.</v-alert
    >
  </div>

  <div class="text-center">
    <v-container>
      <v-row justify="center">
        <v-col col="8">
          <v-container class="max-width">
            <v-pagination
              v-model="page"
              :length="totalPages"
              @input="getInventories"
              class="my-4"
            ></v-pagination>
          </v-container>
        </v-col>
      </v-row>
    </v-container>
  </div>

  <v-dialog class="dialog" v-model="showEditDialog">
    <v-card>
      <h1 class="dialog-title">Editar estado</h1>
      <v-card-text>
        <InventoryUpdate :inventory="editingInventory" @save="handleSave" />
      </v-card-text>
      <v-card-actions>
        <v-btn class="cancel-button" text @click="showEditDialog = false">
          Cancelar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-container v-if="isLoading">
    <LoadingSpinner />
  </v-container>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import moment from "moment-timezone";
import { useDisplay } from "vuetify";

import InventoryUpdate from "./InventoryUpdate.vue";

const CONFIG = useRuntimeConfig();
const router = useRouter();
const isLoading = ref(false);
const { mdAndUp } = useDisplay();
const isMdAndUp = mdAndUp;

const inventories = ref([]);
const sales = ref([]);
const combinedData = ref([]);
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

const getInventories = async () => {
  isLoading.value = true;
  noRecordsFound.value = false;
  try {
    const { data, error } = await useFetch(
      `${CONFIG.public.API_BASE_URL}inventories?page=${page.value}
      &pageSize=${pageSize.value}&status=${filters.value.status}&salesId=${filters.value.salesId}&productName=${filters.value.productName}&createdAt=${filters.value.created_at}&updatedAt=${filters.value.updated_at}`,
      {
        method: "GET",
      },
    );

    if (error.value || !data.value) {
      noRecordsFound.value = true;
      inventories.value = [];
      combinedData.value = [];
      return;
    }

    inventories.value = data.value.data;
    totalPages.value = data.value.totalPages;
    combineData();

    if (combinedData.value.length === 0) {
      noRecordsFound.value = true;
    }
    isLoading.value = false;
  } catch (error) {
    console.log(error);
    noRecordsFound.value = true;
  }
};

const getSales = async () => {
  isLoading.value = true;
  try {
    const { data } = await useFetch(`${CONFIG.public.API_BASE_URL}sales`, {
      method: "GET",
    });
    sales.value = data.value.data;
    combineData();
    isLoading.value = false;
  } catch (error) {
    console.log(error);
  }
};

onMounted(async () => {
  await nextTick();
  await getSales();
  await getInventories();
});

const combineData = () => {
  if (inventories.value.length > 0 && sales.value.length > 0) {
    combinedData.value = inventories.value.map((inventory) => {
      const sale = sales.value.find((sale) => sale.id === inventory.salesId);
      return {
        ...inventory,
        productName: sale ? sale.products.name : inventory.sales.products.name,
      };
    });
  }
};

const updatePage = (newPage) => {
  page.value = newPage;
  getInventories();
};

watch([page, pageSize, filters], () => {
  getInventories();
});

const clearFilter = (filterName) => {
  filters.value[filterName] = "";
  updatePage(1);
  getInventories();
};

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

const inventoryRegister = () => {
  router.push("/inventory/register");
};
</script>

<style scoped>
.header-container {
  display: flex;
  justify-content: space-between;
}
.register-button {
  color: white;
  background: linear-gradient(to bottom, #009c8c, #00b7a2);
  font-family: "Arial", sans-serif;
}
.page-select {
  max-width: 300px;
}
.dialog {
  max-width: 450px;
}
.dialog-title {
  align-self: center;
  background-image: linear-gradient(to bottom, #009c8c, #00b7a2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-top: 10px;
  font-family: "Arial", sans-serif;
  font-size: 2vw;
}
.cancel-button {
  background-image: linear-gradient(to bottom, #009c8c, #00b7a2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-family: "Arial", sans-serif;
}

@media (max-width: 600px) {
  .v-table th,
  .v-table td {
    display: block;
    width: 100%;
  }
  .v-table td {
    padding: 8px 0;
  }
  .v-text-field {
    width: 100%;
  }
}

@media (max-width: 1024px) {
  .dialog {
    margin-bottom: 40%;
  }
}

@media (max-width: 540px) {
  .header-container {
    display: inline;
  }
  .register-button {
    width: 100%;
    font-size: 4vw;
  }
  .page-select {
    max-width: 100%;
    margin-top: 3%;
  }
  .dialog-title {
    font-size: 4vw;
  }
}

@media (max-width: 430px) {
  .header-container {
    display: inline;
  }
  .register-button {
    width: 100%;
    font-size: 5vw;
  }
  .page.select {
    max-width: 100%;
  }
  .dialog-title {
    margin-top: 5%;
    font-size: 5vw;
  }
  .cancel-button {
    font-size: 4vw;
    width: 100%;
    margin-bottom: 5%;
  }
}
</style>
