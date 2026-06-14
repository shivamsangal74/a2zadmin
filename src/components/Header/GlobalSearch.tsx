import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CloseIcon from "@mui/icons-material/Close";
import {
  searchGlobalItems,
  type GlobalSearchItem,
} from "../../data/globalSearchItems";

const GlobalSearch = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  const results = useMemo(() => searchGlobalItems(query), [query]);
  const isPanelOpen = open || mobileOpen;

  const closeSearch = useCallback(() => {
    setOpen(false);
    setMobileOpen(false);
    setQuery("");
    setActiveIndex(0);
  }, []);

  const goToItem = useCallback(
    (item: GlobalSearchItem) => {
      navigate(item.path);
      closeSearch();
    },
    [navigate, closeSearch]
  );

  const focusSearch = useCallback((mobile = false) => {
    if (mobile) {
      setMobileOpen(true);
    } else {
      setOpen(true);
    }
    setTimeout(() => inputRef.current?.focus(), 0);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const isShortcut =
        (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";

      if (isShortcut) {
        event.preventDefault();
        const isMobile = window.matchMedia("(max-width: 767px)").matches;
        focusSearch(isMobile);
      }

      if (event.key === "Escape" && isPanelOpen) {
        closeSearch();
        inputRef.current?.blur();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [closeSearch, focusSearch, isPanelOpen]);

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setMobileOpen(false);
      }
    };

    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open && !mobileOpen && query) {
      setOpen(true);
      setMobileOpen(true);
    }
    if (!results.length) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((prev) => (prev + 1) % results.length);
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((prev) => (prev - 1 + results.length) % results.length);
    }

    if (event.key === "Enter" && results[activeIndex]) {
      event.preventDefault();
      goToItem(results[activeIndex]);
    }
  };

  const renderResults = () => {
    if (!query) {
      return (
        <div className="px-3 py-4 text-xs text-body dark:text-bodydark">
          Search pages, reports, users, and settings.
        </div>
      );
    }

    if (!results.length) {
      return (
        <div className="px-3 py-4 text-xs text-body dark:text-bodydark">
          No results for &quot;{query}&quot;
        </div>
      );
    }

    return (
      <ul className="max-h-72 overflow-y-auto py-1">
        {results.map((item, index) => (
          <li key={`${item.path}-${item.title}`}>
            <button
              type="button"
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => goToItem(item)}
              className={`flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left transition-colors ${
                index === activeIndex
                  ? "bg-primary/10 text-primary dark:bg-primary/20"
                  : "text-black hover:bg-gray dark:text-white dark:hover:bg-meta-4"
              }`}
            >
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium">
                  {item.title}
                </span>
                <span className="block truncate text-[11px] text-body dark:text-bodydark">
                  {item.section}
                </span>
              </span>
              <span className="hidden shrink-0 rounded-md bg-gray px-2 py-0.5 text-[10px] text-body dark:bg-meta-4 dark:text-bodydark sm:inline">
                {item.path}
              </span>
            </button>
          </li>
        ))}
      </ul>
    );
  };

  const searchInput = (
    <div className="relative">
      <SearchOutlinedIcon
        sx={{ fontSize: 18 }}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-body dark:text-bodydark"
      />
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
          setMobileOpen(true);
        }}
        onFocus={() => {
          setOpen(true);
          setMobileOpen(true);
        }}
        onKeyDown={handleKeyDown}
        placeholder="Search pages, reports..."
        className="h-9 w-full rounded-lg border border-stroke bg-gray pl-9 pr-16 text-sm text-black outline-none transition-colors placeholder:text-body focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:text-white dark:placeholder:text-bodydark"
      />
      <span className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 rounded border border-stroke px-1.5 py-0.5 text-[10px] text-body dark:border-strokedark dark:text-bodydark lg:inline">
        Ctrl K
      </span>
      {query && (
        <button
          type="button"
          onClick={() => {
            setQuery("");
            inputRef.current?.focus();
          }}
          className="absolute right-2 top-1/2 inline-flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded text-body hover:text-primary dark:text-bodydark lg:right-14"
          aria-label="Clear search"
        >
          <CloseIcon sx={{ fontSize: 14 }} />
        </button>
      )}
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => focusSearch(true)}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-stroke bg-gray text-body transition-colors hover:border-primary/30 hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-bodydark dark:hover:text-white md:hidden"
        aria-label="Open search"
      >
        <SearchOutlinedIcon sx={{ fontSize: 18 }} />
      </button>

      <div
        ref={containerRef}
        className="relative hidden w-full max-w-md md:block"
      >
        {searchInput}
        {open && (
          <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-[1000] overflow-hidden rounded-xl border border-stroke bg-white shadow-lg dark:border-strokedark dark:bg-boxdark">
            {renderResults()}
          </div>
        )}
      </div>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-[1000] bg-black/40 p-4 md:hidden"
          onClick={closeSearch}
        >
          <div
            className="mx-auto mt-16 max-w-lg overflow-hidden rounded-xl border border-stroke bg-white shadow-lg dark:border-strokedark dark:bg-boxdark"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="border-b border-stroke p-3 dark:border-strokedark">
              {searchInput}
            </div>
            {renderResults()}
          </div>
        </div>
      )}
    </>
  );
};

export default GlobalSearch;
