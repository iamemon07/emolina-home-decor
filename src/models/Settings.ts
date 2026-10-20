import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const WalletSchema = new Schema(
  {
    enabled: { type: Boolean, default: false },
    number: { type: String, default: "" },
    accountType: { type: String, default: "Personal" },
    instructions: { type: String, default: "" },
  },
  { _id: false },
);

/** Singleton document (key = "site") holding all editable site content & business config. */
const SettingsSchema = new Schema(
  {
    key: { type: String, default: "site", unique: true },

    // Brand
    storeName: { type: String, default: "Emoline Home Decor" },
    tagline: { type: String, default: "Where Every Corner Feels Like Home" },
    logo: { type: String, default: "/brand/logo.png" },
    currencySymbol: { type: String, default: "৳" },

    // Contact
    email: { type: String, default: "hello@emoline.com" },
    phone: { type: String, default: "+880 1XXX-XXXXXX" },
    whatsapp: { type: String, default: "" },
    address: { type: String, default: "Dhaka, Bangladesh" },
    social: {
      facebook: { type: String, default: "" },
      instagram: { type: String, default: "" },
      tiktok: { type: String, default: "" },
      youtube: { type: String, default: "" },
    },

    // Announcement bar
    announcement: {
      enabled: { type: Boolean, default: true },
      text: { type: String, default: "Free delivery on orders over ৳5,000 · Every piece safely packed" },
      link: { type: String, default: "/shop" },
    },

    // Homepage content
    home: {
      categoriesTitle: { type: String, default: "Shop by Category" },
      newArrivalsTitle: { type: String, default: "New Arrivals" },
      newArrivalsSubtitle: { type: String, default: "Fresh finds to refresh every room" },
      bestSellersTitle: { type: String, default: "Best Sellers" },
      bestSellersSubtitle: { type: String, default: "The pieces our customers keep coming back for" },
      storyTitle: { type: String, default: "Spaces That Tell Your Story" },
      storyText: {
        type: String,
        default:
          "At Emoline, we believe a home should feel like you. Every vase, lamp, cushion and frame is handpicked for its craft, texture and warmth — so you can create spaces that are calm, beautiful and truly lived-in. From a single statement piece to a full room refresh, we are here to help every corner feel like home.",
      },
      storyImage: { type: String, default: "/brand/banner.png" },
      features: {
        type: [{ title: String, text: String, _id: false }],
        default: [
          { title: "Handpicked Pieces", text: "Curated for quality & craft" },
          { title: "Safe Delivery", text: "Carefully packed, 2–5 working days" },
          { title: "Cash on Delivery", text: "Pay when you receive" },
          { title: "Damage Protection", text: "Free replacement if it arrives broken" },
        ],
      },
    },

    // Shipping
    shipping: {
      insideCityLabel: { type: String, default: "Inside Dhaka" },
      outsideCityLabel: { type: String, default: "Outside Dhaka" },
      insideFee: { type: Number, default: 80 },
      outsideFee: { type: Number, default: 150 },
      freeShippingThreshold: { type: Number, default: 5000 }, // 0 = disabled
      minDays: { type: Number, default: 2 },
      maxDays: { type: Number, default: 5 },
      weekendDays: { type: [Number], default: [5] }, // Friday
    },

    // Payments
    payments: {
      cod: { enabled: { type: Boolean, default: true }, instructions: { type: String, default: "Pay in cash when your parcel arrives." } },
      bkash: { type: WalletSchema, default: () => ({ enabled: false, accountType: "Personal", instructions: "Send Money to the number above, then enter your bKash number and Transaction ID." }) },
      nagad: { type: WalletSchema, default: () => ({ enabled: false, accountType: "Personal" }) },
      rocket: { type: WalletSchema, default: () => ({ enabled: false, accountType: "Personal" }) },
      bank: {
        enabled: { type: Boolean, default: false },
        details: { type: String, default: "" },
      },
    },

    // Invoice
    invoice: {
      footerNote: { type: String, default: "Thank you for shopping with Emoline Home Decor! If anything arrives damaged, message us within 48 hours with your unboxing video." },
    },

    // SEO
    seo: {
      title: { type: String, default: "Emoline Home Decor — Where Every Corner Feels Like Home" },
      description: {
        type: String,
        default: "Shop curated home decor in Bangladesh — vases, wall art, lighting, cushions, planters and tableware from Emoline Home Decor. Safely packed, delivered nationwide with cash on delivery.",
      },
    },
    footerAbout: {
      type: String,
      default: "Handpicked home decor to make every corner feel like home — thoughtfully curated, carefully packed and delivered to your door.",
    },
  },
  { timestamps: true, minimize: false },
);

export type SettingsDoc = InferSchemaType<typeof SettingsSchema>;
export const Settings = (models.Settings as Model<SettingsDoc>) || model("Settings", SettingsSchema);
