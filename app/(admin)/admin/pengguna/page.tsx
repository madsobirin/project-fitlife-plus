"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Search,
  Trash2,
  Loader2,
  AlertCircle,
  X,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Users,
  ShieldOff,
  Shield,
} from "lucide-react";
import LayoutAdmin from "@/components/admin/LayoutAdmin";
import Image from "next/image";

interface Account {
  id: number;
  name: string | null;
  email: string;
  phone: string | null;
  photo: string | null;
  google_avatar: string | null;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string | null;
}

const ITEMS_PER_PAGE = 10;

export default function PenggunaPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  // Debounce
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus]);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch — hanya role user
  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/accounts?role=user");
      if (!res.ok) throw new Error();
      const data: Account[] = await res.json();
      setAccounts(data);
    } catch {
      setError("Gagal memuat data pengguna");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  // Toggle status
  const handleToggleStatus = async (id: number) => {
    setTogglingId(id);
    try {
      const res = await fetch(`/api/accounts/${id}`, { method: "PATCH" });
      const data = await res.json();
      if (res.ok) {
        setAccounts((prev) =>
          prev.map((a) =>
            a.id === id ? { ...a, is_active: data.is_active } : a,
          ),
        );
        showToast("success", data.message);
      } else {
        showToast("error", data.message || "Gagal mengubah status");
      }
    } catch {
      showToast("error", "Terjadi kesalahan");
    } finally {
      setTogglingId(null);
    }
  };

  // Delete
  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/accounts/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        setAccounts((prev) => prev.filter((a) => a.id !== id));
        setDeleteConfirm(null);
        showToast("success", "Akun berhasil dihapus");
      } else {
        showToast("error", data.message || "Gagal menghapus");
      }
    } catch {
      showToast("error", "Terjadi kesalahan");
    } finally {
      setDeletingId(null);
    }
  };

  // Filter client-side
  const filtered = accounts.filter((a) => {
    const matchSearch =
      debouncedSearch === "" ||
      (a.name ?? "").toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      a.email.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      (a.phone ?? "").includes(debouncedSearch);
    const matchStatus =
      filterStatus === "all"
        ? true
        : filterStatus === "active"
          ? a.is_active
          : !a.is_active;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      )
        pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  const AvatarCell = ({ account }: { account: Account }) => {
    const src = account.photo || account.google_avatar;
    const initials = account.name
      ? account.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : account.email[0].toUpperCase();
    return (
      <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-gray-100 flex items-center justify-center bg-gray-100 text-gray-500 font-bold text-xs shrink-0">
        {src ? (
          <Image
            src={src}
            alt={account.name ?? "User"}
            width={36}
            height={36}
            className="object-cover w-full h-full"
            unoptimized
            referrerPolicy="no-referrer"
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>
    );
  };

  const StatusBadge = ({ active }: { active: boolean }) => (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
        active
          ? "bg-green-100 text-green-700 border-green-200"
          : "bg-gray-100 text-gray-500 border-gray-200"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${active ? "bg-green-500" : "bg-gray-400"}`}
      />
      {active ? "Aktif" : "Nonaktif"}
    </span>
  );

  const filterLabel =
    filterStatus === "active"
      ? "Aktif"
      : filterStatus === "inactive"
        ? "Nonaktif"
        : "";

  return (
    <LayoutAdmin>
      <div className="p-4 md:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
              Manajemen Pengguna
            </h1>
            <p className="text-gray-500 text-sm">
              {loading ? "Memuat..." : `${filtered.length} pengguna terdaftar`}
            </p>
          </div>
          {/* Summary badges */}
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 text-green-700 rounded-xl text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              {accounts.filter((a) => a.is_active).length} Aktif
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 border border-gray-200 text-gray-600 rounded-xl text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-gray-400" />
              {accounts.filter((a) => !a.is_active).length} Nonaktif
            </span>
          </div>
        </div>

        {/* Toast */}
        {toast && (
          <div
            className={`mb-4 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border ${
              toast.type === "success"
                ? "bg-green-50 border-green-200 text-green-700"
                : "bg-red-50 border-red-200 text-red-600"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            {toast.msg}
            <button onClick={() => setToast(null)} className="ml-auto">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {error && (
          <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
            <AlertCircle className="w-4 h-4" /> {error}
            <button onClick={() => setError(null)} className="ml-auto">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Search & Filter */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <Search className="h-4 w-4" />
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-9 pr-8 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#22c55e] focus:border-transparent text-sm transition-all outline-none"
              placeholder="Cari nama, email, atau nomor HP..."
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="relative w-full sm:w-auto">
            <button
              onClick={() => setShowFilterDropdown((p) => !p)}
              className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-medium transition-all w-full sm:w-auto justify-center whitespace-nowrap ${
                filterLabel
                  ? "bg-[#22c55e] text-white border-[#22c55e]"
                  : "text-gray-600 border-gray-200 hover:text-[#22c55e] hover:border-[#22c55e] bg-white"
              }`}
            >
              <Users className="w-4 h-4" />
              {filterLabel || "Filter Status"}
              {filterLabel && (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    setFilterStatus("all");
                  }}
                  className="ml-1 hover:opacity-70"
                >
                  <X className="w-3 h-3" />
                </span>
              )}
            </button>
            {showFilterDropdown && (
              <div className="absolute right-0 top-full mt-2 w-44 bg-white border border-gray-100 rounded-xl shadow-lg z-20 overflow-hidden">
                {(
                  [
                    { label: "Semua", value: "all" },
                    { label: "Aktif", value: "active" },
                    { label: "Nonaktif", value: "inactive" },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setFilterStatus(opt.value);
                      setShowFilterDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 transition-colors ${
                      filterStatus === opt.value
                        ? "bg-gray-50 font-semibold text-gray-900"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        opt.value === "active"
                          ? "bg-green-500"
                          : opt.value === "inactive"
                            ? "bg-gray-400"
                            : "bg-gray-300"
                      }`}
                    />
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Loading / Empty */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-[#22c55e] animate-spin" />
              <p className="text-gray-400 text-sm">Memuat pengguna...</p>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
              <Users className="w-7 h-7 text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium">
              Tidak ada pengguna ditemukan
            </p>
            {(search || filterStatus !== "all") && (
              <button
                onClick={() => {
                  setSearch("");
                  setFilterStatus("all");
                }}
                className="text-[#22c55e] text-sm font-medium hover:underline"
              >
                Reset filter
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Mobile Cards */}
            <div className="grid grid-cols-1 gap-3 md:hidden mb-6">
              {paginated.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <AvatarCell account={item} />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 text-sm truncate">
                        {item.name ?? "—"}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {item.email}
                      </p>
                    </div>
                    <StatusBadge active={item.is_active} />
                  </div>
                  {item.phone && (
                    <p className="text-xs text-gray-500 mb-3">
                      📞 {item.phone}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mb-3">
                    {item.last_login_at
                      ? `Login: ${new Date(item.last_login_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}`
                      : "Belum pernah login"}
                  </p>
                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-50">
                    <button
                      onClick={() => handleToggleStatus(item.id)}
                      disabled={togglingId === item.id}
                      className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
                        item.is_active
                          ? "bg-orange-50 text-orange-600 hover:bg-orange-100"
                          : "bg-green-50 text-green-600 hover:bg-green-100"
                      }`}
                    >
                      {togglingId === item.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : item.is_active ? (
                        <>
                          <ShieldOff className="w-3.5 h-3.5" /> Nonaktifkan
                        </>
                      ) : (
                        <>
                          <Shield className="w-3.5 h-3.5" /> Aktifkan
                        </>
                      )}
                    </button>
                    {deleteConfirm === item.id ? (
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={deletingId === item.id}
                          className="flex-1 flex items-center justify-center py-2 bg-red-500 text-white rounded-lg text-xs font-semibold"
                        >
                          {deletingId === item.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            "Yakin?"
                          )}
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="flex-1 flex items-center justify-center py-2 bg-gray-100 text-gray-600 rounded-lg text-xs font-semibold"
                        >
                          Batal
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(item.id)}
                        className="flex items-center justify-center gap-1.5 py-2 bg-red-50 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-100 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Hapus
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      {[
                        "No",
                        "Pengguna",
                        "Email",
                        "No. HP",
                        "Login Terakhir",
                        "Status",
                        "Aksi",
                      ].map((h) => (
                        <th
                          key={h}
                          className={`px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider ${h === "Aksi" ? "text-right" : ""}`}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {paginated.map((item, i) => (
                      <tr
                        key={item.id}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm text-gray-400 font-mono">
                          {String(
                            (currentPage - 1) * ITEMS_PER_PAGE + i + 1,
                          ).padStart(2, "0")}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <AvatarCell account={item} />
                            <span className="font-semibold text-gray-900 text-sm">
                              {item.name ?? (
                                <span className="text-gray-400 font-normal italic">
                                  Belum diisi
                                </span>
                              )}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {item.email}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {item.phone ?? (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {item.last_login_at ? (
                            new Date(item.last_login_at).toLocaleDateString(
                              "id-ID",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )
                          ) : (
                            <span className="text-gray-300 italic text-xs">
                              Belum login
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge active={item.is_active} />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Toggle Status */}
                            <button
                              onClick={() => handleToggleStatus(item.id)}
                              disabled={togglingId === item.id}
                              title={
                                item.is_active ? "Nonaktifkan" : "Aktifkan"
                              }
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 ${
                                item.is_active
                                  ? "bg-orange-50 text-orange-600 hover:bg-orange-100"
                                  : "bg-green-50 text-green-600 hover:bg-green-100"
                              }`}
                            >
                              {togglingId === item.id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : item.is_active ? (
                                <>
                                  <ShieldOff className="w-3.5 h-3.5" />{" "}
                                  Nonaktifkan
                                </>
                              ) : (
                                <>
                                  <Shield className="w-3.5 h-3.5" /> Aktifkan
                                </>
                              )}
                            </button>

                            {/* Delete */}
                            {deleteConfirm === item.id ? (
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleDelete(item.id)}
                                  disabled={deletingId === item.id}
                                  className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-semibold hover:bg-red-600 disabled:opacity-50"
                                >
                                  {deletingId === item.id ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    "Yakin?"
                                  )}
                                </button>
                                <button
                                  onClick={() => setDeleteConfirm(null)}
                                  className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-semibold hover:bg-gray-200"
                                >
                                  Batal
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setDeleteConfirm(item.id)}
                                className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 px-2 sm:px-4 py-4 bg-white border border-gray-100 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-sm text-gray-500 order-2 sm:order-1">
                  Menampilkan{" "}
                  <span className="font-semibold text-gray-900">
                    {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                    {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)}
                  </span>{" "}
                  dari{" "}
                  <span className="font-semibold text-gray-900">
                    {filtered.length}
                  </span>{" "}
                  pengguna
                </span>
                <div className="flex items-center gap-1.5 order-1 sm:order-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 disabled:opacity-40 transition-all"
                  >
                    <ChevronLeft className="w-4 h-4 text-gray-600" />
                  </button>
                  {getPageNumbers().map((page, i) =>
                    page === "..." ? (
                      <span
                        key={`dots-${i}`}
                        className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm"
                      >
                        ···
                      </span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page as number)}
                        className={`w-9 h-9 flex items-center justify-center text-sm rounded-xl font-medium transition-all ${currentPage === page ? "bg-[#22c55e] text-white shadow-md shadow-green-500/20 font-bold" : "border border-gray-200 bg-white hover:bg-gray-50 text-gray-600"}`}
                      >
                        {page}
                      </button>
                    ),
                  )}
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="p-2 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 disabled:opacity-40 transition-all"
                  >
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </LayoutAdmin>
  );
}
