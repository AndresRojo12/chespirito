<template>
  <div class="main-container">
    <div class="header-container">
      <v-list-item
        prepend-icon="mdi-arrow-left"
        class="exit-icon"
        @click="back"
      ></v-list-item>
      <h1 class="card-title">ANTIGÜEDADES CHESPIRITO</h1>
    </div>

    <v-layout>
      <v-navigation-drawer style="max-width: 155px" expand-on-hover rail>
        <v-list>
          <v-list-item
            class="buttons"
            prepend-icon="mdi-account-circle"
            :title="`${userStore.user ? userStore.user.role : 'Usuario'}`"
          ></v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list density="compact" nav>
          <v-list-item
            class="buttons"
            prepend-icon="mdi-home-city"
            title="Inicio"
            @click="goHome"
          ></v-list-item>

          <v-list-item
            class="buttons"
            prepend-icon="mdi-cash"
            title="Categorias"
            @click.prevent="categoriesIn"
          ></v-list-item>

          <v-list-item
            class="buttons"
            @click.prevent="confirmLogout"
            prepend-icon="mdi-logout"
            title="Salir"
          ></v-list-item>
        </v-list>
      </v-navigation-drawer>
    </v-layout>
    <v-container class="container">
      <h1 class="title">Registrar categoría</h1>

      <form @submit.prevent="registerCategory">
        <v-text-field
          v-model="name"
          label="Nombre"
          required
          class="input"
        ></v-text-field>
        <v-textarea
          v-model="description"
          label="Descripción"
          required
          class="text-area"
        ></v-textarea>
        <v-file-input
          v-model="image"
          label="Seleccionar imagen"
          accept="image/*"
          required
          class="file-input"
        ></v-file-input>
        <v-btn type="submit" class="submit-button">Enviar</v-btn>
        <v-btn @click="handleReset" class="clean-button">Limpiar</v-btn>
      </form>
    </v-container>
    <footer class="footer">
      <div>
        <div class="footer-bottom">
          {{ new Date().getFullYear() }} —
          <strong>Antigüedades Chespirito</strong>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Swal from "sweetalert2";
import { useAuth } from "~/store/auth";
const CONFIG = useRuntimeConfig();
const router = useRouter();
const userStore = useAuth();

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

const handleReset = () => {
  name.value = "";
  description.value = "";
  price.value = 0;
  image.value = null;
};

const handleLogout = () => {
  userStore.logout();
  router.push("/");
};

const goHome = () => {
  router.push("/user/gestion");
};

const categoriesIn = () => {
  router.push("/user/gestion");
};

const back = () => {
  router.back();
};
</script>

<style scoped>
.card-title {
  display: flex;
  justify-content: center;
  font-size: 2rem;
  color: #009c8c;
  margin-top: 1%;
}
.exit-icon {
  display: none;
}
.buttons {
  color: #009c8c;
}
.container {
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
.input {
  color: #009c8c;
}
.text-area {
  color: #009c8c;
}
.file-input {
  color: #009c8c;
}
.submit-button {
  background-color: #009c8c;
  color: white;
  margin-left: 5%;
  width: 40%;
}
.clean-button {
  background-color: white;
  color: #009c8c;
  margin-left: 10%;
  width: 40%;
}
.footer-bottom {
  margin-top: 10px;
  font-size: 14px;
}
.footer {
  display: flex;
  justify-content: center;
  margin-top: 2%;
  color: #009c8c;
}

@media (max-width: 429px) {
  .main-container {
    max-width: 100%;
    padding: 3%;
  }
  .container {
    max-width: 100%;
  }
  .header-container {
    display: flexbox;
  }
  .exit-icon {
    display: flex;
    font-size: 5vw;
  }
  .card-title {
    font-size: 5vw;
  }
  .title {
    font-size: 5vw;
    margin-bottom: 5%;
  }
  .input {
    max-width: 100%;
  }
  .text-area {
    max-width: 100%;
  }
  .file-input {
    max-width: 100%;
  }
  .submit-button {
    width: 100%;
    font-size: 4vw;
    margin-bottom: 3%;
    margin-left: 0%;
  }
  .clean-button {
    width: 100%;
    font-size: 4vw;
    margin-left: 0%;
  }
  .footer-bottom {
    margin-top: 10px;
    font-size: 5vw;
  }
  .footer {
    display: flex;
    justify-content: center;
    margin-top: 2%;
    color: #009c8c;
  }
}
</style>
