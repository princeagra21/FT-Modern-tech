import React from "react";
import { motion } from "framer-motion";

const KpiCardBase = ({
  title,
  value,
  Icon,
  subTitle
}: {
  title: string;
  subTitle?: string;
  value: number | string;
  Icon?: any;
}) => {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="group rounded-2xl border border-border bg-background dark:bg-foreground/5 p-4 shadow-sm hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <span className="typo-subtitle">
          {title}
        </span>
        { Icon && <Icon className="h-5 w-5 text-muted group-hover:text-foreground" />}
      </div>
      <div className="mt-3 typo-h1 font-semibold  text-foreground">
        {typeof value === "number" ? Intl.NumberFormat().format(value) : value }
      </div>
      {subTitle && <p className="text-muted text-sm">{subTitle}</p>}
    </motion.div>
  );
};

export default KpiCardBase;
