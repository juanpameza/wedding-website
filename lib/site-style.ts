import type { CSSProperties } from "react";

export const FONT_OPTIONS = [
  {
    label: "Brittney Signature",
    value: "Brittney Signature",
    stack: '"Brittney Signature", "Great Vibes", cursive',
    source: "custom",
  },
  {
    label: "Great Vibes",
    value: "Great Vibes",
    stack: '"Great Vibes", cursive',
    source: "google",
  },
  {
    label: "Dancing Script",
    value: "Dancing Script",
    stack: '"Dancing Script", cursive',
    source: "google",
  },
  {
    label: "Parisienne",
    value: "Parisienne",
    stack: '"Parisienne", cursive',
    source: "google",
  },
  {
    label: "Pinyon Script",
    value: "Pinyon Script",
    stack: '"Pinyon Script", cursive',
    source: "google",
  },
  {
    label: "Sacramento",
    value: "Sacramento",
    stack: '"Sacramento", cursive',
    source: "google",
  },
  {
    label: "Cormorant Garamond",
    value: "Cormorant Garamond",
    stack: '"Cormorant Garamond", Georgia, serif',
    source: "google",
    weighted: true,
  },
  {
    label: "EB Garamond",
    value: "EB Garamond",
    stack: '"EB Garamond", Georgia, serif',
    source: "google",
    weighted: true,
  },
  {
    label: "Playfair Display",
    value: "Playfair Display",
    stack: '"Playfair Display", Georgia, serif',
    source: "google",
    weighted: true,
  },
  {
    label: "Lora",
    value: "Lora",
    stack: '"Lora", Georgia, serif',
    source: "google",
    weighted: true,
  },
  {
    label: "Libre Baskerville",
    value: "Libre Baskerville",
    stack: '"Libre Baskerville", Georgia, serif',
    source: "google",
    weighted: true,
  },
  {
    label: "Montserrat Medium",
    value: "Montserrat",
    stack: '"Montserrat", Arial, sans-serif',
    source: "google",
    weighted: true,
    normalWeight: 500,
  },
] as const;

export const FONT_SELECT_OPTIONS = FONT_OPTIONS.map(({ label, value }) => ({
  label,
  value,
}));

export type FontOptionValue = (typeof FONT_OPTIONS)[number]["value"];

export const INHERIT_DISPLAY_FONT = "__displayFont";
export const INHERIT_BODY_FONT = "__bodyFont";

export const TYPOGRAPHY_FONT_SELECT_OPTIONS = [
  { label: "Use display default", value: INHERIT_DISPLAY_FONT },
  { label: "Use body default", value: INHERIT_BODY_FONT },
  ...FONT_SELECT_OPTIONS,
] as const;

type TypographyFontValue =
  | FontOptionValue
  | typeof INHERIT_DISPLAY_FONT
  | typeof INHERIT_BODY_FONT;

export type TypographyRole =
  | "homeNames"
  | "homeAmpersand"
  | "homeDetails"
  | "pageHeading"
  | "sectionHeading"
  | "sectionSubheading"
  | "cardHeading"
  | "bodyText"
  | "nav"
  | "button"
  | "countdownNumber"
  | "countdownLabel";

export type TypographySettings = {
  fontFamily?: string | null;
  fontSize?: number | null;
  bold?: boolean | null;
  italic?: boolean | null;
};

type TypographyDefaults = {
  fontFamily: TypographyFontValue;
  fontSize: number;
  bold: boolean;
  italic: boolean;
  normalWeight?: number;
};

type ResolvedTypographySettings = Omit<TypographyDefaults, "fontFamily"> & {
  fontFamily: string;
};

export const DEFAULT_TYPOGRAPHY: Record<TypographyRole, TypographyDefaults> = {
  homeNames: {
    fontFamily: INHERIT_DISPLAY_FONT,
    fontSize: 74,
    bold: false,
    italic: false,
  },
  homeAmpersand: {
    fontFamily: INHERIT_DISPLAY_FONT,
    fontSize: 128,
    bold: false,
    italic: false,
  },
  homeDetails: {
    fontFamily: INHERIT_DISPLAY_FONT,
    fontSize: 28,
    bold: false,
    italic: false,
  },
  pageHeading: {
    fontFamily: INHERIT_DISPLAY_FONT,
    fontSize: 64,
    bold: false,
    italic: false,
  },
  sectionHeading: {
    fontFamily: INHERIT_DISPLAY_FONT,
    fontSize: 44,
    bold: false,
    italic: false,
  },
  sectionSubheading: {
    fontFamily: INHERIT_BODY_FONT,
    fontSize: 16,
    bold: false,
    italic: false,
  },
  cardHeading: {
    fontFamily: INHERIT_DISPLAY_FONT,
    fontSize: 32,
    bold: false,
    italic: false,
  },
  bodyText: {
    fontFamily: INHERIT_BODY_FONT,
    fontSize: 18,
    bold: false,
    italic: false,
  },
  nav: {
    fontFamily: INHERIT_BODY_FONT,
    fontSize: 14,
    bold: false,
    italic: false,
  },
  button: {
    fontFamily: INHERIT_BODY_FONT,
    fontSize: 14,
    bold: false,
    italic: false,
  },
  countdownNumber: {
    fontFamily: INHERIT_BODY_FONT,
    fontSize: 44,
    bold: false,
    italic: false,
    normalWeight: 300,
  },
  countdownLabel: {
    fontFamily: INHERIT_BODY_FONT,
    fontSize: 10,
    bold: false,
    italic: false,
  },
};

