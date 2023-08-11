import React, { useEffect, useState } from "react";
import {
  Button,
  EmptyState,
  ErrorState,
  Flex,
  LoadingSpinner,
  Text,
  hubspot,
} from "@hubspot/ui-extensions";
import Carousel from "./Carousel";
import Menu from "./Menu";

hubspot.extend(({ runServerlessFunction, actions }) => (
  <Photobook
    runServerless={runServerlessFunction}
    fetchCrmObjectProperties={actions.fetchCrmObjectProperties}
  />
));

const Photobook = ({ runServerless, fetchCrmObjectProperties }) => {
  const [photobookImages, setPhotobookImages] = useState([]);
  const [contactName, setContactName] = useState("");
  const [loading, setLoading] = useState(true);
  const [doesNotHaveProperty, setDoesNotHaveProperty] = useState(false);

  useEffect(() => {
    fetchCrmObjectProperties(["firstname"]).then(({ firstname }) => {
      setContactName(firstname);
    });

    runServerless({ name: "verifyRequiredProperty" }).then(
      processRequiredPropertyResponse
    );
  }, []);

  const createRequiredProperty = () => {
    setLoading(true);
    runServerless({ name: "createRequiredProperty" }).then(
      processRequiredPropertyResponse
    );
  };

  const processRequiredPropertyResponse = ({
    response: hasRequiredProperty,
  }) => {
    if (hasRequiredProperty) {
      setDoesNotHaveProperty(false);
      fetchRequiredPropery();
    } else {
      setDoesNotHaveProperty(true);
      setLoading(false);
    }
  };

  const fetchRequiredPropery = () => {
    fetchCrmObjectProperties(["photobook_images"]).then(
      ({ photobook_images }) => {
        if (photobook_images) {
          setPhotobookImages(photobook_images.split(","));
        } else if (photobookImages.length) {
          setPhotobookImages([]);
        }
        setLoading(false);
      }
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Flex justify="center">
          <LoadingSpinner label="Loading Images" />
        </Flex>
      );
    }
    if (doesNotHaveProperty) {
      return (
        <ErrorState
          title="Missing required property"
          layout="vertical"
          reverseOrder={true}
        >
          <Text>
            This CRM card requires the "photobook_images" contact property
          </Text>
          <Button onClick={createRequiredProperty} variant="primary">
            Create property
          </Button>
        </ErrorState>
      );
    }
    if (!photobookImages.length) {
      return (
        <EmptyState
          title="No photos to display"
          layout="vertical"
          reverseOrder={true}
        >
          <Text>Use the options menu to add photos for {contactName}</Text>
        </EmptyState>
      );
    }
    return <Carousel photobookImages={photobookImages} />;
  };

  return (
    <>
      <Flex justify="center">
        <Text format={{ fontWeight: "bold" }}>
          Photobook for{contactName ? ` ${contactName}` : "..."}
        </Text>
      </Flex>
      {renderContent()}
      {doesNotHaveProperty ? null : (
        <Menu
          photobookImages={photobookImages}
          runServerless={runServerless}
          refresh={fetchRequiredPropery}
        />
      )}
    </>
  );
};
