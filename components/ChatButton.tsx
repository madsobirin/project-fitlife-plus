"use client";

import { useState, useEffect } from "react";
import { MessageCircleMore, X } from "lucide-react";
import ChatPanel from "./ChatPanel";

export default function ChatButton() {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => setIsLoggedIn(res.ok))
      .catch(() => setIsLoggedIn(false));
  }, []);

  return (
    <>
      {/* Panel Chat */}
      <ChatPanel open={open} onClose={() => setOpen(false)} isLoggedIn={isLoggedIn} />

      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setOpen((p) => !p)}
          className={`relative p-4 rounded-full shadow-[0_0_24px_rgba(0,255,127,0.5)] transition-all duration-300 transform hover:scale-110 flex items-center justify-center group ${
            open
              ? "bg-card-dark border border-primary/40 text-primary"
              : "bg-primary hover:bg-primary-hover text-background-dark"
          }`}
        >
          {open ? (
            <X size={22} className="transition-transform" />
          ) : (
            <MessageCircleMore
              size={22}
              className="group-hover:rotate-12 transition-transform"
            />
          )}

          {/* Ping animation saat belum dibuka */}
          {!open && (
            <span className="absolute -top-1 -right-1 w-3 h-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
            </span>
          )}
        </button>
      </div>
    </>
  );
}


