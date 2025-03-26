import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const g = 9.81; // Ускорение свободного падения

const Home: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [velocity, setVelocity] = useState(30); // Начальная скорость (м/с)
  const [angle, setAngle] = useState(45); // Угол (градусы)

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 900, height = 400; // Увеличил ширину для дальности
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Очистка перед построением

    // Перевод угла в радианы
    const angleRad = (angle * Math.PI) / 180;

    // Время полета (учитываем только фазу вверх-вниз)
    const flightTime = (2 * velocity * Math.sin(angleRad)) / g;
    const dt = 0.02; // Меньший шаг для точности
    let points: [number, number][] = [];

    for (let t = 0; t <= flightTime; t += dt) {
      const x = velocity * Math.cos(angleRad) * t;
      const y = velocity * Math.sin(angleRad) * t - (0.5 * g * t * t);
      if (y >= 0) points.push([x, y]); // Добавляем только положительные координаты
    }

    // Масштабирование
    const maxX = d3.max(points, d => d[0]) || 1;
    const maxY = d3.max(points, d => d[1]) || 1;

    const xScale = d3.scaleLinear()
      .domain([0, maxX * 1.2]) // 20% запаса
      .range([50, width - 50]);

    const yScale = d3.scaleLinear()
      .domain([0, maxY * 1.2]) // 20% запаса
      .range([height - 50, 50]);

    // Линия траектории
    const line = d3.line<[number, number]>()
      .x(d => xScale(d[0]))
      .y(d => yScale(d[1]))
      .curve(d3.curveMonotoneX);

    svg.append("path")
      .datum(points)
      .attr("fill", "none")
      .attr("stroke", "blue")
      .attr("stroke-width", 2)
      .attr("d", line);

    // Оси
    svg.append("line")
      .attr("x1", 50).attr("y1", height - 50)
      .attr("x2", width - 50).attr("y2", height - 50)
      .attr("stroke", "black");

    svg.append("line")
      .attr("x1", 50).attr("y1", 50)
      .attr("x2", 50).attr("y2", height - 50)
      .attr("stroke", "black");

  }, [velocity, angle]);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <h2>Траектория движения тела</h2>
      <label>Начальная скорость (м/с):</label>
      <input
        style={{ width: 300 }}
        type="number"
        value={velocity}
        onChange={e => setVelocity(+e.target.value)}
      />
      <label>Угол (°):</label>
      <input
        style={{ width: 300 }}
        type="number"
        value={angle}
        onChange={e => setAngle(+e.target.value)}
      />

      <svg ref={svgRef} height="400" width="900" style={{ border: "1px solid black" }}></svg>
    </div>
  );
};

export default Home;
