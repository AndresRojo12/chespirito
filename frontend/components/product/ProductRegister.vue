<template>
  <div class="fond">
    <h1
      style="display: flex;
      margin-top:0%;
      background-color: #009c8c; justify-content: center"
    >
      Antigüedades Chespirito
    </h1>
    <v-layout>
      <v-navigation-drawer
        style="background-color: #009c8c; max-width: 155px"
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
            prepend-icon="mdi-cash"
            title="Productos"
            @click.prevent="products"
          ></v-list-item>

          <v-list-item
            @click.prevent="confirmLogout"
            prepend-icon="mdi-logout"
            title="Salir"
          ></v-list-item>
        </v-list>
      </v-navigation-drawer>
    </v-layout>
    <v-container
      style="
        width: 340px;
        margin-top: 4%;
        border-style: groove;
        border-radius: 6%;
        background-color: #009c8c;
      "
    >
      <h1
        style="text-align: center; font-size: larger; color: rgb(217, 217, 236)"
      >
        Registro de productos
      </h1>
      <v-sheet class="mx-auto" width="300" style="border-style: groove">
        <form
          style="margin-top: 5%; background-color: #009c8c"
          @submit.prevent="registerProduct"
        >
          <v-text-field
            v-model="name"
            style="background-color: #009c8c; color: rgb(217, 217, 236)"
            label="Nombre"
            required
          >
          </v-text-field>
          <v-textarea
            style="background-color: #009c8c; color: rgb(217, 217, 236)"
            v-model="description"
            label="Descripción"
            required
          ></v-textarea>
          <v-text-field
            v-model="price"
            label="Precio"
            required
            style="background-color: #009c8c; color: rgb(217, 217, 236)"
          ></v-text-field>
          <v-file-input
            v-model="image"
            style="background-color: #009c8c; color: rgb(217, 217, 236)"
            label="Seleccionar Imagen"
            accept="image/*"
            required
          ></v-file-input>
          <v-autocomplete
            style="background-color: #009c8c; color: rgb(217, 217, 236)"
            v-model="selectedCategory"
            :items="categories"
            item-title="name"
            item-value="id"
            label="Seleccionar Categoría"
            required
          ></v-autocomplete>
          <v-btn
            style="background-color: #009c8c; color: aliceblue"
            type="submit"
            >Enviar</v-btn
          >
          <v-btn
            style="background-color: #009c8c; color: aliceblue"
            @click="handleReset"
            >Limpiar</v-btn
          >
        </form>
      </v-sheet>
    </v-container>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import Swal from "sweetalert2";
import { useAuth } from "~/store/auth";
const CONFIG = useRuntimeConfig();

const name = ref("");
const description = ref("");
const price = ref(0);
const image = ref(null);
const categories = ref([]);
const selectedCategory = ref("");
const router = useRouter();
const userStore = useAuth();

const fetchCategories = async () => {
  try {
    const { data, error } = await useFetch(
      `${CONFIG.public.API_BASE_URL}/categories`,
    );
    if (!error.value) {
      categories.value = data.value.data.map((e) => ({
        id: e.id,
        name: e.name,
      }));
    } else {
      throw new Error(error.value.message);
    }
  } catch (err) {
    console.error("Error loading categories:", err);
    Swal.fire({
      title: "Error al cargar categorías",
      icon: "error",
      text: "No se pudieron cargar las categorías.",
      confirmButtonText: "Aceptar",
    });
  }
};

const registerProduct = async () => {
  if (
    !name.value ||
    !description.value ||
    !image.value ||
    !selectedCategory.value
  ) {
    Swal.fire(
      "Error",
      "Por favor complete todos los campos y suba una imagen.",
      "error",
    );
    return;
  }

  const formData = new FormData();
  formData.append("name", name.value);
  formData.append("description", description.value);
  formData.append("price", price.value);
  formData.append("image", image.value);
  formData.append("categoryId", selectedCategory.value);

  try {
    const response = await fetch(`${CONFIG.public.API_BASE_URL}products`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (response.ok) {
      Swal.fire({
        title: "Producto registrado con éxito!",
        icon: "success",
        confirmButtonText: "Aceptar",
      });
      console.log("Respuesta del servidor:", response);
    } else {
      const errorData = await response.text();
      throw new Error(errorData || "Error al registrar el producto.");
    }
  } catch (err) {
    console.error("Error registering product:", err);
    Swal.fire({
      title: "Error al registrar el producto",
      icon: "error",
      text: err.message || "No se pudo registrar el producto.",
      confirmButtonText: "Aceptar",
    });
  }
};

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

const handleLogout = () => {
  userStore.logout();
  router.push("/");
};

const handleReset = () => {
  name.value = "";
  description.value = "";
  price.value = 0;
  image.value = null;
  selectedCategory.value = "";
};

onMounted(async () => {
  await nextTick();
  await fetchCategories();
});

const goHome = () => {
  router.push("/user/gestion");
};

const products = () => {
  router.push("/product/list");
};
</script>

<style>
.fond {
  background-color: #009c8c;
  height: 100%;
  min-height: 100vh;
  width: 100%;
  box-sizing: border-box;
}
</style>
