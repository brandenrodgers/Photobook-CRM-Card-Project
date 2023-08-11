const axios = require("axios");

exports.main = async (context = {}, sendResponse) => {
  const { PRIVATE_APP_ACCESS_TOKEN } = context.secrets;

  const PHOTOBOOK_IMAGES_PROPERTY = "photobook_images";

  let hasPhotobookImagesProperty = false;

  try {
    const { data } = await fetchContactProperties(PRIVATE_APP_ACCESS_TOKEN);

    if (data) {
      hasPhotobookImagesProperty = data.some(
        ({ name }) => name === PHOTOBOOK_IMAGES_PROPERTY
      );
    }

    sendResponse(hasPhotobookImagesProperty);
  } catch (error) {
    sendResponse(false);
  }
};

// Function to fetch contact properties from HubSpot
const fetchContactProperties = (token) => {
  return axios.get("https://api.hubapi.com/properties/v1/contacts/properties", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};
