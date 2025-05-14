import React, { useEffect, useState } from 'react';

const weights = [2, 3, 4, 7, 6, 7, 2, 5, 5, 6];
const values = [14, 3, 14, 11, 4, 12, 9, 11, 9, 15];
const capacity = 17;
const n = weights.length;

const App: React.FC = () => {
  const [dpTable, setDpTable] = useState<number[][]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  useEffect(() => {
    const dp: number[][] = Array(n + 1)
      .fill(0)
      .map(() => Array(capacity + 1).fill(0));

    for (let i = 1; i <= n; i++) {
      for (let w = 0; w <= capacity; w++) {
        if (weights[i - 1] > w) {
          dp[i][w] = dp[i - 1][w];
        } else {
          dp[i][w] = Math.max(
            dp[i - 1][w],
            dp[i - 1][w - weights[i - 1]] + values[i - 1]
          );
        }
      }
    }

    setDpTable(dp);

    // Відновлення вибраних предметів
    let w = capacity;
    const items: number[] = [];
    for (let i = n; i > 0 && w > 0; i--) {
      if (dp[i][w] !== dp[i - 1][w]) {
        items.push(i - 1);
        w -= weights[i - 1];
      }
    }

    setSelectedItems(items.reverse());
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Задача «Рюкзак» (Варіант 21)</h1>
      <h2>Максимальна цінність: {dpTable[n]?.[capacity]}</h2>

      <h3>Вибрані предмети (індекси з 0):</h3>
      <ul>
        {selectedItems.map((index) => (
          <li key={index}>
            Предмет {index + 1} — Вага: {weights[index]}, Цінність: {values[index]}
          </li>
        ))}
      </ul>

      <h3>Таблиця dp[i][w]:</h3>
      <div style={{ overflowX: 'auto' }}>
        <table border={1} cellPadding={5}>
          <thead>
            <tr>
              <th>i \ w</th>
              {Array.from({ length: capacity + 1 }, (_, w) => (
                <th key={w}>{w}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dpTable.map((row, i) => (
              <tr key={i}>
                <td>{i}</td>
                {row.map((cell, w) => (
                  <td key={w} style={{ backgroundColor: selectedItems.includes(i - 1) ? '#d0f0c0' : '' }}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;
