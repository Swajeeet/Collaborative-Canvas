import { useEffect, useRef, useCallback, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client/dist/sockjs";

const ROOM_ID = "default";

/**
 * Custom hook for STOMP WebSocket connection to Spring Boot backend.
 * Handles connection lifecycle, subscribing to room topics,
 * and publishing draw messages.
 */
export const useStompClient = (onMessageReceived) => {
  const clientRef = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const stompClient = new Client({
      webSocketFactory: () => new SockJS("/ws-whiteboard"),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: () => {}, // silence debug logs
      onConnect: () => {
        setConnected(true);
        stompClient.subscribe(`/topic/room/${ROOM_ID}`, (message) => {
          if (message.body) {
            const data = JSON.parse(message.body);
            onMessageReceived?.(data);
          }
        });
      },
      onDisconnect: () => {
        setConnected(false);
      },
      onStompError: (frame) => {
        console.error("STOMP error:", frame.headers?.message);
        setConnected(false);
      },
    });

    stompClient.activate();
    clientRef.current = stompClient;

    return () => {
      if (stompClient.active) {
        stompClient.deactivate();
      }
    };
  }, [onMessageReceived]);

  const publishDraw = useCallback((action, element) => {
    if (clientRef.current?.active) {
      clientRef.current.publish({
        destination: `/app/whiteboard/${ROOM_ID}/draw`,
        body: JSON.stringify({
          action,
          element,
          senderId: clientRef.current.connectedVersion || "anonymous",
        }),
      });
    }
  }, []);

  return { connected, publishDraw };
};

/**
 * Fetch the room history from the REST API for late-joining users.
 */
export const fetchRoomHistory = async () => {
  try {
    const response = await fetch(`/api/rooms/${ROOM_ID}/history`);
    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    console.warn("Could not fetch room history:", err);
  }
  return [];
};
