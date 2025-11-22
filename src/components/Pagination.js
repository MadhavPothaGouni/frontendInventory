import React from "react";

function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null; // no pagination needed

  const handlePrev = () => {
    if (page > 1) onPageChange(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) onPageChange(page + 1);
  };

  const pages = [];
  for (let p = 1; p <= totalPages; p += 1) {
    pages.push(p);
  }

  return (
    <div style={{ marginTop: "16px", display: "flex", gap: "8px", alignItems: "center" }}>
      <button onClick={handlePrev} disabled={page === 1}>
        Prev
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          style={{
            fontWeight: p === page ? "bold" : "normal",
            textDecoration: p === page ? "underline" : "none",
          }}
        >
          {p}
        </button>
      ))}

      <button onClick={handleNext} disabled={page === totalPages}>
        Next
      </button>
    </div>
  );
}

export default Pagination;
