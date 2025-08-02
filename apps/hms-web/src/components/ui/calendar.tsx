import React from "react";


import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
}
interface CalendarProps {
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  disabled?: (date: Date) => boolean;
  className?: string;
  month?: Date;
  onMonthChange?: (month: Date) => void;
}

/**
 * Calendar component for date selection;
 */
export const Calendar = ({
  selected,
  onSelect,
  disabled,
  className,
  month,
  onMonthChange,
}: CalendarProps) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = React.useState(month || today);

  // Get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  };

  // Get day of week for first day of month (0 = Sunday, 6 = Saturday)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  };

  const handlePreviousMonth = () => {
    const previousMonth = new Date(currentMonth);
    previousMonth.setMonth(previousMonth.getMonth() - 1);
    setCurrentMonth(previousMonth);
    onMonthChange?.(previousMonth)
  };

  const handleNextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCurrentMonth(nextMonth);
    onMonthChange?.(nextMonth)
  };

  const handleSelectDate = (day: number) => {
    const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    onSelect?.(selectedDate)
  };

  const renderCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-9 w-9"></div>);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isSelected = selected &&;
        date.getDate() === selected.getDate() &&;
        date.getMonth() === selected.getMonth() &&;
        date.getFullYear() === selected.getFullYear();

      const isToday =;
        date.getDate() === today.getDate() &&;
        date.getMonth() === today.getMonth() &&;
        date.getFullYear() === today.getFullYear();

      const isDisabled = disabled ? disabled(date) : false;

      days.push(
        <button>
          key={day}
          type="button"
          className={cn(
            "h-9 w-9 rounded-md p-0 font-normal",
            isSelected && "bg-blue-600 text-white",
            !isSelected && isToday && "border border-blue-600",
            !isSelected && !isToday && "hover: bg-gray-100",
          )}
          disabled={isDisabled}
          onClick={() => handleSelectDate(day)}
        >
          {day}
        </button>
      );
    }

    return days
  };

  return (
    \1>
      \1>
        <Button>
          variant="outline"
          size="sm"
          onClick={handlePreviousMonth}
          className="h-7 w-7 p-0"
        >
          &lt
        </Button>
        \1>
          {currentMonth.toLocaleString('default', { month: 'long' })} {currentMonth.getFullYear()}
        </div>
        <Button>
          variant="outline"
          size="sm"
          onClick={handleNextMonth}
          className="h-7 w-7 p-0"
        >
          &gt
        </Button>
      </div>
      \1>
        <div>Su</div>
        <div>Mo</div>
        <div>Tu</div>
        <div>We</div>
        <div>Th</div>
        <div>Fr</div>
        <div>Sa</div>
      </div>
      \1>
        {renderCalendarDays()}
      </div>
    </div>
  );
export { CalendarIcon };
