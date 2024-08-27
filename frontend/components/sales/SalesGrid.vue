<template>
  <div class="header-container">
      <v-btn class="register-button" @click.prevent="salesRegister"
        >Registrar ventas</v-btn
      >
    <v-select
      class="select"
      label="Seleccionar número de items por página"
      v-model="pageSize"
      :items="[10, 20, 30, 40, 50, 100]"
      @change="getSales"
    ></v-select>
  </div>
  <div class="table-container">
    <v-table style="width: 100%">
      <thead>
        <tr>
          <th class="text-left">
            Categoría
            <v-text-field
              v-model="filters.categoryName"
              label="Buscar"
              clearable
            ></v-text-field>
          </th>
          <th class="text-left">
            Producto
            <v-text-field
              v-model="filters.productName"
              label="Buscar"
              clearable
            ></v-text-field>
          </th>
          <th class="text-left">
            Cantidad
            <v-text-field
              v-model="filters.quantitySold"
              label="Buscar"
              clearable
            ></v-text-field>
          </th>
          <th class="text-left">
            Total
            <v-text-field
              v-model="filters.salePrice"
              label="Buscar"
              clearable
            ></v-text-field>
          </th>
          <th class="text-left">
            Fecha
            <v-text-field
              v-model="filters.date"
              label="Buscar"
              clearable
            ></v-text-field>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="sal in filteredData" :key="sal.id">
          <td>{{ sal.categoryName }}</td>
          <td>{{ sal.productName }}</td>
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
    <div v-if="filteredData.length === 0" style="text-align: center">
      <v-alert color="blue" type="warning"
        >No se encontraron registros.</v-alert
      >
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
import moment from "moment-timezone";

const CONFIG = useRuntimeConfig();
const router = useRouter();
const page = ref(1);
const pageSize = ref(10);
const filteredSales = ref({ data: [], totalPages: 1 });
const sales = ref([]);
const categories = ref([]);
const products = ref([]);
const combinedData = ref([]);

const filters = ref({
  categoryName: "",
  productName: "",
  quantitySold: "",
  salePrice: "",
  date: "",
});

const filteredData = computed(() => {
  return combinedData.value.filter((sal) => {
    const matchesCategoryId = filters.value.categoryName
      ? sal.categoryName
          .toString()
          .toLowerCase()
          .includes(filters.value.categoryName.toLowerCase())
      : true;
    const matchesProductId = filters.value.productName
      ? sal.productName
          .toString()
          .toLowerCase()
          .includes(filters.value.productName.toLowerCase())
      : true;
    const matchesQuantitySold = filters.value.quantitySold
      ? sal.quantitySold
          .toString()
          .includes(filters.value.quantitySold.toString())
      : true;
    const matchesSalePrice = filters.value.salePrice
      ? sal.salePrice.toString().includes(filters.value.salePrice.toString())
      : true;
    let matchesDate = true;
    if (filters.value.date) {
      const filterDate = moment(filters.value.date, "DD/MM/YYYY");
      const saleDate = moment(sal.createdAt).tz("America/Bogota");
      matchesDate = saleDate.isSame(filterDate, "day");
    }
    return (
      matchesCategoryId &&
      matchesProductId &&
      matchesQuantitySold &&
      matchesSalePrice &&
      matchesDate
    );
  });
});

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
        productName: product ? product.name : sale.products.name,
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

watch([page, pageSize, filters], () => {
  getSales();
});

const salesRegister = () => {
  router.push("/sales/register");
};
</script>

<style scoped>
.header-container {
  display: flex;
}
.register-button {
  margin-left: 13%;
  margin-top: 3%;
  color: white;
  background-color: #009c8c;
}
.select {
  max-width: 300px;
  margin-top: 3%;
  margin-left: 49%;
}
.table-container {
  max-height: 400px;
  overflow-y: auto;
  margin-top: 2%;
  margin-left: 12%;
}

@media (max-width: 430px) {
  .header-container {
    display: inline;
    padding: 1.5%;
  }
  .container-register {
    padding: 2%;
  }
  .register-button {
    width: 97%;
    font-size: 5vw;
    margin-top: 20%;
    margin-left: 0%;
  }
  .select {
    max-width: 100%;
    margin-left: 0%;
    padding: 2%;
  }
  .table-container {
    display: flex;
    margin-left: 0%;
    padding: 2%;
  }
}
</style>
