"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import LayoutAdmin from "@/components/admin/LayoutAdmin";
import Image from "next/image";
import {
  User,
  Mail,
  Phone,
  Calendar,
  AtSign,
  Edit3,
  Check,
  X,
  Loader2,
  Camera,
  Upload,
  ShieldCheck,
  Sparkles,
  Clock,
  KeyRound,
  Weight,
  Ruler,
} from "lucide-react";

type ProfileData = {
  id: number;
  name: string | null;
  username: string | null;
  email: string;
  role: string;
  phone: string | null;
  birthdate: string | null;
  weight: number | null;
  height: number | null;
  photo: string | null;
  google_avatar: string | null;
  created_at: string | null;
  last_login_at: string | null;
  password?: string | null;
};

type EditableField = {
  key: keyof ProfileData;
  label: string;
  icon: React.ReactNode;
  type: string;
  placeholder: string;
  editable: boolean;
};

const fields: EditableField[] = [
  {
    key: "name",
    label: "Nama Lengkap",
    icon: <User size={14} />,
    type: "text",
    placeholder: "Masukkan nama lengkap",
    editable: true,
  },
  {
    key: "username",
    label: "Username",
    icon: <AtSign size={14} />,
    type: "text",
    placeholder: "Masukkan username",
    editable: true,
  },
  {
    key: "email",
    label: "Email",
    icon: <Mail size={14} />,
    type: "email",
    placeholder: "Email",
    editable: false,
  },
  {
    key: "phone",
    label: "Nomor Telepon",
    icon: <Phone size={14} />,
    type: "tel",
    placeholder: "Masukkan nomor telepon",
    editable: true,
  },
  {
    key: "birthdate",
    label: "Tanggal Lahir",
    icon: <Calendar size={14} />,
    type: "date",
    placeholder: "",
    editable: true,
  },
  {
    key: "weight",
    label: "Berat Badan (kg)",
    icon: <Weight size={14} />,
    type: "number",
    placeholder: "kg",
    editable: true,
  },
  {
    key: "height",
    label: "Tinggi Badan (cm)",
    icon: <Ruler size={14} />,
    type: "number",
    placeholder: "cm",
    editable: true,
  },
];

