import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  Phone,
  MapPin,
  Home,
  Scale,
  Utensils,
  FileText,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-background-dark pt-12 pb-8 border-t border-card-border transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Image src="/logo.png" alt="Logo" width={30} height={30} />
              <span className="font-bold text-xl text-text-light tracking-tight">
                FitLife.id
              </span>
            </div>
            <p className="text-text-muted text-sm max-w-xs leading-relaxed">
              Platform kesehatan terpercaya untuk membantu Anda mencapai berat
              badan ideal dan gaya hidup sehat dengan pendekatan berbasis data.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-bold text-text-light mb-5 text-sm uppercase tracking-wider">
              Navigasi
            </h4>
            <ul className="space-y-3 text-sm text-text-muted">
              <li>
                <Link
                  href="#"
                  className="hover:text-primary transition flex items-center gap-2"
                >
                  <Home size={16} /> Home
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-primary transition flex items-center gap-2"
                >
                  <Scale size={16} /> Kalkulator BMI
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-primary transition flex items-center gap-2"
                >
                  <Utensils size={16} /> Menu Sehat
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-primary transition flex items-center gap-2"
                >
                  <FileText size={16} /> Artikel
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold text-text-light mb-5 text-sm uppercase tracking-wider">
              Hubungi Kami
            </h4>
            <ul className="space-y-3 text-sm text-text-muted">
              <li className="flex items-start gap-3">
                <Mail size={18} className="text-primary shrink-0" />
                <span>support@fitlife.id</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={18} className="text-primary shrink-0" />
                <span>+62 812 3456 7890</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-primary shrink-0" />
                <span>Jakarta, Indonesia</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-card-border pt-8 text-center text-xs text-text-muted uppercase tracking-widest font-medium">
          © {new Date().getFullYear()} FitLife.id. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
