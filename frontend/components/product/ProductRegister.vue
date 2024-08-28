<template>
  <div class="main-container" v-if="isAuthenticated">
    <div class="header-container">
      <v-list-item
        prepend-icon="mdi-arrow-left"
        class="exit-icon"
        @click="back"
      ></v-list-item>
    </div>
    <v-container class="form-container">
      <h1 class="title">Registro de productos</h1>

      <form @submit.prevent="registerProduct">
        <v-text-field class="input" v-model="name" label="Nombre" required>
        </v-text-field>
        <v-textarea
          class="text-area"
          v-model="description"
          label="Descripción"
          required
        ></v-textarea>
        <v-text-field
          class="input"
          v-model="price"
          label="Precio"
          required
        ></v-text-field>
        <v-file-input
          class="file-input"
          v-model="image"
          label="Seleccionar Imagen"
          accept="image/*"
          required
        ></v-file-input>
        <v-autocomplete
          class="select"
          v-model="selectedCategory"
          :items="categories"
          item-title="name"
          item-value="id"
          label="Seleccionar Categoría"
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
const isAuthenticated = ref(false);

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
    await fetchCategories();
  }
});

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
.text-area,
.file-input,
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
@media (max-width: 1024px) {
  .exit-icon {
    display: flex;
    font-size: 3vw;
    margin-left: 2%;
    margin-top: 2%;
  }
  .header-container {
    display: flex;
  }
}
@media (max-width: 430px) {
  .exit-icon {
    display: flex;
    font-size: 5vw;
    margin-left: 0%;
    margin-top: 0%;
  }
  .main-container {
    max-width: 100%;
    padding: 3%;
  }
  .header-container {
    display: flex;
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
