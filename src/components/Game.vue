<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { store } from '../store.js';

const nemesisDecks = {
  1: {
    total: 20,
    level1: 4,
    level2: 6,
    level3: 10,
  },
  2: {
    total: 24,
    level1: 6,
    level2: 8,
    level3: 10,
  },
  3: {
    total: 27,
    level1: 8,
    level2: 9,
    level3: 10,
  },
  4: {
    total: 31,
    level1: 11,
    level2: 10,
    level3: 10,
  }
}

defineProps({
  title: String,
});

const audio = ref(store.audio);
const viewHistory = ref(store.viewHistory);
const nemesisHp = ref(store.nemesisHp);
const graveholdHp = ref(store.graveholdHp);
const nemesisDeckText = ref('');
const nemesisHpChangeText = ref('');
const graveholdHpChangeText = ref('');

watch(nemesisHp, (newValue, oldValue) => {
  store.setValues({
    nemesisHp: newValue,
  });
  recalculateHpChange();
});

watch(graveholdHp, (newValue, oldValue) => {
  store.setValues({
    graveholdHp: newValue,
  });
  recalculateHpChange();
});

const changeNemesisHp = (value) => {
  nemesisHp.value = parseInt(nemesisHp.value) + value;
  if (store.audio){
    const audioFile = new Audio('sounds/click.wav');
    audioFile.volume = store.audioVolume;
    audioFile.play();
  }
};

const changeGraveholdHp = (value) => {
  graveholdHp.value = parseInt(graveholdHp.value) + value;
  if (store.audio){
    const audioFile = new Audio('sounds/click.wav');
    audioFile.volume = store.audioVolume;
    audioFile.play();
  }
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

  recalculateNemesisDeckText();

  if (store.audio){
    const audioFile = new Audio('sounds/shuffle.wav');
    audioFile.volume = store.audioVolume;
    audioFile.play();
  }
};

const drawCard = () => {
  let card = store.turnOrderDeck[0];
  
  let newDeck = store.turnOrderDeck.splice(1, store.turnOrderDeck.length - 1);
  
  let newTurnOrderPlayed = [...store.turnOrderPlayed, card];
  
  let nemesisTurn = store.nemesisTurn;
  if (card=='N'){
    nemesisTurn++;
  }

  store.setValues({
    nemesisTurn: nemesisTurn,
    turnOrderDeck: newDeck,
    turnOrderPlayed: newTurnOrderPlayed,
  });

  if (store.audio){
    let audioFile = null;
    if (card=='N'){
        audioFile = new Audio('sounds/nemesis.wav')
    } else if (card == 'W') {
        audioFile = new Audio('sounds/jolly.wav')
    } else if (card == '12') {
        audioFile = new Audio('sounds/player12.wav')
    } else if (card == '34') {
        audioFile = new Audio('sounds/player34.wav')
    } else if (card == '1' || card=='1B') {
        audioFile = new Audio('sounds/player1.wav')
    } else if (card == '2') {
        audioFile = new Audio('sounds/player2.wav')
    } else if (card == '3' || card=='1b') {
        audioFile = new Audio('sounds/player3.wav')
    } else if (card == '4' || card=='1b') {
        audioFile = new Audio('sounds/player4.wav')
    }

    if (audioFile){
      audioFile.volume = store.audioVolume;
      audioFile.play();
    }
  }

  if (card=='N'){
    recalculateNemesisDeckText();
  }

  saveHistory();

};

const saveHistory=()=>{
  let history = [...store.history];
  
  const id = history.length+1;
  
  history.splice(0, 0, {
    turn: store.turn,
    id: id,
    nemesisHp: store.nemesisHp,
    graveholdHp: store.graveholdHp
  });

  store.setValues({
    history: history
  });

  recalculateHpChange();
}

