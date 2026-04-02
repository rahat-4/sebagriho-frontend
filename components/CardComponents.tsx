import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CardComponentsProps {
  title: string;
  amount: string;
  description: string;
}

const CardComponents: React.FC<CardComponentsProps> = ({
  title,
  amount,
  description,
}) => {
  return (
    <Card className="h-full overflow-hidden rounded-2xl border border-border/60 bg-white/80 shadow-sm backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <CardHeader className="space-y-1 p-5">
        <CardDescription className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
          {title}
        </CardDescription>
        <CardTitle className="@[250px]/card:text-2xl text-2xl font-semibold tabular-nums text-foreground">
          {amount}
        </CardTitle>
      </CardHeader>
      <CardFooter className="px-5 pb-5 pt-0 text-xs text-muted-foreground">
        {description}
      </CardFooter>
    </Card>
  );
};

export default CardComponents;
