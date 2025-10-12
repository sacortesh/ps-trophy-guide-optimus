// Production logging utility
const Logger = {
  enabled: false, // Set to true for debugging in production

  log: function(message, ...args) {
    if (this.enabled) {
      console.log(message, ...args);
    }
  },

  error: function(message, ...args) {
    if (this.enabled) {
      console.error(message, ...args);
    }
  },

  warn: function(message, ...args) {
    if (this.enabled) {
      console.warn(message, ...args);
    }
  },

  info: function(message, ...args) {
    if (this.enabled) {
      console.info(message, ...args);
    }
  }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Logger;
}
