module.exports = {
  e2e: {
    baseUrl: 'http://localhost:8000',
    supportFile: 'tests/e2e/cypress/support/e2e.js',
    specPattern: 'tests/e2e/**/*.spec.js',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true
  }
};

