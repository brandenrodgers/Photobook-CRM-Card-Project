import React, { useState } from "react";
import { Button, Box, Form, Image, Select } from "@hubspot/ui-extensions";

const MAX_SELECT_LABEL_LENGTH = 50;

const RemoveImageInputs = ({ photobookImages, runServerless, refresh }) => {
  const [imageToRemove, setImageToRemove] = useState(null);
  const [removeImageLoading, setRemoveImageLoading] = useState(false);
  const [removeImageError, setRemoveImageError] = useState(false);

  const handleRemoveImage = () => {
    setRemoveImageError(false);

    if (imageToRemove) {
      setRemoveImageLoading(true);
      setImageToRemove(null);
      runServerless({
        name: "updateContact",
        parameters: { imageToRemove },
        propertiesToSend: ["hs_object_id"],
      }).then(({ response }) => {
        const { success, error } = response;

        setRemoveImageLoading(false);
        if (success) {
          refresh();
        } else {
          setRemoveImageError(error);
        }
      });
    }
  };

  return (
    <>
      <Form>
        <Select
          label="Remove an image"
          description="Select an image to remove from the carousel"
          error={!!removeImageError}
          validationMessage={
            removeImageError
              ? `Failed to remove image: ${removeImageError}`
              : null
          }
          value={imageToRemove}
          onChange={(value) => {
            setImageToRemove(value);
          }}
          options={photobookImages.map((image) => ({
            label:
              image.length > MAX_SELECT_LABEL_LENGTH
                ? image.slice(0, MAX_SELECT_LABEL_LENGTH - 1) + "..."
                : image,
            value: image,
          }))}
        />
      </Form>
      {imageToRemove ? (
        <Image src={imageToRemove} alt={imageToRemove} width={75} />
      ) : null}
      <Box alignSelf="start">
        <Button
          onClick={handleRemoveImage}
          disabled={!imageToRemove || removeImageLoading}
        >
          {removeImageLoading ? "Removing" : "Remove"}
        </Button>
      </Box>
    </>
  );
};

export default RemoveImageInputs;
