"use client";
import React, { useEffect, useMemo, useState } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TodayIcon from "@mui/icons-material/Today";
import SearchIcon from "@mui/icons-material/Search";
import EventNoteIcon from "@mui/icons-material/EventNote";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import DirectionsCarFilledIcon from "@mui/icons-material/DirectionsCarFilled";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import { CalendarEvent, EventKind, FilterState } from "@/lib/types/superadmin";
import { SEED } from "@/lib/data/superadmin";
import {
  addDays,
  aggMonth,
  densityClass,
  dotClass,
  emptyAgg,
  endOfMonth,
  fmtDay,
  fmtMonthLabel,
  isSameDay,
  kindIcon,
  kindLabel,
  startOfMonth,
  startOfWeek,
  toDate,
} from "@/lib/utils/superadmin/calendar";

// Utilities

// Aggregation helpers

// Main
export default function EventsCalendar({
  isSuperAdmin=true,
}: {
  isSuperAdmin?: boolean;
}) {
  const today = new Date();
  const [cursor, setCursor] = useState<Date>(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [filters, setFilters] = useState<FilterState>(
    isSuperAdmin
      ? {
          ADMIN_CREATED: true,
          USER_CREATED: true,
          VEHICLE_EXPIRY: true,
          VEHICLE_ADDED: true,
        }
      : {
          USER_CREATED: true,
          VEHICLE_EXPIRY: true,
          VEHICLE_ADDED: true,
        }
  );
  const [query, setQuery] = useState("");
  const [focusDay, setFocusDay] = useState<Date | null>(today);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [panelPage, setPanelPage] = useState(1);
  const PAGE_SIZE = 20;

  const monthStart = startOfMonth(cursor);
  const monthEnd = endOfMonth(cursor);
  const gridStart = startOfWeek(monthStart);
  const totalDays = 42; // 6 rows * 7

  const visibleEvents = useMemo(
    () =>
      SEED.filter((ev) => {
        if (!isSuperAdmin && ev.kind === "ADMIN_CREATED") return false;
        const k = filters[ev.kind as EventKind];
        if (!k) return false;
        const t = toDate(ev.at);
        if (t < gridStart || t > addDays(gridStart, totalDays - 1))
          return false;
        const q = query.trim().toLowerCase();
        if (!q) return true;
        return [
          ev.title,
          ev.note,
          ev.kind,
          ev.meta ? JSON.stringify(ev.meta) : "",
        ]
          .join(" ")
          .toLowerCase()
          .includes(q);
      }),
    [cursor, filters, query]
  );

  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const ev of visibleEvents) {
      const key = ev.at.slice(0, 10);
      const arr = map.get(key) || [];
      arr.push(ev);
      map.set(key, arr);
    }
    // Sort by time within day
    for (const [, arr] of map)
      arr.sort((a, b) => toDate(a.at).getTime() - toDate(b.at).getTime());
    return map;
  }, [visibleEvents]);

  const agg = useMemo(() => aggMonth(visibleEvents), [visibleEvents]);
  const maxInMonth = useMemo(
    () => Array.from(agg.values()).reduce((m, a) => Math.max(m, a.total), 0),
    [agg]
  );

  const days = useMemo(
    () => Array.from({ length: totalDays }, (_, i) => addDays(gridStart, i)),
    [cursor]
  );

  function toggleFilter(kind: EventKind) {
    setFilters((f) => ({ ...f, [kind]: !f[kind] }));
  }
  function goMonth(delta: number) {
    const d = new Date(cursor);
    d.setMonth(d.getMonth() + delta, 1);
    setCursor(d);
    setFocusDay(null);
    setSelectedEvent(null);
    setPanelPage(1);
  }
  function goToday() {
    const d = new Date();
    setCursor(new Date(d.getFullYear(), d.getMonth(), 1));
    setFocusDay(d);
    setSelectedEvent(null);
    setPanelPage(1);
  }

  const focusKey = focusDay ? focusDay.toISOString().slice(0, 10) : "";
  const focusEvents = useMemo(
    () => (focusDay ? eventsByDate.get(focusKey) || [] : []),
    [focusKey, eventsByDate]
  );

  function openDay(d: Date) {
    setFocusDay(d);
    setPanelPage(1);
    setSelectedEvent(null);
  }
  function pageSlice<T>(arr: T[], page: number, size: number) {
    const s = (page - 1) * size;
    return arr.slice(s, s + size);
  }

  return (
    <div className="mx-auto max-w-7xl p-4 md:p-6">
      {/* Header */}
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <button
              className="rounded-lg border border-border bg-background p-2 text-foreground"
              onClick={() => goMonth(-1)}
              aria-label="Previous month"
            >
              <ChevronLeftIcon />
            </button>
            <div className="min-w-[12rem] text-xl font-semibold tracking-tight text-foreground text-center">
              {fmtMonthLabel(cursor)}
            </div>
            <button
              className="rounded-lg border border-border bg-background p-2 text-foreground"
              onClick={() => goMonth(1)}
              aria-label="Next month"
            >
              <ChevronRightIcon />
            </button>
            <button
              className="ml-2 inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
              onClick={goToday}
            >
              <TodayIcon style={{ fontSize: 16 }} /> Today
            </button>
          </div>
          <p className="mt-1 text-xs text-muted">
            Monochrome calendar • Admin/User/Vehicle lifecycle events • Scales
            to 30+/day
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm">
            <SearchIcon style={{ fontSize: 16 }} className="text-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search events, notes, metadata…"
              className="h-6 w-64 border-none bg-transparent text-sm outline-none text-foreground placeholder-muted"
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
        {(isSuperAdmin
          ? ["ADMIN_CREATED", "USER_CREATED", "VEHICLE_EXPIRY", "VEHICLE_ADDED"]
          : ["USER_CREATED", "VEHICLE_EXPIRY", "VEHICLE_ADDED"]
        ).map((k) => (
          <button
            key={k}
            onClick={() => toggleFilter(k)}
            className={`inline-flex items-center gap-2 rounded-lg px-2.5 py-1 border ${
              filters[k]
                ? "bg-primary text-background"
                : "bg-background text-foreground border-border"
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${dotClass(k)}`} />
            {kindLabel(k)}
          </button>
        ))}
      </div>

      {/* 7:3 layout */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-10">
        {/* Month grid */}
        <div className="lg:col-span-7">
          <div className="overflow-hidden rounded-2xl border border-border bg-background">
            {/* Week header */}
            <div className="grid grid-cols-7 border-b border-border bg-foreground/10 text-[11px] uppercase tracking-wider text-foreground/70">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((w) => (
                <div key={w} className="p-2 text-center">
                  {w}
                </div>
              ))}
            </div>

            {/* Days */}
            <div className="grid grid-cols-7">
              {days.map((d, idx) => {
                const inMonth = d.getMonth() === cursor.getMonth();
                const key = d.toISOString().slice(0, 10);
                const list = eventsByDate.get(key) || [];
                const a = agg.get(key) || emptyAgg();
                const isToday = isSameDay(d, new Date());
                const isFocus = !!(focusDay && isSameDay(d, focusDay));
                const dens = densityClass(a.total, maxInMonth);
                return (
                  <button
                    key={key + idx}
                    onClick={() => openDay(d)}
                    className={`relative h-28 border-b border-r p-2 text-left transition ${
                      idx % 7 === 6 ? "border-r-0" : ""
                    } ${inMonth ? "bg-background" : "bg-foreground/5"} ${
                      isFocus
                        ? "outline outline-2 outline-primary -outline-offset-2"
                        : ""
                    } border-border`}
                    aria-label={`${key}: ${a.total} events`}
                  >
                    {/* Density strip */}
                    {/* <div className={`absolute inset-x-0 top-0 h-1 ${dens}`} /> */}

                    <div className="flex items-center justify-between text-xs">
                      <span
                        className={`inline-flex h-6 w-6 items-center justify-center rounded-full ${
                          isToday ? "border border-primary" : ""
                        } ${inMonth ? "text-foreground" : "text-muted"}`}
                      >
                        {fmtDay(d)}
                      </span>
                      {a.total > 0 && (
                        <span className="text-[10px] text-muted">
                          {a.total} evt
                        </span>
                      )}
                    </div>

                    {/* Per-kind counters */}
                    <div className="mt-2 grid grid-cols-2 gap-1 text-[10px] text-foreground/80">
                      {a.ADMIN_CREATED > 0 && (
                        <div className="flex items-center justify-between rounded border border-border px-1 py-0.5">
                          <span className="flex items-center gap-1">
                            <AdminPanelSettingsIcon style={{ fontSize: 12 }} />
                            Admin
                          </span>
                          <span>{a.ADMIN_CREATED}</span>
                        </div>
                      )}
                      {a.USER_CREATED > 0 && (
                        <div className="flex items-center justify-between rounded border border-border px-1 py-0.5">
                          <span className="flex items-center gap-1">
                            <PersonAddAltIcon style={{ fontSize: 12 }} />
                            User
                          </span>
                          <span>{a.USER_CREATED}</span>
                        </div>
                      )}
                      {a.VEHICLE_ADDED > 0 && (
                        <div className="flex items-center justify-between rounded border border-border px-1 py-0.5">
                          <span className="flex items-center gap-1">
                            <DirectionsCarFilledIcon style={{ fontSize: 12 }} />
                            Added
                          </span>
                          <span>{a.VEHICLE_ADDED}</span>
                        </div>
                      )}
                      {a.VEHICLE_EXPIRY > 0 && (
                        <div className="flex items-center justify-between rounded border border-border px-1 py-0.5">
                          <span className="flex items-center gap-1">
                            <NewReleasesIcon style={{ fontSize: 12 }} />
                            Expiry
                          </span>
                          <span>{a.VEHICLE_EXPIRY}</span>
                        </div>
                      )}
                    </div>

                    {/* Quick preview */}
                    {list.length > 0 && (
                      <div
                        className="mt-2 truncate text-[11px] text-muted"
                        title={list[0].title}
                      >
                        {list[0].title}
                      </div>
                    )}

                    {list.length > 1 && (
                      <div className="mt-1 text-[10px] text-muted">
                        +{list.length - 1} more
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right rail: Day focus + Event details */}
        <div className="lg:col-span-3">
          <div className="sticky top-4 flex flex-col gap-4">
            {/* Day summary with counts */}
            <div className="rounded-2xl border border-border bg-background p-4">
              <div className="mb-1 text-sm font-semibold text-foreground">
                {focusDay
                  ? focusDay.toLocaleDateString(undefined, {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "No day selected"}
              </div>

              {focusEvents.length === 0 ? (
                <div className="rounded-lg border border-border bg-background p-3 text-sm text-muted">
                  No events for this day.
                </div>
              ) : (
                <>
                  <div className="mb-2 grid grid-cols-2 gap-1 text-[10px] text-foreground/80">
                    {(() => {
                      const a = agg.get(focusKey) || emptyAgg();
                      return (
                        <>
                          {a.ADMIN_CREATED > 0 && (
                            <div className="flex items-center justify-between rounded border border-border px-1 py-0.5">
                              <span className="flex items-center gap-1">
                                <AdminPanelSettingsIcon
                                  style={{ fontSize: 12 }}
                                />
                                Admin
                              </span>
                              <span>{a.ADMIN_CREATED}</span>
                            </div>
                          )}
                          {a.USER_CREATED > 0 && (
                            <div className="flex items-center justify-between rounded border border-border px-1 py-0.5">
                              <span className="flex items-center gap-1">
                                <PersonAddAltIcon style={{ fontSize: 12 }} />
                                User
                              </span>
                              <span>{a.USER_CREATED}</span>
                            </div>
                          )}
                          {a.VEHICLE_ADDED > 0 && (
                            <div className="flex items-center justify-between rounded border border-border px-1 py-0.5">
                              <span className="flex items-center gap-1">
                                <DirectionsCarFilledIcon
                                  style={{ fontSize: 12 }}
                                />
                                Added
                              </span>
                              <span>{a.VEHICLE_ADDED}</span>
                            </div>
                          )}
                          {a.VEHICLE_EXPIRY > 0 && (
                            <div className="flex items-center justify-between rounded border border-border px-1 py-0.5">
                              <span className="flex items-center gap-1">
                                <NewReleasesIcon style={{ fontSize: 12 }} />
                                Expiry
                              </span>
                              <span>{a.VEHICLE_EXPIRY}</span>
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>

                  <div className="mb-2 text-xs text-muted">
                    {focusEvents.length} events • Latest first
                  </div>

                  {(() => {
                    const pages = Math.max(
                      1,
                      Math.ceil(focusEvents.length / PAGE_SIZE)
                    );
                    const safePage = Math.min(panelPage, pages);
                    const slice = pageSlice(
                      [...focusEvents].reverse(),
                      safePage,
                      PAGE_SIZE
                    );
                    return (
                      <>
                        <ul className="space-y-2 max-h-64 overflow-auto pr-1">
                          {slice.map((ev) => (
                            <li
                              key={ev.id}
                              className={`rounded-xl border ${
                                selectedEvent?.id === ev.id
                                  ? "border-primary"
                                  : "border-border"
                              } bg-background p-3 transition`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm">
                                  <span
                                    className={`h-2 w-2 rounded-full ${dotClass(
                                      ev.kind
                                    )}`}
                                  ></span>
                                  <span
                                    className="font-medium truncate max-w-[12rem] text-foreground"
                                    title={ev.title}
                                  >
                                    {ev.title}
                                  </span>
                                </div>
                                <button
                                  className="text-[11px] underline text-primary"
                                  onClick={() => setSelectedEvent(ev)}
                                >
                                  Details
                                </button>
                              </div>

                              {ev.note && (
                                <div
                                  className="mt-1 text-xs text-muted truncate"
                                  title={ev.note}
                                >
                                  {ev.note}
                                </div>
                              )}
                            </li>
                          ))}
                        </ul>

                        {focusEvents.length > PAGE_SIZE && (
                          <div className="mt-2 flex items-center justify-between text-xs text-foreground">
                            <button
                              disabled={safePage <= 1}
                              onClick={() =>
                                setPanelPage((p) => Math.max(1, p - 1))
                              }
                              className={`rounded border px-2 py-1 ${
                                safePage <= 1
                                  ? "text-muted border-border"
                                  : "border-border text-foreground"
                              }`}
                            >
                              Prev
                            </button>
                            <div>
                              Page {safePage} / {pages}
                            </div>
                            <button
                              disabled={safePage >= pages}
                              onClick={() =>
                                setPanelPage((p) => Math.min(pages, p + 1))
                              }
                              className={`rounded border px-2 py-1 ${
                                safePage >= pages
                                  ? "text-muted border-border"
                                  : "border-border text-foreground"
                              }`}
                            >
                              Next
                            </button>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </>
              )}
            </div>

            {/* Event details */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold dark:text-neutral-100">
                <EventNoteIcon style={{ fontSize: 16 }} />
                <span>Event Details</span>
              </div>
              {!selectedEvent ? (
                <div className="rounded-lg border border-border bg-background p-3 text-sm text-muted">
                  Select an event to view details.
                </div>
              ) : (
                <div className="grid gap-2 text-sm text-foreground">
                  <div className="flex items-center justify-between">
                    <span>Type</span>
                    <span className="inline-flex items-center gap-2">
                      {kindIcon(selectedEvent.kind)}{" "}
                      {kindLabel(selectedEvent.kind)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>When</span>
                    <span className="font-mono">
                      {new Date(selectedEvent.at).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Title</span>
                    <span className="truncate">{selectedEvent.title}</span>
                  </div>

                  {selectedEvent.note && (
                    <div className="flex items-start justify-between">
                      <span>Note</span>
                      <span
                        className="max-w-[16rem] truncate text-foreground"
                        title={selectedEvent.note}
                      >
                        {selectedEvent.note}
                      </span>
                    </div>
                  )}

                  {selectedEvent.meta && (
                    <details className="text-xs text-muted">
                      <summary className="cursor-pointer select-none">
                        Metadata
                      </summary>
                      <pre className="mt-2 max-h-40 overflow-auto rounded-lg border border-border bg-muted p-2">
                        {JSON.stringify(selectedEvent.meta, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
