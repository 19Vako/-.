import React, { useRef, useState, useEffect } from "react";
import * as d3 from "d3";

export default function Home() {
  const svgRef = useRef<SVGSVGElement>(null);
  const width = 600;
  const height = 400;
  const gridSize = 50;
  
  const centerX = width / 2;
  const centerY = height / 2;

  const [x0, setX0] = useState(0);
  const [y0, setY0] = useState(0);
  const [angle, setAngle] = useState(45);
  const [velocity, setVelocity] = useState(50);
  const [acceleration, setAcceleration] = useState(1);
  const [color, setColor] = useState("red");

  useEffect(() => {
    drawGrid();
  }, []);

  const drawGrid = () => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    for (let x = 0; x <= width; x += gridSize) {
      svg.append("line")
        .attr("x1", x).attr("y1", 0)
        .attr("x2", x).attr("y2", height)
        .attr("stroke", "lightgreen")
        .attr("stroke-width", 1);
    }

    for (let y = 0; y <= height; y += gridSize) {
      svg.append("line")
        .attr("x1", 0).attr("y1", y)
        .attr("x2", width).attr("y2", y)
        .attr("stroke", "lightgreen")
        .attr("stroke-width", 1);
    }

    svg.append("line")
      .attr("x1", 0).attr("y1", centerY)
      .attr("x2", width).attr("y2", centerY)
      .attr("stroke", "black")
      .attr("stroke-width", 3);

    svg.append("line")
      .attr("x1", centerX).attr("y1", 0)
      .attr("x2", centerX).attr("y2", height)
      .attr("stroke", "black")
      .attr("stroke-width", 3);
  };

  const drawTrajectory = () => {
    const svg = d3.select(svgRef.current);

    const radianAngle = (angle * Math.PI) / 180;
    let t = 0;
    let x = x0;
    let y = y0;
    const points: [number, number][] = [];

    while (y >= -centerY && x <= centerX) {
      x = x0 + velocity * Math.cos(radianAngle) * t;
      y = y0 - (velocity * Math.sin(radianAngle) * t - 0.5 * acceleration * t * t);
      if (y < -centerY || x > centerX) break;
      points.push([centerX + x, centerY - y]);
      t += 0.1;
    }

    const line = d3.line<[number, number]>()
      .x((d) => d[0])
      .y((d) => d[1]);

    svg.append("path")
      .datum(points)
      .attr("fill", "none")
      .attr("stroke", color)
      .attr("stroke-width", 2)
      .attr("d", line);
  };

  const clearCanvas = () => {
    drawGrid();
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <svg ref={svgRef} width={width} height={height} style={{ border: "1px solid black" }} />
      <div style={{ marginLeft: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
        <label>Початкова X: <input type="number" value={x0} onChange={(e) => setX0(+e.target.value)} /></label>
        <label>Початкова Y: <input type="number" value={y0} onChange={(e) => setY0(+e.target.value)} /></label>
        <label>Кут (градуси): <input type="number" value={angle} onChange={(e) => setAngle(+e.target.value)} /></label>
        <label>Швидкість: <input type="number" value={velocity} onChange={(e) => setVelocity(+e.target.value)} /></label>
        <label>Прискорення: <input type="number" value={acceleration} onChange={(e) => setAcceleration(+e.target.value)} /></label>
        <label>Колір: <input type="color" value={color} onChange={(e) => setColor(e.target.value)} /></label>
        <button onClick={drawTrajectory}>Додати траєкторію</button>
        <button onClick={clearCanvas}>Очистити графік</button>
      </div>
    </div>
  );
}
