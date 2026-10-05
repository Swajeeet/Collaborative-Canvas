package com.synccanvas.model;

/**
 * Wrapper for drawing messages sent via WebSocket.
 * Contains the action type and the element payload.
 */
public class DrawMessage {

    private String action; // "draw", "erase", "clear", "undo", "redo"
    private StrokeElement element;
    private String senderId;

    public DrawMessage() {}

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public StrokeElement getElement() { return element; }
    public void setElement(StrokeElement element) { this.element = element; }

    public String getSenderId() { return senderId; }
    public void setSenderId(String senderId) { this.senderId = senderId; }
}
