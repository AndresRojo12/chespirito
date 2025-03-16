<template>
  <div class="card">
    <h1 class="title">Iniciar sesión</h1>
    <v-card
      class="mx-auto pa-12 pb-8"
      elevation="8"
      max-width="350"
      rounded="lg"
    >
      <div class="text-subtitle-1 text-medium-emphasis color-#009c8c">
        <p class="form-text">Correo electrónico</p>
      </div>

      <v-text-field
        class="input"
        v-model="email"
        density="compact"
        placeholder="Dirección de correo"
        prepend-inner-icon="mdi-email-outline"
        variant="outlined"
        autocomplete="email"
        name="email"
        id="email"
      ></v-text-field>

      <div
        class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between"
      >
        <p class="form-text">Contraseña</p>
        <a
          class="password-text text-caption text-decoration-none"
          href="#"
          rel="noopener noreferrer"
          target="blank"
          @click.prevent="changePassword"
        >
          <p class="password-text">¿Olvidó su contraseña?</p>
        </a>
      </div>

      <v-text-field
        class="input"
        v-model="password"
        :type="visible ? 'text' : 'password'"
        density="compact"
        placeholder="Ingrese su contraseña"
        prepend-inner-icon="mdi-lock-outline"
        variant="outlined"
        autocomplete="current-password"
        name="password"
        id="password"
      >
        <template #append-inner>
          <v-btn
            icon
            variant="text"
            @click="togglePasswordVisibility"
            aria-label="Toggle password visibility"
            class="visibility-btn"
          >
            <v-icon>{{ visible ? "mdi-eye-off" : "mdi-eye" }}</v-icon>
          </v-btn>
        </template>
      </v-text-field>

      <v-btn
        class="button mb-8"
        size="large"
        variant="tonal"
        block
        @click.prevent="login"
      >
        Iniciar
      </v-btn>
    </v-card>
    <div v-if="isLoading">
      <LoadingSpinner />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "~/store/auth";
import Swal from "sweetalert2";

import LoadingSpinner from "../LoadingSpinner.vue";

const CONFIG = useRuntimeConfig();
const router = useRouter();
const auth = useAuth();

const email = ref("");
const password = ref("");
const visible = ref(false);
const isLoading = ref(false);

const login = async () => {
  if (!email.value || !password.value) {
    Swal.fire({
      icon: "warning",
      title: "Campos incompletos",
      text: "Por favor ingresa tu correo electrónico y contraseña.",
      confirmButtonColor: "#1179E1",
      iconColor: "#FF1E1E",
    });
    return;
  }
  isLoading.value = true;
  try {
    const response = await fetch(`${CONFIG.public.API_BASE_URL}auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    });
    const data = await response.json();
    if (response.ok) {
      auth.login(data.token);
      isLoading.value = false;
      router.push("/user/gestion");
    } else {
      isLoading.value = false;
      Swal.fire({
        icon: "error",
        title: "Error de inicio de sesión",
        text: data.message || "Usuario o contraseña incorrectos.",
        confirmButtonColor: "#1179E1",
        iconColor: "#FF1E1E",
      });
    }
  } catch (error) {
    console.error("Error logging in", error);
    isLoading.value = false;
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Hubo un problema al iniciar sesión. Inténtalo de nuevo.",
    });
  }
};

const changePassword = () => {
  router.push("/user/change-password");
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
  margin-top: 6%;
}
.input {
  color: #009c8c;
  font-family: "Arial", sans-serif;
}
.form-text {
  font-family: "Arial", sans-serif;
}
.password-text {
  font-family: "Arial", sans-serif;
  text-align: end;
  color: #009c8c;
}
.button {
  color: white;
  background: linear-gradient(to bottom, #009c8c, #00b7a2);
  font-family: "Arial", sans-serif;
}
.visibility-btn {
  height: 32px; 
  width: 32px;
  min-width: 32px;
  margin: 0;
  padding: 0;
}
.visibility-btn .v-icon {
  font-size: 20px;
}
@media (max-width: 430px) {
  .title {
    font-size: 8vw;
    margin-bottom: 4%;
  }
  .card {
    margin: 3%;
    margin-top: 15%;
  }
  .form-text,
  button {
    font-size: 4vw;
  }
  .password-text {
    font-size: 3vw;
  }
}
</style>
