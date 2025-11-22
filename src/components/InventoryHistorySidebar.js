import React, { useEffect, useState } from "react";
import { getHistory } from "../services/api";
import { format } from "date-fns";

function InventoryHistorySidebar({ product, onClose }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!product) return;
    loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  const loadHistory = async () => {
    try {
      const res = await getHistory(product.id);
      setHistory(res.data);
    } catch {
      setHistory([]);
    }
  };

  if (!product) return null;

  return (
    <div
      className="border-start bg-white position-fixed top-0 end-0 vh-100 shadow p-3"
      style={{ width: "320px", zIndex: 1050 }}
    >
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">{product.name} - History</h5>
        <button className="btn btn-sm btn-outline-secondary" onClick={onClose}>
          Close
        </button>
      </div>

      {history.length === 0 ? (
        <p className="text-muted small">No stock changes logged yet.</p>
      ) : (
        <ul className="list-group list-group-flush small">
          {history.map((h) => (
            <li key={h.id} className="list-group-item px-0">
              <div className="fw-semibold">
                {format(new Date(h.timestamp), "PPpp")}
              </div>
              <div>
                Old: <strong>{h.old_stock}</strong> → New:{" "}
                <strong>{h.new_stock}</strong>
              </div>
              <div className="text-muted">By: {h.changed_by}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default InventoryHistorySidebar;
