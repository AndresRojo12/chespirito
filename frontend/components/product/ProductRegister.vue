<template>
  <v-layout>
    <v-navigation-drawer
      style="background-color: #aeb0b3; max-width: 155px"
      expand-on-hover
      rail
    >
      <v-list>
        <v-list-item prepend-icon="mdi-account-circle"
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
          @click.prevent=""
          prepend-icon="mdi-logout"
          title="Salir"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-layout>
  <v-container style="width: 600px; margin-top: 2%; border-style: groove">
    <h1>Registro de productos</h1>
    <form style="margin-top: 5%" @submit.prevent="registerProduct">
      <v-text-field v-model="name" label="Nombre" required></v-text-field>
      <v-textarea
        v-model="description"
        label="Descripción"
        required
      ></v-textarea>
      <v-text-field v-model="price" label="Precio" required></v-text-field>
      <v-file-input
        v-model="image"
        label="Seleccionar Imagen"
        accept="image/*"
        required
      ></v-file-input>
      <v-autocomplete
        v-model="selectedCategory"
        :items="categories"
        item-text="name"
        item-value="id"
        label="Seleccionar Categoría"
        required
      ></v-autocomplete>
      <v-btn type="submit">Enviar</v-btn>
      <v-btn @click="handleReset">Limpiar</v-btn>
    </form>
  </v-container>
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
}

const products = () => {
  router.push('/product/list')
}
</script>