const putTop = (index, card) => {
  if (window.confirm('Rimetto in cima ' + getCardDescription(card) + '?')) {
    let newDeck = [card, ...store.turnOrderDeck];
    
    let newTurnOrderPlayed = [...store.turnOrderPlayed];
    newTurnOrderPlayed.splice(index, 1);

    let nemesisTurn = store.nemesisTurn;
    if (card == 'N'){
      nemesisTurn--;
    }

    store.setValues({
      nemesisTurn: nemesisTurn,
      turnOrderDeck: newDeck,
      turnOrderPlayed: newTurnOrderPlayed,
    });

      
    if (card=='N'){
      recalculateNemesisDeckText();
    }
  }
};

const putBottom = (index, card) => {
  if (window.confirm('Rimetto in fondo ' +getCardDescription(card) + '?')) {
    let newDeck = [...store.turnOrderDeck, card];
    
    let newTurnOrderPlayed = [...store.turnOrderPlayed];
    newTurnOrderPlayed.splice(index, 1);

    let nemesisTurn = store.nemesisTurn;
    if (card == 'N'){
      nemesisTurn--;
    }

    store.setValues({
      nemesisTurn: nemesisTurn,
      turnOrderDeck: newDeck,
      turnOrderPlayed: newTurnOrderPlayed,
    });
    
    if (card=='N'){
      recalculateNemesisDeckText();
    }
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

const toggleAudio = () => {
  audio.value = !audio.value;
  store.setValues({
    audio: audio.value
  });
}

const toggleViewHistory = () => {
  viewHistory.value = !viewHistory.value;
  store.setValues({
    viewHistory: viewHistory.value
  });
}

const config = () => {
  window.location.hash = '/config';
}

const shuffleTurnOrderDeck = () => {
  if (window.confirm('Confermi di rimischiare il mazzo ordine di turno?')) {
    let newDeck = shuffle(store.turnOrderDeck);
    store.setValues({
      turnOrderDeck: newDeck,
    });

    if (store.audio){
      const audioFile = new Audio('sounds/shuffle.wav');
      audioFile.volume = store.audioVolume;
      audioFile.play();
    }
  }
};

const recalculateNemesisDeckText = () => {
  const nemesisCard = store.nemesisTurn;
  
  const playerNumber = Number((store.players+'_').split('_')[0]);
  
  const nemesisCardsTotal = nemesisDecks[playerNumber].total;
  
  const nemesisCardsLevel1 = nemesisDecks[playerNumber].level1;
  const nemesisCardsLevel2 = nemesisDecks[playerNumber].level2;
  const nemesisCardsLevel3 = nemesisDecks[playerNumber].level3;

  let cards='';
  for (let i=1;i<=Math.max(nemesisCard, nemesisCardsTotal);i++){
    let level = '1';
    let css='';
    if (i == nemesisCard){
      css = 'nemesis-card-turn-chart-actual';
    } else if (i < nemesisCard){
      css = 'nemesis-card-turn-chart-past';
    } else if (i > nemesisCard){
      css = 'nemesis-card-turn-chart-future';
    }
    if (i>nemesisCardsLevel1){
      level='2';
    }
    if (i>nemesisCardsLevel1+nemesisCardsLevel2){
      level='3';
    }
    if (i>nemesisCardsLevel1+nemesisCardsLevel2+nemesisCardsLevel3){
      level='X';
    }
    cards+='<span class="nemesis-card-turn-chart nemesis-card-turn-chart-'+level+' '+css+'">'+level+'</span>'
  }
  nemesisDeckText.value = nemesisCard+"/"+nemesisCardsTotal+" "+cards;
}

const numberWithSign = (value) => {
  if (value>0){
    return "+"+value;
  }
  return ""+value;
}

const recalculateHpChange = () => {
  let nemesisHpOld = store.nemesisHp;
  let graveholdHpOld  = store.graveholdHp;

  if (store.history.length>0){
    nemesisHpOld = store.history[0].nemesisHp;
    graveholdHpOld  = store.history[0].graveholdHp;
  }
  
  if (nemesisHpOld==store.nemesisHp){
    nemesisHpChangeText.value = '&nbsp;';
  } else {
    nemesisHpChangeText.value = nemesisHpOld + " " + numberWithSign(store.nemesisHp-nemesisHpOld);
  }
  
  if (graveholdHpOld==store.graveholdHp){
    graveholdHpChangeText.value = '&nbsp;';
  } else {
    graveholdHpChangeText.value = graveholdHpOld + " " + numberWithSign(store.graveholdHp-graveholdHpOld);
  }
}

onMounted(() => {
  if (store.turn==0){
    newTurn();
  } else {
    recalculateNemesisDeckText();
  }
  recalculateHpChange();
});

</script>

<template>

  <nav class="navbar sticky-top bg-dark">
    <div class="container-fluid">
      <span class="fs-4 text-light">Aeon's End - Assistant</span>
      <span class="fs-4 text-light header-small">Giocatori: <span class="value">{{ store.players }}</span> - Turn: <span class="value">{{ store.turn }}</span></span>
      <span class="game-button-bar">
        <button class="btn btn-primary-outline" type="button" @click="config"><i class="fas fa-gear"></i></button>
        <button class="btn btn-primary-outline" type="button" @click="toggleViewHistory"><i v-if="viewHistory==true" class="fas fa-table-list"></i><i v-if="viewHistory==false" class="fas fa-table-list icon-crossed"></i></button>
        <button class="btn btn-primary-outline" type="button" @click="toggleAudio"><i v-if="audio==true" class="fas fa-volume-high"></i><i v-if="audio==false" class="fas fa-volume-xmark"></i></button>
        <button class="btn btn-danger" type="button" @click="reset"><i class="fas fa-circle-xmark"></i> Reset</button>
      </span>
    </div>
  </nav>

  <div class="nemesis-deck-text">Nemesis deck: <span v-html="nemesisDeckText"></span></div>
  
  <!--<div class="row-hp">Nemesis HP: <span class="value">{{ store.nemesisHp }}</span> - Gravehold HP: <span class="value">{{ store.graveholdHp }}</span></div>-->
  <!--<div>Order cards: {{ store.turnOrderCards }}</div>
  <div>Order cards deck: {{ store.turnOrderDeck }}</div>
  <div>Order cards played: {{ store.turnOrderPlayed }}</div>-->

  

  <div class="turn-order-deck-container">
    <div v-for="(card, index) in store.turnOrderDeck" class="cardEEWrapper">
      <div class="cardEE cardEE-back">
      </div>
    </div>
    <button v-if="store.turnOrderDeck.length>0" class="btn btn-danger shuffleTurnOrderDeck" @click="shuffleTurnOrderDeck()">
      <i class="fa-solid fa-shuffle"></i><br/><span class="button-text">Mischia</span>
    </button>
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
    <i class="fas fa-copy"></i> Pesca Carta
  </button>

  <button :disabled="isNewTurnDisabled" type="button" @click="newTurn"  class="btn btn btn-success game-button">
    <i class="fas fa-solid fa-forward"></i> Nuovo Turno
  </button>

  <div class="hp-container">
    <span class="nemesis-hp-container">
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
      <div class="hp-change" v-html="nemesisHpChangeText"></div>
    </span>

    <span class="gravehold-hp-container">
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
      <div class="hp-change"  v-html="graveholdHpChangeText"></div>
    </span>
  </div>
  
  <div class="history-container" v-if="viewHistory">
    <table class="history-table">
      <tr>
        <th>Turno</th>
        <th>Nemesis HP</th>
        <th>Gravehold HP</th>
      </tr>
      <tr v-for="(historyItem, index) in store.history" class="history-row">
        <td>{{historyItem.turn}}</td>
        <td>{{historyItem.nemesisHp}}</td>
        <td>{{historyItem.graveholdHp}}</td>
      </tr>
    </table>
  </div>

</template>
