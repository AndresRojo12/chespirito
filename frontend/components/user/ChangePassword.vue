<template>
  <div class="card">
    <h1 class="title">Cambiar Contraseña</h1>
    <v-card
      class="mx-auto pa-12 pb-8"
      elevation="8"
      max-width="390"
      rounded="lg"
    >

      <div class="text-subtitle-1 text-medium-emphasis color-#009c8c">
        <p class="form-text">Contraseña Actual</p>
      </div>
      <v-text-field
        class="input"
        v-model="currentPassword"
        :type="visible ? 'text' : 'password'"
        placeholder="Ingresa tu contraseña actual"
        prepend-inner-icon="mdi-lock-outline"
        variant="outlined"
        :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
        @click:append-inner="togglePasswordVisibility"
      ></v-text-field>

      <div class="text-subtitle-1 text-medium-emphasis color-#009c8c">
        <p class="form-text">Nueva contraseña</p>
      </div>
      <v-text-field
        class="input"
        v-model="newPassword"
        :type="visible ? 'text' : 'password'"
        placeholder="Inserta tu nueva contraseña"
        prepend-inner-icon="mdi-lock-outline"
        variant="outlined"
        :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
        @click:append-inner="togglePasswordVisibility"
      ></v-text-field>

      <v-btn
        class="button mb-8"
        size="large"
        variant="tonal"
        block
        @click.prevent="changePassword"
      >
        Cambiar
      </v-btn>
    </v-card>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "~/store/auth";
import Swal from "sweetalert2";

const CONFIG = useRuntimeConfig();
const router = useRouter();
const auth = useAuth();

const currentPassword = ref("");
const newPassword = ref("");
const visible = ref(false);

const changePassword = async () => {
  try {
    const response = await fetch(
      `${CONFIG.public.API_BASE_URL}auth/change-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({
          currentPassword: currentPassword.value,
          newPassword: newPassword.value,
        }),
      },
    );
    const data = await response.json();
    if (response.ok) {
      Swal.fire({
        icon: "success",
        title: "Éxito",
        text: data.message,
      });
      router.push("/");
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: data.message,
      });
    }
  } catch (error) {
    console.error("Error changing password", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Hubo un problema al cambiar la contraseña. Inténtalo de nuevo.",
    });
  }
};

const togglePasswordVisibility = () => {
  visible.value = !visible.value;
};
</script>

<style scoped>
.title {
  font-family: "Arial", sans-serif;
  text-align: center;
  color: #009c8c;
  margin-bottom: 1%;
}
.card {
  margin-top: 9%;
}
.form-text {
  font-family: "Arial", sans-serif;
}
.input {
  font-family: "Arial", sans-serif;
  color: #009c8c;
}
.button {
  color: white;
  background: linear-gradient(to bottom, #009c8c, #00b7a2);
  font-family: "Arial", sans-serif;
}
@media (max-width: 430px) {
  .title {
    font-size: 7vw;
    margin-bottom: 5%;
  }
  .card {
    margin: 3%;
    margin-top: 20%;
  }
  .form-text,
  button {
    font-size: 4vw;
  }
}
</style>
