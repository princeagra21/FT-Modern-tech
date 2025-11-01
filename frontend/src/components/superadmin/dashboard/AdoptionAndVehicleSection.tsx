import React, { useEffect, useMemo, useState } from "react";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import DirectionsCarOutlinedIcon from "@mui/icons-material/DirectionsCarOutlined";
import { motion, AnimatePresence } from "framer-motion";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

const AdoptionAndVehicleSection = () => {
  const [tf, setTf] = useState<"12m" | "6m" | "3m">("12m");
  const [showVehicles, setShowVehicles] = useState(true);
  const [showUsers, setShowUsers] = useState(true);
  const [showLicenses, setShowLicenses] = useState(true);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const vehiclesRaw = [120, 160, 240, 355, 540, 840, 1120, 1500, 2050, 2600, 3100, 3577];
  const usersRaw = [80, 130, 210, 340, 500, 760, 980, 1400, 2000, 2600, 3200, 3847];
  const licensesRaw = [1000, 2500, 5000, 8500, 12000, 18000, 25000, 32000, 38000, 45000, 52000, 57067];
  const [ApexChart, setApexChart] = useState<any>(null);
  const [chartError, setChartError] = useState<null | string>(null);
  const [isClient, setIsClient] = useState(false);

  const tfLen = tf === "12m" ? 12 : tf === "6m" ? 6 : 3;
  const cats = useMemo(() => months.slice(-tfLen), [tfLen]);
  const vehicles = useMemo(() => vehiclesRaw.slice(-tfLen), [tfLen]);
  const users = useMemo(() => usersRaw.slice(-tfLen), [tfLen]);
  const licenses = useMemo(() => licensesRaw.slice(-tfLen), [tfLen]);

  const [toast, setToast] = useState({
    open: false,
    message: "",
    tone: "neutral" as "neutral" | "success" | "warning" | "error",
  });

  const vehicleStatus = [
    { label: "Running", count: 2986, pct: 26.6 },
    { label: "Stop", count: 111, pct: 0.99 },
    { label: "Not Working (48 hours)", count: 7194, pct: 64.08 },
    { label: "No Data", count: 935, pct: 8.33 },
  ];

  const adoptionOptions: any = useMemo(
    () => ({
      chart: { type: "area", toolbar: { show: false }, animations: { enabled: true, easing: "easeinout", speed: 600 }, background: "transparent" },
      colors: ["#000000", "#525252", "#737373"],
      dataLabels: { enabled: false },
      stroke: { curve: "smooth", width: 2 },
      fill: { type: "gradient", gradient: { shadeIntensity: 0.8, opacityFrom: 0.3, opacityTo: 0.05, stops: [0, 90, 100] } },
      grid: { borderColor: "#e5e5e5", strokeDashArray: 3 },
      xaxis: { categories: cats },
      yaxis: { labels: { formatter: (v: number) => `${Intl.NumberFormat("en-US", { notation: "compact" }).format(v)}` } },
      legend: { show: true, position: "top", horizontalAlign: "right" },
    }),
    [cats]
  );

  const showToast = (message: string, tone = "neutral") => {
    setToast({ open: true, message, tone });
    setTimeout(() => setToast((t) => ({ ...t, open: false })), 1500);
  };

  const [copyModalOpen, setCopyModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const adoptionSeries = useMemo(() => {
    const series: any[] = [];
    if (showVehicles) series.push({ name: "Vehicles", data: vehicles });
    if (showUsers) series.push({ name: "Users", data: users });
    if (showLicenses) series.push({ name: "Licenses", data: licenses });
    return series;
  }, [showVehicles, showUsers, showLicenses, vehicles, users, licenses]);

  const ToggleChip = ({ active, onClick, children }: any) => (
    <button
      onClick={onClick}
      className={`rounded-xl border px-3 py-1 text-xs transition ${
        active
          ? "border-primary bg-primary text-white"
          : "border-primary text-primary hover:bg-foreground/5"
      }`}
    >
      {children}
    </button>
  );

  async function safeCopyText(text: string) {
    try {
      if (navigator?.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return "copied";
      }
    } catch {}
    setModalContent(text);
    setCopyModalOpen(true);
    return "modal";
  }

  useEffect(() => {
    setIsClient(true);
    (async () => {
      try {
        const mod = await import("react-apexcharts");
        const chart = mod?.default ?? mod;
        setApexChart(() => chart);
      } catch (err: any) {
        setChartError(err?.message || "Chart load failed");
      }
    })();
  }, []);

  const Toast = ({ open, message, tone }: any) => (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          className={`fixed bottom-6 right-6 z-50 rounded-xl border px-3 py-2 text-xs shadow-sm ${
            tone === "success"
              ? "border-border bg-foreground text-background"
              : "border-border bg-background text-foreground"
          }`}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <section className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-[7fr_3fr]">
        {/* Adoption Chart */}
        <div className="rounded-2xl border border-border bg-background p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <TimelineOutlinedIcon className="h-5 w-5 text-foreground" />
              <h3 className="text-sm font-semibold text-foreground">Adoption & Growth</h3>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <ToggleChip active={tf === "12m"} onClick={() => setTf("12m")}>12M</ToggleChip>
              <ToggleChip active={tf === "6m"} onClick={() => setTf("6m")}>6M</ToggleChip>
              <ToggleChip active={tf === "3m"} onClick={() => setTf("3m")}>3M</ToggleChip>
              <span className="mx-1 h-4 w-px bg-border" />
              <ToggleChip active={showVehicles} onClick={() => setShowVehicles(!showVehicles)}>Vehicles</ToggleChip>
              <ToggleChip active={showUsers} onClick={() => setShowUsers(!showUsers)}>Users</ToggleChip>
              <ToggleChip active={showLicenses} onClick={() => setShowLicenses(!showLicenses)}>Licenses</ToggleChip>
              <span className="mx-1 h-4 w-px bg-border" />
              <button
                onClick={async () => {
                  const payload = JSON.stringify({ cats, adoptionSeries }, null, 2);
                  const result = await safeCopyText(payload);
                  if (result === "copied") showToast("Copied to clipboard", "success");
                  else showToast("Manual copy: opened modal", "warning");
                }}
                className="rounded-xl border border-border p-1 text-muted hover:bg-foreground/5"
              >
                <ContentCopyOutlinedIcon fontSize="small" />
              </button>
              <button className="rounded-xl border border-border p-1 text-muted hover:bg-foreground/5">
                <TuneOutlinedIcon fontSize="small" />
              </button>
            </div>
          </div>

          <div className="w-full">
            {isClient && typeof ApexChart === "function" ? (
              adoptionSeries.length > 0 ? (
                <ApexChart options={adoptionOptions} series={adoptionSeries} type="area" height={300} />
              ) : (
                <div className="flex h-[300px] items-center justify-center rounded-xl border border-dashed border-border bg-muted text-xs text-muted">
                  Enable at least one series.
                </div>
              )
            ) : (
              <div className="relative h-[300px] w-full overflow-hidden rounded-xl border border-border bg-muted">
                <div className="absolute inset-0 animate-pulse bg-muted" />
                <div className="relative z-10 m-4 text-center text-xs text-muted">
                  {chartError ? <p>{chartError}</p> : <span>Loading chart…</span>}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Vehicle Status */}
        <div className="rounded-2xl border border-border bg-background p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <DirectionsCarOutlinedIcon className="h-5 w-5 text-foreground" />
            <h3 className="text-sm font-semibold text-foreground">Vehicle Status</h3>
          </div>
          <div className="space-y-4">
            {vehicleStatus.map((s) => (
              <motion.div key={s.label} whileHover={{ scale: 1.01 }}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-foreground">{s.label}</span>
                  <span className="font-medium text-foreground">
                    {Intl.NumberFormat().format(s.count)}{" "}
                    <span className="text-muted">({s.pct}%)</span>
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-primary/50">
                  <div className="h-2 rounded-full bg-primary" style={{ width: `${s.pct}%` }} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {copyModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              className="relative w-[min(90vw,720px)] rounded-2xl border border-border bg-background p-4 shadow-xl"
            >
              <div className="mb-2 flex items-center justify-between">
                <h4 className="text-sm font-semibold text-foreground">Manual Copy</h4>
                <button className="rounded-lg p-1 text-muted hover:bg-muted" onClick={() => setCopyModalOpen(false)}>
                  <CloseRoundedIcon fontSize="small" />
                </button>
              </div>
              <p className="mb-2 text-xs text-muted">
                Select all and press <strong>Ctrl/⌘ + C</strong>.
              </p>
              <textarea
                readOnly
                value={modalContent}
                className="h-56 w-full resize-none rounded-xl border border-border bg-muted p-3 text-[11px] text-foreground focus:outline-none"
                onFocus={(e) => e.currentTarget.select()}
              />
              <div className="mt-3 flex justify-end">
                <button
                  className="rounded-xl border border-border px-3 py-1.5 text-xs text-foreground hover:bg-muted"
                  onClick={() => setCopyModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Toast {...toast} />
    </>
  );
};

export default AdoptionAndVehicleSection;
