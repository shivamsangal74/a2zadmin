import React, { useState } from "react";
import { Typography } from "@mui/material";
import { ContentCopy, CheckCircleOutline } from "@mui/icons-material";

interface LogsViewerProps {
  data: string | any;
}

interface SplitResult {
  isSplit: boolean;
  initialItems: any[];
  checkStatusItems: any[];
  rawParsed?: any;
}

const isCheckStatusMarker = (item: any): boolean => {
  if (typeof item !== "string") return false;
  const lower = item.trim().toLowerCase();
  return lower.includes("check status");
};

const parseArrayForCheckStatus = (arr: any[]): SplitResult => {
  const hasMarker = arr.some(isCheckStatusMarker);
  if (!hasMarker) {
    return {
      isSplit: false,
      initialItems: arr,
      checkStatusItems: [],
      rawParsed: arr,
    };
  }

  const initialItems: any[] = [];
  const checkStatusItems: any[] = [];
  let foundFirstMarker = false;

  for (const item of arr) {
    if (isCheckStatusMarker(item)) {
      foundFirstMarker = true;
      continue;
    }
    if (!foundFirstMarker) {
      initialItems.push(item);
    } else {
      checkStatusItems.push(item);
    }
  }

  return {
    isSplit: true,
    initialItems,
    checkStatusItems,
    rawParsed: arr,
  };
};

const parseContent = (contentStr: string): SplitResult => {
  try {
    const parsed = JSON.parse(contentStr);
    if (Array.isArray(parsed)) {
      return parseArrayForCheckStatus(parsed);
    }
    return {
      isSplit: false,
      initialItems: [parsed],
      checkStatusItems: [],
      rawParsed: parsed,
    };
  } catch (e) {
    return {
      isSplit: false,
      initialItems: [contentStr],
      checkStatusItems: [],
      rawParsed: contentStr,
    };
  }
};

interface CodeBoxProps {
  title: string;
  badge?: string;
  badgeColor?: "blue" | "green" | "purple" | "indigo";
  content: any;
  boxStyle?: "default" | "request" | "response" | "checkStatusReq" | "checkStatusRes";
  allowLatestToggle?: boolean;
}

