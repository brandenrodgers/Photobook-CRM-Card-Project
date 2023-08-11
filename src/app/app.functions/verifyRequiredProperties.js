const axios = require('axios');

exports.main = async (context = {}, sendResponse) => {
  const { PRIVATE_APP_ACCESS_TOKEN } = context.secrets;

  const PHOTOBOOK_IMAGES_PROPERTY = 'photobook_images';

  try {
    let hasPhotobookImagesProperty = false;

    const { data } = await fetchContactProperties(PRIVATE_APP_ACCESS_TOKEN);

    if (data) {
      hasPhotobookImagesProperty = data.find(
        ({ name }) => name === PHOTOBOOK_IMAGES_PROPERTY
      );
    }

    if (!hasPhotobookImagesProperty) {
      await createContactProperty(PRIVATE_APP_ACCESS_TOKEN, {
        name: PHOTOBOOK_IMAGES_PROPERTY,
        label: 'Photobook Images',
        description:
          'Photobook images that will show in your Photobook CRM card',
        groupName: 'contactinformation',
        type: 'string',
        fieldType: 'text',
      });
    }

    sendResponse(true);
  } catch (error) {
    sendResponse(false);
  }
};

// Function to fetch contact properties from HubSpot
const fetchContactProperties = token => {
  return axios.get('https://api.hubapi.com/properties/v1/contacts/properties', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
};

// Function to create a new contact property in HubSpot
const createContactProperty = (token, property = {}) => {
  return axios.post(
    'https://api.hubapi.com/properties/v1/contacts/properties',
    property,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
