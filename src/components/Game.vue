<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { store } from '../store.js';

defineProps({
  title: String,
});

const nemesisHp = ref(store.nemesisHp);
const graveholdHp = ref(store.graveholdHp);

watch(nemesisHp, (newValue, oldValue) => {
  store.setValues({
    nemesisHp: newValue,
  });
});

watch(graveholdHp, (newValue, oldValue) => {
  store.setValues({
    graveholdHp: newValue,
  });
});

const changeNemesisHp = (value) => {
  nemesisHp.value = parseInt(nemesisHp.value) + value;
};

const changeGraveholdHp = (value) => {
  graveholdHp.value = parseInt(graveholdHp.value) + value;
};

const isNewTurnDisabled = computed(() => {
  return store.turnOrderDeck.length > 0;
});
const isDrawCardDisabled = computed(() => {
  return store.turnOrderDeck.length == 0;
});

const shuffle = (array) => {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

const newTurn = () => {
  let newDeck = [];
  let newTurn = store.turn + 1;
  //Card 1B only on odd turns (1,3,5...)
  for (var index in store.turnOrderCards) {
    if (store.turnOrderCards[index]=='1B'){
      if (newTurn%2==1){
        newDeck.push(store.turnOrderCards[index]);
      }
    } else {
      newDeck.push(store.turnOrderCards[index]);
    }
  }
  newDeck = shuffle(newDeck);
  store.setValues({
    turn: newTurn,
    turnOrderDeck: newDeck,
    turnOrderPlayed: [],
  });
};

const drawCard = () => {
  let card = store.turnOrderDeck[0];
  let newDeck = store.turnOrderDeck.splice(1, store.turnOrderDeck.length - 1);
  let newTurnOrderPlayed = [...store.turnOrderPlayed, card];
  store.setValues({
    turnOrderDeck: newDeck,
    turnOrderPlayed: newTurnOrderPlayed,
  });
};

const putTop = (index, card) => {
  if (window.confirm('Rimetto in cima ' + getCardDescription(card) + '?')) {
    let newDeck = [card, ...store.turnOrderDeck];
    let newTurnOrderPlayed = [...store.turnOrderPlayed];
    newTurnOrderPlayed.splice(index, 1);
    store.setValues({
      turnOrderDeck: newDeck,
      turnOrderPlayed: newTurnOrderPlayed,
    });
  }
};

const putBottom = (index, card) => {
  if (window.confirm('Rimetto in fondo ' +getCardDescription(card) + '?')) {
    let newDeck = [...store.turnOrderDeck, card];
    let newTurnOrderPlayed = [...store.turnOrderPlayed];
    newTurnOrderPlayed.splice(index, 1);
    store.setValues({
      turnOrderDeck: newDeck,
      turnOrderPlayed: newTurnOrderPlayed,
    });
  }
};

const getCardDescription = (card) => {
  if (card == 'N') {
    return 'Nemesis';
  } else if (card == 'W') {
    return 'Jolly';
  } else {
    return 'Giocatore ' + card;
  }
};

const reset = () => {
  if (window.confirm('Confermi reset?')) {
    store.reset();
    window.location.hash = '/';
  }
};

onMounted(() => {
  if (store.turn==0){
    newTurn();
  }
});

</script>

<template>

  <nav class="navbar sticky-top bg-dark">
    <div class="container-fluid">
          <span class="fs-4 text-light">Aeon's End - Assistant</span>
          <span class="fs-4 text-light header-small">Giocatori: <span class="value">{{ store.players }}</span> - Turn: <span class="value">{{ store.turn }}</span></span>
          <button class="btn btn-danger" type="button" @click="reset">Reset</button>
    </div>
  </nav>

  <div class="row-hp">Nemesis HP: <span class="value">{{ store.nemesisHp }}</span> - Gravehold HP: <span class="value">{{ store.graveholdHp }}</span></div>
  <!--<div>Order cards: {{ store.turnOrderCards }}</div>
  <div>Order cards deck: {{ store.turnOrderDeck }}</div>
  <div>Order cards played: {{ store.turnOrderPlayed }}</div>-->

  <div class="turn-order-deck-container">
    <div v-for="(card, index) in store.turnOrderDeck" class="cardEEWrapper">
      <div class="cardEE cardEE-back">
      </div>
    </div>
  </div>

  <div class="turn-order-played-container">
    <div v-for="(card, index) in store.turnOrderPlayed" class="cardEEWrapper">
      <div class="cardEE cardEE-front" :class="'cardEE-'+card" :title="getCardDescription(card)">
        <button class="putBottom" @click="putBottom(index, card)">
          Metti in fondo
        </button>
        <button class="putTop" @click="putTop(index, card)">
          Metti in cima
        </button>
      </div>
    </div>
  </div>

  <button :disabled="isDrawCardDisabled" type="button" @click="drawCard"  class="btn btn-primary game-button">
    Pesca Carta
  </button>

  <button :disabled="isNewTurnDisabled" type="button" @click="newTurn"  class="btn btn btn-success game-button">
    Nuovo Turno
  </button>

  <div class="hp-container">
    <div class="nemesis-hp-container">
      <div class="hp-title">Nemesis</div>
      <div>
        <button
          class="btn btn-danger decrement decrement-5"
          type="button"
          @click="changeNemesisHp(-5)"
        >
          -5
        </button>
        <button
          class="btn btn-danger decrement decrement-1"
          type="button"
          @click="changeNemesisHp(-1)"
        >
          -1
        </button>
        <input v-model="nemesisHp" type="number" class="input-hp" />
        <button
          class="btn btn-success increment increment-1"
          type="button"
          @click="changeNemesisHp(1)"
        >
          +1
        </button>
        <button
          class="btn btn-success increment increment-5"
          type="button"
          @click="changeNemesisHp(5)"
        >
          +5
        </button>
      </div>
    </div>

    <div class="gravehold-hp-container">
      <div class="hp-title">Gravehold</div>
      <div>
        <button
          class="btn btn-danger decrement decrement-5"
          type="button"
          @click="changeGraveholdHp(-5)"
        >
          -5
        </button>
        <button
          class="btn btn-danger decrement decrement-1"
          type="button"
          @click="changeGraveholdHp(-1)"
        >
          -1
        </button>
        <input v-model="graveholdHp" type="number" class="input-hp" />
        <button
          class="btn btn-success increment increment-1"
          type="button"
          @click="changeGraveholdHp(1)"
        >
          +1
        </button>
        <button
          class="btn btn-success increment increment-5"
          type="button"
          @click="changeGraveholdHp(5)"
        >
          +5
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
