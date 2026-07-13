import { describe, it, expect } from "vitest";
import {
  parseGuest,
  matchHouseholds,
  groupByHousehold,
  validateSubmission,
  buildPatchRecords,
  type GuestRecord,
  type HouseholdRoster,
} from "./rsvp-core";

const NAMES = new Map([
  ["hh1", "The Lopez Family"],
  ["hh2", "The Garcia Family"],
]);

function guest(over: Partial<GuestRecord> = {}): GuestRecord {
  return {
    id: "g1",
    firstName: "Maria",
    name: "Maria Lopez",
    householdId: "hh1",
    householdName: "The Lopez Family",
    invitedEvents: ["beachDay", "welcomeDinner", "reception"],
    responses: { beachDay: "No response", welcomeDinner: "No response", reception: "No response" },
    ...over,
  };
}

describe("parseGuest", () => {
  it("normalizes links, invited events, and responses", () => {
    const g = parseGuest(
      "recA",
      {
        "First Name": "Juan",
        Name: "Juan Lopez",
        Household: ["hh1"],
        "Invited Events": ["Beach Day", "Reception"],
        "Beach Day": "Yes",
        Reception: "No response",
      },
      NAMES,
    );
    expect(g.id).toBe("recA");
    expect(g.householdId).toBe("hh1");
    expect(g.householdName).toBe("The Lopez Family");
    expect(g.invitedEvents).toEqual(["beachDay", "reception"]);
    expect(g.responses.beachDay).toBe("Yes");
    expect(g.responses.welcomeDinner).toBe("No response");
  });

  it("handles orphan guests (no household link)", () => {
    const g = parseGuest("recB", { Name: "Solo Guest" }, NAMES);
    expect(g.householdId).toBeNull();
    expect(g.invitedEvents).toEqual([]);
  });
});

describe("matchHouseholds", () => {
  const guests = [
    guest({ id: "g1", name: "Maria Lopez", firstName: "Maria", householdId: "hh1" }),
    guest({ id: "g2", name: "Juan Lopez", firstName: "Juan", householdId: "hh1" }),
    guest({ id: "g3", name: "Ana Garcia", firstName: "Ana", householdId: "hh2", householdName: "The Garcia Family" }),
  ];

  it("returns the full household for a member match", () => {
    const res = matchHouseholds(guests, "maria");
    expect(res).toHaveLength(1);
    expect(res[0].members.map((m) => m.id).sort()).toEqual(["g1", "g2"]);
  });

  it("matches on last name too", () => {
    expect(matchHouseholds(guests, "garcia")[0].householdName).toBe("The Garcia Family");
  });

  it("ignores queries under 2 chars", () => {
    expect(matchHouseholds(guests, "m")).toEqual([]);
  });
});

describe("groupByHousehold", () => {
  it("makes a single-person roster for orphans", () => {
    const orphan = guest({ id: "g9", householdId: null, householdName: null, name: "Solo" });
    const map = groupByHousehold([orphan]);
    expect(map.get("guest:g9")?.members).toHaveLength(1);
  });
});

describe("validateSubmission", () => {
  const roster: HouseholdRoster = {
    householdId: "hh1",
    householdName: "The Lopez Family",
    members: [
      guest({ id: "g1", invitedEvents: ["beachDay", "reception"] }),
      guest({ id: "g2", invitedEvents: ["reception"] }),
    ],
  };

  it("accepts valid invited responses", () => {
    const r = validateSubmission(roster, [
      { guestId: "g1", responses: { beachDay: "Yes", reception: "No" } },
    ]);
    expect(r.ok).toBe(true);
    expect(r.sanitized[0].responses).toEqual({ beachDay: "Yes", reception: "No" });
  });

  it("rejects a guest not in the household", () => {
    const r = validateSubmission(roster, [
      { guestId: "intruder", responses: { reception: "Yes" } },
    ]);
    expect(r.ok).toBe(false);
    expect(r.sanitized).toHaveLength(0);
  });

  it("drops an event the guest is not invited to", () => {
    const r = validateSubmission(roster, [
      { guestId: "g2", responses: { beachDay: "Yes", reception: "Yes" } },
    ]);
    expect(r.ok).toBe(false); // beachDay rejected
    expect(r.sanitized[0].responses).toEqual({ reception: "Yes" });
  });

  it("rejects an invalid attendance value", () => {
    const r = validateSubmission(roster, [
      { guestId: "g1", responses: { reception: "Maybe" as any } },
    ]);
    expect(r.sanitized).toHaveLength(0);
  });
});

describe("buildPatchRecords", () => {
  it("maps event keys to Airtable fields and stamps audit dates", () => {
    const now = "2026-06-28T00:00:00.000Z";
    const recs = buildPatchRecords(
      [{ guestId: "g1", responses: { beachDay: "Yes", reception: "No" } }],
      now,
    );
    expect(recs[0].id).toBe("g1");
    expect(recs[0].fields["Beach Day"]).toBe("Yes");
    expect(recs[0].fields["Reception"]).toBe("No");
    expect(recs[0].fields["Responded At"]).toBe(now);
    expect(recs[0].fields["Last Modified"]).toBe(now);
  });
});
