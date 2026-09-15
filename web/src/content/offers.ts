import type { L10n } from "@/lib/i18n-types";

/**
 * Job openings.
 *
 * Diwa publishes no openings on the live site today, so this ships empty and
 * the page renders its empty state, which points at the spontaneous
 * application. Add entries here to list them; when the volume justifies it
 * this moves to a CMS without the page changing.
 *
 * `closes` is an ISO date. An offer past that date renders as expired rather
 * than disappearing, matching how the group's other sites behave.
 */

export type Contract = "CDI" | "CDD" | "Stage" | "Freelance";

export type Offer = {
  id: string;
  contract: Contract;
  posted: string; // ISO
  closes: string; // ISO
  location: L10n;
  experience: L10n;
  title: L10n;
  summary: L10n;
};

export const offers: Offer[] = [];

export const CONTRACT_TYPES: Contract[] = ["CDI", "CDD", "Stage", "Freelance"];

export function isExpired(offer: Offer, now = new Date()) {
  return new Date(offer.closes).getTime() < now.getTime();
}
