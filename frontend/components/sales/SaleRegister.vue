<template>
  <div class="main-container">
    <div class="header-container">
      <v-list-item
        prepend-icon="mdi-arrow-left"
        class="exit-icon"
        @click="back"
      ></v-list-item>
    </div>
    <v-container class="form-container">
      <h1 class="title">Registro de ventas</h1>
      <form style="margin-top: 5%" @submit.prevent="registerSale">
        <v-text-field
          class="input"
          v-model="quantitySold"
          label="Cantidad"
          required
        ></v-text-field>
        <v-text-field
          class="input"
          v-model="salePrice"
          label="Total"
          required
        ></v-text-field>
        <v-autocomplete
          class="select"
          v-model="selectedCategory"
          :items="categories"
          item-title="name"
          item-value="id"
          label="Seleccionar Categoría"
          required
        ></v-autocomplete>
        <v-autocomplete
          class="select"
          v-model="selectedProduct"
          :items="products"
          item-title="name"
          item-value="id"
          label="Seleccionar Producto"
          required
        ></v-autocomplete>
        <div class="submit-buttons">
          <v-btn class="submit" type="submit">Enviar</v-btn>
          <v-btn class="clean" @click="handleReset">Limpiar</v-btn>
        </div>
      </form>
    </v-container>
  </div>
</template>

<script setup>
import { onMounted, nextTick, ref } from "vue";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";

const CONFIG = useRuntimeConfig();
const router = useRouter();
const quantitySold = ref(0);
const salePrice = ref(0);
const selectedCategory = ref("");
const selectedProduct = ref("");
const categories = ref([]);
const products = ref([]);

const registerSale = async () => {
  if (
    !quantitySold.value ||
    !salePrice.value ||
    !selectedCategory.value ||
    !selectedProduct.value
  ) {
    Swal.fire({
      text: "Todos los campos deben ser completados",
      icon: "warning",
      confirmButtonText: "Aceptar",
    });
    return;
  }
  const data = {
    quantitySold: quantitySold.value,
    salePrice: salePrice.value,
    categoryId: selectedCategory.value,
    productId: selectedProduct.value,
  };

  try {
    const response = await fetch(`${CONFIG.public.API_BASE_URL}sales`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (response.ok) {
      Swal.fire({
        text: "Venta registrada con exito",
        icon: "success",
        confirmButtonText: "Aceptar",
      });
    } else {
      const errorData = await response.text();
      throw new Error(errorData || "Error al registrar la venta");
    }
  } catch (error) {
    Swal.fire({
      title: "Error al registrar la venta",
      text: error.message || "Error al registrar la venta",
      icon: "error",
      confirmButtonText: "Aceptar",
    });
  }
};

const fetchCategories = async () => {
  try {
    const { data, error } = await useFetch(
      `${CONFIG.public.API_BASE_URL}categories`,
    );
    if (!error.value) {
      categories.value = data.value.data.map((e) => ({
        id: e.id,
        name: e.name,
      }));
    } else {
      throw new Error(error.value.message);
    }
  } catch (error) {
    console.error("Error loading categories:", error);
    Swal.fire({
      title: "Error al cargar categorías",
      text: "No se han cargado las categorías",
      icon: "error",
      confirmButtonText: "Aceptar",
    });
  }
};

const fetchProducts = async () => {
  try {
    const { data, error } = await useFetch(
      `${CONFIG.public.API_BASE_URL}products`,
    );
    if (!error.value) {
      products.value = data.value.data.map((e) => ({
        id: e.id,
        name: e.name,
      }));
    } else {
      throw new Error(error.value.message);
    }
  } catch (error) {
    console.error("Error loading categories:", error);
    Swal.fire({
      title: "Error al cargar los productos",
      text: "No se han podido cargar las productos",
      icon: "error",
      confirmButtonText: "Aceptar",
    });
  }
};

onMounted(async () => {
  await nextTick();
  await fetchCategories();
  await fetchProducts();
});

const handleReset = () => {
  quantitySold.value = 0;
  salePrice.value = 0;
  selectedCategory.value = "";
  selectedProduct.value = "";
};
const back = () => {
  router.back();
};
</script>

<style scoped>
.exit-icon {
  display: none;
}
.form-container {
  width: 340px;
  margin-top: 4%;
  border-style: groove;
  border-radius: 6%;
  border-color: black;
  background-color: white;
}
.title {
  text-align: center;
  font-size: larger;
  color: #009c8c;
  margin-bottom: 5%;
}
.input,
.select {
  color: #009c8c;
}
.submit-buttons {
  display: flex;
  justify-content: space-around;
}
.submit {
  background-color: #009c8c;
  color: white;
  width: 40%;
}
.clean {
  background-color: white;
  color: #009c8c;
  width: 40%;
}
@media (max-width: 430px) {
  .main-container {
    max-width: 100%;
    padding: 3%;
  }
  .header-container {
    display: flex;
  }
  .exit-icon {
    display: flex;
    font-size: 5vw;
  }
  .form-container {
    max-width: 100%;
  }
  .title {
    font-size: 5vw;
  }
  .submit-buttons {
    display: inline;
  }
  .submit {
    width: 100%;
    font-size: 4vw;
    margin-bottom: 5%;
  }
  .clean {
    width: 100%;
    font-size: 4vw;
  }
}
</style>
