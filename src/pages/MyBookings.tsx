import { useState, useEffect, useMemo } from "react";
import { Search, ChevronDown, ChevronUp, Download, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import BookingCard, { type BookingData } from "@/components/BookingCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// --- MOCK DATA ---
const MOCK_BOOKINGS: BookingData[] = [
  {
    id: "BK-MOR-001",
    tripTitle: "Morocco Explorer: Desert & Mountains",
    image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=600&h=400&fit=crop",
    startDate: "2024-10-15",
    endDate: "2024-10-22",
    price: 1899,
    participants: 2,
    status: "Confirmed",
    details: {
      travelers: ["You", "Sarah"],
      payment: "Visa **** 4242",
      inclusions: ["Hotel accommodation", "Daily breakfast", "Desert safari", "Airport transfers"],
    },
  },
  {
    id: "BK-VIE-002",
    tripTitle: "Vietnam Food Adventure",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop",
    startDate: "2024-11-05",
    endDate: "2024-11-12",
    price: 1250,
    participants: 1,
    status: "Pending",
    details: {
      travelers: ["You"],
      payment: "Pending",
      inclusions: ["Guided food tours", "Hotel stays", "Cooking class"],
    },
  },
  {
    id: "BK-PAT-003",
    tripTitle: "Patagonia Trekking Expedition",
    image: "https://images.unsplash.com/photo-1518182170546-0766ce6fec56?w=600&h=400&fit=crop",
    startDate: "2024-12-01",
    endDate: "2024-12-10",
    price: 3100,
    participants: 3,
    status: "Confirmed",
    details: {
      travelers: ["You", "Mark", "Lucy"],
      payment: "Mastercard **** 8888",
      inclusions: ["Trekking gear", "Lodge stays", "Park entry", "Guide services"],
    },
  },
  {
    id: "BK-MAC-004",
    tripTitle: "Machu Picchu & Inca Trail",
    image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=600&h=400&fit=crop",
    startDate: "2024-05-10",
    endDate: "2024-05-17",
    price: 2500,
    participants: 2,
    status: "Completed",
    details: {
      travelers: ["You", "Partner"],
      payment: "Visa **** 1234",
      inclusions: ["Trail permits", "Camping gear", "Meals on trail", "Train tickets"],
    },
  },
  {
    id: "BK-ICE-005",
    tripTitle: "Iceland Ring Road Tour",
    image: "https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=600&h=400&fit=crop",
    startDate: "2024-04-01",
    endDate: "2024-04-08",
    price: 2100,
    participants: 4,
    status: "Completed",
    details: {
      travelers: ["Family Group"],
      payment: "Amex **** 0005",
      inclusions: ["4x4 rental", "Guesthouse stays", "Northern Lights tour"],
    },
  },
  {
    id: "BK-THAI-006",
    tripTitle: "Thailand Island Hopping",
    image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600&h=400&fit=crop",
    startDate: "2024-02-15",
    endDate: "2024-02-22",
    price: 950,
    participants: 1,
    status: "Cancelled",
    details: {
      travelers: ["You"],
      payment: "Refunded",
      inclusions: ["Ferry passes", "Beach bungalow", "Snorkeling tour"],
    },
  },
];

function fetchUserBookings(): Promise<BookingData[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_BOOKINGS), 800);
  });
}

// --- Detail Row Helper ---
function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-1.5">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

export default function MyBookings() {
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentOpen, setCurrentOpen] = useState(true);
  const [pastOpen, setPastOpen] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(null);

  useEffect(() => {
    fetchUserBookings().then((data) => {
      setBookings(data);
      setLoading(false);
    });
  }, []);

  // Filter bookings by search
  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return bookings;
    const q = searchQuery.toLowerCase();
    return bookings.filter(
      (b) => b.id.toLowerCase().includes(q) || b.tripTitle.toLowerCase().includes(q)
    );
  }, [bookings, searchQuery]);

  const currentBookings = filtered.filter((b) => b.status === "Confirmed" || b.status === "Pending");
  const pastBookings = filtered.filter((b) => b.status === "Completed" || b.status === "Cancelled");

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <h1 className="text-3xl md:text-4xl font-bold font-serif text-foreground mb-6">My Bookings</h1>

        {/* Search Bar */}
        <div className="flex gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter Booking ID or Trip Name to search"
              className="pl-10 h-12 text-base bg-card"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button className="h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-base">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="space-y-8">
            <Skeleton className="h-10 w-64" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-video w-full rounded-lg" />
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="flex gap-2">
                    <Skeleton className="h-9 flex-1" />
                    <Skeleton className="h-9 flex-1" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && (
          <div className="space-y-8">
            {/* Current Bookings */}
            <Collapsible open={currentOpen} onOpenChange={setCurrentOpen}>
              <CollapsibleTrigger asChild>
                <button className="flex items-center gap-3 w-full text-left group">
                  <h2 className="text-xl font-bold font-serif text-foreground">
                    Current Bookings ({currentBookings.length})
                  </h2>
                  {currentOpen ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  )}
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4">
                {currentBookings.length === 0 ? (
                  <p className="text-muted-foreground text-sm py-6">No current bookings found.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentBookings.map((booking) => (
                      <BookingCard key={booking.id} booking={booking} onViewDetails={setSelectedBooking} />
                    ))}
                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>

            {/* Past Bookings */}
            <Collapsible open={pastOpen} onOpenChange={setPastOpen}>
              <CollapsibleTrigger asChild>
                <button className="flex items-center gap-3 w-full text-left group">
                  <h2 className="text-xl font-bold font-serif text-foreground">
                    Past Bookings ({pastBookings.length})
                  </h2>
                  {pastOpen ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  )}
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4">
                {pastBookings.length === 0 ? (
                  <p className="text-muted-foreground text-sm py-6">No past bookings found.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pastBookings.map((booking) => (
                      <BookingCard key={booking.id} booking={booking} onViewDetails={setSelectedBooking} />
                    ))}
                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>
          </div>
        )}
      </main>

      {/* View Details Modal */}
      <Dialog open={!!selectedBooking} onOpenChange={(open) => !open && setSelectedBooking(null)}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          {selectedBooking && (
            <>
              <DialogHeader>
                <DialogTitle className="font-serif text-xl">{selectedBooking.tripTitle}</DialogTitle>
                <DialogDescription className="font-mono text-xs">
                  Booking ID: {selectedBooking.id}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-2">
                {/* Primary Info */}
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">Trip Details</h4>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <DetailRow label="Dates" value={`${formatDate(selectedBooking.startDate)} - ${formatDate(selectedBooking.endDate)}`} />
                    <DetailRow label="Participants" value={`${selectedBooking.participants}`} />
                    <DetailRow label="Total Price" value={`$${selectedBooking.price.toLocaleString()} USD`} />
                    <DetailRow label="Status" value={selectedBooking.status} />
                  </div>
                </div>

                <Separator />

                {/* Travelers */}
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">Travelers</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedBooking.details.travelers.map((t, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Payment */}
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">Payment Method</h4>
                  <p className="text-sm text-muted-foreground">{selectedBooking.details.payment}</p>
                </div>

                {/* Inclusions */}
                {selectedBooking.details.inclusions && selectedBooking.details.inclusions.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-2">What's Included</h4>
                      <ul className="space-y-1">
                        {selectedBooking.details.inclusions.map((item, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}

                {/* Download Invoice */}
                <Button variant="ghost" className="w-full mt-2 text-primary hover:text-primary/80">
                  <Download className="h-4 w-4 mr-2" />
                  Download Invoice
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
