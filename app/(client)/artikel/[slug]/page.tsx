"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  Eye,
  Tag,
  BookOpen,
  Loader2,
  Star,
} from "lucide-react";

type Artikel = {
  id: number;
  judul: string;
  slug: string;
  kategori: string;
  penulis: string;
  gambar: string;
  is_featured: boolean | null;
  dibaca: number | null;
  isi: string;
  created_at: string;
  updated_at: string;
};

export default function ArtikelDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [artikel, setArtikel] = useState<Artikel | null>(null);
  const [related, setRelated] = useState<Artikel[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const fetchArtikel = useCallback(async () => {
    try {
      const res = await fetch(`/api/artikels/${slug}`);
      if (res.status === 404) {
        setNotFound(true);
        return;
      }
      if (res.ok) {
        const data: Artikel = await res.json();
        setArtikel(data);

        // Fetch related by kategori
        const relRes = await fetch(
          `/api/artikels?kategori=${encodeURIComponent(data.kategori)}`,
        );
        if (relRes.ok) {
          const relData: Artikel[] = await relRes.json();
          setRelated(relData.filter((a) => a.slug !== slug).slice(0, 3));
        }
      }
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchArtikel();
  }, [fetchArtikel]);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const stripHtml = (html: string) =>
    html.replace(/<[^>]*>/g, "").slice(0, 100) + "...";

  if (loading) {
    return (
      <div className="min-h-screen bg-background-base flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-text-muted text-sm">Memuat artikel...</p>
        </div>
      </div>
    );
  }

  if (notFound || !artikel) {
    return (
      <div className="min-h-screen bg-background-base flex flex-col items-center justify-center gap-4">
        <BookOpen className="w-12 h-12 text-text-muted/30" />
        <p className="text-text-light font-bold text-lg">
          Artikel tidak ditemukan
        </p>
        <Link
          href="/artikel"
          className="text-primary text-sm font-semibold hover:underline"
        >
          ← Kembali ke Artikel
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-base">
      {/* ── Hero Image ── */}
      <div className="relative h-72 md:h-[480px] w-full overflow-hidden">
        <Image
          src={artikel.gambar}
          alt={artikel.judul}
          fill
          className="object-cover"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-linear-to-t from-background-base via-background-base/60 to-transparent" />

        <button
          onClick={() => router.back()}
          className="absolute top-6 left-6 flex items-center gap-2 bg-background-dark/70 backdrop-blur-sm border border-card-border text-text-light px-4 py-2 rounded-xl text-sm font-semibold hover:border-primary/50 hover:text-primary transition-all"
        >
          <ArrowLeft size={16} /> Kembali
        </button>

        {artikel.is_featured && (
          <div className="absolute top-6 right-6 bg-primary text-background-dark text-xs font-black px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <Star size={10} className="fill-background-dark" /> UNGGULAN
          </div>
        )}
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-16 relative z-10 pb-20">
        {/* ── Article Card ── */}
        <div className="bg-card-dark border border-card-border rounded-3xl overflow-hidden shadow-2xl">
          <div className="h-1 w-full bg-linear-to-r from-transparent via-primary/60 to-transparent" />

          <div className="p-8 md:p-10">
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="flex items-center gap-1.5 text-xs text-primary font-bold bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
                <Tag size={10} /> {artikel.kategori}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-text-muted">
                <Clock size={11} /> {formatDate(artikel.created_at)}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-text-muted">
                <Eye size={11} /> {artikel.dibaca ?? 0} kali dibaca
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-black text-text-light leading-tight mb-6">
              {artikel.judul}
            </h1>

            {/* Author */}
            <div className="flex items-center gap-3 pb-6 mb-8 border-b border-card-border">
              <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-sm">
                {artikel.penulis[0].toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-bold text-text-light">
                  {artikel.penulis}
                </p>
                <p className="text-[11px] text-text-muted uppercase tracking-widest">
                  Penulis
                </p>
              </div>
            </div>

            {/* Content */}
            <div
              className="artikel-content text-text-muted leading-relaxed"
              dangerouslySetInnerHTML={{ __html: artikel.isi }}
            />
          </div>
        </div>

        {/* ── Related Articles ── */}
        {related.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 bg-primary rounded-full" />
              <h2 className="text-xl font-black text-text-light">
                Artikel Terkait
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((item) => (
                <Link key={item.id} href={`/artikel/${item.slug}`}>
                  <div className="group bg-card-dark border border-card-border rounded-2xl overflow-hidden hover:border-primary/30 transition-all hover:-translate-y-1">
                    <div className="relative h-36 overflow-hidden">
                      <Image
                        src={item.gambar}
                        alt={item.judul}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-card-dark/70 to-transparent" />
                    </div>
                    <div className="p-4">
                      <span className="text-[10px] text-primary font-bold">
                        {item.kategori}
                      </span>
                      <h3 className="text-sm font-bold text-text-light mt-1 line-clamp-2 group-hover:text-primary transition-colors">
                        {item.judul}
                      </h3>
                      <p className="text-[11px] text-text-muted mt-1 line-clamp-2">
                        {stripHtml(item.isi)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
