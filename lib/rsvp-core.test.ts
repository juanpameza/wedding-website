import { describe, it, expect } from "vitest";
import {
  parseGuest,
  matchHouseholds,
  groupByHousehold,
  validateSubmission,
  buildPatchRecords,
  isUnnamedPlusOne,
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
    isPlusOne: false,
    dietary: "",
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

  it("reads the Plus One flag and dietary notes", () => {
    const g = parseGuest(
      "recC",
      { Name: "Guest", "Plus One": true, "Dietary Restrictions": " Vegan " },
      NAMES,
    );
    expect(g.isPlusOne).toBe(true);
    expect(g.dietary).toBe("Vegan");

    const plain = parseGuest("recD", { Name: "Ana" }, NAMES);
    expect(plain.isPlusOne).toBe(false);
    expect(plain.dietary).toBe("");
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

  it("preserves the incoming Airtable order (does not sort)", () => {
    const ordered = [
      guest({ id: "g2", name: "Zoe Lopez" }),
      guest({ id: "g1", name: "Adam Lopez" }),
      guest({ id: "g3", name: "Mia Lopez" }),
    ];
    const members = groupByHousehold(ordered).get("hh1")!.members;
    expect(members.map((m) => m.name)).toEqual([
      "Zoe Lopez",
      "Adam Lopez",
      "Mia Lopez",
    ]);
  });
});

describe("isUnnamedPlusOne", () => {
  it("detects blank and placeholder names on +1 rows", () => {
    expect(isUnnamedPlusOne({ isPlusOne: true, name: "" })).toBe(true);
    expect(isUnnamedPlusOne({ isPlusOne: true, name: "Guest" })).toBe(true);
    expect(isUnnamedPlusOne({ isPlusOne: true, name: "Ana Ruiz" })).toBe(false);
    expect(isUnnamedPlusOne({ isPlusOne: false, name: "" })).toBe(false);
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

  it("lets a +1 be named, and trims/caps it", () => {
    const withPlusOne: HouseholdRoster = {
      ...roster,
      members: [guest({ id: "p1", name: "Guest", isPlusOne: true, invitedEvents: ["reception"] })],
    };
    const r = validateSubmission(withPlusOne, [
      { guestId: "p1", responses: {}, name: "  Ana Ruiz  " },
    ]);
    expect(r.sanitized[0].name).toBe("Ana Ruiz");

    const long = validateSubmission(withPlusOne, [
      { guestId: "p1", responses: {}, name: "x".repeat(200) },
    ]);
    expect(long.sanitized[0].name!.length).toBe(80);
  });

  it("refuses to rename a guest who is not a +1", () => {
    const r = validateSubmission(roster, [
      { guestId: "g1", responses: {}, name: "Hacked Name" },
    ]);
    expect(r.ok).toBe(false);
    expect(r.sanitized).toHaveLength(0);
  });

  it("leaves a +1's placeholder alone when the name is left blank", () => {
    const withPlusOne: HouseholdRoster = {
      ...roster,
      members: [guest({ id: "p1", name: "Guest", isPlusOne: true, invitedEvents: ["reception"] })],
    };
    const r = validateSubmission(withPlusOne, [
      { guestId: "p1", responses: { reception: "No" }, name: "   " },
    ]);
    expect(r.sanitized[0].name).toBeUndefined();
  });

  it("accepts dietary notes, caps length, and allows clearing", () => {
    const r = validateSubmission(roster, [
      { guestId: "g1", responses: {}, dietary: "  Peanut allergy " },
    ]);
    expect(r.sanitized[0].dietary).toBe("Peanut allergy");

    const cleared = validateSubmission(roster, [
      { guestId: "g1", responses: {}, dietary: "" },
    ]);
    expect(cleared.sanitized[0].dietary).toBe("");

    const long = validateSubmission(roster, [
      { guestId: "g1", responses: {}, dietary: "x".repeat(999) },
    ]);
    expect(long.sanitized[0].dietary!.length).toBe(500);
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

  it("writes a +1's name and dietary notes", () => {
    const recs = buildPatchRecords(
      [{ guestId: "p1", responses: {}, name: "Ana Ruiz", dietary: "Vegan" }],
      "2026-06-28T00:00:00.000Z",
    );
    expect(recs[0].fields["Name"]).toBe("Ana Ruiz");
    expect(recs[0].fields["First Name"]).toBe("Ana");
    expect(recs[0].fields["Dietary Restrictions"]).toBe("Vegan");
  });
});
