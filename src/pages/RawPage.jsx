import { useState, useRef } from "react";
import { rawData as sampleRawData } from "../data/mockData";

const IMPORT_API = "http://192.168.10.164:5044/api/import";

function RawPage() {
  const [data, setData] = useState(sampleRawData);
  const [columns, setColumns] = useState([
    "id",
    "source",
    "timestamp",
    "product_code",
    "qty",
    "price",
    "customer",
    "note",
  ]);
  const [fileName, setFileName] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    const isExcel =
      /\.(xlsx|xls|csv)$/i.test(file.name) ||
      [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
        "text/csv",
      ].includes(file.type);

    if (!isExcel) {
      setError("Vui lòng chọn file Excel (.xlsx, .xls) hoặc CSV.");
      setSuccess(null);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append("file", file); // field name: file

      const res = await fetch(IMPORT_API, {
        method: "POST",
        body: formData,
        // Không set Content-Type — browser tự gắn multipart boundary
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Import thất bại (HTTP ${res.status})`);
      }

      // Nếu API trả JSON có data thì hiển thị lên bảng
      let payload = null;
      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        payload = await res.json();
      }

      // Hỗ trợ vài dạng response phổ biến: { data: [...] } | { rows: [...] } | [...]
      const rows = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload?.rows)
            ? payload.rows
            : null;

      if (rows && rows.length > 0) {
        const cols = Object.keys(rows[0]);
        setColumns(cols);
        setData(rows);
      }

      setFileName(file.name);
      setSuccess(payload?.message || `Import thành công: ${file.name}`);
    } catch (err) {
      setError(err.message || "Không kết nối được API import.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setData(sampleRawData);
    setColumns([
      "id",
      "source",
      "timestamp",
      "product_code",
      "qty",
      "price",
      "customer",
      "note",
    ]);
    setFileName(null);
    setError(null);
    setSuccess(null);
  };

  const sourceCol = columns.find((c) =>
    ["source", "Source", "SOURCE", "source_system"].includes(c),
  );
  const uniqueSources = sourceCol
    ? new Set(data.map((r) => r[sourceCol]).filter(Boolean)).size
    : null;

  const renderCell = (value) => {
    if (value === null || value === undefined)
      return <span className="null-value">null</span>;
    if (value === "") return <span className="null-value">empty</span>;
    return String(value);
  };

  return (
    <div>
      <h2 className="page-title">
        <span className="badge badge-raw">RAW</span> Dữ liệu Thô
      </h2>
      <p className="page-desc">
        Import file Excel lên hệ thống (lưu DB) qua API <code>/api/import</code>
        .
      </p>

      <div className="import-toolbar">
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        <button
          className="btn btn-import"
          onClick={handleImportClick}
          disabled={loading}
        >
          {loading ? "⏳ Đang import..." : "📥 Import Excel"}
        </button>
        {fileName && (
          <>
            <button className="btn btn-reset" onClick={handleReset}>
              ↺ Khôi phục dữ liệu mẫu
            </button>
            <span className="file-info">
              File: <strong>{fileName}</strong>
            </span>
          </>
        )}
      </div>

      {error && <div className="error-box">{error}</div>}
      {success && <div className="success-box">{success}</div>}

      <div className="stats">
        <div className="stat-card">
          <div className="label">Tổng bản ghi</div>
          <div className="value">{data.length}</div>
        </div>
        {uniqueSources !== null && (
          <div className="stat-card">
            <div className="label">Nguồn dữ liệu</div>
            <div className="value">{uniqueSources}</div>
          </div>
        )}
        <div className="stat-card">
          <div className="label">Số cột</div>
          <div className="value">{columns.length}</div>
        </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  style={{ textAlign: "center", color: "#94a3b8" }}
                >
                  Không có dữ liệu.
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr key={row.id ?? idx}>
                  {columns.map((col) => (
                    <td key={col}>{renderCell(row[col])}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RawPage;
