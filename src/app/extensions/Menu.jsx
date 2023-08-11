import React, { useState } from "react";
import { Button, Flex, Link } from "@hubspot/ui-extensions";
import AddImageInputs from "./AddImageInputs";
import RemoveImageInputs from "./RemoveImageInputs";

const OPTIONS_ACTIONS = {
  add: "add",
  remove: "remove",
};

const Menu = ({ photobookImages, runServerless, refresh }) => {
  const [optionsDrawerOpen, setOptionsDrawerOpen] = useState(false);
  const [optionsAction, setOptionsAction] = useState(null);

  const toggleOptionsDrawerOpen = () => {
    setOptionsDrawerOpen(!optionsDrawerOpen);
    setOptionsAction(null);
  };

  const renderDrawerContent = () => {
    if (!optionsDrawerOpen) {
      return null;
    }
    if (optionsAction === OPTIONS_ACTIONS.add) {
      return <AddImageInputs runServerless={runServerless} refresh={refresh} />;
    }
    if (optionsAction === OPTIONS_ACTIONS.remove) {
      return (
        <RemoveImageInputs
          photobookImages={photobookImages}
          runServerless={runServerless}
          refresh={refresh}
        />
      );
    }
    return (
      <Flex justify="around">
        <Button onClick={() => setOptionsAction(OPTIONS_ACTIONS.add)}>
          Add image
        </Button>
        <Button
          disabled={!photobookImages.length}
          onClick={() => setOptionsAction(OPTIONS_ACTIONS.remove)}
        >
          Remove image
        </Button>
      </Flex>
    );
  };

  return (
    <Flex direction="column" gap="small">
      <Link onClick={toggleOptionsDrawerOpen}>
        {optionsDrawerOpen ? "Collapse options ^" : "Options"}
      </Link>
      {!!optionsAction ? (
        <Link onClick={() => setOptionsAction(null)}>{`< back`}</Link>
      ) : null}
      {renderDrawerContent()}
    </Flex>
  );
};

export default Menu;
