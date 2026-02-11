import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ShieldCheck,
  Plus,
  Minus,
  CalendarDays,
  Users,
  CreditCard,
  AlertCircle,
  ExternalLink,
  Lock,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

// --- Constants ---
const IS_DEV_MODE = true;
const TAX_RATE = 0.05;

// --- Mock trip context ---
const MOCK_TRIPS_CONTEXT: Record<string, { title: string; image: string }> = {
  trip_101: {
    title: "Captivating Morocco: Imperial Cities & Sahara Adventure",
    image: "https://images.unsplash.com/photo-1626014903700-1c5c58b44463?w=600&q=80",
  },
  trip_102: {
    title: "Classic Japan: Kyoto to Tokyo",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=80",
  },
  trip_103: {
    title: "Kerala Backwaters Retreat",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80",
  },
  trip_104: {
    title: "Goa Beach & Party",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&q=80",
  },
};

// --- Session data interface ---
interface BookingSession {
  tripId: string;
  selectedDate: { start: string; end: string } | null;
  selectedDateId?: string;
  pricePerPerson: number;
  groupType: string;
}

// --- Zod schemas ---
const travelerSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(100),
  lastName: z.string().trim().max(100).optional().or(z.literal("")),
  email: z.string().trim().email("Invalid email address").max(255),
  phone: z.string().trim().min(1, "Phone number is required").max(30),
  address1: z.string().trim().max(200).optional().or(z.literal("")),
  address2: z.string().trim().max(200).optional().or(z.literal("")),
  city: z.string().trim().max(100).optional().or(z.literal("")),
  state: z.string().trim().max(100).optional().or(z.literal("")),
  postalCode: z.string().trim().max(20).optional().or(z.literal("")),
  country: z.string().trim().max(100).optional().or(z.literal("")),
});

const paymentSchema = z.object({
  cardNumber: z.string().trim().min(1, "Card number is required").max(19),
  nameOnCard: z.string().trim().min(1, "Name on card is required").max(100),
  expiry: z.string().trim().min(1, "Expiry date is required").max(5),
  cvc: z.string().trim().min(1, "CVC is required").max(4),
});

type TravelerFormData = z.infer<typeof travelerSchema>;
type PaymentFormData = z.infer<typeof paymentSchema>;

