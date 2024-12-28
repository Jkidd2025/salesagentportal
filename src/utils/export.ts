import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { format } from "date-fns";

export const exportToCSV = (data: any[], filename: string) => {
  const csvContent = convertToCSV(data);
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToPDF = (
  data: any[],
  columns: string[],
  filename: string,
  title: string
) => {
  const doc = new jsPDF();
  doc.text(title, 14, 15);
  
  // @ts-ignore - jspdf-autotable types are not properly recognized
  doc.autoTable({
    head: [columns],
    body: data.map((item) => columns.map((col) => item[col])),
    startY: 25,
  });

  doc.save(`${filename}.pdf`);
};

const convertToCSV = (data: any[]) => {
  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(",")];

  for (const row of data) {
    const values = headers.map((header) => {
      const value = row[header];
      return typeof value === "string" ? `"${value}"` : value;
    });
    csvRows.push(values.join(","));
  }

  return csvRows.join("\n");
};