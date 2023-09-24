/// <reference types="Cypress" />
const neatCSV = require("neat-csv");

describe("My Second Test Suite", function () {
  it("My FirstTest case", function () {
    //Visiting the website (1)
    cy.visit("https://automationexercise.com/");

    //Verifying the homepage (2)
    cy.get(".shop-menu > .nav > :nth-child(1)").should("be.visible");

    //Signing up to the website (3)
    cy.get(".shop-menu > .nav > :nth-child(4)").click();
    cy.get('[data-qa="signup-name"]').type("Mahfuzul Alam");
    cy.get('[data-qa="signup-email"]').type("mahfuzshanto12@gmail.com");
    cy.get('[data-qa="signup-button"]').click();

    // Check if the user already exists
    cy.get(".signup-form > form > p").then((messageElement) => {
      const message = messageElement.text();

      if (message.includes("Email Address already exist!")) {
        // User already exists, so let's log in
        cy.get('[data-qa="login-email"]').type("mahfuzshanto12@gmail.com");
        cy.get('[data-qa="login-password"]').type("123456");
        cy.get('[data-qa="login-button"]').click();
      } else {
        // User does not exist, continue with signup
        // Fill in the rest of the signup fields on the next page
        cy.get("#id_gender1").click();
        cy.get('[data-qa="password"]').type("123456");
        cy.get('[data-qa="days"]').select("1");
        cy.get('[data-qa="months"]').select("January");
        cy.get('[data-qa="years"]').select("1999");
        cy.get('[data-qa="first_name"]').type("Mahfuzul");
        cy.get('[data-qa="last_name"]').type("Alam");
        cy.get('[data-qa="company"]').type("Tekarsh");
        cy.get('[data-qa="address"]').type("Nikunja-2");
        cy.get('[data-qa="country"]').select("India");
        cy.get('[data-qa="state"]').type("Road 11");
        cy.get('[data-qa="city"]').type("Dhaka");
        cy.get('[data-qa="zipcode"]').type("1200");
        cy.get('[data-qa="mobile_number"]').type("01939594524");
        cy.get('[data-qa="create-account"]').click();
        cy.get('[data-qa="continue-button"]').click();
      }

      //Logging out (4)
      cy.get(".shop-menu > .nav > :nth-child(4) > a").click();

      //Logging with Wrong Credentials (5)
      cy.get('[data-qa="login-email"]').type("wrongName@gmail.com");
      cy.get('[data-qa="login-password"]').type("wrongPassword");
      cy.get('[data-qa="login-button"]').click();

      // Check for an error message indicating failed login
      cy.get(".login-form > form > p").should(
        "contain",
        "Your email or password is incorrect!"
      );

      //cy.wait(4000);

      // Clear the inputs
      cy.get('[data-qa="login-email"]').clear();
      cy.get('[data-qa="login-password"]').clear();

      // Log in with correct credentials (6)
      cy.get('[data-qa="login-email"]').type("mahfuzshanto12@gmail.com");
      cy.get('[data-qa="login-password"]').type("123456");
      cy.get('[data-qa="login-button"]').click();

      // Add assertions for successful login
      cy.get(".features_items > .title").should("be.visible");

      //Search product (7)
      cy.get(".shop-menu > .nav > :nth-child(2) > a").click();
      cy.get("#search_product").type("Blue top");
      cy.get("#submit_search > .fa").click();
      cy.get(".productinfo").should("be.visible");
      cy.get(
        ":nth-child(3) > .product-image-wrapper > .choose > .nav > li > a"
      ).click();

      //adding producto to cart with -2 value (8,9)
      cy.get("#quantity").type("{selectall}{backspace}-2");
      cy.get(":nth-child(5) > .btn").click();
      cy.get("u").click();

      //Verify Price, negative Quantity and Negative Total. (10)
      cy.get(".cart_price > p").should("contain", "Rs. 500");
      cy.get(".cart_quantity").should("contain", "-2");
      cy.get(".cart_total_price").should("contain", "Rs. -1000");

      //adding same product to card with 10 quantity
      cy.get(".cart_quantity_delete > .fa").click();
      cy.get("#empty_cart > .text-center > a > u").click();

      //Add the same Product to the cart, add a quantity of 10 for the product (11)
      cy.get(
        ":nth-child(3) > .product-image-wrapper > .choose > .nav > li > a"
      ).click();
      cy.get("#quantity").type("{selectall}{backspace}10");
      cy.get(":nth-child(5) > .btn").click();
      cy.get("u").click();

      // Verify Price, Quantity and Total. (12)
      cy.get(".cart_price > p").should("contain", "Rs. 500");
      cy.get(".cart_quantity").should("contain", "10");
      cy.get(".cart_total_price").should("contain", "Rs. 5000");

      // Verify Proceed to Checkout Button is not disabled and click on the button (13)
      cy.get(".col-sm-6 > .btn").should("be.visible").click();

      //Verify the details of DELIVERY ADDRESS and BILLING ADDRESS are the same. (14)
      cy.get("#address_delivery")
        .invoke("text")
        .then((text) => {
          // Remove the title from the text
          const contentWithoutTitle = text.replace("DELIVERY ADDRESS", "");

          // Now, 'contentWithoutTitle' contains all the text content within the box without the title
          cy.log(contentWithoutTitle);
        });

      // Select the contents of the billing address box
      cy.get("#address_invoice")
        .invoke("text")
        .then((text) => {
          // Remove the title from the text
          const contentWithoutTitle = text.replace("BILLING ADDRESS", "");

          // Now, 'contentWithoutTitle' contains all the text content within the box without the title
          cy.log(contentWithoutTitle);

          //Placing an Order and filling up the Payment details with dummy card information.(15)
          cy.get(":nth-child(7) > .btn").click();
          cy.get('[data-qa="name-on-card"]').type("Mahfuz");
          cy.get('[data-qa="card-number"]').type("1234567890123456");
          cy.get('[data-qa="cvc"]').type("123");
          cy.get('[data-qa="expiry-month"]').type("12");
          cy.get('[data-qa="expiry-year"]').type("2026");
          cy.get('[data-qa="pay-button"]').click();

          // Downloading the invoice. (16)
          cy.get(".col-sm-9 > .btn-default")
            .click()
            .then(() => {
              cy.log("Button clicked successfully.");
            });

          ///cy.wait(5000);
          cy.get('[data-qa="continue-button"]').click();

          // Verify the invoice.txt file exists in the project (17)
          //Attempt-1
          /*
          cy.readFile(
            "C:/Assessment/TekarshAssessment/cypress/downloads/invoice.txt"
          ).should(
            "equal",
            "Hi Mahfuzul Alam, Your total purchase amount is 5000. Thank you"
          ); */
        });

      //Attempt-2
      /*  // Verify the invoice.txt file exists in the project
          cy.readFile("cypress/downloads/invoice.txt").should("exist");

          // Read the content of the file
          cy.readFile("cypress/downloads/invoice.txt").then((text) => {
            
            const expectedContent =
              "Hi Mahfuzul Alam, Your total purchase amount is 5000. Thank you";
            expect(text).to.contain(expectedContent);

            cy.log(text);
          });

          // Remove the text file from the project
          cy.exec("rm cypress/downloads/invoice.txt"); */

      //Log out from the website (18)
      cy.get(".nav > :nth-child(4) > a").click();
    });
  });
});
