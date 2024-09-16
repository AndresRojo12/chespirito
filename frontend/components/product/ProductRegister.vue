<template>
  <div class="main-container">
    <div class="header-container">
      <v-list-item
        prepend-icon="mdi-arrow-left"
        class="exit-icon"
        @click="router.back()"
      ></v-list-item>
    </div>
    <v-container class="form-container">
      <h1 class="title">Registro de productos</h1>

      <form @submit.prevent="registerProduct">
        <v-text-field
          class="input"
          v-model="name"
          label="Nombre"
          :error-messages="errors.name"
          @input="clearErrors('name')"
        >
        </v-text-field>
        <v-textarea
          class="text-area"
          v-model="description"
          label="Descripción"
          :error-messages="errors.description"
          @input="clearErrors('description')"
        ></v-textarea>
        <v-text-field
          class="input"
          v-model.number="price"
          label="Precio"
          :error-messages="errors.price"
          @input="clearErrors('price')"
          :rules="[(v) => !isNaN(v) || 'El precio debe ser un número válido']"
        ></v-text-field>
        <v-file-input
          class="file-input"
          v-model="image"
          label="Seleccionar Imagen"
          accept="image/*"
          :error-messages="errors.image"
          @change="clearErrors('image')"
        ></v-file-input>
        <v-autocomplete
          class="select"
          v-model="selectedCategory"
          :items="categories"
          item-title="name"
          item-value="id"
          label="Seleccionar Categoría"
          :error-messages="errors.selectedCategory"
          @update:model-value="clearErrors('selectedCategory')"
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
import { number, z } from "zod";
import Swal from "sweetalert2";

const CONFIG = useRuntimeConfig();
const router = useRouter();

const page = ref(1);
const pageSize = ref(10);

const name = ref("");
const description = ref("");
const price = ref();
const image = ref(null);
const selectedCategory = ref("");
const categories = ref([]);

const errors = reactive({
  name: [],
  description: [],
  price: [],
  image: [],
  selectedCategory: [],
});

const schema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().min(1, "La descripción es obligatoria"),
  price: z
    .number()
    .min(1, "El precio debe ser un número positivo")
    .max(15000000, "El precio no puede ser mayor de 15,000.000"),
  image: z.any().refine((value) => value instanceof File, {
    message: "Debes seleccionar una imagen",
  }),
  selectedCategory: z.number().min(1, "La categoría es requerida"),
});

const validateForm = () => {
  errors.value = [];
  errors.description = [];
  errors.price = [];
  errors.image = [];
  errors.selectedCategory = [];
  try {
    const formData = {
      name: name.value,
      description: description.value,
      price: price.value,
      image: image.value,
      selectedCategory: selectedCategory.value,
    };
    schema.parse(formData);
    return true;
  } catch (error) {
    if (error instanceof z.ZodError) {
      error.errors.forEach((err) => {
        const field = err.path[0];
        if (field === "name") errors.name = [err.message];
        if (field === "description") errors.description = [err.message];
        if (field === "price") errors.price = [err.message];
        if (field === "image") errors.image = [err.message];
        if (field === "selectedCategory")
          errors.selectedCategory = [err.message];
      });
    }
    return false;
  }
};

const fetchCategories = async () => {
  try {
    const { data: metaData } = await useFetch(
      `${CONFIG.public.API_BASE_URL}categories?page=1&pageSize=1`,
    );
    const totalItems = metaData.value.totalItems;

    pageSize.value = totalItems;
    const { data, error } = await useFetch(
      `${CONFIG.public.API_BASE_URL}/categories?page=${page.value}&pageSize=${pageSize.value}`,
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

onMounted(async () => {
  await nextTick();
  await fetchCategories();
});

const registerProduct = async () => {
  if (!validateForm()) {
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
      handleReset();
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
  for (const key of Object.keys(errors)) {
    if (key === "name") name.value = "";
    else if (key === "description") description.value = "";
    else if (key === "price") price.value = 0;
    else if (key === "image") image.value = "";
    else if (key === "selectedCategory") selectedCategory.value = "";
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
  margin-top: 4%;
  border: 1px solid;
  border-radius: 6%;
  border-color: #116a7b;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.title {
  text-align: center;
  font-size: 2vw;
  margin-bottom: 5%;
  font-family: "Arial", sans-serif;
}
.input,
.text-area,
.file-input,
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
  font-family: "Arial", sans-serif;
  width: 40%;
}
.clean {
  background-color: white;
  color: #009c8c;
  font-family: "Arial", sans-serif;
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
