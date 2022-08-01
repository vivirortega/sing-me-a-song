/* eslint-disable no-undef */
/// <reference types="cypress" />
import { faker } from "@faker-js/faker";

const url = "http://localhost:3000";
const recommendation = {
  name: "mitski - glide",
  youtubeLink: "https://www.youtube.com/watch?v=EG9t7Wsc9YU",
};

describe("post/recommendation", () => {
  it("should post a recommendation", () => {
    cy.visit(`${url}/`);
    cy.get("#name").type(recommendation.name);
    cy.get("#youtube-link").type(recommendation.youtubeLink);
    cy.get("#submit").click();
    cy.contains(`${recommendation.name}`).should("be.visible");
    cy.end();
  });

  it('should return alert when name is already created', () => {
    cy.visit(`${url}/`);
    cy.get("#name").type(recommendation.name);
    cy.get("#youtube-link").type(recommendation.youtubeLink);
    cy.get("#submit").click();
    cy.on('window:alert', (text) => {
      expect(text).to.contains('Error creating recommendation!');
    });
    cy.end();
  });
});



