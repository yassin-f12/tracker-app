import { CategoryType, ExpenseCategoriesType } from "@/types";
import {
    CarIcon,
    CurrencyEurIcon,
    DotsThreeOutlineIcon,
    FilmStripIcon,
    ForkKnifeIcon,
    HeartIcon,
    HouseIcon,
    LightbulbIcon,
    PiggyBankIcon,
    ShieldCheckIcon,
    ShoppingCartIcon,
    TShirtIcon,
    UserIcon,
} from "phosphor-react-native";

export const expenseCategories: ExpenseCategoriesType = {
  groceries: {
    label: "Courses",
    value: "groceries",
    icon: ShoppingCartIcon,
    bgColor: "#4B5563",
  },
  rent: {
    label: "Loyer",
    value: "rent",
    icon: HouseIcon,
    bgColor: "#075985",
  },
  utilities: {
    label: "Factures",
    value: "utilities",
    icon: LightbulbIcon,
    bgColor: "#ca8a04",
  },
  transportation: {
    label: "Transport",
    value: "transportation",
    icon: CarIcon,
    bgColor: "#b45309",
  },
  entertainment: {
    label: "Loisirs",
    value: "entertainment",
    icon: FilmStripIcon,
    bgColor: "#0f766e",
  },
  dining: {
    label: "Restauration",
    value: "dining",
    icon: ForkKnifeIcon,
    bgColor: "#be185d",
  },
  health: {
    label: "Santé",
    value: "health",
    icon: HeartIcon,
    bgColor: "#e11d48",
  },
  insurance: {
    label: "Assurance",
    value: "insurance",
    icon: ShieldCheckIcon,
    bgColor: "#404040",
  },
  savings: {
    label: "Épargne",
    value: "savings",
    icon: PiggyBankIcon,
    bgColor: "#065F46",
  },
  clothing: {
    label: "Vêtements",
    value: "clothing",
    icon: TShirtIcon,
    bgColor: "#7c3aed",
  },
  personal: {
    label: "Personnel",
    value: "personal",
    icon: UserIcon,
    bgColor: "#a21caf",
  },
  others: {
    label: "Autres",
    value: "others",
    icon: DotsThreeOutlineIcon,
    bgColor: "#525252",
  },
};

export const incomeCategory: CategoryType = {
  label: "Revenus",
  value: "income",
  icon: CurrencyEurIcon,
  bgColor: "#16a34a",
};

export const transactionTypes = [
  { label: "Dépense", value: "expense" },
  { label: "Revenu", value: "income" },
];
