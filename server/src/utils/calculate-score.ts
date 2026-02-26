const GENERIC_EMAIL_DOMAINS = Object.freeze([
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "icloud.com",
  "aol.com",
  "protonmail.com",
  "proton.me",
  "gmx.com",
  "yandex.com",
]);

const HIGH_INTENT_KEYWORDS = Object.freeze([
  "referral",
  "webinar",
  "demo",
  "partner",
  "conference",
  "event",
  "pricing",
  "campaign",
  "rfi",
  "rfx",
]);

const MEDIUM_INTENT_KEYWORDS = Object.freeze([
  "social",
  "ad",
  "newsletter",
  "ebook",
  "download",
  "blog",
  "signup",
]);

export const calculateLeadScore = (lead) => {
  if (!lead || typeof lead !== "object") return 0;

  let score = 0;

  score += 10;

  const completenessFields = [
    "firstName",
    "lastName",
    "email",
    "mobile",
    "gender",
    "orgName",
  ];

  completenessFields.forEach((field) => {
    if (lead[field]) score += 5;
  });

  if (lead.email && lead.email.includes("@")) {
    const domain = lead.email.split("@")[1].toLowerCase();

    if (!GENERIC_EMAIL_DOMAINS.includes(domain)) {
      score += 15;
    }

    if (
      domain.endsWith(".io") ||
      domain.endsWith(".ai") ||
      domain.endsWith(".co")
    ) {
      score += 5;
    }
  }

  switch (lead.status) {
    case "converted":
      score += 35;
      break;
    case "qualified":
      score += 25;
      break;
    case "contacted":
      score += 15;
      break;
    case "new":
      score += 8;
      break;
    case "lost":
      score -= 10;
      break;
  }

  if (lead.source) {
    const sourceText = lead.source.toLowerCase();

    if (HIGH_INTENT_KEYWORDS.some((k) => sourceText.includes(k))) {
      score += 20;
    } else if (MEDIUM_INTENT_KEYWORDS.some((k) => sourceText.includes(k))) {
      score += 10;
    }
  }

  if (lead.orgId) score += 10;

  if (lead.dealId) score += 15;

  score = Math.max(0, Math.min(score, 100));

  return score;
};
