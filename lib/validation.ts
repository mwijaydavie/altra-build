import { z } from "zod";

export const rfqSchema = z.object({
  name: z
    .string()
    .min(2, "Enter your full name")
    .max(80, "That name is too long"),
  organisation: z
    .string()
    .min(2, "Enter your organisation")
    .max(120, "That organisation name is too long"),
  email: z.string().email("Enter a valid email address"),
  phone: z
    .string()
    .min(7, "Enter a reachable phone number")
    .max(24, "That phone number is too long"),
  discipline: z.enum(["civil", "commercial", "industrial", "retrofit"], {
    message: "Select a discipline",
  }),
  location: z.string().min(2, "Where is the project?"),
  area: z
    .number({ message: "Enter an approximate area" })
    .min(100, "Minimum enquiry is 100 m²")
    .max(500000, "Please contact us directly for sites above 500,000 m²"),
  budget: z.enum(["under-1b", "1b-5b", "5b-20b", "20b-plus", "advise"]),
  timeframe: z.enum(["0-6", "6-12", "12-24", "24-plus", "advise"]),
  brief: z
    .string()
    .min(20, "Give us at least a sentence or two")
    .max(2000, "Please keep the brief under 2,000 characters"),
  consent: z
    .boolean()
    .refine((value) => value === true, {
      message: "Please accept the data processing terms",
    }),
});

export type RFQValues = z.infer<typeof rfqSchema>;

export const rfqDefaults: Partial<RFQValues> = {
  discipline: "commercial",
  area: 8500,
  budget: "1b-5b",
  timeframe: "6-12",
  consent: false,
};

export const portalLoginSchema = z.object({
  email: z.string().email("Enter the email registered with us"),
  password: z.string().min(8, "Passwords are at least 8 characters"),
});

export type PortalLoginValues = z.infer<typeof portalLoginSchema>;

export const budgetLabels: Record<RFQValues["budget"], string> = {
  "under-1b": "Under TZS 1B",
  "1b-5b": "TZS 1B – 5B",
  "5b-20b": "TZS 5B – 20B",
  "20b-plus": "TZS 20B +",
  advise: "Advise me",
};

export const timeframeLabels: Record<RFQValues["timeframe"], string> = {
  "0-6": "Within 6 months",
  "6-12": "6 – 12 months",
  "12-24": "12 – 24 months",
  "24-plus": "24 months +",
  advise: "Advise me",
};
