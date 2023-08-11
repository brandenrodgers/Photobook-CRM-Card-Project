const axios = require('axios');

exports.main = async (context = {}, sendResponse) => {
  const { PRIVATE_APP_ACCESS_TOKEN } = context.secrets;
  const { hs_object_id } = context.propertiesToSend;
  const { imageToAdd, imageToRemove } = context.parameters;

  const PHOTOBOOK_IMAGES_PROPERTY = 'photobook_images';

  let currentPhotobookImages = '';

  try {
    const { data } = await fetchPropertyForContact(
      PRIVATE_APP_ACCESS_TOKEN,
      hs_object_id,
      PHOTOBOOK_IMAGES_PROPERTY
    );

    if (data && data.properties && data.properties.photobook_images) {
      currentPhotobookImages = data.properties.photobook_images.value || '';
    }
  } catch (error) {
    console.log(error);
  }

  let newPhotobookImages;

  if (imageToAdd) {
    newPhotobookImages = handleAddImage(currentPhotobookImages, imageToAdd);
  } else if (imageToRemove) {
    newPhotobookImages = handleRemoveImage(
      currentPhotobookImages,
      imageToRemove
    );
  } else {
    sendResponse(false);
  }

  try {
    const updatedProperty = {
      property: PHOTOBOOK_IMAGES_PROPERTY,
      value: newPhotobookImages,
    };
    await updatePropertyForContact(
      PRIVATE_APP_ACCESS_TOKEN,
      hs_object_id,
      updatedProperty
    );
  } catch (error) {
    console.log(error);
    sendResponse(false);
  }

  sendResponse(true);
};

const handleAddImage = (currentPhotobookImages, imageToAdd) => {
  const newPhotobookImages = currentPhotobookImages
    ? `${currentPhotobookImages},${imageToAdd}`
    : imageToAdd;

  return newPhotobookImages;
};

const handleRemoveImage = (currentPhotobookImages, imageToRemove) => {
  let index;

  // Attempt to avoid issues where images have overlapping urls
  index = currentPhotobookImages.indexOf(`${imageToRemove},`);

  if (index < 0) {
    index = currentPhotobookImages.indexOf(imageToRemove);
  }

  let newPhotobookImages = currentPhotobookImages;

  if (index === 0) {
    newPhotobookImages = currentPhotobookImages.slice(imageToRemove.length + 1);
  } else {
    newPhotobookImages =
      currentPhotobookImages.slice(0, index - 1) +
      currentPhotobookImages.slice(index + imageToRemove.length);
  }

  return newPhotobookImages;
};

// Function to fetch contact properties from HubSpot
const fetchPropertyForContact = (token, id, property) => {
  return axios.get(
    `https://api.hubapi.com/contacts/v1/contact/vid/${id}/profile?property=${property}`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// Function to create a new contact property in HubSpot
const updatePropertyForContact = (token, id, property) => {
  return axios.post(
    `https://api.hubapi.com/contacts/v1/contact/vid/${id}/profile`,
    { properties: [property] },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
