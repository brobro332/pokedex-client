import { createRouter, createWebHistory } from "vue-router";
import PokemonListView from "../views/PokemonListView.vue";
import PokemonDetailView from "../views/PokemonDetailView.vue";

const routes = [
  { path: "/", component: PokemonListView },
  { path: "/pokemon/:name", component: PokemonDetailView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
