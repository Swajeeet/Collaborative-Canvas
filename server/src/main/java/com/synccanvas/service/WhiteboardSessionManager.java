package com.synccanvas.service;

import com.synccanvas.model.StrokeElement;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * In-memory session manager that caches room strokes.
 * Each room maintains an ordered list of stroke elements so
 * late-joining users can reconstruct the current canvas state.
 */
@Service
public class WhiteboardSessionManager {

    private final Map<String, List<StrokeElement>> rooms = new ConcurrentHashMap<>();

    /**
     * Add a stroke element to a room's history.
     */
    public void addStroke(String roomId, StrokeElement element) {
        rooms.computeIfAbsent(roomId, k -> new CopyOnWriteArrayList<>()).add(element);
    }

    /**
     * Remove a stroke element from a room by its id.
     */
    public void removeStroke(String roomId, int elementId) {
        List<StrokeElement> elements = rooms.get(roomId);
        if (elements != null) {
            elements.removeIf(e -> e.getId() == elementId);
        }
    }

    /**
     * Get all stroke elements for a room (for late-joining users).
     */
    public List<StrokeElement> getRoomHistory(String roomId) {
        return rooms.getOrDefault(roomId, List.of());
    }

    /**
     * Clear all strokes in a room.
     */
    public void clearRoom(String roomId) {
        rooms.remove(roomId);
    }

    /**
     * Get all active room IDs.
     */
    public java.util.Set<String> getActiveRooms() {
        return rooms.keySet();
    }
}
