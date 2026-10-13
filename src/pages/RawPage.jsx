import { useState, useRef, useEffect } from "react";

const IMPORT_API = "http://192.168.10.164:5044/api/import";
const LIST_API = "http://192.168.10.164:5044/api/import/files";
const STATUS_API = (id) =>
  `http://192.168.10.164:5044/api/import/files/${id}/status-action`;

function RawSourcesPage() {
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchList();
  }, []);

  const mapSource = (item) => ({
    id: item.id ?? item.fileId ?? item._id,
    name:
      item.name ??
      item.fileName ??
      item.originalName ??
      item.file_name ??
      "Không tên",
    type: item.type ?? item.fileType ?? "File (.xlsx/.csv)",
    flow: item.flow ?? [1, 2],
    nextSync: item.nextSync ?? item.next_sync ?? null,

    // Trạng thái JOB (không dùng cho badge)
    status: item.status ?? null,

    // Trạng thái BẢN GHI — dùng cho badge Hoạt động / Không hoạt động
    status_action: item.statusAction ?? item.status_action ?? 0,

    fileName: item.fileName ?? item.originalName ?? item.name,
  });

  const fetchList = async () => {
    setListLoading(true);
    setError(null);
    try {
      const res = await fetch(LIST_API);
      if (!res.ok) {
        throw new Error(`Không tải được danh sách (HTTP ${res.status})`);
      }
      const data = await res.json();
      console.log("LIST API response:", data);

      const list = Array.isArray(data)
        ? data
        : Array.isArray(data.data)
          ? data.data
          : Array.isArray(data.files)
            ? data.files
            : Array.isArray(data.items)
              ? data.items
              : [];
      console.log("Mapped sources:", list);
      setSources(list.map(mapSource));
    } catch (err) {
      console.error(err);
      setError(err.message || "Không kết nối được API danh sách.");
    } finally {
      setListLoading(false);
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

      setSuccess(`Import thành công: ${file.name}`);
      await fetchList();
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

  // Bật/tắt trạng thái qua API
  const handleToggleStatus = async (id, currentStatus) => {
    if (!id || togglingId) return;

    const nextStatus = currentStatus == 1 ? 0 : 1;
    setTogglingId(id);
    setError(null);

    try {
      const res = await fetch(STATUS_API(id), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statusAction: nextStatus }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Đổi trạng thái thất bại (${res.status})`);
      }

      const payload = await res.json().catch(() => ({}));
      // Response: { statusAction: 0, statusText: "Không hoạt động", ... }
      const serverStatus = payload.statusAction ?? nextStatus;

      setSources((prev) =>
        prev.map((s) =>
          s.id === id ? { ...s, status_action: serverStatus } : s,
        ),
      );

      setSuccess(
        payload.message ||
          (serverStatus === 1
            ? "Đã bật trạng thái Hoạt động"
            : "Đã tắt trạng thái (Không hoạt động)"),
      );
    } catch (err) {
      console.error(err);
      setError(err.message || "Không đổi được trạng thái.");
    } finally {
      setTogglingId(null);
    }
  };

  const filtered = sources.filter((s) => {
    const matchSearch =
      !search ||
      (s.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (s.fileName || "").toLowerCase().includes(search.toLowerCase());
    const matchType =
      !typeFilter ||
      (s.type || "").toLowerCase().includes(typeFilter.toLowerCase());
    return matchSearch && matchType;
  });
  console.log("Filtered sources:", filtered);
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
        <button className="btn-search" onClick={fetchList}>
          🔍 Tìm kiếm
        </button>
        <button
          className="btn-reset"
          onClick={() => {
            setSearch("");
            setTypeFilter("");
            fetchList();
          }}
        >
          Đặt lại
        </button>
      </div>

      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}
      {listLoading && <div className="alert">Đang tải danh sách...</div>}

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
                <tr key={s.id ?? idx}>
                  <td>{idx + 1}</td>
                  <td>{s.name}</td>
                  <td>{s.type}</td>
                  <td>{renderFlow(s.flow)}</td>
                  <td>{s.nextSync || "—"}</td>
                  <td>
                    <span
                      className={`badge-status ${s.status_action == 1 ? "active" : "inactive"}`}
                      onClick={() => handleToggleStatus(s.id, s.status_action)}
                    >
                      {s.status_action == 1 ? "Hoạt động" : "Không hoạt động"}
                    </span>
                  </td>
                  <td>
                    {s.status_action == 1 ? (
                      <button className="icon-btn" title="Chuyển sang staging">
                        ⇄
                      </button>
                    ) : (
                      "—"
                    )}
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
