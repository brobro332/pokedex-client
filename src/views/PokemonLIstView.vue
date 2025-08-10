<template>
  <div class="pokemon-list" ref="listContainer">
    <div class="logo">
      <img
        src="/logo.png"
        alt="포켓몬 도감"
        style="width: 200px; height: auto"
      />
    </div>

    <input
      type="text"
      v-model="searchText"
      placeholder="포켓몬 이름을 입력해보세요!"
      class="search-bar"
    />

    <div class="grid">
      <PokemonCard
        v-for="pokemon in filteredList"
        :key="pokemon.id"
        :name="pokemon.name"
        :image="pokemon.image"
        :id="pokemon.id"
      />
    </div>

    <div v-if="loading" class="loading">로딩중...</div>
    <div v-if="noMoreData" class="end-message">더 이상 포켓몬이 없습니다.</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import axios from "axios";
import PokemonCard from "../components/PokemonCard.vue";

interface Pokemon {
  name: string;
  id: string;
  image: string;
}

const pokemonList = ref<Pokemon[]>([]);
const searchText = ref<string>("");
const loading = ref<boolean>(false);
const noMoreData = ref<boolean>(false);

const limit = 24;
let offset = 0;

const listContainer = ref<HTMLElement | null>(null);

const fetchPokemon = async (): Promise<void> => {
  if (loading.value || noMoreData.value) return;
  loading.value = true;
  try {
    const res = await axios.get<{ results: { name: string; url: string }[] }>(
      `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
    );
    const results = res.data.results;

    if (results.length === 0) {
      noMoreData.value = true;
    } else {
      const newPokemons: Pokemon[] = results.map((p) => {
        const id = p.url.split("/").filter(Boolean).pop() || "";
        return {
          name: p.name,
          id,
          image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
        };
      });
      pokemonList.value.push(...newPokemons);
      offset += limit;
    }
  } catch {
  } finally {
    loading.value = false;
  }
};

const filteredList = computed<Pokemon[]>(() => {
  if (!searchText.value) return pokemonList.value;
  return pokemonList.value.filter((p) =>
    p.name.toLowerCase().includes(searchText.value.toLowerCase())
  );
});

const handleScroll = (): void => {
  const container = listContainer.value;
  if (!container || loading.value || noMoreData.value) return;

  if (
    container.scrollTop + container.clientHeight >=
    container.scrollHeight - 100
  ) {
    fetchPokemon();
  }
};

onMounted(() => {
  fetchPokemon();
  const container = listContainer.value;
  container?.addEventListener("scroll", handleScroll);
});

onBeforeUnmount(() => {
  const container = listContainer.value;
  container?.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped>
.pokemon-list {
  padding: 20px;
  height: 80vh;
  overflow-y: auto;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.search-bar {
  padding: 6px;
  margin-top: 10px;
  margin-bottom: 20px;
  width: 100%;
  max-width: 300px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.logo img {
  display: block;
  margin: 0 auto;
}

.grid {
  display: grid;
  grid-template-columns: repeat(8, minmax(120px, 1fr));
  gap: 12px;
}

.loading,
.end-message {
  text-align: center;
  margin-top: 16px;
  color: #666;
}
</style>
