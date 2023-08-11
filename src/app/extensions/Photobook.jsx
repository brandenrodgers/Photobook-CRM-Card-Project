import React, { useEffect, useState } from "react";
import {
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
  const [doesNotHaveProperties, setDoesNotHaveProperties] = useState(false);

  useEffect(() => {
    init();
  }, []);

  const init = () => {
    runServerless({ name: "verifyRequiredProperties" }).then(
      ({ response: hasRequiredProperties }) => {
        if (hasRequiredProperties) {
          fetchRequiredContactProperties();
        } else {
          setDoesNotHaveProperties(true);
          fetchCrmObjectProperties(["firstname"]).then(({ firstname }) => {
            setLoading(false);
            setContactName(firstname);
          });
        }
      },
    );
  };

  const fetchRequiredContactProperties = () => {
    fetchCrmObjectProperties(["firstname", "photobook_images"]).then(
      ({ firstname, photobook_images }) => {
        if (!contactName) {
          setContactName(firstname);
        }
        if (photobook_images) {
          setPhotobookImages(photobook_images.split(","));
        } else if (photobookImages.length) {
          setPhotobookImages([]);
        }
        if (loading) {
          setLoading(false);
        }
      },
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
    if (doesNotHaveProperties) {
      return (
        <ErrorState
          title="Missing required properties"
          layout="vertical"
          reverseOrder={true}
        >
          <Text>Unable to create the required properties</Text>
          <Button onClick={init}>Try again</Button>
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
      <Menu
        photobookImages={photobookImages}
        runServerless={runServerless}
        refresh={fetchRequiredContactProperties}
      />
    </>
  );
};
