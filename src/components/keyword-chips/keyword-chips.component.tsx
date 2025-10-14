"use client";

import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../../store/app-wrapper.context";
import { delay } from "../../utils/apply-filter";
import { useDelay } from "../../hooks/useDelay.hook";
import { useSearchParams } from "react-router";

type KeywordChipsProps = {
  value?: string[];
  onChange?: (next: string[]) => void;
  placeholder?: string;
  maxChips?: number;
};

export default function KeywordChips({
  value = [],
  onChange,
  placeholder = "Type and press Enter",
  maxChips = 20,
}: KeywordChipsProps) {
  const { setFilter } = useApp();
  const [chips, setChips] = useState<string[]>(value);
  const [input, setInput] = useState("");
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [searchParams] = useSearchParams();

  const update = (next: string[]) => {
    setChips(next);
    onChange?.(next);
    setFilter("keywords", next);
  };

  useEffect(() => {
    const kwParam = searchParams.get("keywords");
    if (kwParam) {
      const kwList = kwParam
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean);
      if (kwList.length > 0) {
        setChips(kwList);
        setFilter("keywords", kwList);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addChip = useDelay((raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed || chips.includes(trimmed) || chips.length >= maxChips) return;
    update([...chips, trimmed]);
    setInput("");
    inputRef.current?.focus();
  });

  const removeChip = (idx: number) => {
    const next = chips.filter((_, i) => i !== idx);
    update(next);
    setFocusedIndex(null);
    inputRef.current?.focus();
  };

  const onKeyDown = useDelay((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addChip(input);
      return;
    }
    if (e.key === "Backspace" && input === "" && chips.length > 0) {
      if (focusedIndex === chips.length - 1) removeChip(chips.length - 1);
      else setFocusedIndex(chips.length - 1);
    }
    if (e.key === "Escape") {
      setFocusedIndex(null);
      inputRef.current?.focus();
    }
  });

  const onChipKeyDown = useDelay(
    (e: React.KeyboardEvent<HTMLButtonElement>, idx: number) => {
      if (e.key === "Backspace" || e.key === "Delete") {
        e.preventDefault();
        removeChip(idx);
        return;
      }
      if (e.key === "ArrowLeft") setFocusedIndex(idx > 0 ? idx - 1 : idx);
      if (e.key === "ArrowRight") {
        if (idx === chips.length - 1) {
          setFocusedIndex(null);
          inputRef.current?.focus();
        } else {
          setFocusedIndex(idx + 1);
        }
      }
    }
  );

  // useEffect(() => {
  //   setFilter("keywords", chips);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [chips]);

  return (
    <div className="w-full">
      <label className="sr-only">Keywords</label>

      <div
        className="flex flex-wrap items-center gap-1.5 min-h-[40px] border border-gray-200 bg-white rounded-lg px-2.5 py-1.5 shadow-sm focus-within:ring-2 focus-within:ring-blue-400 transition"
        role="list"
        aria-label="Keywords"
        onClick={() => inputRef.current?.focus()}
      >
        {chips.map((c, idx) => (
          <button
            key={c}
            role="listitem"
            aria-label={`Keyword ${c}. Press delete to remove.`}
            onClick={() => setFocusedIndex(idx)}
            onKeyDown={(e) => onChipKeyDown(e, idx)}
            tabIndex={0}
            className={
              `inline-flex items-center gap-1.5 px-2 py-[3px] rounded-full text-xs font-medium border transition ` +
              (focusedIndex === idx
                ? "bg-blue-50 border-blue-800 text-blue-700 ring-1 ring-blue-300"
                : "bg-blue-50  border-blue-800  hover:border-blue-300 hover:bg-blue-50")
            }
          >
            <span className="truncate max-w-[8rem]">{c}</span>
            <span
              onClick={(ev) => {
                ev.stopPropagation();
                removeChip(idx);
              }}
              className="text-gray-400 hover:text-red-500 transition text-[13px]"
              aria-hidden
            >
              ✕
            </span>
          </button>
        ))}

        <input
          ref={inputRef}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setFocusedIndex(null);
          }}
          onKeyDown={onKeyDown}
          placeholder={chips.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[120px] py-1.5 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none"
          aria-label="Add keyword"
        />
      </div>

      <div className="mt-1 text-[11px] text-gray-400">
        Press{" "}
        <kbd className="px-1 py-0.5 bg-gray-100 rounded font-mono">Enter</kbd>{" "}
        to add keywords
      </div>
    </div>
  );
}
