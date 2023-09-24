const { downloadFile } = require("cypress-downloadfile/lib/addPlugin");
const { rmdir } = require("fs");
module.exports = (on, config) => {
  on("task", { downloadFile });

  on("task", {
    deleteDownloads() {
      console.log("deleting downloads");
      return new Promise((resolve) => {
        rmdir("cypress/downloads", { recursive: true }, () => {
          resolve(null);
        });
      });
    },
  });
};

const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    specPattern: "cypress/integration/examples/*.js",
    pageLoadTimeout: 120000,
  },
});
