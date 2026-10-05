package com.synccanvas.controller;

import com.synccanvas.model.StrokeElement;
import com.synccanvas.service.WhiteboardSessionManager;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * REST controller for canvas history retrieval.
 * Late-joining users call GET /api/rooms/{roomId}/history
 * to reconstruct the current canvas state before subscribing
 * to the STOMP topic.
 */
@RestController
@RequestMapping("/api/rooms")
public class RoomRestController {

    private final WhiteboardSessionManager sessionManager;

    public RoomRestController(WhiteboardSessionManager sessionManager) {
        this.sessionManager = sessionManager;
    }

    @GetMapping("/{roomId}/history")
    public ResponseEntity<List<StrokeElement>> getRoomHistory(
            @PathVariable String roomId) {
        List<StrokeElement> history = sessionManager.getRoomHistory(roomId);
        return ResponseEntity.ok(history);
    }

    @GetMapping
    public ResponseEntity<Set<String>> getActiveRooms() {
        return ResponseEntity.ok(sessionManager.getActiveRooms());
    }

    @DeleteMapping("/{roomId}")
    public ResponseEntity<Map<String, String>> clearRoom(
            @PathVariable String roomId) {
        sessionManager.clearRoom(roomId);
        return ResponseEntity.ok(Map.of("status", "cleared", "roomId", roomId));
    }
}
