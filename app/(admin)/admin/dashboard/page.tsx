"use client";

import { useEffect, useState } from "react";
import LayoutAdmin from "@/components/admin/LayoutAdmin";
import Link from "next/link";
import {
  Users,
  Utensils,
  Newspaper,
  UserCheck,
  TrendingUp,
  Eye,
  ArrowRight,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence, type Variants } from "framer-motion";

// ── Types ──
type Stats = {
  totalPengguna: number;
  penggunaAktif: number;
  totalMenu: number;
  totalArtikel: number;
};

type MenuTerbaru = {
  id: number;
  nama_menu: string;
  dibaca: number | null;
};

type PenggunaTerbaru = {
  id: number;
  name: string | null;
  email: string;
  is_active: boolean;
  last_login_at: string | null;
};

type DashboardData = {
  stats: Stats;
  menuTerbaru: MenuTerbaru[];
  penggunaTerbaru: PenggunaTerbaru[];
};

// ── Animation variants ──
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

const tableRow: Variants = {
  hidden: { opacity: 0, x: -12 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.3 + i * 0.06, duration: 0.4, ease: "easeOut" },
  }),
};

// ── Stat Card ──
const statConfig = [
  {
    key: "totalPengguna" as keyof Stats,
    label: "Total Pengguna",
    icon: Users,
    color: "text-blue-500",
    bg: "bg-blue-50",
    border: "border-blue-100",
    glow: "shadow-blue-100",
  },
  {
    key: "penggunaAktif" as keyof Stats,
    label: "Pengguna Aktif",
    icon: UserCheck,
    color: "text-emerald-500",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    glow: "shadow-emerald-100",
  },
  {
    key: "totalMenu" as keyof Stats,
    label: "Total Menu",
    icon: Utensils,
    color: "text-orange-500",
    bg: "bg-orange-50",
    border: "border-orange-100",
    glow: "shadow-orange-100",
  },
  {
    key: "totalArtikel" as keyof Stats,
    label: "Total Artikel",
    icon: Newspaper,
    color: "text-purple-500",
    bg: "bg-purple-50",
    border: "border-purple-100",
    glow: "shadow-purple-100",
  },
];

// ── Counter animation ──
function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (value === 0) return;
    let start = 0;
    const duration = 800;
    const step = 16;
    const increment = value / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(Math.floor(start));
      }
    }, step);
    return () => clearInterval(timer);
  }, [value]);

  return <span>{display}</span>;
}

