import AddTransactionButton from "@/app/_components/add-transaction-button";
import { Card, CardContent, CardHeader } from "@/app/_components/ui/card";
import { ReactNode } from "react";

interface SummaryCardProps {
  icon: ReactNode;
  title: string;
  amount: number;
  size?: "small" | "large";
  userCanAddTransaction?: boolean;
}

const SummaryCard = ({
  icon,
  title,
  amount,
  size = "small",
  userCanAddTransaction,
}: SummaryCardProps) => {
  return (
    <Card className="p-4 sm:p-6 lg:p-8">
      <CardHeader className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        {icon}
        <p
          className={`${
            size === "small"
              ? "text-sm text-muted-foreground sm:text-base"
              : "text-lg text-white opacity-70 sm:text-xl"
          }`}
        >
          {title}
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p
          className={`font-bold ${
            size === "small" ? "text-2xl sm:text-3xl" : "text-4xl sm:text-5xl"
          }`}
        >
          {Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(amount)}
        </p>

        {size === "large" && (
          <AddTransactionButton userCanAddTransaction={userCanAddTransaction} />
        )}
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
