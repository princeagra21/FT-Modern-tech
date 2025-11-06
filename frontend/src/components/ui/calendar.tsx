"use client";

import * as React from "react";
import {
  ExpandMore as ChevronDownIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import { DayButton, DayPicker, getDefaultClassNames } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  numberOfMonths = 2,
  mode = "single",
  required = false,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"];
}) {
  const defaultClassNames = getDefaultClassNames();
  const [month, setMonth] = React.useState<Date>(props.month || new Date());

  // Handle navigation for range picker (like AntD/MUI)
  const handleMonthChange = (offset: number) => {
    const newMonth = new Date(
      month.getFullYear(),
      month.getMonth() + offset,
      1
    );
    setMonth(newMonth);
  };

  return (
    <div className="relative inline-block">
      {/* {mode === "range" && numberOfMonths > 1 && (
        <div className="flex justify-between items-center mb-2">
          <Button
            variant={buttonVariant}
            size="icon"
            onClick={() => handleMonthChange(-1)}
          >
            <ChevronLeftIcon fontSize="small" />
          </Button>
          <Button
            variant={buttonVariant}
            size="icon"
            onClick={() => handleMonthChange(1)}
          >
            <ChevronRightIcon fontSize="small" />
          </Button>
        </div>
      )} */}

      <DayPicker
        {...(mode === "range" ? { required } : {})}
        showOutsideDays={showOutsideDays}
        captionLayout={captionLayout}
        className={cn(
          "bg-background group/calendar p-3 [--cell-size:--spacing(8)] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
          String.raw`rtl:**:[.rdp-button_next>svg]:rotate-180`,
          String.raw`rtl:**:[.rdp-button_previous>svg]:rotate-180`,
          className
        )}
        month={month}
        onMonthChange={setMonth}
        numberOfMonths={numberOfMonths}
        mode={mode}
        formatters={{
          formatMonthDropdown: (date) =>
            date.toLocaleString("default", { month: "short" }),
          ...formatters,
        }}
        classNames={{
          root: cn("w-fit", defaultClassNames.root),
          months: cn(
            "flex flex-col md:flex-row gap-4 relative",
            defaultClassNames.months
          ),
          month: cn("flex flex-col w-full gap-4", defaultClassNames.month),
          nav: cn(
            "flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between",
            defaultClassNames.nav
          ),
          button_previous: cn(
            buttonVariants({ variant: buttonVariant }),
            "size-(--cell-size) p-0 aria-disabled:opacity-50 select-none",
            defaultClassNames.button_previous
          ),
          button_next: cn(
            buttonVariants({ variant: buttonVariant }),
            "size-(--cell-size) p-0 aria-disabled:opacity-50 select-none",
            defaultClassNames.button_next
          ),
          month_caption: cn(
            "flex items-center justify-center h-(--cell-size) w-full px-(--cell-size)",
            defaultClassNames.month_caption
          ),
          dropdowns: cn(
            "w-full flex items-center justify-center h-(--cell-size) gap-1.5 text-sm font-medium",
            defaultClassNames.dropdowns
          ),
          dropdown_root: cn(
            "relative border border-border rounded-md has-focus:ring-[3px] has-focus:ring-ring/50 has-focus:border-ring shadow-xs",
            defaultClassNames.dropdown_root
          ),
          dropdown: cn(
            "absolute inset-0 bg-background dark:bg-popover opacity-0 z-[99998]",
            defaultClassNames.dropdown
          ),
          caption_label: cn(
            "select-none font-medium text-foreground",
            captionLayout === "label"
              ? "text-sm"
              : "rounded-md pl-2 pr-1 flex items-center gap-1 text-sm h-8 [&>svg]:text-muted-foreground [&>svg]:size-3.5",
            defaultClassNames.caption_label
          ),
          table: "w-full border-collapse",
          weekdays: cn("flex", defaultClassNames.weekdays),
          weekday: cn(
            "text-muted-foreground rounded-md flex-1 font-normal text-[0.8rem] select-none",
            defaultClassNames.weekday
          ),
          week: cn("flex w-full mt-2", defaultClassNames.week),
          week_number_header: cn(
            "select-none w-(--cell-size)",
            defaultClassNames.week_number_header
          ),
          week_number: cn(
            "text-[0.8rem] select-none text-muted-foreground",
            defaultClassNames.week_number
          ),
          day: cn(
            "relative w-full h-full p-0 text-center aspect-square select-none group/day " +
              "[&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md",
            defaultClassNames.day
          ),
          range_start: cn(
            "rounded-l-md text-accent-foreground",
            defaultClassNames.range_start
          ),
          range_middle: cn(
            "rounded-none  text-accent-foreground",
            defaultClassNames.range_middle
          ),
          range_end: cn(
            "rounded-r-md  text-accent-foreground",
            defaultClassNames.range_end
          ),
          today: cn(
            "bg-muted text-foreground rounded-md data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground",
            defaultClassNames.today
          ),
          outside: cn(
            "text-muted-foreground opacity-60",
            defaultClassNames.outside
          ),
          disabled: cn(
            "text-muted-foreground opacity-50 cursor-not-allowed",
            defaultClassNames.disabled
          ),
          hidden: cn("invisible", defaultClassNames.hidden),
          ...classNames,
        }}
        components={{
          Root: ({ className, rootRef, ...props }) => (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(className)}
              {...props}
            />
          ),
          Chevron: ({ className, orientation, ...props }) => {
            const Icon =
              orientation === "left"
                ? ChevronLeftIcon
                : orientation === "right"
                ? ChevronRightIcon
                : ChevronDownIcon;
            return (
              <Icon
                fontSize="small"
                className={cn("text-muted-foreground", className)}
                {...props}
              />
            );
          },
          DayButton: CalendarDayButton,
          WeekNumber: ({ children, ...props }) => (
            <td {...props}>
              <div className="flex size-(--cell-size) items-center justify-center text-center text-muted-foreground">
                {children}
              </div>
            </td>
          ),
          ...components,
        }}
        {...props}
      />
    </div>
  );
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames();
  const ref = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        `
        flex aspect-square size-auto w-full min-w-(--cell-size)
        flex-col gap-1 leading-none font-normal relative
        
        data-[selected-single=true]:bg-primary data-[selected-single=true]:text-white
        data-[range-middle=true]:bg-primary/30 data-[range-middle=true]:text-white
        data-[range-start=true]:bg-primary data-[range-start=true]:text-white
        data-[range-end=true]:bg-primary data-[range-end=true]:text-white
        hover:bg-foreground/5 hover:text-foreground
        [&>span]:text-xs [&>span]:opacity-70 outline-none
      `,
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  );
}

export { Calendar, CalendarDayButton };
