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
    <Card className="p-2">
      <CardHeader className="relative">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="@[250px]/card:text-2xl text-xl font-semibold tabular-nums">
          {amount}
        </CardTitle>
      </CardHeader>
      <CardFooter className="text-xs text-muted-foreground">
        {description}
      </CardFooter>
    </Card>
  );
};

export default CardComponents;
