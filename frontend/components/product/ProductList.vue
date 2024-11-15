<template>
  <div class="header-container">
    <v-btn class="register-button" @click.prevent="product">
      Registrar producto
    </v-btn>
    <v-text-field
      class="search-field"
      v-model="search"
      density="comfortable"
      placeholder="Buscar Productos"
      prepend-inner-icon="mdi-magnify"
      variant="solo"
      clearable
      hide-details
      @click:clear="clearSearch"
    ></v-text-field>
  </div>

  <v-select
    v-model="pageSize"
    class="page-select"
    :items="[10, 20, 30, 40, 50]"
    label="Seleccionar productos por página"
    @change="getProducts"
  ></v-select>

  <div v-if="!isLoading && noRecordsFound" style="text-align: center">
    <v-alert color="#009c8c" type="warning">
      No se encontraron registros.
    </v-alert>
  </div>

  <div v-else class="product-container">
    <div
      class="product-item"
      v-for="pro in filteredProducts.data || []"
      :key="pro.id"
    >
      <div>
        <img class="product-image" :src="getImageUrl(pro.imagePath1)" />
      </div>
      <div class="product-info">
        <h1 class="info">
          {{ pro.name }}
        </h1>
        <p class="info">Estado {{ pro.status }}</p>
        <p class="info">{{ pro.description }}</p>
        <p class="info">{{ formatPrice(pro.price) }}</p>
      </div>
      <v-tooltip text="Editar">
        <template v-slot:activator="{ props }">
          <v-icon
            style="color: rgba(228, 192, 11, 0.663)"
            v-bind="props"
            @click="editProduct(pro)"
          >
            mdi-pencil
          </v-icon>
        </template>
      </v-tooltip>
      <v-tooltip text="Eliminar">
        <template v-slot:activator="{ props }">
          <v-icon
            style="color: darkslategrey"
            v-bind="props"
            @click="confirmDelete(pro)"
          >
            mdi-delete
          </v-icon>
        </template>
      </v-tooltip>
    </div>
  </div>
  <div class="text-center">
    <v-container>
      <v-row justify="center">
        <v-col cols="8">
          <v-container class="max-width">
            <v-pagination
              v-model="page"
              :length="filteredProducts.totalPages || 1"
              class="my-4"
              @input="getProducts"
            ></v-pagination>
          </v-container>
        </v-col>
      </v-row>
    </v-container>

    <v-dialog class="dialog" v-model="showEditDialog">
      <v-card>
        <v-card-title class="dialog-title">Editar Producto</v-card-title>
        <v-card-text>
          <ProductUpdate :product="editingProduct" @save="handleSave" />
        </v-card-text>
        <v-card-actions>
          <v-btn class="cancel-button" @click="showEditDialog = false">
            Cancelar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog class="dialog" v-model="showDeleteDialog">
      <v-card>
        <v-card-text>
          <ProductDelete :product="productToDelete" @deleted="handleDelete" />
        </v-card-text>
        <v-card-actions>
          <v-btn class="cancel-button" text @click="showDeleteDialog = false">
            Cancelar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
  <v-container v-if="isLoading">
    <LoadingSpinner />
  </v-container>
</template>

<script setup>
import debounce from "lodash/debounce";
import { ref, watch, onMounted, nextTick } from "vue";

import ProductUpdate from "./ProductUpdate.vue";
import ProductDelete from "./ProductDelete.vue";

const CONFIG = useRuntimeConfig();
const router = useRouter();
const isLoading = ref(false);

const page = ref(1);
const pageSize = ref(10);
const showEditDialog = ref(false);
const editingProduct = ref(null);
const showDeleteDialog = ref(false);
const productToDelete = ref(null);
const products = ref([]);
const filteredProducts = ref({ data: [], totalPages: 1 });
const search = ref("");
const noRecordsFound = ref(false);

const getProducts = async () => {
  isLoading.value = true;
  try {
    const { data } = await useFetch(
      `${CONFIG.public.API_BASE_URL}products?page=${page.value}&pageSize=${pageSize.value}`,
      {
        method: "GET",
      },
    );
    products.value = data.value.data;
    filteredProducts.value = {
      data: data.value.data,
      totalPages: data.value.totalPages,
    };
  } catch (error) {
    filteredProducts.value = { data: [], totalPages: 1 };
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await nextTick();
  await getProducts();
});

