package com.synccanvas.model;

import java.util.List;
import java.util.Map;

/**
 * Represents a single drawing element on the canvas.
 * Mirrors the frontend element structure for serialization.
 */
public class StrokeElement {

    private int id;
    private double x1;
    private double y1;
    private double x2;
    private double y2;
    private String type;
    private String fill;
    private String stroke;
    private int size;
    private String text;
    private List<Map<String, Double>> points;

    public StrokeElement() {}

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public double getX1() { return x1; }
    public void setX1(double x1) { this.x1 = x1; }

    public double getY1() { return y1; }
    public void setY1(double y1) { this.y1 = y1; }

    public double getX2() { return x2; }
    public void setX2(double x2) { this.x2 = x2; }

    public double getY2() { return y2; }
    public void setY2(double y2) { this.y2 = y2; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getFill() { return fill; }
    public void setFill(String fill) { this.fill = fill; }

    public String getStroke() { return stroke; }
    public void setStroke(String stroke) { this.stroke = stroke; }

    public int getSize() { return size; }
    public void setSize(int size) { this.size = size; }

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    public List<Map<String, Double>> getPoints() { return points; }
    public void setPoints(List<Map<String, Double>> points) { this.points = points; }
}
