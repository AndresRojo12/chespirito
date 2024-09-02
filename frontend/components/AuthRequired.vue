<template>
  <div class="access-denied-container">
    <h1>Acceso Denegado</h1>
    <p>No tienes acceso a esta página. Por favor, inicia sesión para continuar.</p>
    <v-btn color="primary" @click="goToLogin">Ir al Login</v-btn>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

function goToLogin() {
  router.push('/');
}
</script>

<style scoped>
.access-denied-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh; 
  text-align: center;
  background-color: #f8f8f8; 
  padding: 20px;
}

.access-denied-container h1 {
  color: #FF1E1E; 
  margin-bottom: 20px;
}

.access-denied-container p {
  margin-bottom: 20px;
}

.access-denied-container v-btn {
  margin-top: 20px;
}
</style>
