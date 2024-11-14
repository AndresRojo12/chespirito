<template>
  <div class="main-container">
    <v-icon class="exit-icon" @click="router.back()">mdi-arrow-left</v-icon>
    <v-container class="form-container">
      <h1 class="title">Registro de productos</h1>

      <form @submit.prevent="registerProduct">
        <v-text-field
          class="input"
          v-model="name"
          label="Nombre"
          :error-messages="errors.name"
          @input="clearErrors('name')"
          required
        ></v-text-field>

        <v-text-field
          class="input"
          v-model="status"
          label="Estado"
          :error-messages="errors.status"
          @input="clearErrors('status')"
          required
        ></v-text-field>

        <v-textarea
          class="text-area"
          v-model="description"
          label="Descripción"
          :error-messages="errors.description"
          @input="clearErrors('description')"
          required
        ></v-textarea>

        <v-text-field
          class="input"
          v-model="price"
          label="Precio"
          :error-messages="errors.price"
          @input="clearErrors('price')"
          type="number"
          required
        ></v-text-field>

        <v-file-input
          class="file-input"
          v-model="anverso"
          label="Anverso"
          accept="image/*"
          :error-messages="errors.anverso"
          @change="clearErrors('anverso')"
          required
        ></v-file-input>

        <v-file-input
          class="file-input"
          v-model="reverso"
          label="Reverso"
          accept="image/*"
          :error-messages="errors.reverso"
          @change="clearErrors('reverso')"
          required
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
          required
        ></v-autocomplete>

        <div class="submit-buttons">
          <v-btn class="submit" type="submit" :loading="isSubmitting">Enviar</v-btn>
          <v-btn class="clean" @click="handleReset">Limpiar</v-btn>
        </div>
      </form>
    </v-container>
  </div>
</template>


<script setup>
import { ref, onMounted, nextTick } from "vue";
import Swal from "sweetalert2";

const CONFIG = useRuntimeConfig();
const router = useRouter();

const page = ref(1);
const pageSize = ref(10);

const name = ref("");
const status = ref();
const description = ref("");
const price = ref();
const anverso = ref("");
const reverso = ref("");
const selectedCategory = ref("");
const categories = ref([]);
const isSubmitting = ref(false);

const errors = reactive({
  name: [],
  status: [],
  description: [],
  price: [],
  anverso: [],
  reverso: [],
  selectedCategory: [],
});


const validateName = () => {
  const trimmedName = name.value.trim();
  if (!trimmedName) {
    errors.name = ["El nombre es requerido"];
    return false;
  }
  if (trimmedName.length < 8) {
    errors.name = ["El nombre debe tener por lo menos 8 caracteres"];
    return false;
  }
  if (trimmedName.length > 50) {
    errors.name = ["El nombre no puede exceder los 50 caracteres"];
    return false;
  }
  return true;
};

const validateStatus = () => {
  const statusNum = parseFloat(status.value);
  if (isNaN(statusNum)) {
    errors.status = ["El estado debe ser un número válido"];
    return false;
  }
  if (statusNum < 1) {
    errors.status = ["El estado debe ser al menos 1"];
    return false;
  }
  if (statusNum > 10) {
    errors.status = ["El estado no puede ser mayor a 10"];
    return false;
  }
  return true;
};

const validateDescription = () => {
  const trimmedDesc = description.value.trim();
  if (!trimmedDesc) {
    errors.description = ["La descripción es requerida"];
    return false;
  }
  if (trimmedDesc.length < 10) {
    errors.description = ["La descripción debe contener por lo menos 10 caracteres"];
    return false;
  }
  if (trimmedDesc.length > 500) {
    errors.description = ["La descripción no debe exceder los 500 caracteres"];
    return false;
  }
  return true;
};

const validatePrice = () => {
  const priceNum = parseFloat(price.value);
  if (isNaN(priceNum)) {
    errors.price = ["El precio debe ser un número válido"];
    return false;
  }
  if (priceNum < 1000) {
    errors.price = ["El precio debe ser mayor a 1000"];
    return false;
  }
  if (priceNum > 20000000) {
    errors.price = ["El precio no debe superar 20000000"];
    return false;
  }
  return true;
};

const validateAnverso = () => {
  if (!anverso.value) {
    errors.anverso = ["Selecciona una imagen para el anverso"];
    return false;
  }
  if (!(anverso.value instanceof File)) {
    errors.anverso = ["El archivo seleccionado no es válido"];
    return false;
  }
  return true;
};

const validateReverso = () => {
  if (!reverso.value) {
    errors.reverso = ["Selecciona una imagen para el reverso"];
    return false;
  }
  if (!(reverso.value instanceof File)) {
    errors.reverso = ["El archivo seleccionado no es válido"];
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


const validateForm = () => {

  for (const key in errors) {
    if (errors.hasOwnProperty(key)) {
      errors[key] = [];
    }
  }

  const isNameValid = validateName();
  const isStatusValid = validateStatus();
  const isDescriptionValid = validateDescription();
  const isPriceValid = validatePrice();
  const isAnversoValid = validateAnverso();
  const isReversoValid = validateReverso();
  const isCategoryValid = validateSelectedCategory();

  return (
    isNameValid &&
    isStatusValid &&
    isDescriptionValid &&
    isPriceValid &&
    isAnversoValid &&
    isReversoValid &&
    isCategoryValid
  );
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
    Swal.fire({
      title: "Formulario Inválido",
      icon: "warning",
      text: "Por favor, completa los campos.",
      confirmButtonText: "Aceptar",
    });
    return;
  }

  const formData = new FormData();
  formData.append("name", name.value.trim());
  formData.append("status", status.value);
  formData.append("description", description.value.trim());
  formData.append("price", price.value);
  formData.append("anverso", anverso.value);
  formData.append("reverso", reverso.value);
  formData.append("categoryId", selectedCategory.value);

  try {
    isSubmitting.value = true;

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
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al registrar el producto.");
    }
  } catch (err) {
    console.error("Error registering product:", err);
    Swal.fire({
      title: "Error al registrar el producto",
      icon: "error",
      text: err.message || "No se pudo registrar el producto.",
      confirmButtonText: "Aceptar",
    });
  } finally {
    isSubmitting.value = false;
  }
};


const handleReset = () => {
  name.value = "";
  status.value = null;
  description.value = "";
  price.value = null;
  anverso.value = null;
  reverso.value = null;
  selectedCategory.value = null;

  for (const key in errors) {
    if (errors.hasOwnProperty(key)) {
      errors[key] = [];
    }
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