const getImageUrl = (imagePath) => {
  return imagePath;
};

const debouncedFetchProducts = debounce(async (newSearch) => {
  await getProducts();

  if (!newSearch.trim()) {
    filteredProducts.value = {
      data: products.value,
      totalPages: filteredProducts.value.totalPages,
    };
    noRecordsFound.value = categories.value.length === 0;
    return;
  }

  try {
    const response = await fetch(
      `${CONFIG.public.API_BASE_URL}products/search?query=${encodeURIComponent(newSearch.trim())}`,
    );
    const data = await response.json();
    filteredProducts.value = { data, totalPages: 1 };
    noRecordsFound.value = data.length === 0;
  } catch (error) {
    console.error("Error fetching filtered products:", error);
    filteredProducts.value = { data: [], totalPages: 1 };
    noRecordsFound.value = true;
  }
}, 500);

watch(search, (newSearch) => {
  debouncedFetchProducts(newSearch);
});

watch(page, async () => {
  await getProducts();
});

watch(pageSize, async () => {
  await getProducts();
});

const editProduct = (pro) => {
  if (pro && pro.id) {
    editingProduct.value = { ...pro };
    showEditDialog.value = true;
  } else {
    console.error("El objeto product no tiene una propiedad id válida.");
  }
};

const handleSave = async (updatedProduct) => {
  if (updatedProduct) {
    const index = filteredProducts.value.data.findIndex(
      (item) => item.id === updatedProduct.id,
    );
    if (index !== -1) {
      filteredProducts.value.data[index] = updatedProduct;
    }
  }
  await getProducts();
  showEditDialog.value = false;
};

const handleDelete = async (productId) => {
  const index = filteredProducts.value.data.findIndex(
    (item) => item.id === productId,
  );

  if (index !== -1) {
    filteredProducts.value.data.splice(index, 1);
  }
  await getProducts();
  showDeleteDialog.value = false;
};

const formatPrice = (price) => {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
  }).format(price);
};

const confirmDelete = (product) => {
  showDeleteDialog.value = true;
  productToDelete.value = product;
};

const product = () => {
  router.push("/product/register");
};

const clearSearch = () => {
  search.value = "";
  noRecordsFound.value = false;
};
</script>

<style scoped>
.header-container {
  display: flex;
  justify-content: space-between;
}
.register-button {
  color: white;
  background: linear-gradient(45deg, #009c8c, #00b7a2);
}
.search-field {
  max-width: 300px;
}
.page-select {
  max-width: 300px;
  margin-top: 2%;
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
  text-align: center;
}
.product-image {
  width: 100%;
}
.product-info {
  width: 100%;
  padding: 5%;
  margin-top: 5px;
  font-family: "Arial", sans-serif;
  text-align: start;
  background: linear-gradient(45deg, #009c8c, #00b7a2);
  color: white;
  border: none;
  border-radius: 5px;
}
.info {
  color: white;
  text-align: center;
  font-size: 1vw;
  margin-bottom: 3%;
}
.dialog {
  max-width: 500px;
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

@media (max-width: 1024px) {
  .title-info {
    font-size: 2vw;
  }
  .dialog {
    margin-bottom: 50%;
  }
  .dialog-title {
    font-size: 3vw;
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
  .search-field {
    max-width: 100%;
    margin-top: 3%;
  }
  .page-select {
    max-width: 100%;
  }
  .product-item {
    flex: 1 1 80%;
    max-width: 100%;
  }
  .title-info {
    font-size: 4vw;
  }
  .dialog {
    margin-bottom: 0%;
  }
  .dialog-title {
    font-size: 5vw;
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
  .search-field {
    max-width: 100%;
  }
  .page-select {
    max-width: 100%;
  }
  .cancel-button {
    width: 100%;
    font-size: 4vw;
    margin-bottom: 5%;
  }
  .dialog-title {
    font-size: 7vw;
  }
}
</style>
