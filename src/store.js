import { reactive } from 'vue';

export const store = reactive({
  initialized: false,
  players: '0',
  turn: 0,
  nemesisTurn: 0,
  nemesisHp: 0,
  graveholdHp: 0,
  turnOrderCards: [],
  turnOrderDeck: [],
  turnOrderPlayed: [],
  audio: true,
  audioVolume: 1,
  history: [],
  viewHistory: true,
  reset() {
    this.setValues({
      initialized: true,
      players: 0,
      turn: 0,
      nemesisTurn: 0,
      nemesisHp: 0,
      graveholdHp: 0,
      turnOrderCards: [],
      turnOrderDeck: [],
      turnOrderPlayed: [],
      history: [],
    });
  },
  load() {
    console.log('store load');
    var values = localStorage.store;
    if (values != null) {
      this.setValues(JSON.parse(values));
    } else {
      this.initialized = true;
    }
    console.log('store load:', this);
  },
  setValues(obj) {
    if (obj != null) {
      for (var k in obj) {
        this[k] = obj[k];
      }
    }
    console.log('store save');
    localStorage.store = JSON.stringify(this);
  },
});
