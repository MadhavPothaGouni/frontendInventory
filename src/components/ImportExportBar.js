import React, { useRef } from "react";
import { importCSV, exportCSV } from "../services/api";
import { toast } from "react-toastify";

function ImportExportBar({ onImported }) {
  const fileInputRef = useRef(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      await importCSV(file);
      toast.success("CSV Imported Successfully!");
      onImported();
    } catch {
      toast.error("Import failed");
    } finally {
      e.target.value = "";
    }
  };

  const handleExport = async () => {
    try {
      const res = await exportCSV();
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = "products.csv";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error("Export failed");
    }
  };

  return (
    <>
      <input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      <div className="btn-group">
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm"
          onClick={handleImportClick}
        >
          Import CSV
        </button>
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm"
          onClick={handleExport}
        >
          Export CSV
        </button>
      </div>
    </>
  );
}

export default ImportExportBar;
