"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import LayoutAdmin from "@/components/admin/LayoutAdmin";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Upload,
  ImageIcon,
  FileText,
  Tag,
  User,
  Check,
  Loader2,
  X,
  Star,
} from "lucide-react";
import RichTextEditor from "@/components/admin/RichTextEditor";

type FormData = {
  judul: string;
  kategori: string;
  penulis: string;
  isi: string;
  gambar: string;
  is_featured: boolean;
};

type FormErrors = Partial<Record<keyof FormData, string[]>>;

export default function CreateArtikelPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormData>({
    judul: "",
    kategori: "",
    penulis: "Admin",
    isi: "",
    gambar: "",
    is_featured: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name as keyof FormData])
      setErrors((p) => ({ ...p, [name]: undefined }));
  };

  const handleFileSelect = async (file: File) => {
    setUploadError(null);
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      setUploadError("Tipe file tidak didukung. Gunakan JPG, PNG, atau WebP");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      setUploadError("Ukuran file maksimal 3MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "fitlife/artikels");
      const res = await fetch("/api/upload/menu", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setForm((p) => ({ ...p, gambar: data.url }));
      } else {
        setUploadError(data.message || "Gagal upload gambar");
        setImagePreview(null);
      }
    } catch {
      setUploadError("Terjadi kesalahan saat upload");
      setImagePreview(null);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setForm((p) => ({ ...p, gambar: "" }));
    setUploadError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async () => {
    setErrors({});
    setSaving(true);
    try {
      const res = await fetch("/api/artikels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok || res.status === 201) {
        setSuccess(true);
        setTimeout(() => router.push("/admin/artikel"), 1200);
      } else if (data.errors) {
        setErrors(data.errors);
      } else {
        setErrors({ judul: [data.message || "Terjadi kesalahan"] });
      }
    } catch {
      setErrors({ judul: ["Terjadi kesalahan server"] });
    } finally {
      setSaving(false);
    }
  };

  const inputClass = (field: keyof FormData) =>
    `w-full px-4 py-2.5 border rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#22c55e] focus:border-transparent text-sm transition-all outline-none text-gray-800 placeholder:text-gray-400 ${
      errors[field] ? "border-red-300 bg-red-50" : "border-gray-200"
    }`;

  return (
    <LayoutAdmin>
      <div className="p-4 md:p-8 max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/admin/artikel"
            className="p-2 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all text-gray-500"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Tambah Artikel Baru
            </h1>
            <p className="text-gray-500 text-sm">
              Isi konten artikel kesehatan
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Upload Gambar */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <label className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#22c55e]" />
              Foto / Thumbnail <span className="text-red-400">*</span>
            </label>

            {imagePreview ? (
              <div className="relative rounded-xl overflow-hidden border border-gray-200">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  width={600}
                  height={240}
                  className="w-full h-48 object-cover"
                  unoptimized
                />
                {uploading && (
                  <div className="absolute inset-0 bg-white/70 flex flex-col items-center justify-center gap-2">
                    <Loader2 className="w-6 h-6 text-[#22c55e] animate-spin" />
                    <span className="text-xs text-gray-500 font-medium">
                      Mengupload...
                    </span>
                  </div>
                )}
                {!uploading && (
                  <>
                    <button
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-lg shadow border border-gray-200 text-gray-500 hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {form.gambar && (
                      <div className="absolute bottom-2 left-2 bg-green-500 text-white text-xs px-2.5 py-1 rounded-lg flex items-center gap-1 font-medium">
                        <Check className="w-3 h-3" /> Berhasil diupload
                      </div>
                    )}
                  </>
                )}
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
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
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  dragOver
                    ? "border-[#22c55e] bg-green-50"
                    : "border-gray-200 hover:border-[#22c55e] hover:bg-green-50/50"
                }`}
              >
                <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-500">
                  Klik atau drag foto ke sini
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  JPG, PNG, WebP — Maks. 3MB
                </p>
              </div>
            )}
            {uploadError && (
              <p className="text-red-500 text-xs mt-2">{uploadError}</p>
            )}
            {errors.gambar && (
              <p className="text-red-500 text-xs mt-2">{errors.gambar[0]}</p>
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

          {/* Info Dasar */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#22c55e]" />
              Informasi Artikel
            </h2>

            {/* Judul */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Judul Artikel <span className="text-red-400">*</span>
              </label>
              <input
                name="judul"
                value={form.judul}
                onChange={handleChange}
                placeholder="Contoh: 5 Tips Makan Sehat untuk Pemula"
                className={inputClass("judul")}
              />
              {errors.judul && (
                <p className="text-red-500 text-xs mt-1">{errors.judul[0]}</p>
              )}
            </div>

            {/* Kategori & Penulis */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  <Tag className="w-3.5 h-3.5 inline mr-1" />
                  Kategori <span className="text-red-400">*</span>
                </label>
                <input
                  name="kategori"
                  value={form.kategori}
                  onChange={handleChange}
                  placeholder="Contoh: Nutrisi, Diet, Olahraga"
                  className={inputClass("kategori")}
                />
                {errors.kategori && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.kategori[0]}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  <User className="w-3.5 h-3.5 inline mr-1" />
                  Penulis
                </label>
                <input
                  name="penulis"
                  value={form.penulis}
                  onChange={handleChange}
                  placeholder="Nama penulis"
                  className={inputClass("penulis")}
                />
                {errors.penulis && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.penulis[0]}
                  </p>
                )}
              </div>
            </div>

            {/* Featured toggle */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                <Star className="w-3.5 h-3.5 inline mr-1" />
                Tampilkan sebagai Featured
              </label>
              <button
                type="button"
                onClick={() =>
                  setForm((p) => ({ ...p, is_featured: !p.is_featured }))
                }
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${
                  form.is_featured
                    ? "border-yellow-400 bg-yellow-50 text-yellow-700"
                    : "border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300"
                }`}
              >
                <Star
                  className={`w-4 h-4 transition-all ${form.is_featured ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`}
                />
                {form.is_featured
                  ? "Featured — Tampil di Highlight"
                  : "Reguler — Tidak Featured"}
              </button>
            </div>
          </div>

          {/* Isi Artikel */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Isi Artikel <span className="text-red-400">*</span>
            </label>
            <RichTextEditor
              value={form.isi}
              onChange={(val) => {
                setForm((p) => ({ ...p, isi: val }));
                if (errors.isi) setErrors((p) => ({ ...p, isi: undefined }));
              }}
              placeholder="Tulis konten artikel di sini..."
              error={!!errors.isi}
            />
            {errors.isi && (
              <p className="text-red-500 text-xs mt-1">{errors.isi[0]}</p>
            )}
            <div className="flex items-center justify-between mt-1.5">
              {errors.isi ? (
                <p className="text-red-500 text-xs">{errors.isi[0]}</p>
              ) : (
                <span />
              )}
              <span className="text-xs text-gray-400 ml-auto">
                {form.isi.length} karakter
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pb-4">
            <Link
              href="/admin/artikel"
              className="flex-1 sm:flex-none px-6 py-2.5 border border-gray-200 rounded-xl text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-all text-center"
            >
              Batal
            </Link>
            <button
              onClick={handleSubmit}
              disabled={saving || uploading || !form.gambar}
              className="flex-1 sm:flex-none bg-[#22c55e] hover:bg-[#16a34a] disabled:bg-gray-200 disabled:text-gray-400 text-white px-8 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-500/20 disabled:shadow-none"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...
                </>
              ) : success ? (
                <>
                  <Check className="w-4 h-4" /> Tersimpan!
                </>
              ) : (
                "Publikasikan Artikel"
              )}
            </button>
          </div>
        </div>
      </div>
    </LayoutAdmin>
  );
}
