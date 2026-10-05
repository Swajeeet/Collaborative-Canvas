package com.synccanvas.controller;

import com.synccanvas.model.DrawMessage;
import com.synccanvas.service.WhiteboardSessionManager;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

/**
 * STOMP controller handling real-time drawing messages.
 * Clients publish to /app/whiteboard/{roomId}/draw
 * and receive broadcasts on /topic/room/{roomId}.
 */
@Controller
public class CanvasSocketController {

    private final WhiteboardSessionManager sessionManager;

    public CanvasSocketController(WhiteboardSessionManager sessionManager) {
        this.sessionManager = sessionManager;
    }

    @MessageMapping("/whiteboard/{roomId}/draw")
    @SendTo("/topic/room/{roomId}")
    public DrawMessage handleDraw(
            @DestinationVariable String roomId,
            DrawMessage message) {

        switch (message.getAction()) {
            case "draw":
                if (message.getElement() != null) {
                    sessionManager.addStroke(roomId, message.getElement());
                }
                break;
            case "erase":
                if (message.getElement() != null) {
                    sessionManager.removeStroke(roomId, message.getElement().getId());
                }
                break;
            case "clear":
                sessionManager.clearRoom(roomId);
                break;
            default:
                break;
        }

        return message;
    }
}
