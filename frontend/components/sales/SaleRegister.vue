<template>
  <v-icon class="exit-icon" @click="router.back()">mdi-arrow-left</v-icon>
  <v-container class="form-container">
    <h1 class="form-title">Registro de ventas</h1>
    <form style="margin-top: 5%" @submit.prevent="registerSale">
      <v-text-field
        class="input"
        v-model.number="quantitySold"
        label="Cantidad"
        :error-messages="errors.quantitySold"
        @input="clearErrors('quantitySold')"
        type="number"
      ></v-text-field>
      <v-text-field
        class="input"
        v-model.number="salePrice"
        label="Total"
        :error-messages="errors.salePrice"
        @input="clearErrors('salePrice')"
        type="number"
      ></v-text-field>
      <v-autocomplete
        class="select"
        v-model.number="selectedCategory"
        :items="categories"
        item-title="name"
        item-value="id"
        label="Seleccionar Categoría"
        :error-messages="errors.selectedCategory"
        @update:model-value="clearErrors('selectedCategory')"
      ></v-autocomplete>
      <v-autocomplete
        class="select"
        v-model="selectedProduct"
        :items="products"
        item-title="name"
        item-value="id"
        label="Seleccionar Producto"
        :error-messages="errors.selectedProduct"
        @update:model-value="clearErrors('selectedProduct')"
      ></v-autocomplete>
      <div class="submit-buttons">
        <v-btn class="submit" type="submit">Enviar</v-btn>
        <v-btn class="clean" @click="handleReset">Limpiar</v-btn>
      </div>
    </form>
  </v-container>
</template>

<script setup>
import { onMounted, nextTick, ref, reactive } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";

const CONFIG = useRuntimeConfig();
const router = useRouter();

const quantitySold = ref();
const salePrice = ref();
const selectedCategory = ref("");
const selectedProduct = ref("");
const categories = ref([]);
const products = ref([]);
const page = ref(1);
const pageSize = ref(10);

const errors = reactive({
  quantitySold: [],
  salePrice: [],
  selectedCategory: [],
  selectedProduct: [],
});

const validateQuantitySold = () => {
  const quantitySoldNum = parseInt(quantitySold.value);
  if (isNaN(quantitySoldNum)) {
    errors.quantitySold = ["La cantidad debe ser un número entero válido"];
    return false;
  }
  if (quantitySoldNum < 1) {
    errors.quantitySold = ["La cantidad debe ser mayor a 1"];
    return false;
  }
  if (quantitySoldNum > 20000000) {
    errors.quantitySold = ["La cantidad no debe superar 20000000"];
    return false;
  }
  return true;
};

const validateSalePrice = () => {
  const salePriceNum = parseInt(salePrice.value);
  if (isNaN(salePriceNum)) {
    errors.salePrice = ["El precio debe ser un número entero válido"];
    return false;
  }
  if (salePriceNum < 1000) {
    errors.salePrice = ["El precio total debe ser mayor a 1000"];
    return false;
  }
  if (salePriceNum > 20000000) {
    errors.salePrice = ["El precio no debe superar 20000000"];
    return false;
  }
  return true;
};

const validateSelectedCategory = () => {
  const categoryId = parseInt(selectedCategory.value);
  if (isNaN(categoryId) || categoryId < 1) {
    errors.selectedCategory = ["La categoría es requerida"];
    return false;
  }
  return true;
};

const validateSelectedProduct = () => {
  const productId = parseInt(selectedProduct.value);
  if (isNaN(productId) || productId < 1) {
    errors.selectedProduct = ["El producto es requerido"];
    return false;
  }
  return true;
};

const validateForm = () => {
  for (const key in errors) {
    if (errors.hasOwnProperty(key)) {
      errors[key] = [];
    }
  }

  const isCategoryValid = validateSelectedCategory();
  const isProductValid = validateSelectedProduct();
  const isQuantitySoldValid = validateQuantitySold();
  const isSalePriceValid = validateSalePrice();

  return (
    isCategoryValid &&
    isProductValid &&
    isQuantitySoldValid &&
    isSalePriceValid
  );

};

const registerSale = async () => {
  if (!validateForm()) {
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
      handleReset();
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
  const { data: metaData } = await useFetch(
    `${CONFIG.public.API_BASE_URL}categories?page=1&pageSize=1`,
  );

  const totalItems = metaData.value.totalItems;

  pageSize.value = totalItems;
  try {
    const { data, error } = await useFetch(
      `${CONFIG.public.API_BASE_URL}categories?page=${page.value}&pageSize=${pageSize.value}`,
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
  const { data: metaData } = await useFetch(
    `${CONFIG.public.API_BASE_URL}products?page=1&pageSize=1`,
  );

  const totalItems = metaData.value.totalItems;

  pageSize.value = totalItems;
  try {
    const { data, error } = await useFetch(
      `${CONFIG.public.API_BASE_URL}products?page=${page.value}&pageSize=${pageSize.value}`,
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
  for (const key of Object.keys(errors)) {
    if (key === "quantitySold") quantitySold.value = 0;
    else if (key === "salePrice") salePrice.value = 0;
    else if (key === "selectedCategory") selectedCategory.value = "";
    else if (key === "selectedProduct") selectedProduct.value = "";
    errors[key] = [];
  }
};

const clearErrors = (field) => {
  errors[field] = [];
};
</script>

<style scoped>
.exit-icon {
  display: none;
}
.form-container {
  width: 340px;
  border: 1px solid;
  border-radius: 6%;
  border-color: #116a7b;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.form-title {
  text-align: center;
  font-size: 2vw;
  font-family: "Arial", sans-serif;
}
.input,
.select {
  color: #116a7b;
}
.submit-buttons {
  display: flex;
  justify-content: space-around;
}
.submit {
  background: linear-gradient(45deg, #009c8c, #00b7a2);
  color: white;
  width: 40%;
  font-family: "Arial", sans-serif;
}
.clean {
  background-color: white;
  color: #116a7b;
  width: 40%;
  font-family: "Arial", sans-serif;
}

@media (max-width: 1024px) {
  .exit-icon {
    display: flex;
  }
  .form-title {
    font-size: 2.5vw;
  }
}

@media (max-width: 540px) {
  .form-title {
    font-size: 4vw;
  }
}

@media (max-width: 430px) {
  .exit-icon {
    display: flex;
    font-size: 4vw;
    margin-bottom: 4%;
  }
  .form-container {
    max-width: 100%;
  }
  .form-title {
    font-size: 6vw;
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
