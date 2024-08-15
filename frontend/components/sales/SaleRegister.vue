<template>
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
        >
        </v-list-item>
        <v-list-item
          prepend-icon="mdi-cash"
          title="Productos"
          @click.prevent="productsPage"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-logout"
          title="Salir"
          @click.prevent="confirmLogout"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-layout>
  <v-container style="width: 600px; margin-top: 2px; border-style: groove">
    <h1>Registro de ventas</h1>
    <form style="margin-top: 5%" @submit.prevent="registerSale">
      <v-text-field
        v-model="quantitySold"
        label="Cantidad"
        required
      ></v-text-field>
      <v-text-field v-model="salePrice" label="Total" required></v-text-field>
      <v-autocomplete
        v-model="selectedCategory"
        :items="categories"
        item-title="name"
        item-value="id"
        label="Seleccionar Categoría"
        required
      ></v-autocomplete>
      <v-autocomplete
        v-model="selectedProduct"
        :items="products"
        item-title="name"
        item-value="id"
        label="Seleccionar Producto"
        required
      ></v-autocomplete>
      <v-btn type="submit">Enviar</v-btn>
      <v-btn @click="handleReset">Limpiar</v-btn>
    </form>
  </v-container>
</template>

<script setup>
import { onMounted, nextTick, ref } from "vue";
import { useAuth } from "~/store/auth";
import Swal from "sweetalert2";

const CONFIG = useRuntimeConfig();
const userStore = useAuth();
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

const goHome = () => {
  router.push("/user/gestion");
};

const productsPage = () => {
  router.push("/product/list");
};

const confirmLogout = () => {
  Swal.fire({
    text: "¿Está seguro que quiere cerrar sesión?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Si",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      handleLogout();
    }
  });
};

const handleLogout = () => {
  userStore.logout();
  router.push("/");
};

const handleReset = () => {
  quantitySold.value = 0;
  salePrice.value = 0;
  selectedCategory.value = "";
  selectedProduct.value = "";
};
</script>
