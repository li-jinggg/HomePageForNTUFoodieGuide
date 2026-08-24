import { useState } from "react";
import {
  Search,
  Star,
  MapPin,
  Bot,
  Users,
  Map,
  Send,
  ChevronRight,
  Clock,
  Utensils,
  TrendingUp,
  ArrowRight,
  Menu,
  X,
  ThumbsUp,
} from "lucide-react";

const DISPLAY_FONT = "'Fraunces', serif";
const BODY_FONT = "'Plus Jakarta Sans', sans-serif";

const STALLS = [
  {
    id: 1,
    name: "Uncle Lim's Chicken Rice",
    canteen: "North Spine Food Court",
    cuisine: "Chinese",
    rating: 4.7,
    reviews: 312,
    price: "$3.50–$5",
    image:
      "https://images.unsplash.com/photo-1602253057119-44d745d9b860?w=400&h=280&fit=crop&auto=format",
    tags: ["Chicken Rice", "Roast"],
    topReview:
      "The roast chicken is absolutely tender and the chilli sauce hits different!",
  },
  {
    id: 2,
    name: "Ah Kow Ramen Bar",
    canteen: "The Hive",
    cuisine: "Japanese",
    rating: 4.5,
    reviews: 187,
    price: "$7–$10",
    image:
      "https://images.unsplash.com/photo-1612927601601-6638404737ce?w=400&h=280&fit=crop&auto=format",
    tags: ["Ramen", "Tonkotsu"],
    topReview:
      "Rich broth and perfectly done soft-boiled eggs. Go early to skip the queue!",
  },
  {
    id: 3,
    name: "Mama's Ban Mian",
    canteen: "Pioneer Canteen",
    cuisine: "Chinese",
    rating: 4.8,
    reviews: 429,
    price: "$4–$6",
    image:
      "https://images.unsplash.com/photo-1681038560284-58214f7ea0ac?w=400&h=280&fit=crop&auto=format",
    tags: ["Ban Mian", "Soup"],
    topReview:
      "Best ban mian on campus. Handmade noodles and crispy ikan bilis — perfection.",
  },
  {
    id: 4,
    name: "Seoulmate Korean Kitchen",
    canteen: "Foodgle Hub",
    cuisine: "Korean",
    rating: 4.4,
    reviews: 204,
    price: "$8–$12",
    image:
      "https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=400&h=280&fit=crop&auto=format",
    tags: ["Bibimbap", "Kimchi Jjigae"],
    topReview:
      "Portions are generous and the kimchi jjigae is genuinely authentic. Great value.",
  },
];

const REVIEWS = [
  {
    id: 1,
    initials: "W",
    user: "Wei Ling T.",
    programme: "Computer Science, Yr 3",
    stall: "Uncle Lim's Chicken Rice",
    canteen: "North Spine",
    rating: 5,
    date: "2 days ago",
    text: "Been eating here every week since Year 1. The soya sauce chicken is unmatched — silky smooth and the rice is always fluffy. Uncle and Auntie are so friendly too!",
    helpful: 47,
  },
  {
    id: 2,
    initials: "A",
    user: "Arjun M.",
    programme: "Electrical Engineering, Yr 2",
    stall: "Mama's Ban Mian",
    canteen: "Pioneer Canteen",
    rating: 5,
    date: "5 days ago",
    text: "Stumbled here before a 9am lab. The dry ban mian with extra egg is my go-to fuel now. Queue moves fast despite looking long. 100% recommend over the usual suspects.",
    helpful: 33,
  },
  {
    id: 3,
    initials: "S",
    user: "Sarah K.",
    programme: "Business, Yr 4",
    stall: "Ah Kow Ramen Bar",
    canteen: "The Hive",
    rating: 4,
    date: "1 week ago",
    text: "For campus ramen this is genuinely impressive. The shoyu broth surprised me. A bit pricier than other options but worth it as an occasional treat between tutorials.",
    helpful: 29,
  },
];

const BOT_RESPONSES: Record<string, string> = {
  "What's cheap near North Spine?":
    "At North Spine Food Court, Uncle Lim's Chicken Rice starts at just $3.50 — hard to beat for a full meal! The economy rice stall lets you mix-and-match dishes for around $3–4. Both are perennial student favourites. 🍱",
  "Best mala on campus?":
    "The mala xiang guo at Foodgle Hub (Level 1) consistently tops student polls — rated 4.6★ with 280+ reviews. Go before 12:30pm or expect a 15-min queue. Set your spice level to medium if it's your first time! 🌶️",
  "What's open after 8pm?":
    "Late-night options are slim, but The Quad's convenience store and Pioneer Canteen's Western stall usually stay open until 9pm on weekdays. The North Hill minimart is your best bet after that. 🌙",
};