export default function BerandaPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/dashboard");
      if (!res.ok) throw new Error();
      const json: DashboardData = await res.json();
      setData(json);
    } catch {
      setError("Gagal memuat data dashboard");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatDate = (date: string | null) => {
    if (!date) return null;
    return new Date(date).toLocaleString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ── Loading ──
  if (loading) {
    return (
      <LayoutAdmin>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center">
                <Loader2 className="w-7 h-7 text-emerald-500 animate-spin" />
              </div>
            </div>
            <p className="text-slate-400 text-sm font-medium">
              Memuat dashboard...
            </p>
          </div>
        </div>
      </LayoutAdmin>
    );
  }

  if (error || !data) {
    return (
      <LayoutAdmin>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <p className="text-slate-500">{error ?? "Terjadi kesalahan"}</p>
          <button
            onClick={() => fetchData()}
            className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm font-semibold hover:bg-emerald-600 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </LayoutAdmin>
    );
  }

  return (
    <LayoutAdmin>
      <div className="space-y-6 md:space-y-8 p-4 md:p-0">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
        >
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              Dashboard Admin
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Selamat datang kembali 👋
            </p>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-xs text-slate-400 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg">
              {new Date().toLocaleString("id-ID", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
            <button
              onClick={() => fetchData(true)}
              disabled={refreshing}
              className="p-2 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 text-slate-500 hover:text-emerald-600 transition-all"
              title="Refresh"
            >
              <RefreshCw
                className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
              />
            </button>
          </div>
        </motion.div>

        {/* ── Stats Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statConfig.map((stat, i) => (
            <motion.div
              key={stat.key}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className={`bg-white p-5 rounded-2xl border ${stat.border} shadow-sm ${stat.glow} flex flex-col gap-4 cursor-default`}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-500">
                  {stat.label}
                </p>
                <div
                  className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center`}
                >
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <p className={`text-4xl font-black ${stat.color}`}>
                  <AnimatedNumber value={data.stats[stat.key]} />
                </p>
                <div className="flex items-center gap-1 text-emerald-500 text-xs font-semibold bg-emerald-50 px-2 py-1 rounded-lg">
                  <TrendingUp className="w-3 h-3" />
                  Live
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Tables ── */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Menu Terbaru */}
          <motion.div
            custom={4}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="xl:col-span-5 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center">
                  <Utensils className="w-3.5 h-3.5 text-orange-500" />
                </div>
                <h2 className="font-bold text-slate-800 text-sm">
                  Menu Terpopuler
                </h2>
              </div>
              <Link
                href="/admin/menu"
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors"
              >
                Lihat semua <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {data.menuTerbaru.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-sm">
                Belum ada menu
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50/80">
                    <tr>
                      {["No", "Nama Menu", "Dilihat"].map((h) => (
                        <th
                          key={h}
                          className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {data.menuTerbaru.map((item, i) => (
                        <motion.tr
                          key={item.id}
                          custom={i}
                          variants={tableRow}
                          initial="hidden"
                          animate="visible"
                          className="border-t border-slate-50 hover:bg-slate-50/50 transition-colors"
                        >
                          <td className="px-5 py-3.5 text-slate-400 font-mono text-xs">
                            {String(i + 1).padStart(2, "0")}
                          </td>
                          <td className="px-5 py-3.5 font-semibold text-slate-700 max-w-[160px] truncate">
                            {item.nama_menu}
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="flex items-center gap-1.5 text-slate-500 text-xs">
                              <Eye className="w-3.5 h-3.5 text-slate-400" />
                              {item.dibaca ?? 0}x
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>

          {/* Pengguna Terbaru */}
          <motion.div
            custom={5}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="xl:col-span-7 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Users className="w-3.5 h-3.5 text-blue-500" />
                </div>
                <h2 className="font-bold text-slate-800 text-sm">
                  Pengguna Terbaru
                </h2>
              </div>
              <Link
                href="/admin/pengguna"
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors"
              >
                Lihat semua <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {data.penggunaTerbaru.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-sm">
                Belum ada pengguna
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-slate-50/80">
                      <tr>
                        {["No", "Nama", "Email", "Status"].map((h) => (
                          <th
                            key={h}
                            className={`px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide ${h === "Status" ? "text-center" : ""}`}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence>
                        {data.penggunaTerbaru.map((user, i) => (
                          <motion.tr
                            key={user.id}
                            custom={i}
                            variants={tableRow}
                            initial="hidden"
                            animate="visible"
                            className="border-t border-slate-50 hover:bg-slate-50/50 transition-colors"
                          >
                            <td className="px-5 py-3.5 text-slate-400 font-mono text-xs">
                              {String(i + 1).padStart(2, "0")}
                            </td>
                            <td className="px-5 py-3.5 font-semibold text-slate-700 max-w-[120px] truncate">
                              {user.name ?? (
                                <span className="text-slate-300 font-normal italic">
                                  —
                                </span>
                              )}
                            </td>
                            <td className="px-5 py-3.5 text-slate-500 max-w-[180px] truncate">
                              {user.email}
                            </td>
                            <td className="px-5 py-3.5 text-center">
                              <div className="flex flex-col items-center gap-0.5">
                                <span
                                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                    user.is_active
                                      ? "bg-emerald-100 text-emerald-700"
                                      : "bg-slate-100 text-slate-500"
                                  }`}
                                >
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full ${user.is_active ? "bg-emerald-500" : "bg-slate-400"}`}
                                  />
                                  {user.is_active ? "Aktif" : "Nonaktif"}
                                </span>
                                {user.last_login_at && (
                                  <span className="text-[10px] text-slate-400">
                                    {formatDate(user.last_login_at)}
                                  </span>
                                )}
                                {!user.last_login_at && (
                                  <span className="text-[10px] text-slate-300 italic">
                                    Belum login
                                  </span>
                                )}
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </LayoutAdmin>
  );
}
