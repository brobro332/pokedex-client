<template>
  <div class="pokemon-detail" v-if="pokemon">
    <h2 class="name">{{ pokemon.name }}</h2>
    <img :src="pokemon.image ?? ''" :alt="pokemon.name" />

    <ul class="info-list">
      <li><strong>ID:</strong> {{ pokemon.id }}</li>
      <li><strong>키:</strong> {{ (pokemon.height / 10).toFixed(1) }} m</li>
      <li>
        <strong>몸무게:</strong> {{ (pokemon.weight / 10).toFixed(1) }} kg
      </li>
      <li>
        <strong>타입:</strong>
        <span
          v-for="type in pokemon.types"
          :key="type"
          :class="['type-badge', `type-${type}`]"
        >
          {{ type }}
        </span>
      </li>
    </ul>
  </div>
  <div v-else class="loading">로딩중...</div>
  <button class="back-button" @click="goBack">메인으로 돌아가기</button>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

interface PokemonDetail {
  id: number;
  name: string;
  image: string | null;
  height: number;
  weight: number;
  types: string[];
}

const route = useRoute();
const router = useRouter();
const pokemon = ref<PokemonDetail | null>(null);

const fetchPokemonDetail = async (name: string): Promise<void> => {
  try {
    const res = await axios.get<{
      id: number;
      name: string;
      sprites: { front_default: string | null };
      height: number;
      weight: number;
      types: { type: { name: string } }[];
    }>(`https://pokeapi.co/api/v2/pokemon/${name}`);

    const data = res.data;
    pokemon.value = {
      id: data.id,
      name: data.name,
      image: data.sprites.front_default,
      height: data.height,
      weight: data.weight,
      types: data.types.map((t) => t.type.name),
    };
  } catch {
    pokemon.value = null;
  }
};

const goBack = (): void => {
  router.push("/");
};

onMounted(() => {
  const nameParam = route.params.name;
  if (typeof nameParam === "string") {
    fetchPokemonDetail(nameParam);
  }
});
</script>

<style scoped>
.pokemon-detail {
  padding: 20px;
  text-align: center;
}

.back-button {
  background-color: #4a90e2;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 16px;
  font-weight: 600;
  transition: background-color 0.3s;
}

.back-button:hover {
  background-color: #357abd;
}

.name {
  text-transform: capitalize;
  margin-bottom: 12px;
  font-size: 2em;
}

img {
  width: 150px;
  height: 150px;
  object-fit: contain;
  margin-bottom: 20px;
}

.info-list {
  list-style: none;
  padding: 0;
  font-size: 1.1em;
}

.info-list li {
  margin: 8px 0;
}

.type-badge {
  display: inline-block;
  border-radius: 12px;
  padding: 4px 10px;
  margin: 0 4px;
  text-transform: capitalize;
  font-weight: 600;
  color: white;
}

.type-normal {
  background-color: #a8a77a;
}
.type-fire {
  background-color: #ee8130;
}
.type-water {
  background-color: #6390f0;
}
.type-electric {
  background-color: #f7d02c;
}
.type-grass {
  background-color: #7ac74c;
}
.type-ice {
  background-color: #96d9d6;
}
.type-fighting {
  background-color: #c22e28;
}
.type-poison {
  background-color: #a33ea1;
}
.type-ground {
  background-color: #e2bf65;
}
.type-flying {
  background-color: #a98ff3;
}
.type-psychic {
  background-color: #f95587;
}
.type-bug {
  background-color: #a6b91a;
}
.type-rock {
  background-color: #b6a136;
}
.type-ghost {
  background-color: #735797;
}
.type-dragon {
  background-color: #6f35fc;
}
.type-dark {
  background-color: #705746;
}
.type-steel {
  background-color: #b7b7ce;
}
.type-fairy {
  background-color: #d685ad;
}
</style>