const SUGGESTED_QUESTIONS = [
  "What's cheap near North Spine?",
  "Best mala on campus?",
  "What's open after 8pm?",
];

const CANTEENS = [
  { name: "North Spine Food Court", stalls: 18, distance: "5 min walk" },
  { name: "South Spine Food Court", stalls: 14, distance: "8 min walk" },
  { name: "The Hive", stalls: 10, distance: "3 min walk" },
  { name: "Pioneer Canteen", stalls: 22, distance: "12 min walk" },
  { name: "Foodgle Hub", stalls: 16, distance: "7 min walk" },
  { name: "The Quad", stalls: 8, distance: "6 min walk" },
];

function StarRow({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`${size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4"} ${
            i <= Math.round(rating)
              ? "fill-primary text-primary"
              : "fill-transparent text-muted"
          }`}
        />
      ))}
    </div>
  );
}

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<
    { role: "user" | "bot"; text: string }[]
  >([
    {
      role: "bot",
      text: "Hey there! I'm Foodie, your NTU campus food guide 🍜 Ask me about canteens, opening hours, or what's good today!",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  function sendMessage(text: string) {
    if (!text.trim()) return;
    setChatMessages((prev) => [...prev, { role: "user", text }]);
    setChatInput("");
    setIsTyping(true);
    setTimeout(() => {
      const response =
        BOT_RESPONSES[text] ??
        "Great question! I'm still learning about all the stalls on campus. Try browsing the map or check community reviews for the latest info! 😊";
      setChatMessages((prev) => [...prev, { role: "bot", text: response }]);
      setIsTyping(false);
    }, 1100);
  }

  return (
    <div
      className="min-h-screen bg-background text-foreground overflow-x-hidden"
      style={{ fontFamily: BODY_FONT }}
    >
      {/* ── NAV ──────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Utensils className="w-4 h-4 text-primary-foreground" />
            </div>
            <span
              className="text-lg font-bold text-foreground"
              style={{ fontFamily: DISPLAY_FONT }}
            >
              NTU Foodie Guide
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            {["Discover", "Reviews", "Map", "Chatbot"].map((link) => (
              <a
                key={link}
                href="#"
                className="hover:text-foreground transition-colors duration-200"
              >
                {link}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Sign In
            </button>
            <button className="text-sm px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">Leave a Review</button>
          </div>

          <button
            className="md:hidden text-muted-foreground p-1"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background px-6 py-4 flex flex-col gap-4 text-sm">
            {["Discover", "Reviews", "Map", "Chatbot"].map((link) => (
              <a
                key={link}
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {link}
              </a>
            ))}
            <button className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold">
              Leave a Review
            </button>
          </div>
        )}
      </nav>

      {/* ── HERO ─────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center pt-16">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-muted"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1628532429788-c35922b5e6c1?w=1600&h=900&fit=crop&auto=format')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/96 via-background/84 to-background/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold mb-7 tracking-wide"> BUILT BY STUDENTS, FOR STUDENTS<TrendingUp className="w-3.5 h-3.5" /></div>

            <h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6"
              style={{ fontFamily: DISPLAY_FONT }}
            >
              Find Your Next
              <span className="block text-primary italic">Favourite Stall</span>
            </h1>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed"> Discover hidden gems across 13 canteens, a variety of cafes, fast food outlets and restaurants — rated, reviewed, and recommended by your fellow NTU foodies.</p>

            {/* Search bar */}
            <div className="flex gap-3 mb-7">
              <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl bg-card border border-border focus-within:border-primary/40 transition-colors">
                <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search stalls, dishes, canteens..."
                  className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none flex-1"
                />
              </div>
              <button className="px-5 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">
                Search
              </button>
            </div>

            {/* Quick tags */}
            <div className="flex flex-wrap gap-2 mb-10">
              {[
                "🍗 Chicken Rice",
                "🍜 Ban Mian",
                "🌶️ Mala",
                "🍱 Bento",
                "🥘 Economy Rice",
                "🍣 Japanese",
              ].map((tag) => (
                <button
                  key={tag}
                  className="px-3 py-1.5 rounded-full text-xs border border-border text-muted-foreground hover:border-primary/40 hover:text-foreground transition-all duration-200"
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Stats */}
            <div className="flex gap-10">
              {[
                ["50+", "Food Stalls"],
                ["2,400+", "Reviews"],
                ["8", "Canteens"],
              ].map(([num, label]) => (
                <div key={label}>
                  <div
                    className="text-3xl font-bold text-foreground"
                    style={{ fontFamily: DISPLAY_FONT }}
                  >
                    {num}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────── */}
      <section className="py-24 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ fontFamily: DISPLAY_FONT }}
            >Everything you need to eat well on campus</h2>
            <p className="text-muted-foreground max-w-md mx-auto text-sm leading-relaxed">— Helping every NTU student find their next great meal without the guesswork.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                icon: <Bot className="w-6 h-6" />,
                title: "AI Foodie Chatbot",
                desc: "Ask anything — \"What's cheap near North Spine?\" or \"Best vegetarian options today?\" — and get instant, personalised recommendations drawn from thousands of student reviews.",
                cta: "Chat with Foodie",
                color: "#C41230",
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: "Community Reviews",
                desc: "Browse honest, unfiltered reviews from fellow NTU students and alumni. Filter by canteen, cuisine type, price range, or dietary preference.",
                cta: "Browse Reviews",
                color: "#1B2D4F",
              },
              {
                icon: <Map className="w-6 h-6" />,
                title: "Interactive Campus Map",
                desc: "A visual map of every canteen and food stall on campus. Find exactly where to go, check opening hours, and see estimated walking times from your current location.",
                cta: "Open the Map",
                color: "#1B2D4F",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group p-8 rounded-2xl border border-border bg-background hover:border-primary/25 transition-all duration-300"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
                  style={{
                    backgroundColor: `${feature.color}18`,
                    color: feature.color,
                  }}
                >
                  {feature.icon}
                </div>
                <h3
                  className="text-xl font-semibold mb-3"
                  style={{ fontFamily: DISPLAY_FONT }}
                >
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  {feature.desc}
                </p>
                <button
                  className="flex items-center gap-2 text-sm font-semibold transition-all"
                  style={{ color: feature.color }}
                >
                  {feature.cta}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRENDING STALLS ───────────────────────────── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-primary text-xs font-bold uppercase tracking-widest mb-2">
                This Week's Picks
              </p>
              <h2
                className="text-3xl md:text-4xl font-bold"
                style={{ fontFamily: DISPLAY_FONT }}
              >
                Trending on Campus
              </h2>
            </div>
            <button className="hidden md:flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              View all stalls{" "}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {STALLS.map((stall) => (
              <div
                key={stall.id}
                className="group rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/25 transition-all duration-300 cursor-pointer"
              >
                <div className="relative h-44 overflow-hidden bg-muted">
                  <img
                    src={stall.image}
                    alt={`${stall.name} dish`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                    {stall.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-background/75 text-foreground border border-border/60 backdrop-blur-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-primary text-primary-foreground text-xs font-bold">
                    {stall.rating}★
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-sm leading-snug mb-1">
                    {stall.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    {stall.canteen}
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <StarRow rating={stall.rating} />
                    <span>{stall.reviews} reviews</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 border-t border-border pt-3">
                    &ldquo;{stall.topReview}&rdquo;
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs font-bold text-foreground">
                      {stall.price}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {stall.cuisine}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REVIEWS ──────────────────────────────────── */}
      <section className="py-24 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-[#1B2D4F] text-xs font-bold uppercase tracking-widest mb-2">
                From the Community
              </p>
              <h2
                className="text-3xl md:text-4xl font-bold"
                style={{ fontFamily: DISPLAY_FONT }}
              >
                What students are saying
              </h2>
            </div>
            <button className="hidden md:flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              All reviews <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {REVIEWS.map((review) => (
              <div
                key={review.id}
                className="p-6 rounded-2xl border border-border bg-background flex flex-col"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold flex-shrink-0">
                      {review.initials}
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{review.user}</div>
                      <div className="text-xs text-muted-foreground">
                        {review.programme}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {review.date}
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <StarRow rating={review.rating} />
                  <span className="text-xs text-muted-foreground">at</span>
                  <span className="text-xs font-semibold text-primary truncate">
                    {review.stall}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">
                  &ldquo;{review.text}&rdquo;
                </p>

                <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-3">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3 h-3" />
                    {review.canteen}
                  </div>
                  <button className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                    <ThumbsUp className="w-3 h-3" />
                    {review.helpful} helpful
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-sm font-semibold text-foreground hover:border-primary/40 transition-colors">
              Load more reviews <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ── CHATBOT DEMO ─────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <p className="text-primary text-xs font-bold uppercase tracking-widest mb-4">
              Meet Foodie
            </p>
            <h2
              className="text-3xl md:text-4xl font-bold mb-6 leading-tight"
              style={{ fontFamily: DISPLAY_FONT }}
            >
              Your AI campus
              <span className="italic block">food companion</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6 text-sm">
              Don't know what to eat? Just ask Foodie. Whether you're hunting
              for something cheap before a 9am lecture, craving mala on a
              Friday, or need halal options near Hall 14 — Foodie has you covered.
            </p>
            <ul className="space-y-3">
              {[
                "Recommends stalls based on your budget and location",
                "Knows opening hours for all 8 canteens",
                "Understands dietary needs — halal, vegetarian, vegan",
                "Powered by 2,400+ real student reviews",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <span className="w-4 h-4 rounded-full bg-primary/15 flex-shrink-0 flex items-center justify-center mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Interactive chat widget */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-2xl">
            {/* Chat header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <div className="text-sm font-semibold">Foodie</div>
                <div className="text-xs text-[#4CAF50] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4CAF50] inline-block" />
                  Online
                </div>
              </div>
            </div>

            {/* Messages */}
            <div
              className="p-4 h-64 overflow-y-auto flex flex-col gap-3"
              style={{ scrollbarWidth: "none" }}
            >
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[82%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-background border border-border text-foreground rounded-bl-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="px-4 py-3 rounded-2xl bg-background border border-border rounded-bl-sm">
                    <div className="flex gap-1 items-center">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Suggested + input */}
            <div className="px-4 pt-2 pb-4 border-t border-border">
              <div className="flex flex-wrap gap-1.5 mb-3">
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="text-xs px-2.5 py-1.5 rounded-full border border-border text-muted-foreground hover:border-primary/40 hover:text-foreground transition-all duration-200"
                  >
                    {q}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage(chatInput)}
                  placeholder="Ask anything about campus food..."
                  className="flex-1 bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/40 transition-colors"
                />
                <button
                  onClick={() => sendMessage(chatInput)}
                  className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center hover:opacity-90 transition-opacity flex-shrink-0"
                >
                  <Send className="w-4 h-4 text-primary-foreground" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CAMPUS MAP TEASER ────────────────────────── */}
      <section className="py-24 bg-card border-t border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-[#1B2D4F] text-xs font-bold uppercase tracking-widest mb-2">
              Navigate Campus
            </p>
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ fontFamily: DISPLAY_FONT }}
            >
              All 8 canteens, one map
            </h2>
            <p className="text-muted-foreground max-w-sm mx-auto text-sm leading-relaxed">
              Don't wander hungry. Find the nearest canteen, check what's
              available, and plan your route in seconds.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {CANTEENS.map((c) => (
              <div
                key={c.name}
                className="group flex items-center gap-4 p-4 rounded-xl border border-border bg-background hover:border-primary/30 transition-all duration-200 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{c.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {c.stalls} stalls · {c.distance}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            ))}
          </div>

          <div className="text-center">
            <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">
              <Map className="w-4 h-4" />
              Open Interactive Map
            </button>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────── */}
      <section className="py-28 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-muted"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1681038560284-58214f7ea0ac?w=1600&h=600&fit=crop&auto=format')",
          }}
        />
        <div className="absolute inset-0 bg-[#0D1B2A]/90" />
        <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
          <h2
            className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-white"
            style={{ fontFamily: DISPLAY_FONT }}
          >
            Tried something great?
            <span className="block text-[#E8485A] italic">
              Tell everyone about it.
            </span>
          </h2>
          <p className="text-white/65 mb-8 leading-relaxed">
            Every review helps a fellow NTU student find their next favourite
            meal. Join 5,000+ students already shaping the guide.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
              Write a Review
            </button>
            <button className="px-8 py-3.5 rounded-xl border border-white/20 text-white font-semibold hover:border-white/40 transition-colors">
              Browse Stalls
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────── */}
      <footer className="border-t border-border py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <Utensils className="w-3 h-3 text-primary-foreground" />
            </div>
            <span
              className="text-sm font-bold"
              style={{ fontFamily: DISPLAY_FONT }}
            >
              NTU Foodie Guide
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Made with 🍜 by NTU students, for NTU students.
          </p>
          <div className="flex gap-6 text-xs text-muted-foreground">
            {["About", "Contribute", "Privacy"].map((l) => (
              <a
                key={l}
                href="#"
                className="hover:text-foreground transition-colors"
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
