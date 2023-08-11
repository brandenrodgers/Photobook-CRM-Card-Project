# HubSpot Photobook CRM Card Project

This project will create a photobook CRM card that will show on your contacts page. It utilizes the custom contact property "photobook_images". The card will automatically generate this contact property for you if it does not already exist in your HubSpot account.

**Card Features:**
- Rotating carousel of images that are associated with a specific contact
- Add new images to the carousel
- Remove images from the carousel

## Requirements
There are a few things that must be set up before you can make use of this getting started project.
- You must have an active HubSpot account.
- You must have the [HubSpot CLI](https://www.npmjs.com/package/@hubspot/cli) installed and set up.
- You must have access to developer projects (developer projects are currently [in public beta under "CRM Development Tools"](https://app.hubspot.com/l/whats-new/betas)).

## To Install
Installation should be simple! Just run `hs project upload` somewhere within the project directory.

## To Develop Locally
1. Run `npm install` in the root directory of the project
2. Run `hs project dev`
