// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import "cypress-file-upload";

export function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

Cypress.Commands.add("upload_banner", fileName => {
  cy.fixture(fileName).then(fileContent => {
    cy.get(".dropzone").upload(
      { fileContent, fileName, mimeType: "image/jpeg" },
      { subjectType: "drag-n-drop" }
    );
  });
});

// custom file upload command
Cypress.Commands.add("upload_files", (selector, fixturePath, type) => {
  cy.get(selector).then(subject =>
    cy.window().then(win =>
      cy
        .fixture(fixturePath, "base64")
        .then(Cypress.Blob.base64StringToBlob)
        .then(blob => {
          const el = subject[0];
          const testFile = new win.File([blob], fixturePath, {
            type
          });
          const dataTransfer = new win.DataTransfer();
          dataTransfer.items.add(testFile);
          el.files = dataTransfer.files;
          cy.wrap(subject).trigger("change", {
            force: true
          });
        })
    )
  );
});

// custom login command
Cypress.Commands.add("login", () => {
  Cypress.log({
    name: "loginViaAuth0"
  });
  const auth0_domain = Cypress.env("auth_domain");
  const options = {
    method: "POST",
    url: `https://${auth0_domain}/oauth/token`,
    body: {
      grant_type: "password",
      username: Cypress.env("auth_username"),
      password: Cypress.env("auth_password"),
      audience: `https://${auth0_domain}/userinfo`,
      scope: "openid profile email",
      client_id: Cypress.env("auth_client_id"),
      client_secret: Cypress.env("auth_client_secret")
    }
  };
  cy.request(options)
    .then(resp => {
      return resp.body;
    })
    .then(body => {
      const { access_token, expires_in, id_token } = body;
      const auth0State = {
        nonce: "",
        state: "some-random-state"
      };
      const callbackUrl = `http://localhost:8080/callback#access_token=${access_token}&scope=openid&id_token=${id_token}&expires_in=${expires_in}&token_type=Bearer&state=${auth0State.state}`;
      cy.visit(callbackUrl, {
        onBeforeLoad(win) {
          win.localStorage.removeItem("access_token");
          win.localStorage.setItem("access_token", id_token);
        }
      });
    });
});
