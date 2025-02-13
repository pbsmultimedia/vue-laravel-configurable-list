// eventBus.js
import { reactive } from 'vue';

const eventBus = reactive({
  events: {},

  // Register an event listener
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  },

  // Emit an event to all listeners
  emit(event, payload) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(payload));
    }
  },

  // Unregister an event listener
  off(event, callback) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(cb => cb !== callback);
    }
  }
});

export default eventBus;
