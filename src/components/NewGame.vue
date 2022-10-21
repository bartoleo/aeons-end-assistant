<script setup>
import { ref } from 'vue';
import { store } from '../store.js';

defineProps({
  title: String,
});

const config = () => {
  window.location.hash = '/config';
}

const startGame = (players) => {
  const orderDeck = {
    '1_3': ['1', '1', '1', 'N', 'N'],
    '1_34': ['1' ,'1', '1', '1B', 'N', 'N'],
    '1_4': ['1','1', '1', '1', 'N', 'N'],
    '2': ['1', '1', '2', '2', 'N', 'N'],
    '3': ['1', '2', '3', 'W', 'N', 'N'],
    '4': ['1', '2', '3', '4', 'N', 'N'],
  };

  store.setValues({
    game: true,
    players: players,
    turn: 0,
    nemesisHp: 60,
    graveholdHp: 30,
    turnOrderCards: orderDeck[players],
    turnOrderDeck: [],
    turnOrderPlayed: [],
  });

  window.location.hash = '/game';
};

const count = ref(0);
</script>

<template>
  <nav class="navbar sticky-top bg-dark">
    <div class="container-fluid">
        <span class="fs-4 text-light">Aeon's End - Assistant</span>
        <span class="game-button-bar">
          <button class="btn btn-primary-outline" type="button" @click="config"><i class="fas fa-gear"></i></button>
        </span>
    </div>
  </nav>

  <div class="card">
    <div class="card-body new-game-info" >
      Nuova partita, scegli il numero di giocatori:
    </div> 
  </div>

  <div class="new-game-buttons">
    <button class="btn btn-primary" type="button" @click="startGame('1_3')">1 Giocatore (difficile: 3 carte)</button>
    <button class="btn btn-primary" type="button" @click="startGame('1_34')">1 Giocatore (medio: 3/4 carte)</button>
    <button class="btn btn-primary" type="button" @click="startGame('1_4')">1 Giocatore (facile: 4 carte)</button>
  </div>
  
  <div class="new-game-buttons">
    <button class="btn btn-primary" type="button" @click="startGame('2')">2 Giocatori</button>
  </div>
  
  <div class="new-game-buttons">
    <button class="btn btn-primary" type="button" @click="startGame('3')">3 Giocatori</button>
  </div>

  <div class="new-game-buttons">
    <button class="btn btn-primary" type="button" @click="startGame('4')">4 Giocatori</button>
  </div>

  <div class="setup-nemesis">
    <table class="table-setup-nemesis">
      <thead>
        <tr>
          <th>
            Carte nemesi<br/>da aggiungere
          </th>
          <th>
            1 Giocatore
          </th>
          <th>
            2 Giocatori
          </th>
          <th>
            3 Giocatori
          </th>
          <th>
            4 Giocatori
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
          Livello 1
          </td>
          <td>
            1
          </td>
          <td>
            3
          </td>
          <td>
            5
          </td>
          <td>
            8
          </td>
        </tr>
        <tr>
          <td>
          Livello 2
          </td>
          <td>
            3
          </td>
          <td>
            5
          </td>
          <td>
            6
          </td>
          <td>
            7
          </td>
        </tr>
        <tr>
          <td>
          Livello 3
          </td>
          <td>
            7
          </td>
          <td>
            7
          </td>
          <td>
            7
          </td>
          <td>
            7
          </td>
        </tr>
      </tbody>
    </table>
  </div>

</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
