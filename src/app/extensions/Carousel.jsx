import React, { useEffect, useState, useRef } from "react";
import { Box, Divider, Flex, Image, ProgressBar } from "@hubspot/ui-extensions";

const Carousel = ({ photobookImages }) => {
  const [imageOrder, setImageOrder] = useState(photobookImages);
  const [rotationCounter, setRotationCounter] = useState(0);
  const interval = useRef();

  useEffect(() => {
    if (interval.current) {
      clearInterval(interval.current);
    }

    if (photobookImages.length !== imageOrder.length) {
      setImageOrder(photobookImages);
    }

    interval.current = setInterval(() => {
      if (rotationCounter >= 100) {
        setRotationCounter(0);
        setImageOrder([
          ...imageOrder.slice(1, imageOrder.length),
          imageOrder[0],
        ]);
      } else {
        setRotationCounter(rotationCounter + 5);
      }
    }, 500);

    return () => clearInterval(interval.current);
  }, [photobookImages, rotationCounter]);

  return (
    <Flex direction="column" gap="medium">
      <Divider distance="flush" />
      <Flex direction="column">
        <Flex direction="row" justify="center" align="center">
          {imageOrder.slice(0, 3).map((imageUrl, i) => {
            return (
              <Box flex={i === 1 ? 2 : 1}>
                <Image src={imageUrl} alt={imageUrl} />
              </Box>
            );
          })}
        </Flex>
        {imageOrder.length > 1 ? (
          <ProgressBar
            variant="success"
            value={rotationCounter}
            showPercentage={false}
          />
        ) : null}
        <Divider distance="flush" />
      </Flex>
    </Flex>
  );
};

export default Carousel;
