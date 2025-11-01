import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";



const SubscriptionBanner = () => {
  const [showLicenseBanner, setShowLicenseBanner] = useState(true);

  return (
    <AnimatePresence>
      {showLicenseBanner && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className="mb-6 rounded-2xl  border border-border bg-background p-4 shadow-sm "
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <VerifiedUserOutlinedIcon className="mt-0.5 h-5 w-5 text-foreground" />
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  You are using the Freemium version
                </h3>
                <p className="mt-1 text-sm text-muted">
                  Unlock enterprise features, unlimited scale, and dedicated
                  support. Activate your license to remove restrictions and
                  enable deployment automation.
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <button className="rounded-xl border border-primary px-4 py-2 text-sm font-medium transition-colors text-primary hover:bg-primary hover:text-background">
                    Activate License
                  </button>
                  <button className="rounded-xl border border-muted px-4 py-2 text-sm text-muted hover:bg-foreground/5">
                    Compare Plans
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowLicenseBanner(false)}
              className="rounded-xl p-2 text-muted hover:bg-foreground/5"
              aria-label="Dismiss"
            >
              <CloseRoundedIcon />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SubscriptionBanner;
