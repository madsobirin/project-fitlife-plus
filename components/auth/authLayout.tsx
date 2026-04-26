"use client";

import { motion, Variants } from "framer-motion";
import AuthLink from "@/components/ui/authLink";

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 25 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

type Props = {
  children: React.ReactNode;
  title?: string;
  titleText?: string;
  linkTitle?: string;
  linkText?: string;
  href: string;
};

export default function AuthLayout({
  children,
  title,
  titleText,
  linkText,
  linkTitle,
  href,
}: Props) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f7f6] px-6">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full max-w-md"
      >
        <AuthLink linkText={linkText} linkTitle={linkTitle} href={href} />

        <motion.div variants={item} className="mb-10">
          <h1 className="text-[36px] font-bold text-neutral-900">{title}</h1>
          <p className="text-neutral-500 mt-2 text-[15px]">{titleText}</p>
        </motion.div>

        {children}
      </motion.div>
    </div>
  );
}
