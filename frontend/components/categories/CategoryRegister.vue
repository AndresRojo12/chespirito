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
      <h1 class="title">Registrar categoría</h1>
      <form @submit.prevent="registerCategory">
        <v-text-field
          class="input"
          v-model="name"
          label="Nombre"
          required
        ></v-text-field>
        <v-textarea
          class="text-area"
          v-model="description"
          label="Descripción"
          required
        ></v-textarea>
        <v-file-input
          class="file-input"
          v-model="image"
          label="Seleccionar imagen"
          accept="image/*"
          required
        ></v-file-input>
        <div class="submit-buttons">
          <v-btn class="submit" type="submit">Enviar</v-btn>
          <v-btn @click="handleReset" class="clean">Limpiar</v-btn>
        </div>
      </form>
    </v-container>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Swal from "sweetalert2";
const CONFIG = useRuntimeConfig();
const router = useRouter();

const name = ref("");
const description = ref("");
const price = ref(0);
const image = ref(null);

const registerCategory = async () => {
  if (!name.value || !description.value || !image.value) {
    Swal.fire({
      title: "Error",
      text: "Por favor complete todos los campos",
      icon: "warning",
      confirmButtonText: "Aceptar",
    });
    return;
  }

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
  name.value = "";
  description.value = "";
  price.value = 0;
  image.value = null;
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
.text-area,
.file-input {
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
  .exit-icon {
    display: flex;
    font-size: 5vw;
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
