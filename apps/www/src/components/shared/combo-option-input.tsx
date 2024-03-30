"use client";

import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { X } from "lucide-react";

import { searchCombos } from "@/lib/constants";
import useSet from "@/hooks/useSet";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { SearchLineIcon } from "./icons";

interface ComboOptionInputProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "onChange"> {
  initValue?: string[];
  onChange?: (val: string[]) => void;
}

export function ComboOptionInput({
  initValue = [],
  onChange,
}: ComboOptionInputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [inputLock, setInputLock] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [selected, selectControl] = useSet<string>(new Set(initValue));
  const [search, setSearch] = React.useState("");
  const [value, setValue] = React.useState("");

  React.useEffect(() => {
    if (onChange) {
      onChange(Array.from(selected));
    }
  }, [selected, onChange]);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      switch (e.key) {
        // case "Enter":
        //   if (!inputLock) {
        //     onChange?.(Array.from(selected));
        //   }
        //   break;
        case "Escape":
          inputRef.current?.blur();
          break;
        case "Delete":
        case "Backspace":
          if (search.trim() === "") {
            setSearch("");
            selectControl.pop();
          }
          break;
        case " ":
          if (search.trim() !== "") {
            if (!inputLock) {
              selectControl.add(search);
              setSearch("");
            }
          }
          break;
      }
    },
    [inputLock, selectControl, setSearch, search],
  );

  const options = React.useMemo(() => {
    return searchCombos.filter((item) => !selected.has(item));
  }, [selected]);

  return (
    <Command
      onKeyDown={handleKeyDown}
      className="overflow-visible bg-transparent"
      value={value}
      onValueChange={(val) => {
        setValue(val);
      }}
    >
      <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex flex-wrap gap-1 pl-6">
          {Array.from(selected).map((item) => {
            return (
              <Badge
                key={item}
                variant="secondary"
                className="pr-1.5 font-medium"
              >
                {item}
                <button
                  className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      selectControl.remove(item);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => selectControl.remove(item)}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            );
          })}
          <div className="absolute left-3 top-1/2 flex -translate-y-1/2 items-center justify-center">
            <SearchLineIcon className="text-xl" />
          </div>
          <CommandPrimitive.Input
            ref={inputRef}
            value={search}
            onValueChange={(val) => {
              if (val.trim() === "") {
                setSearch("");
              } else {
                setSearch(val);
              }
            }}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            onCompositionStart={() => {
              setInputLock(true);
            }}
            onCompositionEnd={() => {
              setInputLock(false);
            }}
            placeholder="搜索招聘信息，支持空格分隔多词条搜索"
            className="placeholder:text-md ml-2 flex-1 bg-transparent text-base outline-none placeholder:text-secondary-foreground"
          />
        </div>
      </div>
      {open && options.length > 0 ? (
        <div className="relative z-10">
          <div className="absolute top-2 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            <CommandList>
              <CommandEmpty>无匹配项, “空格” 确实当前输入</CommandEmpty>
              <CommandGroup className="h-full overflow-auto">
                {options.map((option) => {
                  return (
                    <CommandItem
                      key={option}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onSelect={(value) => {
                        setSearch("");
                        selectControl.add(value);
                      }}
                      className={"cursor-pointer"}
                    >
                      {option}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </div>
        </div>
      ) : null}
    </Command>
  );
}
