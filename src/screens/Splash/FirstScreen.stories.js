/**
 *
 * This file was generated with Adobe XD React Exporter
 * Exporter for Adobe XD is written by: Johannes Pichler <j.pichler@webpixels.at>
 *
 **/

import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import FirstScreen from "./FirstScreen";

export const myProps = {
  id: "1",
  className: "mySampleClass",
  sampleString: "Test Task",
  sampleDate: new Date(2018, 0, 1, 9, 0)
};

export const actions = {
  onActionOne: action("onActionOne"),
  onActionTwo: action("onActionTwo")
};

storiesOf("FirstScreen", module)
  .add("default", () => <FirstScreen {...myProps} {...actions} />)
  .add("pinned", () => <FirstScreen {...myProps} pinned={true} {...actions} />)
  .add("archived", () => <FirstScreen {...myProps} archived={true} {...actions} />);
