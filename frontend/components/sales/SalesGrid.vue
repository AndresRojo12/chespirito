<template>
  <div class="header-container">
    <v-btn class="register-button" @click.prevent="salesRegister"
      >Registrar ventas</v-btn
    >
    <v-select
      class="page-select"
      label="Seleccionar número de items por página"
      v-model="pageSize"
      :items="[10, 20, 30, 40, 50, 100]"
      @change="getSales"
    ></v-select>
  </div>
  <div>
    <v-table style="width: 100%">
      <thead>
        <tr>
          <th class="text-left">
            <v-text-field
              v-model="filters.categoryName"
              label="Categoría"
              clearable
              @input="updatePage(1)"
              @click:clear="clearFilter('categoryName')"
            ></v-text-field>
          </th>
          <th class="text-left">
            <v-text-field
              v-model="filters.productName"
              label="Producto"
              clearable
              @input="updatePage(1)"
              @click:clear="clearFilter('productName')"
            ></v-text-field>
          </th>
          <th class="text-left">
            <v-text-field
              v-model="filters.quantitySold"
              label="Cantidad"
              clearable
              @input="updatePage(1)"
              @click:clear="clearFilter('quantitySold')"
            ></v-text-field>
          </th>
          <th class="text-left">
            <v-text-field
              v-model="filters.salePrice"
              label="Total"
              clearable
              @input="updatePage(1)"
              @click:clear="clearFilter('salePrice')"
            ></v-text-field>
          </th>
          <th class="text-left">
            <v-text-field
              v-model="filters.created_at"
              label="Fecha"
              clearable
              @input="updatePage(1)"
              @click:clear="clearFilter('created_at')"
            ></v-text-field>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="sal in combinedData" :key="sal.id">
          <td>{{ sal.categoryName }}</td>
          <td>{{ sal.productName }}</td>
          <td>{{ sal.quantitySold }}</td>
          <td>{{ sal.salePrice }}</td>
          <td>
            {{
              moment(sal.createdAt)
                .tz("America/Bogota")
                .format("DD/MM/YYYY/ hh:mm A")
            }}
          </td>
        </tr>
      </tbody>
    </v-table>
    <div v-if="noRecordsFound" style="text-align: center">
      <v-alert color="#009c8c" type="warning"
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
              :length="totalPages"
              @input="getSales"
              class="my-4"
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
const totalPages = ref(10);
const sales = ref([]);
const categories = ref([]);
const products = ref([]);
const combinedData = ref([]);
const filters = ref({
  categoryId: "",
  categoryName: "",
  productId: "",
  productName: "",
  quantitySold: "",
  salePrice: "",
  created_at: "",
});

const noRecordsFound = ref(false);

const getSales = async () => {
  noRecordsFound.value = false;
  try {
    const { data, error } = await useFetch(
      `${CONFIG.public.API_BASE_URL}sales?page=${page.value}
      &pageSize=${pageSize.value}&categoryId=${filters.value.categoryId}&categoryName=${filters.value.categoryName}&productId=${filters.value.productId}&productName=${filters.value.productName}&quantitySold=${filters.value.quantitySold}&salePrice=${filters.value.salePrice}&createdAt=${filters.value.created_at}`,
      {
        method: "GET",
      },
    );

    if (error.value || !data.value) {
      noRecordsFound.value = true;
      sales.value = [];
      combinedData.value = [];
      return;
    }

    sales.value = data.value.data;
    totalPages.value = data.value.totalPages;
    combineData();
  } catch (error) {
    console.log(error);
    noRecordsFound.value = true;
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
        (category) => category.id === sale.categoryId,
      );
      const product = products.value.find(
        (product) => product.id === sale.productId,
      );

      return {
        ...sale,
        categoryName: category ? category.name : sale.products.category.name,
        productName: product ? product.name : sale.products.name,
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

const updatePage = (newPage) => {
  page.value = newPage;
  getSales();
};

watch([page, pageSize, filters], () => {
  getSales();
});

const clearFilter = (filterName) => {
  filters.value[filterName] = "";
  updatePage(1);
  getSales();
};

const salesRegister = () => {
  router.push("/sales/register");
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
}
</style>
