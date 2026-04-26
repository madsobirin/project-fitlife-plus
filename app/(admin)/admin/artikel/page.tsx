"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Loader2,
  AlertCircle,
  X,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Eye,
  Star,
} from "lucide-react";
import LayoutAdmin from "@/components/admin/LayoutAdmin";
import Image from "next/image";
import Link from "next/link";

interface Artikel {
  id: number;
  judul: string;
  slug: string;
  kategori: string;
  penulis: string;
  gambar: string;
  is_featured: boolean | null;
  dibaca: number | null;
  created_at: string;
}

const ITEMS_PER_PAGE = 8;

export default function ArtikelPage() {
  const [artikels, setArtikels] = useState<Artikel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterFeatured, setFilterFeatured] = useState<boolean | null>(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterFeatured]);

  const fetchArtikels = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filterFeatured !== null)
        params.set("featured", String(filterFeatured));
      const res = await fetch(`/api/artikels?${params.toString()}`);
      if (!res.ok) throw new Error();
      const data: Artikel[] = await res.json();
      setArtikels(data);
    } catch {
      setError("Gagal memuat data artikel");
    } finally {
      setLoading(false);
    }
  }, [filterFeatured]);

  useEffect(() => {
    fetchArtikels();
  }, [fetchArtikels]);

  const handleDelete = async (slug: string) => {
    setDeletingId(slug);
    try {
      const res = await fetch(`/api/artikels/${slug}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setArtikels((prev) => prev.filter((a) => a.slug !== slug));
        setDeleteConfirm(null);
        setDeleteSuccess(true);
        setTimeout(() => setDeleteSuccess(false), 2500);
      }
    } catch {
      setError("Gagal menghapus artikel");
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = artikels.filter(
    (a) =>
      debouncedSearch === "" ||
      a.judul.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      a.kategori.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      a.penulis.toLowerCase().includes(debouncedSearch.toLowerCase()),
  );

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

  const activeFilterLabel =
    filterFeatured === true
      ? "Featured"
      : filterFeatured === false
        ? "Reguler"
        : "";

  return (
    <LayoutAdmin>
      <div className="p-4 md:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
              Daftar Artikel
            </h1>
            <p className="text-gray-500 text-sm">
              {loading ? "Memuat..." : `${filtered.length} artikel tersedia`}
            </p>
          </div>
          <Link
            href="/admin/artikel/create"
            className="w-fit bg-[#22c55e] hover:bg-[#16a34a] text-white px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg shadow-green-500/20"
          >
            <Plus className="w-5 h-5" /> Tambah Artikel
          </Link>
        </div>

        {/* Toast */}
        {deleteSuccess && (
          <div className="mb-4 flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm font-medium">
            <CheckCircle className="w-4 h-4" /> Artikel berhasil dihapus
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
              className="block w-full pl-9 pr-8 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#22c55e] focus:border-transparent text-sm transition-all outline-none text-slate-800"
              placeholder="Cari judul, kategori, atau penulis..."
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

          {/* Filter dropdown */}
          <div className="relative w-full sm:w-auto">
            <button
              onClick={() => setShowFilterDropdown((p) => !p)}
              className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-medium transition-all w-full sm:w-auto justify-center whitespace-nowrap ${
                activeFilterLabel
                  ? "bg-[#22c55e] text-white border-[#22c55e]"
                  : "text-gray-600 border-gray-200 hover:text-[#22c55e] hover:border-[#22c55e] bg-white"
              }`}
            >
              <Star className="w-4 h-4" />
              {activeFilterLabel || "Filter"}
              {activeFilterLabel && (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    setFilterFeatured(null);
                  }}
                  className="ml-1 hover:opacity-70"
                >
                  <X className="w-3 h-3" />
                </span>
              )}
            </button>
            {showFilterDropdown && (
              <div className="absolute right-0 top-full mt-2 w-40 bg-white border border-gray-100 rounded-xl shadow-lg z-20 overflow-hidden">
                {[
                  { label: "Semua", value: null },
                  { label: "Featured", value: true },
                  { label: "Reguler", value: false },
                ].map((opt) => (
                  <button
                    key={String(opt.value)}
                    onClick={() => {
                      setFilterFeatured(opt.value);
                      setShowFilterDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 transition-colors ${
                      filterFeatured === opt.value
                        ? "bg-gray-50 font-semibold text-gray-900"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {opt.value === true && (
                      <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    )}
                    {opt.value === false && (
                      <BookOpen className="w-3.5 h-3.5 text-gray-400" />
                    )}
                    {opt.value === null && (
                      <X className="w-3.5 h-3.5 text-gray-400" />
                    )}
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
              <p className="text-gray-400 text-sm">Memuat artikel...</p>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium">
              Tidak ada artikel ditemukan
            </p>
            {(search || filterFeatured !== null) && (
              <button
                onClick={() => {
                  setSearch("");
                  setFilterFeatured(null);
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
            <div className="grid grid-cols-1 gap-4 md:hidden mb-6">
              {paginated.map((item, i) => (
                <div
                  key={item.slug}
                  className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3"
                >
                  <div className="flex gap-4">
                    <Image
                      alt={item.judul}
                      src={item.gambar}
                      width={80}
                      height={80}
                      className="w-20 h-20 object-cover rounded-xl shadow-sm shrink-0"
                      unoptimized
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-mono text-gray-400">
                          #
                          {String(
                            (currentPage - 1) * ITEMS_PER_PAGE + i + 1,
                          ).padStart(2, "0")}
                        </span>
                        {item.is_featured && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border bg-yellow-100 text-yellow-700 border-yellow-200 flex items-center gap-1">
                            <Star className="w-2.5 h-2.5 fill-yellow-500 text-yellow-500" />{" "}
                            FEATURED
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-gray-900 text-sm line-clamp-2 leading-snug">
                        {item.judul}
                      </h3>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                          {item.kategori}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <Eye className="w-3 h-3" /> {item.dibaca ?? 0}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">
                    oleh{" "}
                    <span className="font-semibold text-gray-600">
                      {item.penulis}
                    </span>
                  </p>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-50">
                    <Link
                      href={`/admin/artikel/${item.slug}/edit`}
                      className="flex items-center justify-center py-2 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-semibold hover:bg-indigo-100 transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5 mr-1.5" /> Edit
                    </Link>
                    {deleteConfirm === item.slug ? (
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleDelete(item.slug)}
                          disabled={deletingId === item.slug}
                          className="flex-1 flex items-center justify-center py-2 bg-red-500 text-white rounded-lg text-xs font-semibold"
                        >
                          {deletingId === item.slug ? (
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
                        onClick={() => setDeleteConfirm(item.slug)}
                        className="flex items-center justify-center py-2 bg-red-50 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-100 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Hapus
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
                        "Foto",
                        "Judul",
                        "Kategori",
                        "Penulis",
                        "Dibaca",
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
                        key={item.slug}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="px-6 py-5 text-sm text-gray-400 font-mono">
                          {String(
                            (currentPage - 1) * ITEMS_PER_PAGE + i + 1,
                          ).padStart(2, "0")}
                        </td>
                        <td className="px-6 py-5">
                          <Image
                            alt={item.judul}
                            src={item.gambar}
                            width={64}
                            height={48}
                            className="w-16 h-12 object-cover rounded-lg"
                            unoptimized
                          />
                        </td>
                        <td className="px-6 py-5 max-w-xs">
                          <div className="flex items-start gap-2">
                            <div className="min-w-0">
                              <p className="font-semibold text-gray-900 text-sm line-clamp-1">
                                {item.judul}
                              </p>
                              {item.is_featured && (
                                <span className="inline-flex items-center gap-1 text-[10px] bg-yellow-100 text-yellow-700 border border-yellow-200 px-1.5 py-0.5 rounded-full font-bold mt-0.5">
                                  <Star className="w-2.5 h-2.5 fill-yellow-500 text-yellow-500" />{" "}
                                  Featured
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                            {item.kategori}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-sm text-gray-600">
                          {item.penulis}
                        </td>
                        <td className="px-6 py-5">
                          <span className="flex items-center gap-1.5 text-sm text-gray-500">
                            <Eye className="w-3.5 h-3.5 text-gray-400" />
                            {(item.dibaca ?? 0).toLocaleString("id-ID")}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/admin/artikel/${item.slug}/edit`}
                              className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                            >
                              <Pencil className="h-4 w-4" />
                            </Link>
                            {deleteConfirm === item.slug ? (
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleDelete(item.slug)}
                                  disabled={deletingId === item.slug}
                                  className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-semibold hover:bg-red-600 disabled:opacity-50"
                                >
                                  {deletingId === item.slug ? (
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
                                onClick={() => setDeleteConfirm(item.slug)}
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
                  artikel
                </span>
                <div className="flex items-center gap-1.5 order-1 sm:order-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 disabled:opacity-40 transition-all text-gray-600"
                  >
                    <ChevronLeft className="w-4 h-4" />
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
                    className="p-2 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 disabled:opacity-40 transition-all text-gray-600"
                  >
                    <ChevronRight className="w-4 h-4" />
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
