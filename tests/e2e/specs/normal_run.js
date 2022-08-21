/// <reference types="cypress" />

import { randomIntFromInterval } from "../support/commands";

let category;
const country = "Chile";
const testClient = "demo.datacue.co";
const backend = "http://localhost:8000";

const colorArray = [
  "#FF6633",
  "#FFB399",
  "#FF33FF",
  "#FFFF99",
  "#00B3E6",
  "#E6B333",
  "#3366E6",
  "#999966",
  "#99FF99",
  "#B34D4D",
  "#80B300",
  "#809900",
  "#E6B3B3",
  "#6680B3",
  "#66991A",
  "#FF99E6",
  "#CCFF1A",
  "#FF1A66",
  "#E6331A",
  "#33FFCC",
  "#66994D",
  "#B366CC",
  "#4D8000",
  "#B33300",
  "#CC80CC",
  "#66664D",
  "#991AFF",
  "#E666FF",
  "#4DB3FF",
  "#1AB399",
  "#E666B3",
  "#33991A",
  "#CC9999",
  "#B3B31A",
  "#00E680",
  "#4D8066",
  "#809980",
  "#E6FF80",
  "#1AFF33",
  "#999933",
  "#FF3380",
  "#CCCC00",
  "#66E64D",
  "#4D80CC",
  "#9900B3",
  "#E64D66",
  "#4DB380",
  "#FF4D4D",
  "#99E6E6",
  "#6666FF"
];

const testSubject = `Subject ${Math.random()
  .toString(36)
  .replace(/[^a-z]+/g, "")
  .substr(0, 5)}`;
const testHeading = `Heading ${Math.random()
  .toString(36)
  .replace(/[^a-z]+/g, "")
  .substr(0, 5)}`;
const testMainBody = `The quick brown fox jumps over the lazy dog ${randomIntFromInterval(
  1,
  16
)}`;
const testButtonTxt = `Btn${Math.random()
  .toString(36)
  .replace(/[^a-z]+/g, "")
  .substr(0, 3)}`;
const testFooter = `Footer${Math.random()
  .toString(36)
  .replace(/[^a-z]+/g, "")
  .substr(0, 5)}`;

const randomMainColor =
  colorArray[Math.floor(Math.random() * colorArray.length)];
const randomSaleColor =
  colorArray[Math.floor(Math.random() * colorArray.length)];

const logoImage = "datacue-logo.jpg";
const coverImage = "my-banner.jpg";
const fileType = "image/jpeg";

