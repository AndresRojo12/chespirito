<template>
  <v-icon class="exit-icon" @click="router.back()">mdi-arrow-left</v-icon>

  <v-container class="form-container">
    <h1 class="form-title">Registrar categoría</h1>
    <form @submit.prevent="registerCategory">
      <v-text-field
        class="input"
        v-model="name"
        label="Nombre"
        :error-messages="errors.name"
        @input="clearErrors('name')"
      ></v-text-field>
      <v-textarea
        class="text-area"
        v-model="description"
        label="Descripción"
        :error-messages="errors.description"
        @input="clearErrors('description')"
      ></v-textarea>
      <v-file-input
        class="file-input"
        v-model="image"
        label="Seleccionar imagen"
        accept="image/*"
        :error-messages="errors.image"
        @change="clearErrors('image')"
      ></v-file-input>
      <div class="submit-buttons">
        <v-btn class="submit" type="submit">Enviar</v-btn>
        <v-btn @click="handleReset" class="clean">Limpiar</v-btn>
      </div>
    </form>
  </v-container>
</template>

<script setup>
import { ref, reactive } from "vue";
import Swal from "sweetalert2";

const CONFIG = useRuntimeConfig();
const router = useRouter();

const name = ref("");
const description = ref("");
const image = ref(null);

const errors = reactive({
  name: [],
  description: [],
  image: [],
});


const validateName = (value) => {
  const errors = [];
  if (!value || !value.trim()) {
    errors.push("Debe ingresar un nombre");
  }
  if (value.length < 8) {
    errors.push("El nombre debe tener al menos 8 caracteres");
  }
  if (value.length > 255) {
    errors.push("El nombre no puede exceder los 255 caracteres");
  }
  return errors;
};

const validateDescription = (value) => {
  const errors = [];
  if (!value || !value.trim()) {
    errors.push("La descripción no puede estar vacía");
  }
  if (value.length < 10) {
    errors.push("La descripción debe tener entre 10 y 500 caracteres");
  }
  if (value.length > 500) {
    errors.push("La descripción no puede exceder los 500 caracteres");
  }
  return errors;
};

const validateImage = (file) => {
  const errors = [];
  if (!file) {
    errors.push("Debes seleccionar una imagen");
    return errors;
  }
  const validTypes = ["image/jpeg", "image/png", "image/gif"];
  if (!validTypes.includes(file.type)) {
    errors.push("El archivo debe ser una imagen (jpeg, png, gif)");
  }

  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    errors.push("La imagen no puede exceder los 5MB");
  }
  return errors;
};

const validateForm = () => {
  errors.name = [];
  errors.description = [];
  errors.image = [];

  let isValid = true;

  const nameErrors = validateName(name.value);
  if (nameErrors.length > 0) {
    errors.name = nameErrors;
    isValid = false;
  }


  const descriptionErrors = validateDescription(description.value);
  if (descriptionErrors.length > 0) {
    errors.description = descriptionErrors;
    isValid = false;
  }

  const imageErrors = validateImage(image.value);
  if (imageErrors.length > 0) {
    errors.image = imageErrors;
    isValid = false;
  }

  return isValid;
};

const registerCategory = async () => {
  if (!validateForm()) return;

  const formData = new FormData();
  formData.append("name", name.value);
  formData.append("description", description.value);
  formData.append("image", image.value);

  try {
    const response = await fetch(`${CONFIG.public.API_BASE_URL}categories`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (response.ok) {
      Swal.fire({
        title: "Categoría registrada con éxito",
        icon: "success",
        confirmButtonText: "Aceptar",
      });
      handleReset();
    } else if (response.status === 409) {
      errors.name = ["Esta categoría ya existe"];
    } else if (response.status === 400) {
      const errorData = await response.json();
     
      if (errorData.errors) {
        errorData.errors.forEach((err) => {
          const field = err.field;
          const message = err.message;
          if (field === "name") errors.name.push(message);
          if (field === "description") errors.description.push(message);
          if (field === "image") errors.image.push(message);
        });
      } else {
        errors.description = ["La descripción debe contener por lo menos 10 caracteres"];
      }
    } else {
      const errorData = await response.text();
      throw new Error(errorData || "Error al registrar la categoría");
    }
  } catch (error) {
    Swal.fire({
      title: "Error al registrar la categoría",
      icon: "error",
      text: error.message || "No se pudo registrar la categoría",
      confirmButtonText: "Aceptar",
    });
  }
};

const handleReset = () => {
  for (const key of Object.keys(errors)) {
    if (key === "image") image.value = null;
    else if (key === "name") name.value = "";
    else if (key === "description") description.value = "";
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
  margin-bottom: 4%;
}
.input,
.text-area,
.file-input {
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
    margin-bottom: 4%;
  }
  .form-title {
    font-size: 3vw;
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
    font-size: 5vw;
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
