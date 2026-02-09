import { useSearch } from "@/contexts/SearchContext";
import { format } from "date-fns";
import { MapPin, Calendar, Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SearchDestination = () => {
  const { searchParams } = useSearch();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              Search Results
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore destinations based on your search criteria
            </p>
          </div>

          {/* Search Parameters Display */}
          <div className="max-w-3xl mx-auto bg-card rounded-2xl border border-border shadow-sm p-6 mb-12">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Search className="w-5 h-5 text-primary" />
              Your Search Parameters
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Destination</p>
                  <p className="font-medium text-foreground">
                    {searchParams.destination || "Not specified"}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Start Date</p>
                  <p className="font-medium text-foreground">
                    {searchParams.startDate 
                      ? format(searchParams.startDate, "PPP") 
                      : "Not specified"}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">End Date</p>
                  <p className="font-medium text-foreground">
                    {searchParams.endDate 
                      ? format(searchParams.endDate, "PPP") 
                      : "Not specified"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Placeholder Content */}
          <div className="text-center py-16 bg-muted/30 rounded-2xl border border-dashed border-border">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="font-serif text-2xl font-semibold text-foreground mb-2">
              Coming Soon
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              The search parameters retrieved from the store will be used here to display matching destinations, tours, and experiences.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SearchDestination;
