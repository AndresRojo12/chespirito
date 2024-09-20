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
import { z } from "zod";
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

const schema = z.object({
  name: z.string().min(1, "Ingresa un nombre"),
  description: z.string().min(1, "La descripción es requerida"),
  image: z.any().refine((value) => value instanceof File, {
    message: "Debes seleccionar una imagen",
  }),
});

const validateForm = () => {
  errors.name = [];
  errors.description = [];
  errors.image = [];

  try {
    const formData = {
      name: name.value,
      description: description.value,
      image: image.value,
    };
    schema.parse(formData);
    return true;
  } catch (error) {
    if (error instanceof z.ZodError) {
      error.errors.forEach((err) => {
        const field = err.path[0];
        if (field === "name") errors.name = [err.message];
        if (field === "description") errors.description = [err.message];
        if (field === "image") errors.image = [err.message];
      });
    }
    return false;
  }
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
      errors.name = "Esta categoría ya existe";
    } else if (response.status === 400) {
      errors.description =
        "La descripción debe contener por lo menos 5 caracteres";
    } else {
      const errorData = await response.text();
      throw new Error(errorData || "Error al registrar la categoría");
    }
  } catch (error) {
    Swal.fire({
      title: "Error al registrar la categoría",
      icon: "error",
      text: "No se pudo registrar la categoría",
      confirmButtonText: "Aceptar",
    });
  }
};

const handleReset = () => {
  for (const key of Object.keys(errors)) {
    if (key === "image") image.value = "";
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
