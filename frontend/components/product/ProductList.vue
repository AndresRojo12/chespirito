<template>
  <div class="main-container" v-if="isAuthenticated">
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
      ></v-text-field>
    </div>
    <v-select
      v-model="pageSize"
      class="page-select"
      :items="[10, 20, 30, 40, 50]"
      label="Seleccionar productos por página"
      @change="getProducts"
    ></v-select>
    <div class="product-container">
      <div
        class="product-item"
        v-for="pro in filteredProducts.data || []"
        :key="pro.id"
      >
        <div>
          <img class="product-image" :src="getImageUrl(pro.imagePath)" />
        </div>
        <button class="product-button">
          <h3 class="button-text">Nombre: {{ pro.name }}</h3>
          <p class="button-text">Descripción: {{ pro.description }}</p>
          <p class="button-text">Precio: {{ pro.price }}</p>
        </button>
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
      <v-dialog class="dialog-delete" v-model="showDeleteDialog">
        <v-card>
          <v-card-text>
            <ProductDelete :product="productToDelete" @deleted="handleDelete" />
          </v-card-text>
          <v-card-actions>
            <v-btn style="color:#009c8c ;" text @click="showDeleteDialog = false"> Cancelar </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "~/store/auth";
import Swal from "sweetalert2";
import ProductUpdate from "./ProductUpdate.vue";
import ProductDelete from "./ProductDelete.vue";

const CONFIG = useRuntimeConfig();
const router = useRouter();

const page = ref(1);
const pageSize = ref(10);
const userStore = useAuth();
const showEditDialog = ref(false);
const editingProduct = ref(null);
const showDeleteDialog = ref(false);
const productToDelete = ref(null);
const isAuthenticated = ref(false);

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
    filteredProducts.value = {
      data: data.value.data,
      totalPages: data.value.totalPages,
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    filteredProducts.value = { data: [], totalPages: 1 };
  }
};

const getImageUrl = (imagePath) => {
  return imagePath;
};

onMounted(async () => {
  if (!userStore.user) {
    Swal.fire({
      icon: "error",
      title: "Acceso Denegado",
      text: "Debe iniciar sesión primero",
      confirmButtonText: "Aceptar",
    }).then(() => {
      router.push("/");
    });
  } else {
    isAuthenticated.value = true;
    await nextTick();
    await getProducts();
  }
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

const product = () => {
  router.push("/product/register");
};

const confirmDelete = (product) => {
  showDeleteDialog.value = true;
  productToDelete.value = product;
};
</script>

<style scoped>
.header-container {
  display: flex;
  justify-content: space-between;
}
.register-button {
  margin-top: 5%;
  margin-left: 13%;
  color: white;
  background: linear-gradient(45deg, #009c8c, #00b7a2);
}
.search-field {
  max-width: 300px;
  margin-top: 3%;
  margin-right: 5%;
}
.page-select {
  max-width: 300px;
  margin-left: 13%;
  margin-top: 5%;
}
.product-container {
  margin-left: 10%;
  display: flex;
  flex-wrap: wrap;
  padding: 2%;
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
.product-button {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  background: linear-gradient(45deg, #009c8c, #00b7a2);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.button-text {
  margin: 0;
}
.dialog {
  max-width: 350px;
}

.dialog-delete {
  max-width: 300px;
}
.dialog-title {
  align-self: center;
  background-image: linear-gradient(to bottom, #009c8c, #00b7a2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-top: 10px;
  font-family: "Arial", sans-serif;
}
.cancel-button {
  background-image: linear-gradient(to bottom, #009c8c, #00b7a2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-family: "Arial", sans-serif;
}
@media (max-width: 1024px) {
  .main-container {
    margin-top: 8%;
    margin-right: 5%;
  }
  .search-field {
    margin-right: 0%;
  }
  .dialog {
    margin-bottom: 40%;
  }
}

@media (max-width: 540px) {
  .main-container {
    margin-right: 5%;
    margin-top: 0%;
  }
  .header-container {
    align-self: center;
    display: inline;
  }
  .register-button {
    width: 80%;
    font-size: 4vw;
    margin-top: 15%;
  }
  .search-field {
    max-width: 80%;
    margin-left: 13%;
  }
  .page-select {
    max-width: 80%;
  }
  .product-item {
    flex: 1 1 80%;
    max-width: 93.5%;
  }
  .button-text {
    font-size: 5vw;
    margin: 0;
  }
  .dialog {
    margin-bottom: 0%;
  }
}

@media (max-width: 430px) {
  .main-container {
    margin-right: 0%;
    margin-top: 0%;
  }
  .header-container {
    display: inline;
  }
  .register-button {
    width: 97%;
    font-size: 5vw;
    margin-left: 1.5%;
    margin-top: 20%;
  }
  .search-field {
    max-width: 100%;
    margin-right: 0%;
    margin-left: 0%;
    padding: 2%;
  }
  .page-select {
    max-width: 100%;
    margin-left: 0%;
    padding: 2%;
  }
  .product-container {
    max-width: 100%;
    margin-left: 0%;
  }
  .product-item {
    flex: 1 1 100%;
    max-width: 100%;
  }
  .product-button {
    max-width: 100%;
  }
  .button-text {
    max-width: 100%;
    font-size: 5vw;
    margin: 0;
  }
  .form-title {
    font-size: 5vw;
  }
  .cancel-button {
    font-size: 5vw;
  }
  .dialog-title {
    font-size: 4vw;
  }
}
</style>
