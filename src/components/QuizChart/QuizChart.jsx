import React from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import styles from "./QuizChart.module.css";

function QuizChart({ chartRef, answers }) {
  const chartData = Object.entries(answers).map(([key, value]) => ({
    subject: key,
    A: value,
    fullMark: 10,
  }));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Perfil de Marketing Digital</h2>
      </div>
      <div className={styles.chartContainer}>
        <div ref={chartRef} className={styles.chartWrapper}>
          <ResponsiveContainer width="100%" height={500}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
              <PolarGrid stroke="#3FFFF3" strokeWidth={2} className={styles.neonEffect} />
              <PolarAngleAxis
                dataKey="subject"
                stroke="#0a2ff1"
                tickLine={false}
                style={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  fontFamily: "Red Hat Display",
                  filter: "drop-shadow(0 0 8px rgba(63,255,243,0.3))",
                }}
                className={styles.neonEffect}
              />
              <Radar
                name="Perfil"
                dataKey="A"
                stroke="#0a2ff1"
                fill="#3FFFF3"
                fillOpacity={0.3}
                strokeWidth={4}
                className={styles.neonEffect}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default QuizChart;