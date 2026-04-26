import Link from "next/link";
import { motion, Variants } from "framer-motion";

const item: Variants = {
  hidden: { opacity: 0, y: 25 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

type LinkType = {
  linkText?: string;
  linkTitle?: string;
  href: string;
};

const AuthLink = ({ linkText, linkTitle, href }: LinkType) => {
  return (
    <div>
      {/* top link */}
      <motion.div variants={item} className="flex justify-end text-sm mb-14">
        <span className="text-neutral-500">
          {linkTitle}{" "}
          <Link
            href={href}
            className="text-emerald-500 font-semibold hover:underline"
          >
            {linkText}
          </Link>
        </span>
      </motion.div>
    </div>
  );
};

export default AuthLink;