context("Client: basic flows", () => {
  beforeEach(() => {
    cy.server();
    cy.route("GET", "/v1/banners*").as("banners");
    cy.route("GET", "/v1/summary/setup").as("settingsPanel");
    cy.route("POST", `${backend}/v1/settings`).as("savedSettings");
    cy.route("POST", `${backend}/v1/banners`).as("newBanner");
    cy.route("GET", `${backend}/v1/banners/categories`).as("bannerCategories");
    cy.route("PUT", "https://datacue-js.s3.amazonaws.com/client_assets/**").as(
      "s3Upload"
    );

    cy.login().wait(2000);
    cy.log("pick client site");

    // "Select" button is disabled before selecting a website
    cy.get('[data-id="loading:select-website-btn"]')
      .should("have.attr", "disabled", "disabled")
      .and("have.class", "is-disabled");

    // get the main table object, then select our test client row
    cy.get('[data-id="loading:select-website-table"]')
      .children()
      .contains(testClient)
      .click();

    // "Select" button is enabled
    cy.get('[data-id="loading:select-website-btn"]')
      .should("not.have.attr", "disabled", "disabled")
      .and("not.have.class", "is-disabled");
    cy.get('[data-id="loading:select-website-btn"]').click();
    cy.wait("@settingsPanel");

    // cy.log("switching to english");
    // cy.get('[data-id="footer:language-switcher-btn"]').click();
    // cy.get('[data-id="footer:language-switcher-options"]')
    //   .children()
    //   .contains("English")
    //   .click();

    cy.log("navigate to banners");
    cy.get('[data-id="sidebar"]')
      .get('a[data-id="sidebar:link-banners"]')
      .click();
    cy.wait("@banners");
  });

  it("SCENARIO 1: Banner upload", () => {
    cy.log('check for the "+ Add Banner" button');
    cy.get('[data-id="feature_page:add-banner-btn"]')
      .should("exist")
      .and("be.visible");
    cy.get('[data-id="feature_page:add-banner-btn"]')
      .parent()
      .should("have.attr", "href", "/banners/add")
      .click();

    cy.wait("@bannerCategories");
    cy.log("select a random category");
    cy.get(".el-tree-node__children")
      .parent()
      .should("have.attr", "aria-expanded", "true")
      .and("have.class", "is-expanded");
    cy.get(".el-tree-node__children")
      .children()
      .its("length")
      .then($len => {
        let randomInt = randomIntFromInterval(1, $len - 1); // random int to select a random category
        cy.get(".el-tree-node__children")
          .children()
          .eq(randomInt)
          .scrollIntoView()
          .click();
        cy.get(".el-tree-node__children")
          .children()
          .eq(randomInt)
          .invoke("text")
          .then($text => {
            $text = $text.replace(/Sales/, "");
            category = $text.split(" ")[0];
            cy.log(`Selected category: ${category}`);
          });
      });

    cy.log("upload an image in the upload box");
    cy.get('[data-id="banner-form:image-dropzone"]')
      .should("exist")
      .and("have.attr", "max-files", "1");
    cy.upload_banner("my-banner.jpg");
    cy.wait("@s3Upload");

    cy.log("Upload is successful");
    cy.get(".dz-preview")
      .should("exist")
      .and("be.visible");
    cy.get(".dz-preview")
      .should("have.class", "dz-success")
      .and("have.class", "dz-complete");

    cy.log('Click on the "+ Upload" button');
    cy.get('[data-id="banner-form:upload-btn"]')
      .should("not.have.class", "is-disabled")
      .click();
    cy.wait("@newBanner");
    cy.get("@newBanner").then(xhr => {
      expect(xhr.status).to.be.gte(200);
    });
  });

  it("SCENARIO 2: Settings", () => {
    cy.log('navigate to "Settings"');
    cy.get('[data-id="navbar:settings-btn"]')
      .should("have.attr", "href", "/settings/banners")
      .click();

    cy.log('navigate to "General" settings tab');
    cy.get("#tab-general")
      .should("exist")
      .and("not.have.attr", "aria-selected");
    cy.get("#tab-general").click();
    cy.get("#tab-general").should("have.attr", "aria-selected", "true");

    cy.log('change the country to "Chile"');
    cy.get('[data-id="general-settings:country-list"]').click();
    cy.get('[data-id="general-settings:country-list"]')
      .find("input")
      .clear()
      .type(`${country}{enter}`);
    cy.get(".el-select-dropdown__item")
      .contains(country)
      .click();

    cy.log("change currency settings: currency symbol separator");
    cy.get('[data-id="general-settings:currency-symbol-separator"]').click();
    cy.get(".el-select-dropdown__item")
      .contains("None")
      .click();

    cy.log("change currency settings: placement");
    cy.get('[data-id="general-settings:currency-symbol-placement"]').click();
    cy.get(".el-select-dropdown__item")
      .contains("Back")
      .click();

    cy.log("change currency settings: decimal places");
    cy.get('[data-id="general-settings:decimal-places"]')
      .find("input")
      .click();
    cy.get('[data-id="general-settings:decimal-places"]')
      .find("input")
      .clear()
      .type("1");

    cy.log('click "Save" button');

    cy.get('[data-id="general-settings:save-btn"]')
      .contains("Save")
      .should("exist")
      .and("be.visible");
    cy.get('[data-id="general-settings:save-btn"]').click();
    cy.wait("@savedSettings");
    cy.get("@savedSettings").then(xhr => {
      expect(xhr.status).to.be.eq(200);
      expect(xhr.statusMessage).to.be.eq("200 (OK)");
    });
    cy.wait(200)
      .get(".el-notification")
      .should("exist")
      .and("be.visible");
    cy.get(".el-notification > i").should("have.class", "el-icon-success");
  });

  it("SCENARIO 3: Logout", () => {
    cy.log("click on logout");
    cy.get('[data-id="navbar:menu-btn"]')
      .click()
      .then(() => {
        cy.get('[data-id="navbar:logout-btn"]')
          .contains("Log Out")
          .click();
      });
    cy.log("visit /banners/view");
    cy.visit("/banners/view");
    cy.log("the user is redirected to the login page");
    cy.location("pathname").should("eq", "/login");
  });
});
context("Email campaign setup", () => {
  beforeEach(() => {
    cy.server();
    cy.route("GET", `${backend}/v1/summary/setup`).as("settingsPanel");
    cy.route("GET", `${backend}/v1/products/*`).as("products");
    cy.route("GET", `${backend}/v1/campaigns/*`).as("campaigns");

    cy.login().wait(2000);

    cy.log("switching to english");
    cy.get('[data-id="footer:language-switcher-btn"]').click();
    cy.get('[data-id="footer:language-switcher-options"]')
      .children()
      .contains("English")
      .click();

    cy.get('[data-id="navbar:menu-btn"]')
      .click()
      .then(() => {
        cy.get('[data-id="navbar:switch-websites-btn"]')
          .contains("Switch website")
          .click();
      });

    cy.log("pick client site");

    // "Select" button is disabled before selecting a website
    cy.get('[data-id="loading:select-website-btn"]')
      .should("have.attr", "disabled", "disabled")
      .and("have.class", "is-disabled");

    // get the main table object, then select our test client row
    cy.get('[data-id="loading:select-website-table"]')
      .children()
      .contains(testClient)
      .click();

    // "Select" button is enabled
    cy.get('[data-id="loading:select-website-btn"]')
      .should("not.have.attr", "disabled", "disabled")
      .and("not.have.class", "is-disabled");
    cy.get('[data-id="loading:select-website-btn"]').click();
    cy.wait("@settingsPanel");

    // click on the "Email" section from the sidebar
    cy.get('[data-id="sidebar:link-email"]')
      .should("have.attr", "href", "/email")
      .click();
    cy.url()
      .should("contain", "email/view")
      .wait(2000);
  });
  it("Scenarion 1: Content", () => {
    // routing the backend requests to be able to check on their response
    cy.get('[data-id="campaigns:add-campaign-btn"]').click();
    cy.wait("@campaigns");

    cy.server();
    cy.route("PUT", `${backend}/v1/campaigns/*`).as("content");
    cy.route("PUT", "https://datacue-js.s3.amazonaws.com/client_assets/**").as(
      "s3Upload"
    );
    cy.route("POST", `${backend}/v1/uploads/**`).as("uploads");
    cy.log("Content");

    // close the notifications
    cy.get(".el-notification__closeBtn").click({ multiple: true });

    // change "Subject"
    cy.get('[data-id="editor:subject-input"]')
      .click()
      .clear()
      .type(testSubject);
    cy.wait("@content").then(response => {
      expect(response.status).to.eq(200);
    });

    // check if the preview updated accordingly
    cy.get(".preview-toolbar").scrollIntoView();
    cy.get(".preview-toolbar > header > span")
      .invoke("text")
      .should("contain", testSubject);

    // upload logo
    let uploadLogoSelector = '[data-id="editor:upload-logo-btn"] > div > input';
    cy.upload_files(uploadLogoSelector, logoImage, fileType);
    cy.wait("@uploads").then(response => {
      expect(response.status).to.eq(200);
    });
    cy.wait("@content").then(response => {
      expect(response.status).to.eq(200);
    });
    cy.wait("@s3Upload").then(response => {
      expect(response.status).to.eq(200);
    });

    // check if image uploaded
    cy.get('[data-id="editor:upload-logo-btn"] > div > div > img')
      .should("have.attr", "src")
      .and("contain", logoImage.replace(".jpg", ""));

    // change "Heading"
    cy.get('[data-id="editor:heading-input"]')
      .click()
      .clear()
      .type(testHeading);

    // check response
    // cy.wait("@content").then(response => {
    //   expect(response.status).to.eq(200);
    // });

    // upload cover
    let uploadCoverSelector =
      '[data-id="editor:upload-cover-photo"] > div > input';
    cy.upload_files(uploadCoverSelector, coverImage, fileType);
    cy.wait("@uploads").then(response => {
      expect(response.status).to.eq(200);
    });
    cy.wait("@content").then(response => {
      expect(response.status).to.eq(200);
    });
    cy.wait("@s3Upload").then(response => {
      expect(response.status).to.eq(200);
    });

    // check if image uploaded
    cy.get('[data-id="editor:upload-cover-photo"] > div > div > img')
      .should("have.attr", "src")
      .and("contain", coverImage.replace(".jpg", ""));

    // change "Main body" text
    cy.get('[data-id="editor:content-body-input"]')
      .click()
      .clear()
      .type(testMainBody);

    // check response
    // cy.wait("@content").then(response => {
    //   expect(response.status).to.eq(200);
    // });

    // change the button text
    cy.get('[data-id="editor:button-caption-btn"]')
      .click()
      .clear()
      .type(testButtonTxt);

    // check response
    // cy.wait("@content").then(response => {
    //   expect(response.status).to.eq(200);
    // });

    // change the footer text
    cy.get('[data-id="editor:content-footer-input"]')
      .click()
      .clear()
      .type(testFooter);

    // check response
    cy.wait("@content").then(response => {
      expect(response.status).to.eq(200);
    });
  });
  it("Scenario 2: Design", () => {
    // routing the backend requests to be able to check on their response
    cy.get('[data-id="campaigns:edit-btn-0"]').click();
    cy.wait("@campaigns");
    cy.wait("@products");

    cy.server();
    cy.route("PUT", `${backend}/v1/campaigns/*`).as("content");
    cy.log("Design");

    // close the notifications
    cy.get(".el-notification__closeBtn").click({ multiple: true });

    // select the design tab
    cy.get('[data-id="editor:design-tab-btn"]').click();

    // Theme
    // color picker - clear color & input random color from array
    cy.get('[data-id="editor:main-color-picker"]').click();
    cy.get(".el-color-dropdown")
      .find("input")
      .eq(1)
      .click({
        force: true
      })
      .clear()
      .type(`${randomMainColor}`);

    // cy.get(
    //   '[style="position: absolute; top: 323px; left: 1463px; transform-origin: center top; z-index: 2003;"] > .el-color-dropdown__btns > .el-color-dropdown__btn'
    // ).click();
    // cy.get('div[class^="el-color-dropdown"]:not([style="*display: none;"])')
    //   .children()
    //   .contains("OK")
    //   .click();
    cy.contains("OK").click({
      force: true
    });
    // // check response
    // cy.wait("@content").then(response => {
    //   expect(response.status).to.eq(200);
    // });

    /**
     * Logo background switch
     * we don't know the default switch position (on/off) beforehand;
     * there's also no DOM attribute reflecting its status;
     * it is a checkbox type element, so I would recommend adding a "checked" attribute when it's on;
     * we'll just check the response triggered for each of the two clicks
     * same applies for the "Heading bold" switch
     */
    // switch 1
    cy.get('[data-id="editor:logo-background-checkbox"]').click({
      force: true
    });

    // check response
    // cy.wait("@content").then(response => {
    //   expect(response.status).to.eq(200);
    // });

    // switch 2
    cy.get('[data-id="editor:logo-background-checkbox"]').click({
      force: true
    });

    // check response
    // cy.wait("@content").then(response => {
    //   expect(response.status).to.eq(200);
    // });

    // random font selection
    cy.get('[data-id="editor:main-font-select"]')
      .children()
      .its("length")
      .then($length => {
        let randomFont = randomIntFromInterval(0, $length - 1);
        cy.get('[data-id="editor:main-font-select"] > option')
          .eq(randomFont)
          .then($element => {
            cy.get('[data-id="editor:main-font-select"]').select(
              $element.val()
            );
            // extra check on the font selection input to see if the name of the font is correctly displayed
            cy.get('[data-id="editor:main-font-select"]').should(
              "contain",
              $element.text()
            );
          });
      });

    // check response
    // cy.wait("@content").then(response => {
    //   expect(response.status).to.eq(200);
    // });

    // change heading size
    let headingSizeSelectors = [
      '[data-id="editor:heading-size-medium-radio"]',
      '[data-id="editor:heading-size-large-radio"]',
      '[data-id="editor:heading-size-small-radio"]'
    ];

    for (let i in headingSizeSelectors) {
      cy.get(headingSizeSelectors[i]).click({
        force: true
      });
      // check response
      // cy.wait("@content").then(response => {
      //   expect(response.status).to.eq(200);
      // });
    }

    // on/off Heading bold switch
    cy.get('[data-id="editor:heading-bold-checkbox"]').click({
      force: true
    });

    // check response
    // cy.wait("@content").then(response => {
    //   expect(response.status).to.eq(200);
    // });

    cy.get('[data-id="editor:heading-bold-checkbox"]').click({
      force: true
    });

    // check response
    // cy.wait("@content").then(response => {
    //   expect(response.status).to.eq(200);
    // });

    // looping over selectors for the heading alignment
    let headingAlignmentSelectors = [
      '[data-id="editor:heading-align-center-radio"]',
      '[data-id="editor:heading-align-right-radio"]',
      '[data-id="editor:heading-align-justify-radio"]',
      '[data-id="editor:heading-align-left-radio"]'
    ];

    for (let i in headingAlignmentSelectors) {
      cy.get(headingAlignmentSelectors[i]).click({
        force: true
      });
      // check response
      // cy.wait("@content").then(response => {
      //   expect(response.status).to.eq(200);
      // });
    }

    // looping over selectors for the main text alignment
    let mainTextAlignmentSelectors = [
      '[data-id="editor:body-align-center-radio"]',
      '[data-id="editor:body-align-right-radio"]',
      '[data-id="editor:body-align-justify-radio"]',
      '[data-id="editor:body-align-left-radio"]'
    ];

    for (let i in mainTextAlignmentSelectors) {
      cy.get(mainTextAlignmentSelectors[i]).click({
        force: true
      });
      // check response
      // cy.wait("@content").then(response => {
      //   expect(response.status).to.eq(200);
      // });
    }

    // pick discount color & input color from array
    cy.get('[data-id="editor:discount-color-picker"]').click();

    cy.get(".el-color-dropdown")
      .find("input")
      .eq(1)
      .click({
        force: true
      })
      .clear()
      .type(`${randomSaleColor}`);
    // cy.get(
    //   '[style="position: absolute; top: 323px; left: 1463px; transform-origin: center top; z-index: 2003;"] > .el-color-dropdown__btns > .el-color-dropdown__btn'
    // ).click();
    cy.contains("OK").click({
      force: true
    });
    // check response
    cy.wait("@content").then(response => {
      expect(response.status).to.eq(200);
    });
  });
  it("Scenario 3: Settings", () => {
    // routing the backend requests to be able to check on their response
    cy.get('[data-id="campaigns:edit-btn-0"]').click();
    cy.wait("@campaigns");
    cy.wait("@products");

    cy.server();
    cy.route("PUT", `${backend}/v1/campaigns/*`).as("content");
    cy.route("GET", `${backend}/v1/campaigns/*/reach*`).as("delay");
    cy.log("Settings");

    // close the notifications
    cy.get(".el-notification__closeBtn").click({ multiple: true });

    // select the settings tab
    cy.get('[data-id="editor:settings-tab-btn"]').click();

    // input random number in the "Days since last purchase" input box
    let numberOfDays = randomIntFromInterval(1, 10);
    cy.get('[data-id="editor:rules-delay-input"]')
      .click({
        force: true
      })
      .clear()
      .type(numberOfDays);

    // check for backend responses
    cy.wait("@delay").then(response => {
      expect(response.status).to.eq(200);
    });
    cy.wait("@content").then(response => {
      expect(response.status).to.eq(200);
    });
  });
});
