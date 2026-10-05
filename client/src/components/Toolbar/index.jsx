import React, { useContext } from "react";
import cx from "classnames";
import {
  FaSlash,
  FaRegCircle,
  FaArrowRight,
  FaPaintBrush,
  FaEraser,
  FaUndoAlt,
  FaRedoAlt,
  FaFont,
  FaDownload,
} from "react-icons/fa";
import { LuRectangleHorizontal } from "react-icons/lu";
import { TOOL_ITEMS } from "../../constants";
import boardContext from "../../store/board-context";
import classes from "./index.module.css";

const ToolBar = () => {
  const { activeToolItem, changeToolHandler, undo, redo } =
    useContext(boardContext);

  /**
   * Fix Issue #15: Draw a white background before exporting
   * so the downloaded PNG isn't transparent.
   */
  const handleDownloadClick = () => {
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");

    // Create a temporary canvas with white background
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext("2d");

    // Fill white background
    tempCtx.fillStyle = "#ffffff";
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    // Draw the original canvas content on top
    tempCtx.drawImage(canvas, 0, 0);

    const data = tempCanvas.toDataURL("image/png");
    const anchor = document.createElement("a");
    anchor.href = data;
    anchor.download = "collaborative-canvas-board.png";
    anchor.click();
  };

  const tools = [
    { id: TOOL_ITEMS.BRUSH, icon: <FaPaintBrush />, title: "Brush" },
    { id: TOOL_ITEMS.LINE, icon: <FaSlash />, title: "Line" },
    { id: TOOL_ITEMS.RECTANGLE, icon: <LuRectangleHorizontal />, title: "Rectangle" },
    { id: TOOL_ITEMS.CIRCLE, icon: <FaRegCircle />, title: "Circle" },
    { id: TOOL_ITEMS.ARROW, icon: <FaArrowRight />, title: "Arrow" },
    { id: "divider1", divider: true },
    { id: TOOL_ITEMS.ERASER, icon: <FaEraser />, title: "Eraser" },
    { id: TOOL_ITEMS.TEXT, icon: <FaFont />, title: "Text" },
    { id: "divider2", divider: true },
    { id: "undo", icon: <FaUndoAlt />, title: "Undo (Ctrl+Z)", action: undo },
    { id: "redo", icon: <FaRedoAlt />, title: "Redo (Ctrl+Y)", action: redo },
    { id: "divider3", divider: true },
    { id: "download", icon: <FaDownload />, title: "Download", action: handleDownloadClick },
  ];

  return (
    <div className={classes.container}>
      {tools.map((tool) => {
        if (tool.divider) {
          return <div key={tool.id} className={classes.divider} />;
        }
        return (
          <div
            key={tool.id}
            className={cx(classes.toolItem, {
              [classes.active]: activeToolItem === tool.id,
            })}
            onClick={tool.action || (() => changeToolHandler(tool.id))}
            title={tool.title}
          >
            {tool.icon}
          </div>
        );
      })}
    </div>
  );
};

export default ToolBar;