export default function AdminProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingField, setEditingField] = useState<keyof ProfileData | null>(
    null,
  );
  const [editValue, setEditValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<keyof ProfileData | null>(
    null,
  );
  const [fieldError, setFieldError] = useState<string | null>(null);

  // Upload
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  // Password
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch("/api/profile");
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      if (res.ok) {
        const d = await res.json();
        setProfile(d.user);
      }
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // ── File upload ──
  const handleFileSelect = (file: File) => {
    setUploadError(null);
    if (
      !["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
        file.type,
      )
    ) {
      setUploadError("Gunakan JPG, PNG, atau WebP");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setUploadError("Maksimal 2MB");
      return;
    }
    setUploadFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setUploadPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!uploadFile) return;
    setUploading(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append("photo", uploadFile);
      const res = await fetch("/api/profile/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setProfile(data.user);
        setUploadPreview(null);
        setUploadFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        setUploadError(data.message || "Gagal upload");
      }
    } catch {
      setUploadError("Terjadi kesalahan");
    } finally {
      setUploading(false);
    }
  };

  // ── Field edit ──
  const startEdit = (field: EditableField) => {
    if (!field.editable) return;
    setEditingField(field.key);
    const val = profile?.[field.key];
    setEditValue(
      field.type === "date" && val
        ? new Date(val as string).toISOString().split("T")[0]
        : val != null
          ? String(val)
          : "",
    );
    setFieldError(null);
  };

  const saveField = async (key: keyof ProfileData) => {
    setSaving(true);
    setFieldError(null);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [key]: editValue }),
      });
      const data = await res.json();
      if (res.ok) {
        setProfile(data.user);
        setEditingField(null);
        setSaveSuccess(key);
        setTimeout(() => setSaveSuccess(null), 2000);
      } else {
        setFieldError(data.message || "Gagal menyimpan");
      }
    } catch {
      setFieldError("Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  };

  // ── Password ──
  const handlePasswordChange = async () => {
    setPasswordError(null);
    if (passwordForm.new !== passwordForm.confirm) {
      setPasswordError("Password tidak cocok");
      return;
    }
    if (passwordForm.new.length < 8) {
      setPasswordError("Minimal 8 karakter");
      return;
    }
    setPasswordSaving(true);
    try {
      const res = await fetch("/api/profile/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordForm.current,
          newPassword: passwordForm.new,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setPasswordSuccess(true);
        setPasswordForm({ current: "", new: "", confirm: "" });
        setTimeout(() => {
          setPasswordSuccess(false);
          setShowPasswordForm(false);
        }, 2500);
      } else {
        setPasswordError(data.message || "Gagal mengubah password");
      }
    } catch {
      setPasswordError("Terjadi kesalahan");
    } finally {
      setPasswordSaving(false);
    }
  };

  const formatValue = (
    field: EditableField,
    val: ProfileData[keyof ProfileData],
  ) => {
    if (val === null || val === undefined || val === "") return null;
    if (field.type === "date")
      return new Date(val as string).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    return String(val);
  };

  const initials = profile?.name
    ? profile.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "A";
  const avatarSrc = uploadPreview || profile?.photo || profile?.google_avatar;

  if (loading) {
    return (
      <LayoutAdmin>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            <p className="text-slate-400 text-sm">Memuat profil...</p>
          </div>
        </div>
      </LayoutAdmin>
    );
  }

  if (!profile) return null;

  return (
    <LayoutAdmin>
      <div className="p-4 md:p-8 max-w-3xl mx-auto">
        {/* ── Header Card ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-6">
          {/* Top accent */}
          <div className="h-1.5 w-full bg-linear-to-r from-emerald-400 via-emerald-500 to-teal-500" />

          <div className="p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* ── Avatar Upload ── */}
            <div className="flex flex-col items-center gap-2 shrink-0">
              <div
                className={`relative w-24 h-24 rounded-2xl overflow-hidden border-2 cursor-pointer transition-all duration-300 ${
                  dragOver
                    ? "border-emerald-400 scale-105 shadow-lg shadow-emerald-500/20"
                    : "border-slate-200 hover:border-emerald-400 hover:shadow-md"
                }`}
                onClick={() => !uploadPreview && fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  const f = e.dataTransfer.files?.[0];
                  if (f) handleFileSelect(f);
                }}
              >
                <div className="w-full h-full flex items-center justify-center bg-emerald-50 text-emerald-600 font-black text-2xl">
                  {avatarSrc ? (
                    <Image
                      src={avatarSrc}
                      alt="Avatar"
                      width={96}
                      height={96}
                      className="object-cover w-full h-full"
                      referrerPolicy="no-referrer"
                      unoptimized
                    />
                  ) : (
                    <span>{initials}</span>
                  )}
                </div>
                {!uploadPreview && (
                  <div className="absolute inset-0 bg-slate-900/50 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                    <Camera size={18} className="text-white" />
                    <span className="text-[10px] text-white font-bold">
                      Ubah
                    </span>
                  </div>
                )}
              </div>

              {uploadPreview ? (
                <div className="flex gap-1.5">
                  <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-xs font-bold hover:bg-emerald-600 transition-colors disabled:opacity-50"
                  >
                    {uploading ? (
                      <Loader2 size={11} className="animate-spin" />
                    ) : (
                      <Upload size={11} />
                    )}
                    {uploading ? "..." : "Simpan"}
                  </button>
                  <button
                    onClick={() => {
                      setUploadPreview(null);
                      setUploadFile(null);
                    }}
                    className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors"
                  >
                    <X size={11} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs text-slate-400 hover:text-emerald-500 transition-colors flex items-center gap-1"
                >
                  <Camera size={11} /> Ubah foto
                </button>
              )}
              {uploadError && (
                <p className="text-red-500 text-[10px] text-center max-w-[110px]">
                  {uploadError}
                </p>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFileSelect(f);
                }}
                className="hidden"
              />
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                <h1 className="text-xl font-black text-slate-800">
                  {profile.name ?? "Administrator"}
                </h1>
                <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-bold bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full w-fit mx-auto sm:mx-0">
                  <ShieldCheck size={11} /> Admin
                </span>
              </div>
              {profile.username && (
                <p className="text-slate-400 text-sm mb-0.5">
                  @{profile.username}
                </p>
              )}
              <p className="text-slate-500 text-sm mb-4">{profile.email}</p>

              <div className="flex flex-wrap justify-center sm:justify-start gap-4">
                {profile.created_at && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Sparkles size={12} className="text-emerald-400" />
                    <span>
                      Bergabung{" "}
                      {new Date(profile.created_at).toLocaleDateString(
                        "id-ID",
                        { month: "long", year: "numeric" },
                      )}
                    </span>
                  </div>
                )}
                {profile.last_login_at && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Clock size={12} className="text-emerald-400" />
                    <span>
                      Login{" "}
                      {new Date(profile.last_login_at).toLocaleDateString(
                        "id-ID",
                        { day: "numeric", month: "short", year: "numeric" },
                      )}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Fields Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {fields.map((field) => {
            const isEditing = editingField === field.key;
            const value = formatValue(field, profile[field.key]);
            const justSaved = saveSuccess === field.key;

            return (
              <div
                key={field.key}
                className={`group bg-white rounded-xl border transition-all duration-200 overflow-hidden ${
                  isEditing
                    ? "border-emerald-300 shadow-sm shadow-emerald-500/10"
                    : justSaved
                      ? "border-emerald-200"
                      : "border-slate-100 hover:border-slate-200 shadow-sm"
                }`}
              >
                {isEditing && (
                  <div className="h-px w-full bg-linear-to-r from-transparent via-emerald-400 to-transparent" />
                )}

                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <span
                        className={
                          isEditing ? "text-emerald-500" : "text-slate-300"
                        }
                      >
                        {field.icon}
                      </span>
                      {field.label}
                    </label>
                    {field.editable && !isEditing && (
                      <button
                        onClick={() => startEdit(field)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md text-slate-400 hover:text-emerald-500 hover:bg-emerald-50"
                      >
                        <Edit3 size={12} />
                      </button>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="space-y-2">
                      <input
                        type={field.type}
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        placeholder={field.placeholder}
                        autoFocus
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 text-sm placeholder:text-slate-300 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                      />
                      {fieldError && (
                        <p className="text-red-500 text-xs">{fieldError}</p>
                      )}
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => saveField(field.key)}
                          disabled={saving}
                          className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-xs font-bold hover:bg-emerald-600 transition-colors disabled:opacity-50 shadow-sm"
                        >
                          {saving ? (
                            <Loader2 size={11} className="animate-spin" />
                          ) : (
                            <Check size={11} />
                          )}
                          Simpan
                        </button>
                        <button
                          onClick={() => {
                            setEditingField(null);
                            setFieldError(null);
                          }}
                          disabled={saving}
                          className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 text-slate-500 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors"
                        >
                          <X size={11} /> Batal
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={
                        field.editable ? "cursor-pointer" : "cursor-default"
                      }
                      onClick={() => field.editable && startEdit(field)}
                    >
                      {justSaved ? (
                        <span className="text-emerald-500 text-sm font-semibold flex items-center gap-1">
                          <Check size={13} /> Tersimpan!
                        </span>
                      ) : value ? (
                        <span className="text-slate-700 text-sm font-medium">
                          {value}
                        </span>
                      ) : (
                        <span className="text-slate-300 text-sm italic">
                          {field.editable ? `Klik untuk mengisi` : "—"}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Ganti Password ── */}
        {profile.password !== null && (
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <button
              onClick={() => {
                setShowPasswordForm((p) => !p);
                setPasswordError(null);
              }}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                  <KeyRound size={14} className="text-emerald-500" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-700">
                    Ubah Password
                  </p>
                  <p className="text-xs text-slate-400">
                    Perbarui keamanan akun admin
                  </p>
                </div>
              </div>
              <div
                className={`transition-transform duration-200 ${showPasswordForm ? "rotate-45" : ""}`}
              >
                {showPasswordForm ? (
                  <X size={15} className="text-slate-400" />
                ) : (
                  <Edit3
                    size={15}
                    className="text-slate-300 group-hover:text-emerald-500 transition-colors"
                  />
                )}
              </div>
            </button>

            {showPasswordForm && (
              <div className="px-5 pb-5 border-t border-slate-100 pt-4 space-y-3">
                {(["current", "new", "confirm"] as const).map((f) => (
                  <div key={f}>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                      {f === "current"
                        ? "Password Saat Ini"
                        : f === "new"
                          ? "Password Baru"
                          : "Konfirmasi Password"}
                    </label>
                    <input
                      type="password"
                      value={passwordForm[f]}
                      onChange={(e) =>
                        setPasswordForm((p) => ({ ...p, [f]: e.target.value }))
                      }
                      placeholder={f === "new" ? "Minimal 8 karakter" : ""}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-slate-800 text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                    />
                  </div>
                ))}

                {passwordError && (
                  <p className="text-red-500 text-xs">{passwordError}</p>
                )}
                {passwordSuccess && (
                  <p className="text-emerald-500 text-xs font-semibold flex items-center gap-1">
                    <Check size={12} /> Password berhasil diubah!
                  </p>
                )}

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={handlePasswordChange}
                    disabled={passwordSaving}
                    className="flex items-center gap-1.5 px-5 py-2 bg-emerald-500 text-white rounded-lg text-xs font-bold hover:bg-emerald-600 transition-colors disabled:opacity-50 shadow-sm shadow-emerald-500/25"
                  >
                    {passwordSaving ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <Check size={12} />
                    )}
                    {passwordSaving ? "Menyimpan..." : "Simpan Password"}
                  </button>
                  <button
                    onClick={() => {
                      setShowPasswordForm(false);
                      setPasswordForm({ current: "", new: "", confirm: "" });
                      setPasswordError(null);
                    }}
                    disabled={passwordSaving}
                    className="px-4 py-2 bg-slate-100 text-slate-500 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors"
                  >
                    Batal
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <p className="text-center text-xs text-slate-300 mt-6">
          Klik field untuk edit langsung • Email tidak dapat diubah
        </p>
      </div>
    </LayoutAdmin>
  );
}
