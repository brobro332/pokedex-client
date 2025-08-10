<template>
  <router-link :to="`/pokemon/${name}`" class="card">
    <img :src="image" :alt="name" @error="onImgError" />
    <p>{{ name }}</p>
  </router-link>
</template>

<script setup lang="ts">
interface Props {
  name: string;
  image: string;
  id: number;
}

const props = defineProps<Props>();

function onImgError(event: Event) {
  const target = event.target as HTMLImageElement;
  target.src = "/default-pokemon.png";
}
</script>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
  background: #f6f6f6;
  border-radius: 8px;
  text-decoration: none;
  color: black;
  transition: transform 0.15s ease;
}
.card:hover {
  transform: scale(1.05);
}
img {
  width: 96px;
  height: 96px;
  object-fit: contain;
}
p {
  margin: 4px 0 0;
  text-transform: capitalize;
}
</style>