export const COUNTDOWN_PAGE_KEYS = [
  "home",
  "journey",
  "itinerary",
  "travel",
  "hairMakeup",
  "thingsToDo",
  "gallery",
  "registry",
  "faqs",
] as const;

export type CountdownPageKey = (typeof COUNTDOWN_PAGE_KEYS)[number];

type SiteTypography = Partial<Record<TypographyRole, TypographySettings>>;

export type SiteStyleContent = {
  displayFont?: string | null;
  bodyFont?: string | null;
  baseFontSize?: number | null;
  typography?: SiteTypography | null;
  countdownVisibility?: Partial<Record<CountdownPageKey, boolean>> | null;
};

function getFontOption(fontFamily?: string | null) {
  return FONT_OPTIONS.find((option) => option.value === fontFamily);
}

function getFontOptionNormalWeight(fontFamily?: string | null) {
  const option = getFontOption(fontFamily);
  return option && "normalWeight" in option ? option.normalWeight : undefined;
}

function getRoleCssName(role: TypographyRole) {
  return role.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
}

function resolveTypographyFont(
  selectedFont: string | null | undefined,
  siteContent: SiteStyleContent,
) {
  if (selectedFont === INHERIT_DISPLAY_FONT) {
    return siteContent.displayFont ?? "Great Vibes";
  }

  if (selectedFont === INHERIT_BODY_FONT) {
    return siteContent.bodyFont ?? "Cormorant Garamond";
  }

  return selectedFont;
}

export function getTypographySetting(
  siteContent: SiteStyleContent,
  role: TypographyRole,
): ResolvedTypographySettings {
  const defaults = DEFAULT_TYPOGRAPHY[role];
  const overrides = siteContent.typography?.[role] ?? {};
  const selectedFont = overrides.fontFamily ?? defaults.fontFamily;
  const fontFamily =
    resolveTypographyFont(selectedFont, siteContent) ?? defaults.fontFamily;

  return {
    fontFamily,
    fontSize: overrides.fontSize ?? defaults.fontSize,
    bold: overrides.bold ?? defaults.bold,
    italic: overrides.italic ?? defaults.italic,
    normalWeight: defaults.normalWeight,
  };
}

export function getFontStack(fontFamily?: string | null, fallback = "serif") {
  const option = getFontOption(fontFamily);
  if (option) return option.stack;
  if (fontFamily) return `"${fontFamily}", ${fallback}`;
  return fallback;
}

function getFontWeight(settings: ReturnType<typeof getTypographySetting>) {
  if (settings.bold) return 700;
  return settings.normalWeight ?? getFontOptionNormalWeight(settings.fontFamily) ?? 400;
}

export function getTypographyCssVars(
  siteContent: SiteStyleContent,
): CSSProperties {
  const vars: Record<string, string | number> = {};

  (Object.keys(DEFAULT_TYPOGRAPHY) as TypographyRole[]).forEach((role) => {
    const settings = getTypographySetting(siteContent, role);
    const cssName = getRoleCssName(role);
    vars[`--font-${cssName}`] = getFontStack(settings.fontFamily);
    vars[`--font-${cssName}-size`] = `${settings.fontSize}px`;
    vars[`--font-${cssName}-weight`] = getFontWeight(settings);
    vars[`--font-${cssName}-style`] = settings.italic ? "italic" : "normal";
  });

  return vars as CSSProperties;
}

export function getGoogleFontsUrl(siteContent: SiteStyleContent) {
  const selectedFonts = new Set<string>();
  selectedFonts.add(siteContent.displayFont ?? "Great Vibes");
  selectedFonts.add(siteContent.bodyFont ?? "Cormorant Garamond");

  (Object.keys(DEFAULT_TYPOGRAPHY) as TypographyRole[]).forEach((role) => {
    selectedFonts.add(getTypographySetting(siteContent, role).fontFamily);
  });

  const families = Array.from(selectedFonts)
    .map((fontFamily) => getFontOption(fontFamily))
    .filter((option): option is (typeof FONT_OPTIONS)[number] => {
      return Boolean(option && option.source === "google");
    })
    .map((option) => {
      const family = option.value.replace(/ /g, "+");
      if ("weighted" in option && option.weighted) {
        return `family=${family}:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700`;
      }
      return `family=${family}`;
    });

  if (families.length === 0) return null;
  return `https://fonts.googleapis.com/css2?${families.join("&")}&display=swap`;
}

export function shouldShowCountdown(
  siteContent: SiteStyleContent,
  page: CountdownPageKey,
) {
  const visibility = siteContent.countdownVisibility;
  if (!visibility) return page === "home";
  return visibility[page] ?? false;
}
