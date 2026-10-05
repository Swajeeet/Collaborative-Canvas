import React, { useContext } from "react";
import cx from "classnames";
import classes from "./index.module.css";
import {
  COLORS,
  FILL_TOOL_TYPES,
  SIZE_TOOL_TYPES,
  STROKE_TOOL_TYPES,
  TOOL_ITEMS,
} from "../../constants";
import toolboxContext from "../../store/toolbox-context";
import boardContext from "../../store/board-context";

const Toolbox = () => {
  const { activeToolItem } = useContext(boardContext);
  const { toolboxState, changeStroke, changeFill, changeSize } =
    useContext(toolboxContext);

  const strokeColor = toolboxState[activeToolItem]?.stroke;
  const fillColor = toolboxState[activeToolItem]?.fill;
  const size = toolboxState[activeToolItem]?.size;

  // Don't show toolbox for eraser (no options to configure)
  if (activeToolItem === TOOL_ITEMS.ERASER) return null;

  // Only show if the active tool has configurable options
  const hasStroke = STROKE_TOOL_TYPES.includes(activeToolItem);
  const hasFill = FILL_TOOL_TYPES.includes(activeToolItem);
  const hasSize = SIZE_TOOL_TYPES.includes(activeToolItem);

  if (!hasStroke && !hasFill && !hasSize) return null;

  return (
    <div className={classes.container}>
      {hasStroke && (
        <div className={classes.selectOptionContainer}>
          <div className={classes.toolBoxLabel}>Stroke Color</div>
          <div className={classes.colorsContainer}>
            <input
              className={classes.colorPicker}
              type="color"
              value={strokeColor}
              onChange={(e) => changeStroke(activeToolItem, e.target.value)}
            />
            {Object.keys(COLORS).map((k) => (
              <div
                key={k}
                className={cx(classes.colorBox, {
                  [classes.activeColorBox]: strokeColor === COLORS[k],
                  [classes.colorBoxWhite]: COLORS[k] === "#ffffff",
                })}
                style={{ backgroundColor: COLORS[k] }}
                onClick={() => changeStroke(activeToolItem, COLORS[k])}
              />
            ))}
          </div>
        </div>
      )}

      {hasFill && (
        <div className={classes.selectOptionContainer}>
          <div className={classes.toolBoxLabel}>Fill Color</div>
          <div className={classes.colorsContainer}>
            {fillColor === null ? (
              <div
                className={cx(classes.colorPicker, classes.noFillColorBox)}
                onClick={() => changeFill(activeToolItem, COLORS.BLACK)}
              />
            ) : (
              <input
                className={classes.colorPicker}
                type="color"
                value={fillColor}   /* Fix Issue #9: was strokeColor, now fillColor */
                onChange={(e) => changeFill(activeToolItem, e.target.value)}
              />
            )}
            <div
              className={cx(classes.colorBox, classes.noFillColorBox, {
                [classes.activeColorBox]: fillColor === null,
              })}
              onClick={() => changeFill(activeToolItem, null)}
            />
            {Object.keys(COLORS).map((k) => (
              <div
                key={k}
                className={cx(classes.colorBox, {
                  [classes.activeColorBox]: fillColor === COLORS[k],
                  [classes.colorBoxWhite]: COLORS[k] === "#ffffff",
                })}
                style={{ backgroundColor: COLORS[k] }}
                onClick={() => changeFill(activeToolItem, COLORS[k])}
              />
            ))}
          </div>
        </div>
      )}

      {hasSize && (
        <div className={classes.selectOptionContainer}>
          <div className={classes.toolBoxLabel}>
            {activeToolItem === TOOL_ITEMS.TEXT ? "Font Size" : "Brush Size"}
          </div>
          <input
            type="range"
            className={classes.sizeSlider}
            min={activeToolItem === TOOL_ITEMS.TEXT ? 12 : 1}
            max={activeToolItem === TOOL_ITEMS.TEXT ? 64 : 10}
            step={1}
            value={size}
            onChange={(event) => changeSize(activeToolItem, event.target.value)}
          />
        </div>
      )}
    </div>
  );
};

export default Toolbox;
