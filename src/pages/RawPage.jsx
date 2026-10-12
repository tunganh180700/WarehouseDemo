import { useState, useRef, useEffect } from "react";

const IMPORT_API = "http://192.168.10.164:5044/api/import";
// Nếu có API lấy danh sách nguồn thì thay URL này
const LIST_API = "http://localhost:5044/api/raw-sources";

function RawSourcesPage() {
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const fileInputRef = useRef(null);

  // Load danh sách (nếu có API list)
  useEffect(() => {
    fetchList();
  }, []);

  const fetchList = async () => {
    try {
      const res = await fetch(LIST_API);
      if (res.ok) {
        const data = await res.json();
        setSources(Array.isArray(data) ? data : data.data || []);
      }
    } catch {
      // giữ mock nếu chưa có API list
    }
  };

  const handleAddClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    if (!/\.(xlsx|xls|csv)$/i.test(file.name)) {
      setError("Chỉ hỗ trợ file .xlsx, .xls, .csv");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(IMPORT_API, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Import thất bại (${res.status})`);
      }

      const payload = await res.json().catch(() => ({}));

      // Tạo item mới trong danh sách (dùng response API nếu có)
      const newSource = {
        id: payload.id || Date.now(),
        name: payload.name || file.name.replace(/\.(xlsx|xls|csv)$/i, ""),
        type: "File (.xlsx/.csv)",
        flow: payload.flow || [1, 2], // bước đã hoàn thành: 01, 02
        nextSync: payload.nextSync || null,
        status: payload.status ?? false, // false = Không hoạt động
        fileName: file.name,
      };

      setSources((prev) => [newSource, ...prev]);
      setSuccess(`Đã thêm nguồn: ${newSource.name}`);
    } catch (err) {
      setError(err.message || "Không kết nối được API import.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    if (!window.confirm("Xóa nguồn dữ liệu này?")) return;
    setSources((prev) => prev.filter((s) => s.id !== id));
  };

  const handleToggleStatus = (id) => {
    setSources((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: !s.status } : s)),
    );
  };

  const filtered = sources.filter((s) => {
    const matchSearch =
      !search || s.name.toLowerCase().includes(search.toLowerCase());
    const matchType = !typeFilter || s.type.includes(typeFilter);
    return matchSearch && matchType;
  });

  // 5 bước luồng dữ liệu
  const renderFlow = (completed = []) => {
    const steps = [1, 2, 3, 4, 5];
    const labels = ["CSDL Nguồn", "Datalake", "03", "04", "05"];
    return (
      <div className="flow-steps">
        {steps.map((step, i) => {
          const done = completed.includes(step);
          return (
            <div
              key={step}
              className={`flow-dot ${done ? "done" : ""}`}
              title={labels[i]}
            >
              <span>{String(step).padStart(2, "0")}</span>
              {done && i < 2 && (
                <small className="flow-label">{labels[i]}</small>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="raw-page">
      <div className="page-header">
        <div>
          <h1>NGUỒN DỮ LIỆU THÔ</h1>
          <p className="breadcrumb">Quản lý nguồn dữ liệu &gt; Dữ liệu thô</p>
        </div>
        <button className="btn-add" onClick={handleAddClick} disabled={loading}>
          {loading ? "⏳ Đang import..." : "+ Thêm mới"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileChange}
          hidden
        />
      </div>

      {/* Bộ lọc */}
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Tìm kiếm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-search"
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="select-type"
        >
          <option value="">Chọn loại dữ liệu</option>
          <option value="xlsx">File (.xlsx/.csv)</option>
        </select>
        <button className="btn-search">🔍 Tìm kiếm</button>
        <button
          className="btn-reset"
          onClick={() => {
            setSearch("");
            setTypeFilter("");
          }}
        >
          Đặt lại
        </button>
      </div>

      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}

      {/* Bảng danh sách nguồn */}
      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Tên nguồn dữ liệu thô</th>
              <th>Loại dữ liệu</th>
              <th>Luồng dữ liệu</th>
              <th>Lịch đồng bộ kế tiếp</th>
              <th>Trạng thái</th>
              <th>Chuyển dữ liệu thô tới vùng staging</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="empty">
                  Chưa có nguồn nào. Bấm <b>Thêm mới</b> để import file.
                </td>
              </tr>
            ) : (
              filtered.map((s, idx) => (
                <tr key={s.id}>
                  <td>{idx + 1}</td>
                  <td>{s.name}</td>
                  <td>{s.type}</td>
                  <td>{renderFlow(s.flow)}</td>
                  <td>{s.nextSync || "—"}</td>
                  <td>
                    <span
                      className={`badge-status ${s.status ? "active" : "inactive"}`}
                      onClick={() => handleToggleStatus(s.id)}
                      style={{ cursor: "pointer" }}
                    >
                      {s.status ? "Hoạt động" : "Không hoạt động"}
                    </span>
                  </td>
                  <td>
                    <button className="icon-btn" title="Chuyển sang staging">
                      ⇄
                    </button>
                  </td>
                  <td className="actions">
                    <button className="icon-btn" title="Sửa">
                      ✏️
                    </button>
                    <button className="icon-btn" title="Tải xuống">
                      ⬇️
                    </button>
                    <button
                      className="icon-btn danger"
                      title="Xóa"
                      onClick={() => handleDelete(s.id)}
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RawSourcesPage;
