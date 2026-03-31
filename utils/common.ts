import { DayData, MonthData, YearData } from "@/types";

export const getLast7Days = (): DayData[] => {
  const daysOfWeek = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
  const result = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    result.push({
      day: daysOfWeek[date.getDay()],
      date: date.toISOString().split("T")[0],
      income: 0,
      expense: 0,
    });
  }
  return result.reverse();
};

export const getLast12Months = (): MonthData[] => {
  const monthsOfYear = [
    "Jan",
    "Fév",
    "Mar",
    "Avr",
    "Mai",
    "Juin",
    "Juil",
    "Août",
    "Sep",
    "Oct",
    "Nov",
    "Déc",
  ];
  const result = [];

  for (let i = 11; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);

    const monthName = monthsOfYear[date.getMonth()];
    const shortYear = date.getFullYear().toString().slice(-2);
    const formattedMonthYear = `${monthName} ${shortYear}`;
    const formattedDate = date.toISOString().split("T")[0];

    result.push({
      month: formattedMonthYear,
      fullDate: formattedDate,
      income: 0,
      expense: 0,
    });
  }

  return result.reverse();
};

export const getYearsRange = (startYear: number, endYear: number): YearData[] => {
  const result = [];
  for (let year = startYear; year <= endYear; year++) {
    result.push({
      year: year.toString(),
      fullDate: `01-01-${year}`,
      income: 0,
      expense: 0,
    });
  }
  return result.reverse();
};