const CodeBox: React.FC<CodeBoxProps> = ({
  title,
  badge,
  badgeColor = "blue",
  content,
  boxStyle = "default",
  allowLatestToggle = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<"all" | "latest">("all");

  const isArray = Array.isArray(content);
  const showToggle = allowLatestToggle && isArray && content.length > 1;

  const displayData =
    showToggle && viewMode === "latest"
      ? content[content.length - 1]
      : isArray && content.length === 1
      ? content[0]
      : content;

  const textToDisplay =
    typeof displayData === "string"
      ? displayData
      : JSON.stringify(displayData, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(textToDisplay);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const badgeClasses: Record<string, string> = {
    blue: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800",
    green: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
    purple: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800",
  };

  const headerTextClasses: Record<string, string> = {
    default: "text-gray-800 dark:text-gray-200",
    request: "text-blue-600 dark:text-blue-400",
    response: "text-emerald-600 dark:text-emerald-400",
    checkStatusReq: "text-indigo-600 dark:text-indigo-400",
    checkStatusRes: "text-purple-600 dark:text-purple-400",
  };

  const boxBgClasses: Record<string, string> = {
    default: "bg-gray-100 border-gray-200 dark:bg-gray-800/60 dark:border-gray-700",
    request: "bg-blue-50/40 border-blue-200 dark:bg-blue-950/20 dark:border-blue-900/60",
    response: "bg-emerald-50/40 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900/60",
    checkStatusReq: "bg-indigo-50/50 border-indigo-200 dark:bg-indigo-950/30 dark:border-indigo-900/70",
    checkStatusRes: "bg-purple-50/50 border-purple-200 dark:bg-purple-950/30 dark:border-purple-900/70",
  };

  return (
    <div className="flex flex-col gap-1.5 mb-2">
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2">
          <Typography
            variant="subtitle2"
            className={`font-bold ${headerTextClasses[boxStyle] || headerTextClasses.default}`}
          >
            {title}
          </Typography>
          {badge && (
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${badgeClasses[badgeColor]}`}
            >
              {badge}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {showToggle && (
            <div className="inline-flex rounded-md shadow-sm border border-gray-300 dark:border-gray-700 overflow-hidden text-xs">
              <button
                type="button"
                onClick={() => setViewMode("all")}
                className={`px-2.5 py-0.5 font-medium transition-colors ${
                  viewMode === "all"
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-boxdark dark:text-gray-300"
                }`}
              >
                All ({content.length})
              </button>
              <button
                type="button"
                onClick={() => setViewMode("latest")}
                className={`px-2.5 py-0.5 font-medium transition-colors border-l border-gray-300 dark:border-gray-700 ${
                  viewMode === "latest"
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-boxdark dark:text-gray-300"
                }`}
              >
                Latest
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            title="Copy to clipboard"
          >
            {copied ? (
              <>
                <CheckCircleOutline fontSize="inherit" className="text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">Copied</span>
              </>
            ) : (
              <>
                <ContentCopy fontSize="inherit" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div
        className={`p-3 rounded-lg border max-h-72 overflow-y-auto ${boxBgClasses[boxStyle] || boxBgClasses.default}`}
      >
        <pre className="whitespace-pre-wrap break-all text-xs font-mono text-gray-800 dark:text-gray-200 m-0">
          {textToDisplay}
        </pre>
      </div>
    </div>
  );
};

export const LogsViewer: React.FC<LogsViewerProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<"all" | "initial" | "checkStatus">("all");

  if (!data) {
    return <div className="text-sm text-gray-500 italic p-4 text-center">No logs available</div>;
  }

  // Handle case when data is not string
  const rawString = typeof data === "string" ? data : JSON.stringify(data, null, 2);

  // If no <b> and no <br/>, check if direct JSON with check status
  if (!rawString.includes("<b>") && !rawString.includes("<br/>") && !rawString.includes("<br>")) {
    const split = parseContent(rawString);
    if (!split.isSplit) {
      return (
        <CodeBox
          title="LOGS"
          content={split.rawParsed}
          boxStyle="default"
        />
      );
    }

    return (
      <div className="flex flex-col gap-3">
        {split.initialItems.length > 0 && (
          <CodeBox
            title="INITIAL REQUEST / LOG"
            content={split.initialItems}
            boxStyle="request"
          />
        )}
        {split.checkStatusItems.length > 0 && (
          <CodeBox
            title="CHECK STATUS LOGS"
            badge={`${split.checkStatusItems.length} ${
              split.checkStatusItems.length === 1 ? "entry" : "entries"
            }`}
            badgeColor="indigo"
            content={split.checkStatusItems}
            boxStyle="checkStatusReq"
            allowLatestToggle={true}
          />
        )}
      </div>
    );
  }

  // Standard case: data contains <b>...</b> and <br/>
  const parts = rawString.split(/<br\s*\/?>/i);

  // Parse each part
  const parsedSections = parts.map((part) => {
    const match = part.match(/<b>(.*?)<\/b>(.*)/is);
    if (!match) {
      return { isRawHtml: true, html: part };
    }

    const tag = match[1].trim();
    const cleanTag = tag.replace(/[:\s]+$/, "").trim();
    const content = match[2].trim();
    const isRequest = cleanTag.toLowerCase().includes("request");
    const isResponse = cleanTag.toLowerCase().includes("response");
    const split = parseContent(content);

    return {
      isRawHtml: false,
      tag,
      cleanTag,
      isRequest,
      isResponse,
      split,
    };
  });

  const totalCheckStatusCount = parsedSections.reduce((acc, curr) => {
    if (!curr.isRawHtml && curr.split.isSplit) {
      return acc + curr.split.checkStatusItems.length;
    }
    return acc;
  }, 0);

  const hasCheckStatusLogs = totalCheckStatusCount > 0;

  return (
    <div className="flex flex-col gap-3">
      {hasCheckStatusLogs && (
        <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2 mb-1">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-colors ${
              activeTab === "all"
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            All Logs
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("initial")}
            className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-colors ${
              activeTab === "initial"
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            Initial Request / Response
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("checkStatus")}
            className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === "checkStatus"
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            <span>Check Status Logs</span>
            <span className="text-[10px] bg-white/20 dark:bg-white/10 px-1.5 py-0.2 rounded-full font-bold">
              {totalCheckStatusCount}
            </span>
          </button>
        </div>
      )}

      {parsedSections.map((section, idx) => {
        if (section.isRawHtml) {
          return <div key={idx} dangerouslySetInnerHTML={{ __html: section.html }} />;
        }

        const { tag, cleanTag, isRequest, isResponse, split } = section;

        // If this part did not have "Check status logs"
        if (!split.isSplit) {
          if (activeTab === "checkStatus") return null;

          return (
            <CodeBox
              key={idx}
              title={tag}
              content={split.rawParsed}
              boxStyle={isRequest ? "request" : isResponse ? "response" : "default"}
            />
          );
        }

        // This part has "Check status logs"
        const showInitial = activeTab !== "checkStatus" && split.initialItems.length > 0;
        const showCheckStatus = activeTab !== "initial" && split.checkStatusItems.length > 0;

        return (
          <React.Fragment key={idx}>
            {/* Box 1: Initial Request / Response */}
            {showInitial && (
              <CodeBox
                title={tag}
                badge={isRequest ? "Initial Request" : isResponse ? "Initial Response" : undefined}
                badgeColor={isRequest ? "blue" : "green"}
                content={split.initialItems}
                boxStyle={isRequest ? "request" : isResponse ? "response" : "default"}
              />
            )}

            {/* Box 2: Check status logs in its own different box */}
            {showCheckStatus && (
              <CodeBox
                title={`Check Status Logs (${cleanTag})`}
                badge={`${split.checkStatusItems.length} ${
                  split.checkStatusItems.length === 1 ? "entry" : "entries"
                }`}
                badgeColor={isRequest ? "indigo" : "purple"}
                content={split.checkStatusItems}
                boxStyle={isRequest ? "checkStatusReq" : "checkStatusRes"}
                allowLatestToggle={true}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default LogsViewer;
