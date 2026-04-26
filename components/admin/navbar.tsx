"use client";

import { useEffect, useState, useRef } from "react";
import {
  Menu,
  ShieldCheck,
  ChevronDown,
  User,
  LogOut,
  Loader2,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface NavbarProps {
  onMenuClick: () => void;
}

type AdminUser = {
  name: string | null;
  email: string;
  role: string;
  photo: string | null;
  google_avatar: string | null;
};

export default function Navbar({ onMenuClick }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [user, setUser] = useState<AdminUser | null>(null);
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setUser(d.user))
      .catch(() => null);
  }, []);

  // Tutup dropdown klik luar
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        router.push("/login");
        router.refresh();
      }
    } catch {
      console.error("Logout gagal");
    } finally {
      setLoggingOut(false);
    }
  };

  const avatarSrc = user?.photo || user?.google_avatar || null;
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "A";

  const segments = pathname.split("/").filter(Boolean);
  const breadcrumb = segments
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" / ");

  const AvatarBox = ({ size }: { size: number }) => (
    <div
      style={{ width: size, height: size }}
      className="rounded-xl overflow-hidden border-2 border-slate-200 group-hover:border-emerald-400 transition-colors flex items-center justify-center bg-emerald-50 text-emerald-600 font-bold text-sm shadow-sm shrink-0"
    >
      {avatarSrc ? (
        <Image
          src={avatarSrc}
          alt={user?.name ?? "Admin"}
          width={size}
          height={size}
          className="object-cover w-full h-full"
          referrerPolicy="no-referrer"
          unoptimized={!!user?.photo && !user?.google_avatar}
        />
      ) : (
        <span style={{ fontSize: size * 0.32 }}>{initials}</span>
      )}
    </div>
  );

  return (
    <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-4 md:px-8 sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Menu size={22} />
        </button>
        <div className="hidden sm:block">
          <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">
            {breadcrumb || "Dashboard"}
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        <div className="h-8 w-px bg-slate-100" />

        {/* Trigger */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen((p) => !p)}
            className="flex items-center gap-3 group"
            aria-expanded={open}
            aria-haspopup="true"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-800 leading-tight group-hover:text-emerald-600 transition-colors">
                {user?.name ?? "Administrator"}
              </p>
              <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase flex items-center justify-end gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                Admin
              </p>
            </div>

            <AvatarBox size={40} />

            <ChevronDown
              className={`w-4 h-4 text-slate-400 hidden sm:block transition-all duration-200 ${
                open
                  ? "rotate-180 text-emerald-500"
                  : "group-hover:text-emerald-500"
              }`}
            />
          </button>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 mt-3 w-60 rounded-2xl border border-slate-100 bg-white shadow-xl shadow-slate-200/60 z-50 overflow-hidden">
              {/* Top accent */}
              <div className="h-px w-full bg-linear-to-r from-transparent via-emerald-400/50 to-transparent" />

              {/* Profile header */}
              <div className="px-4 py-3.5 bg-slate-50/80 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <AvatarBox size={36} />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate leading-tight">
                      {user?.name ?? "Administrator"}
                    </p>
                    <p className="text-xs text-slate-400 truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <span className="mt-2 inline-flex items-center gap-1 text-[10px] text-emerald-600 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  <ShieldCheck size={10} /> Administrator
                </span>
              </div>

              {/* Menu items */}
              <div className="py-1.5">
                <Link
                  href="/admin/profile"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors group/item"
                >
                  <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover/item:bg-emerald-50 flex items-center justify-center transition-colors shrink-0">
                    <User
                      size={13}
                      className="text-slate-400 group-hover/item:text-emerald-500 transition-colors"
                    />
                  </div>
                  <span className="font-medium">Profil Saya</span>
                </Link>
              </div>

              {/* Logout */}
              <div className="border-t border-slate-100 py-1.5">
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-500 hover:text-red-500 hover:bg-red-50/60 transition-colors disabled:opacity-40 group/logout"
                >
                  <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover/logout:bg-red-50 flex items-center justify-center transition-colors shrink-0">
                    {loggingOut ? (
                      <Loader2
                        size={13}
                        className="animate-spin text-slate-400"
                      />
                    ) : (
                      <LogOut
                        size={13}
                        className="text-slate-400 group-hover/logout:text-red-500 transition-colors"
                      />
                    )}
                  </div>
                  <span className="font-medium">
                    {loggingOut ? "Keluar..." : "Keluar"}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
