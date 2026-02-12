import { Calendar, DollarSign, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface BookingData {
  id: string;
  tripTitle: string;
  image: string;
  startDate: string;
  endDate: string;
  price: number;
  participants: number;
  status: "Confirmed" | "Pending" | "Completed" | "Cancelled";
  details: {
    travelers: string[];
    payment: string;
    inclusions?: string[];
  };
}

interface BookingCardProps {
  booking: BookingData;
  onViewDetails: (booking: BookingData) => void;
}

const statusStyles: Record<BookingData["status"], string> = {
  Confirmed: "bg-destructive/10 text-destructive border-destructive/20",
  Pending: "bg-muted text-muted-foreground border-border",
  Completed: "bg-muted text-foreground border-border",
  Cancelled: "bg-destructive/5 text-destructive/60 border-destructive/10",
};

export default function BookingCard({ booking, onViewDetails }: BookingCardProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <Card className="overflow-hidden border border-border bg-card shadow-soft hover:shadow-card transition-shadow duration-300">
      {/* Image */}
      <div className="aspect-video overflow-hidden">
        <img
          src={booking.image}
          alt={booking.tripTitle}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Title & Status */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-serif font-bold text-foreground text-base leading-tight line-clamp-2">
            {booking.tripTitle}
          </h3>
          <Badge
            variant="outline"
            className={`shrink-0 text-xs font-medium px-2.5 py-0.5 ${statusStyles[booking.status]}`}
          >
            {booking.status}
          </Badge>
        </div>

        {/* Info Rows */}
        <div className="space-y-1.5 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 shrink-0" />
            <span>{formatDate(booking.startDate)} - {formatDate(booking.endDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 shrink-0" />
            <span>${booking.price.toLocaleString()} USD</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 shrink-0" />
            <span>{booking.participants} Participant{booking.participants > 1 ? "s" : ""}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            onClick={() => onViewDetails(booking)}
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-semibold"
          >
            View Details
          </Button>
          <Button
            variant="outline"
            className="flex-1 text-sm font-medium"
            onClick={() => window.open("mailto:support@rathh.com?subject=Booking " + booking.id, "_blank")}
          >
            Contact Support
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
