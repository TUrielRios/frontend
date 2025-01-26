import React from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import styles from "./QuizResult.module.css";

function QuizResult({ chartRef }) {
  const downloadAsPNG = async () => {
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current);
      const imgData = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = imgData;
      link.download = "perfil_marketing_digital.png";
      link.click();
    }
  };

  const downloadAsPDF = async () => {
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
      pdf.save("perfil_marketing_digital.pdf");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>¡Gracias por completar el diagnóstico!</h2>
      </div>
      <div className={styles.buttonContainer}>
        <button onClick={downloadAsPNG} className={styles.button}>
          Descargar como PNG
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
        <button onClick={downloadAsPDF} className={styles.button}>
          Descargar como PDF
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default QuizResult;