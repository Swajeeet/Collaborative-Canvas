import { useContext, useEffect, useLayoutEffect, useRef, useState, useCallback } from "react";
import rough from "roughjs";
import boardContext from "../../store/board-context";
import { TOOL_ACTION_TYPES, TOOL_ITEMS } from "../../constants";
import toolboxContext from "../../store/toolbox-context";
import { useStompClient, fetchRoomHistory } from "../../utils/stompClient";
import { getSvgPathFromStroke } from "../../utils/element";
import getStroke from "perfect-freehand";
import classes from "./index.module.css";

function Board() {
  const canvasRef = useRef();
  const textAreaRef = useRef();
  const [hasDrawn, setHasDrawn] = useState(false);

  const {
    elements,
    toolActionType,
    boardMouseDownHandler,
    boardMouseMoveHandler,
    boardMouseUpHandler,
    textAreaBlurHandler,
    undo,
    redo,
  } = useContext(boardContext);
  const { toolboxState } = useContext(toolboxContext);

  // STOMP real-time connection (Phase 5)
  const onMessageReceived = useCallback((data) => {
    // Future: dispatch incoming remote draw events to the board reducer
    // For now, log received messages for debugging
    if (data && data.action) {
      console.log("[CollaborativeCanvas] Received:", data.action);
    }
  }, []);

  const { connected, publishDraw } = useStompClient(onMessageReceived);

  // Fix Issue #3: Responsive canvas — resize on mount AND on window resize
  useEffect(() => {
    const canvas = canvasRef.current;
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.ctrlKey && event.key === "z") {
        undo();
      } else if (event.ctrlKey && event.key === "y") {
        redo();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  // Render elements to canvas
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.save();

    const roughCanvas = rough.canvas(canvas);

    elements.forEach((element) => {
      switch (element.type) {
        case TOOL_ITEMS.LINE:
        case TOOL_ITEMS.RECTANGLE:
        case TOOL_ITEMS.CIRCLE:
        case TOOL_ITEMS.ARROW:
          roughCanvas.draw(element.roughEle);
          break;
        case TOOL_ITEMS.BRUSH:
          context.fillStyle = element.stroke;
          context.fill(element.path);
          context.restore();
          break;
        case TOOL_ITEMS.TEXT:
          context.textBaseline = "top";
          context.font = `${element.size}px Caveat`;
          context.fillStyle = element.stroke;
          context.fillText(element.text, element.x1, element.y1);
          context.restore();
          break;
        default:
          throw new Error("Type not recognized");
      }
    });

    return () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [elements]);

  // Focus textarea when entering text mode
  useEffect(() => {
    const textarea = textAreaRef.current;
    if (toolActionType === TOOL_ACTION_TYPES.WRITING) {
      setTimeout(() => {
        textarea.focus();
      }, 0);
    }
  }, [toolActionType]);

  // Track if user has drawn anything (for empty state)
  useEffect(() => {
    if (elements.length > 0 && !hasDrawn) {
      setHasDrawn(true);
    }
  }, [elements, hasDrawn]);

  const handleMouseDown = (event) => {
    boardMouseDownHandler(event, toolboxState);
  };

  const handleMouseMove = (event) => {
    boardMouseMoveHandler(event);
  };

  const handleMouseUp = () => {
    boardMouseUpHandler();
    // Publish completed stroke via STOMP
    if (elements.length > 0) {
      const lastElement = elements[elements.length - 1];
      publishDraw("draw", {
        id: lastElement.id,
        x1: lastElement.x1,
        y1: lastElement.y1,
        x2: lastElement.x2,
        y2: lastElement.y2,
        type: lastElement.type,
        stroke: lastElement.stroke,
        fill: lastElement.fill,
        size: lastElement.size,
        text: lastElement.text,
        points: lastElement.points,
      });
    }
  };

  return (
    <>
      {/* Empty state banner — disappears after first stroke (Issue #14) */}
      {!hasDrawn && (
        <div className={classes.emptyState}>
          <div className={classes.emptyStateIcon}>✏️</div>
          <div className={classes.emptyStateTitle}>Start Drawing</div>
          <div className={classes.emptyStateHint}>
            Pick a tool from the toolbar and draw on the canvas
          </div>
        </div>
      )}

      {/* Text input overlay */}
      {toolActionType === TOOL_ACTION_TYPES.WRITING && (
        <textarea
          type="text"
          ref={textAreaRef}
          className={classes.textElementBox}
          style={{
            top: elements[elements.length - 1].y1,
            left: elements[elements.length - 1].x1,
            fontSize: `${elements[elements.length - 1]?.size}px`,
            color: elements[elements.length - 1]?.stroke,
          }}
          onBlur={(event) => textAreaBlurHandler(event.target.value)}
        />
      )}

      {/* Canvas — Fix Issue #2: use classes.canvas instead of plain string */}
      <canvas
        ref={canvasRef}
        id="canvas"
        className={classes.canvas}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />

      {/* Connection status badge */}
      <div className={`${classes.connectionBadge} ${connected ? classes.connected : classes.disconnected}`}>
        <span className={`${classes.statusDot} ${connected ? classes.statusDotConnected : classes.statusDotDisconnected}`} />
        {connected ? "Live" : "Offline"}
      </div>
    </>
  );
}

export default Board;
