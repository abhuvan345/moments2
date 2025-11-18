"use client";

import * as React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { DayButton, DayPicker, getDefaultClassNames } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

function Calendar({ className, classNames, ...props }) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays
      captionLayout="label"
      className={cn(
        "rounded-2xl shadow-xl border bg-white p-6 w-fit",
        "[--cell-size:3.5rem]",
        className
      )}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn("flex flex-col gap-2", defaultClassNames.months),
        month: cn("flex flex-col gap-2", defaultClassNames.month),

        // ⬅️ NEW: Arrows left, title right
        nav: cn(
          "flex items-center justify-start gap-3 w-full mb-2 px-2",
          defaultClassNames.nav
        ),

        button_previous: cn(
          "size-8 flex items-center justify-center rounded-full bg-orange-400 text-white hover:bg-orange-500 transition shadow-sm",
          defaultClassNames.button_previous
        ),

        button_next: cn(
          "size-8 flex items-center justify-center rounded-full bg-orange-400 text-white hover:bg-orange-500 transition shadow-sm",
          defaultClassNames.button_next
        ),

        // Keeps month caption aligned to the right
        caption: cn(
          "w-full flex items-center justify-end pr-5",
          defaultClassNames.caption
        ),

        month_caption: cn(
          "text-lg font-semibold text-gray-800",
          defaultClassNames.month_caption
        ),

        caption_label: cn(
          "text-lg font-semibold",
          defaultClassNames.caption_label
        ),

        weekdays: cn(
          "flex justify-between text-sm text-gray-600",
          defaultClassNames.weekdays
        ),
        weekday: cn(
          "flex w-full items-center justify-center text-sm font-medium",
          defaultClassNames.weekday
        ),

        week: cn("flex justify-between mt-4 gap-2", defaultClassNames.week),

        day: cn(
          "relative w-10 h-10 flex items-center justify-center text-sm font-medium rounded-md",
          "mx-1.5 my-1.5",
          "hover:bg-orange-100 transition-all",
          defaultClassNames.day
        ),

        selected: cn(
          "!bg-orange-500 !text-white !shadow-lg",
          "!border-4 !border-orange-600",
          "ring-2 ring-orange-300",
          "scale-105 z-10",
          defaultClassNames.selected
        ),

        today: cn(
          "border border-orange-400 text-orange-600 rounded-md font-bold",
          defaultClassNames.today
        ),

        outside: cn("text-gray-300 select-none", defaultClassNames.outside),
        disabled: cn("opacity-40", defaultClassNames.disabled),
        hidden: cn("invisible", defaultClassNames.hidden),

        ...classNames,
      }}
      components={{
        Chevron: ({ className, orientation, ...props }) => {
          const Icon =
            orientation === "left" ? ChevronLeftIcon : ChevronRightIcon;
          return <Icon className={cn("size-4", className)} {...props} />;
        },
        DayButton: CalendarDayButton,
      }}
      {...props}
    />
  );
}

function CalendarDayButton({ className, day, modifiers, ...props }) {
  const defaultClassNames = getDefaultClassNames();
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      className={cn(
        "w-full h-full rounded-md font-medium text-sm",
        "hover:bg-orange-200",
        "data-[selected=true]:!bg-orange-500 data-[selected=true]:!text-white data-[selected=true]:!shadow-lg",
        "data-[selected=true]:!border-4 data-[selected=true]:!border-orange-600",
        "data-[selected=true]:ring-2 data-[selected=true]:ring-orange-300",
        "data-[selected=true]:scale-105 data-[selected=true]:z-10",
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  );
}

export { Calendar, CalendarDayButton };