// --- Generate simple unique ID ---
const generateId = () =>
  `bk_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

// --- Main Page ---
const CheckoutPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Read session data
  const [session, setSession] = useState<BookingSession | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("booking_session_data");
      if (!raw) {
        navigate("/");
        return;
      }
      setSession(JSON.parse(raw));
    } catch {
      navigate("/");
    }
  }, [navigate]);

  // Traveler count
  const [travelerCount, setTravelerCount] = useState(1);

  // Payment valid state
  const [isPaymentValid, setIsPaymentValid] = useState(IS_DEV_MODE);

  // Load draft data
  const getDraft = useCallback((): {
    traveler?: Partial<TravelerFormData>;
    payment?: Partial<PaymentFormData>;
    travelerCount?: number;
  } => {
    try {
      const raw = localStorage.getItem("checkout_form_draft");
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }, []);

  const draft = getDraft();

  // Traveler form
  const travelerForm = useForm<TravelerFormData>({
    resolver: zodResolver(travelerSchema),
    defaultValues: {
      firstName: draft.traveler?.firstName || "",
      lastName: draft.traveler?.lastName || "",
      email: draft.traveler?.email || "",
      phone: draft.traveler?.phone || "",
      address1: draft.traveler?.address1 || "",
      address2: draft.traveler?.address2 || "",
      city: draft.traveler?.city || "",
      state: draft.traveler?.state || "",
      postalCode: draft.traveler?.postalCode || "",
      country: draft.traveler?.country || "",
    },
    mode: "onChange",
  });

  // Payment form
  const paymentForm = useForm<PaymentFormData>({
    resolver: zodResolver(IS_DEV_MODE ? paymentSchema.partial() : paymentSchema),
    defaultValues: {
      cardNumber: draft.payment?.cardNumber || (IS_DEV_MODE ? "4242 4242 4242 4242" : ""),
      nameOnCard: draft.payment?.nameOnCard || (IS_DEV_MODE ? "Dev User" : ""),
      expiry: draft.payment?.expiry || (IS_DEV_MODE ? "12/28" : ""),
      cvc: draft.payment?.cvc || (IS_DEV_MODE ? "123" : ""),
    },
    mode: "onChange",
  });

  // Restore traveler count from draft
  useEffect(() => {
    if (draft.travelerCount && draft.travelerCount >= 1) {
      setTravelerCount(draft.travelerCount);
    }
  }, []);

  // Persist form draft
  const travelerValues = travelerForm.watch();
  const paymentValues = paymentForm.watch();

  useEffect(() => {
    const draftData = {
      traveler: travelerValues,
      payment: paymentValues,
      travelerCount,
    };
    try {
      localStorage.setItem("checkout_form_draft", JSON.stringify(draftData));
    } catch {}
  }, [travelerValues, paymentValues, travelerCount]);

  // Payment validation for non-dev mode
  useEffect(() => {
    if (!IS_DEV_MODE) {
      const { cardNumber, nameOnCard, expiry, cvc } = paymentValues;
      setIsPaymentValid(
        !!(cardNumber?.trim() && nameOnCard?.trim() && expiry?.trim() && cvc?.trim())
      );
    }
  }, [paymentValues]);

  if (!session) return null;

  // Trip context
  const tripInfo = MOCK_TRIPS_CONTEXT[session.tripId] || {
    title: "Your Selected Trip",
    image: "https://images.unsplash.com/photo-1626014903700-1c5c58b44463?w=600&q=80",
  };

  // Price calculations
  const tripPrice = session.pricePerPerson * travelerCount;
  const taxes = tripPrice * TAX_RATE;
  const totalAmount = tripPrice + taxes;

  const isTravelerValid = travelerForm.formState.isValid;
  const canConfirm = isTravelerValid && isPaymentValid;

  const handleConfirm = () => {
    if (!canConfirm) return;

    const travelerData = travelerForm.getValues();

    const finalPayload = {
      bookingId: generateId(),
      tripId: session.tripId,
      selectedDate: session.selectedDate,
      groupType: session.groupType,
      pricePerPerson: session.pricePerPerson,
      travelerCount,
      totalAmount,
      taxes,
      traveler: travelerData,
      timestamp: new Date().toISOString(),
    };

    try {
      localStorage.setItem("final_booking_data", JSON.stringify(finalPayload));
      localStorage.removeItem("booking_session_data");
      localStorage.removeItem("checkout_form_draft");
    } catch (e) {
      console.warn("Failed to save booking:", e);
    }

    toast({ title: "Booking confirmed!", description: "Redirecting..." });
    navigate("/booking-confirmation");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-8">
          Complete Your Booking
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-8">
            {/* Traveler Information */}
            <Card>
              <CardContent className="p-6 space-y-6">
                <h2 className="font-serif text-xl font-semibold text-foreground flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Traveler Information
                </h2>

                <Form {...travelerForm}>
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={travelerForm.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="John" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={travelerForm.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={travelerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address *</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="john@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={travelerForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number *</FormLabel>
                            <FormControl>
                              <Input type="tel" placeholder="+1 234 567 8900" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={travelerForm.control}
                      name="address1"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address Line 1</FormLabel>
                          <FormControl>
                            <Input placeholder="123 Main Street" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={travelerForm.control}
                      name="address2"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address Line 2</FormLabel>
                          <FormControl>
                            <Input placeholder="Apt 4B" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <FormField
                        control={travelerForm.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="New York" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={travelerForm.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State / Province</FormLabel>
                            <FormControl>
                              <Input placeholder="NY" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={travelerForm.control}
                        name="postalCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Postal Code</FormLabel>
                            <FormControl>
                              <Input placeholder="10001" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={travelerForm.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                            <Input placeholder="United States" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardContent className="p-6 space-y-6">
                <h2 className="font-serif text-xl font-semibold text-foreground flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  Payment Method
                </h2>

                {IS_DEV_MODE && (
                  <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-lg px-4 py-2.5">
                    <AlertCircle className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-sm text-primary font-medium">
                      Dev Mode: Payment Simulation Active (Payment considered successful)
                    </span>
                  </div>
                )}

                <Form {...paymentForm}>
                  <form className="space-y-4">
                    <FormField
                      control={paymentForm.control}
                      name="cardNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Card Number</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="4242 4242 4242 4242"
                              {...field}
                              disabled={IS_DEV_MODE}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={paymentForm.control}
                      name="nameOnCard"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name on Card</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="John Doe"
                              {...field}
                              disabled={IS_DEV_MODE}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={paymentForm.control}
                        name="expiry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Expiry Date</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="MM/YY"
                                {...field}
                                disabled={IS_DEV_MODE}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={paymentForm.control}
                        name="cvc"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CVC</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="123"
                                {...field}
                                disabled={IS_DEV_MODE}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Booking Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="shadow-lg border-primary/10 overflow-hidden">
                {/* Trip Image */}
                <div className="h-40 overflow-hidden">
                  <img
                    src={tripInfo.image}
                    alt={tripInfo.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <CardContent className="p-6 space-y-5">
                  <h3 className="font-serif text-lg font-semibold text-foreground leading-snug">
                    {tripInfo.title}
                  </h3>

                  {/* Date & Group */}
                  <div className="space-y-2 text-sm">
                    {session.selectedDate && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <CalendarDays className="w-4 h-4 text-primary" />
                        <span>
                          {session.selectedDate.start} → {session.selectedDate.end}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="w-4 h-4 text-primary" />
                      <span className="capitalize">{session.groupType} Group</span>
                    </div>
                  </div>

                  {/* Traveler Count */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Travelers</span>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setTravelerCount((c) => Math.max(1, c - 1))}
                        disabled={travelerCount <= 1}
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </Button>
                      <span className="text-sm font-semibold w-6 text-center text-foreground">
                        {travelerCount}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setTravelerCount((c) => c + 1)}
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  {/* Price Breakdown */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                      <span>
                        ${session.pricePerPerson.toLocaleString()} × {travelerCount}{" "}
                        {travelerCount === 1 ? "traveler" : "travelers"}
                      </span>
                      <span>${tripPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Taxes & Fees (5%)</span>
                      <span>${taxes.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg text-foreground">
                      <span>Total</span>
                      <span>${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  </div>

                  {/* Confirm Button */}
                  <Button
                    onClick={handleConfirm}
                    disabled={!canConfirm}
                    className="w-full h-12 text-base font-semibold"
                    size="lg"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Confirm Booking
                  </Button>

                  {/* Security note */}
                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <ShieldCheck className="w-4 h-4 text-green-600" />
                    <span>Your booking is 100% secure</span>
                  </div>

                  {/* Cancellation policy */}
                  <p className="text-xs text-muted-foreground text-center leading-relaxed">
                    Free cancellation within 24 hours of booking. Read our{" "}
                    <a
                      href="/terms"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline underline-offset-2 inline-flex items-center gap-0.5"
                    >
                      terms and conditions
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CheckoutPage;
