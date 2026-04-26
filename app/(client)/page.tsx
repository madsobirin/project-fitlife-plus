import Link from "next/link";
import Image from "next/image";
import {
  Scale,
  Utensils,
  BookOpen,
  ChevronRight,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import HomeRecentContent from "@/components/HomeRecentContent";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-background-base pt-12 pb-20 lg:pt-24 lg:pb-32 overflow-hidden">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-br from-background-dark via-background-base to-background-dark opacity-80 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 filter blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="w-full lg:w-1/2 text-left">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-card-dark border border-card-border text-primary text-sm font-bold tracking-wide uppercase mb-6">
                <Sparkles size={14} />
                Hidup lebih sehat dan bahagia
              </span>
              <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight mb-6 text-text-light">
                Selamat Datang di{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-green-300">
                  Fitlife.id
                </span>
              </h1>
              <p className="text-lg text-text-muted mb-8 leading-relaxed max-w-xl">
                Platform manajemen diet dan pola makan digital untuk hidup yang
                lebih sehat dengan menu lezat, artikel inspiratif, dan
                kalkulator BMI.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-start">
                <Link
                  href="/kalkulator"
                  className="bg-primary text-slate-800 hover:bg-primary-hover px-8 py-3.5 rounded-full font-bold shadow-[0_0_20px_rgba(0,255,127,0.4)] transition transform hover:-translate-y-1 text-center flex items-center justify-center gap-2"
                >
                  Mulai Sekarang
                  <ArrowRight size={18} />
                </Link>
                <Link
                  href="/"
                  className="bg-transparent border border-card-border hover:border-primary text-text-light hover:text-primary px-8 py-3.5 rounded-full font-bold transition text-center"
                >
                  Pelajari Lebih Lanjut
                </Link>
              </div>
            </div>

            <div className="w-full lg:w-1/2 relative group">
              <div className="absolute inset-0 bg-primary/20 rounded-3xl transform rotate-3 scale-95 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"></div>
              <div className="relative rounded-3xl overflow-hidden border border-card-border shadow-2xl">
                <Image
                  alt="Healthy Lifestyle"
                  className="object-cover w-full h-100 lg:h-125 transform transition duration-500 group-hover:scale-105"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQ4ZkSFClO1fXtFbM0XmO9HaCa_r9xNW8tboOEpzU7LBjEFr5MPX4c86KmN2zBDe6d_YoFLQVSQ8A05NFXJEdmxFjW4rakGfhZleToMRiI8UAtyHgiXcg4cLOpsjuifCjLKlfYK-f4nZ5SdfmAy-FXZ0pOfr1n2CUBYI3h5myPjfEaNdOSnDRu-HUcTPQX59IVEidQcadhat-aKa25U7WoftnrqckvkVyf84ERzpSltf24cU-EJFf78t3LWPE77S3ylwfSmnh3JNY"
                  width={800}
                  height={600}
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text-light mb-4">
              Fitur Unggulan FitLife.id
            </h2>
            <p className="text-text-muted text-lg">
              Dapatkan semua yang anda butuhkan untuk mencapai tujuan kesehatan
              anda
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 - BMI */}
            <div className="bg-card-dark rounded-2xl p-8 shadow-lg hover:shadow-primary/10 transition-all border border-card-border flex flex-col items-center text-center group hover:border-primary/50">
              <div className="w-16 h-16 bg-background-base text-primary border border-card-border rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:shadow-[0_0_15px_rgba(0,255,127,0.2)]">
                <Scale size={32} />
              </div>
              <h3 className="text-xl font-bold text-text-light mb-3">
                Kalkulator BMI
              </h3>
              <p className="text-text-muted mb-8 grow">
                Hitung indeks massa tubuh anda dan dapatkan rekomendasi berat
                badan ideal secara instan.
              </p>
              <Link
                href="/kalkulator"
                className="w-full bg-transparent border border-primary text-primary hover:bg-primary hover:text-white py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 group/btn"
              >
                Lihat Detail
                <ChevronRight
                  size={18}
                  className="transition-transform group-hover/btn:translate-x-1"
                />
              </Link>
            </div>

            {/* Feature 2 - Menu */}
            <div className="bg-card-dark rounded-2xl p-8 shadow-lg hover:shadow-primary/10 transition-all border border-card-border flex flex-col items-center text-center group hover:border-primary/50">
              <div className="w-16 h-16 bg-background-base text-primary border border-card-border rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:shadow-[0_0_15px_rgba(0,255,127,0.2)]">
                <Utensils size={32} />
              </div>
              <h3 className="text-xl font-bold text-text-light mb-3">
                Menu Sehat
              </h3>
              <p className="text-text-muted mb-8 grow">
                Temukan berbagai pilihan menu makanan sehat dan lezat yang
                disesuaikan untuk diet anda.
              </p>
              <Link
                href="/menu"
                className="w-full bg-transparent border border-primary text-primary hover:bg-primary hover:text-white py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 group/btn"
              >
                Lihat Detail
                <ChevronRight
                  size={18}
                  className="transition-transform group-hover/btn:translate-x-1"
                />
              </Link>
            </div>

            {/* Feature 3 - Artikel */}
            <div className="bg-card-dark rounded-2xl p-8 shadow-lg hover:shadow-primary/10 transition-all border border-card-border flex flex-col items-center text-center group hover:border-primary/50">
              <div className="w-16 h-16 bg-background-base text-primary border border-card-border rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:shadow-[0_0_15px_rgba(0,255,127,0.2)]">
                <BookOpen size={32} />
              </div>
              <h3 className="text-xl font-bold text-text-light mb-3">
                Artikel
              </h3>
              <p className="text-text-muted mb-8 grow">
                Baca artikel edukatif dan tips praktis seputar gaya hidup sehat
                dan pola makan seimbang.
              </p>
              <Link
                href="/artikel"
                className="w-full bg-transparent border border-primary text-primary hover:bg-primary hover:text-white py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 group/btn"
              >
                Lihat Detail
                <ChevronRight
                  size={18}
                  className="transition-transform group-hover/btn:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Content Section */}
      <HomeRecentContent />

      {/* CTA Section */}
      <section className="bg-linear-to-r from-card-dark to-background-dark border-t border-card-border py-20 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, var(--color-primary) 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        ></div>

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-text-light leading-tight">
            Siap Memulai Perjalanan <br className="hidden md:block" /> Sehat
            Anda?
          </h2>
          <p className="text-lg md:text-xl text-text-muted mb-10 max-w-2xl mx-auto">
            Bergabunglah dengan ribuan pengguna yang telah merasakan manfaat
            hidup lebih sehat bersama FitLife.id.
          </p>
          <Link
            href="kalkulator"
            className="inline-flex items-center gap-3 bg-primary text-slate-800 hover:bg-primary-hover px-10 py-4 rounded-full font-bold text-lg shadow-[0_0_25px_rgba(0,255,127,0.5)] transition transform hover:scale-105"
          >
            <Scale size={22} />
            Hitung BMI Sekarang
          </Link>
        </div>
      </section>
    </>
  );
}
