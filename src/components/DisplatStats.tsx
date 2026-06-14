import React from "react";
import {
  FaRupeeSign,
  FaCircleCheck,
  FaClock,
  FaCircleXmark,
} from "react-icons/fa6";

const StatsDisplay = ({ stats }) => {
  const cards = [
    {
      key: "success",
      label: "Success",
      icon: FaCircleCheck,
      amount: stats?.success?.amount ?? 0,
      count: stats?.success?.count ?? 0,
      accent: "border-l-emerald-500",
      cardClass:
        "border-emerald-200/80 bg-gradient-to-br from-emerald-50/95 via-white to-white dark:border-emerald-900/60 dark:from-emerald-950/50 dark:via-boxdark dark:to-boxdark",
      labelClass: "text-emerald-800 dark:text-emerald-300",
      amountClass: "text-emerald-900 dark:text-emerald-100",
      pillClass:
        "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200/80 dark:bg-emerald-950/70 dark:text-emerald-200 dark:ring-emerald-800/60",
      iconWrap:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300",
    },
    {
      key: "pending",
      label: "Pending",
      icon: FaClock,
      amount: stats?.pending?.amount ?? 0,
      count: stats?.pending?.count ?? 0,
      accent: "border-l-amber-500",
      cardClass:
        "border-amber-200/80 bg-gradient-to-br from-amber-50/95 via-white to-white dark:border-amber-900/60 dark:from-amber-950/50 dark:via-boxdark dark:to-boxdark",
      labelClass: "text-amber-900 dark:text-amber-300",
      amountClass: "text-amber-950 dark:text-amber-100",
      pillClass:
        "bg-amber-100 text-amber-900 ring-1 ring-amber-200/80 dark:bg-amber-950/70 dark:text-amber-200 dark:ring-amber-800/60",
      iconWrap:
        "bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300",
    },
    {
      key: "fail",
      label: "Fail",
      icon: FaCircleXmark,
      amount: stats?.fail?.amount ?? 0,
      count: stats?.fail?.count ?? 0,
      accent: "border-l-rose-500",
      cardClass:
        "border-rose-200/80 bg-gradient-to-br from-rose-50/95 via-white to-white dark:border-rose-900/60 dark:from-rose-950/50 dark:via-boxdark dark:to-boxdark",
      labelClass: "text-rose-800 dark:text-rose-300",
      amountClass: "text-rose-950 dark:text-rose-100",
      pillClass:
        "bg-rose-100 text-rose-900 ring-1 ring-rose-200/80 dark:bg-rose-950/70 dark:text-rose-200 dark:ring-rose-800/60",
      iconWrap:
        "bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300",
    },
  ];

  return (
    <div className="mb-2 rounded-xl border border-slate-200/90 bg-gradient-to-r from-white via-slate-50 to-blue-50 p-2.5 shadow-sm ring-1 ring-slate-100/70 dark:border-slate-700 dark:bg-gradient-to-r dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 dark:ring-slate-800/80">
      {stats && (
        <>
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Transaction summary
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {cards.map((card) => {
              const Icon = card.icon;
              return (
              <div
                key={card.key}
                className={`group relative overflow-hidden rounded-lg border border-slate-200/90 pl-1 shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 ${card.accent} border-l-[3px] ${card.cardClass}`}
              >
                <div className="flex items-start justify-between gap-2 px-2 pb-1 pt-1.5">
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition-transform duration-300 group-hover:scale-105 ${card.iconWrap}`}
                    >
                      <Icon className="h-3.5 w-3.5" aria-hidden />
                    </span>
                    <h4
                      className={`truncate text-[11px] font-bold leading-tight ${card.labelClass}`}
                    >
                      {card.label}
                    </h4>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold tabular-nums ${card.pillClass}`}
                  >
                    {card.count}
                  </span>
                </div>
                <p
                  className={`flex items-baseline justify-center gap-0.5 px-2 pb-1.5 text-lg font-bold tabular-nums leading-none tracking-tight sm:text-xl ${card.amountClass}`}
                >
                  <FaRupeeSign className="relative top-[2px] text-xs opacity-80" />
                  {card.amount.toLocaleString()}
                </p>
              </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default StatsDisplay;
