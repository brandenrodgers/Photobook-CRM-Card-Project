import React, { useState } from "react";
import { Button, Box, Form, Input } from "@hubspot/ui-extensions";

const AddImageInputs = ({ runServerless, refresh }) => {
  const [imageToAdd, setImageToAdd] = useState("");
  const [addImageLoading, setAddImageLoading] = useState(false);
  const [addImageError, setAddImageError] = useState(false);

  const handleAddImage = () => {
    setAddImageError(false);

    if (imageToAdd) {
      setAddImageLoading(true);
      setImageToAdd("");
      runServerless({
        name: "updateContact",
        parameters: { imageToAdd },
        propertiesToSend: ["hs_object_id"],
      }).then(({ response }) => {
        const { success, error } = response;

        setAddImageLoading(false);
        if (success) {
          refresh();
        } else {
          setAddImageError(error);
        }
      });
    }
  };

  return (
    <>
      <Form>
        <Input
          label="Add an image"
          description="Enter an image to appear in the carousel"
          error={!!addImageError}
          validationMessage={
            addImageError ? `Failed to add image: ${addImageError}` : null
          }
          value={imageToAdd || ""}
          onInput={(value) => {
            setImageToAdd(value);
          }}
        />
      </Form>
      <Box alignSelf="start">
        <Button
          onClick={handleAddImage}
          disabled={!imageToAdd || addImageLoading}
        >
          {addImageLoading ? "Adding" : "Add"}
        </Button>
      </Box>
    </>
  );
};

export default AddImageInputs;
