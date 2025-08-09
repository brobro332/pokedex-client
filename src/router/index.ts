import { createRouter, createWebHistory } from "vue-router";
import PokemonListView from "../views/PokemonListView.vue";

const routes = [{ path: "/", component: PokemonListView }];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
