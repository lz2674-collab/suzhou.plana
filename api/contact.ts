import { Resend } from "resend";

declare const process: {
  env: Record<string, string | undefined>;
};

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  company?: unknown;
  projectType?: unknown;
  budget?: unknown;
  message?: unknown;
  pageUrl?: unknown;
  startedAt?: unknown;
  website?: unknown;
};

type VercelRequest = {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: unknown;
};

type VercelResponse = {
  status: (code: number) => VercelResponse;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const maxLengths = {
  name: 120,
  email: 180,
  company: 180,
  projectType: 120,
  budget: 120,
  message: 4000,
  pageUrl: 500,
};

function text(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function parseBody(body: unknown): ContactPayload {
  if (typeof body === "string") {
    try {
      return JSON.parse(body) as ContactPayload;
    } catch {
      return {};
    }
  }

  return body && typeof body === "object" ? (body as ContactPayload) : {};
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (char) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;",
    };
    return entities[char] ?? char;
  });
}

function row(label: string, value: string) {
  return `<p><strong>${label}:</strong><br />${escapeHtml(value).replace(/\n/g, "<br />") || "-"}</p>`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Allow", "POST");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const payload = parseBody(req.body);
  const spamTrap = text(payload.website, 200);
  const startedAt = typeof payload.startedAt === "number" ? payload.startedAt : Number(payload.startedAt);

  if (spamTrap || !Number.isFinite(startedAt) || Date.now() - startedAt < 1200) {
    return res.status(400).json({ error: "Unable to submit this request" });
  }

  const name = text(payload.name, maxLengths.name);
  const email = text(payload.email, maxLengths.email).toLowerCase();
  const company = text(payload.company, maxLengths.company);
  const projectType = text(payload.projectType, maxLengths.projectType);
  const budget = text(payload.budget, maxLengths.budget);
  const message = text(payload.message, maxLengths.message);
  const pageUrl = text(payload.pageUrl, maxLengths.pageUrl);
  const userAgent = Array.isArray(req.headers["user-agent"])
    ? req.headers["user-agent"].join(" ")
    : req.headers["user-agent"] ?? "";

  if (!name || !email || !projectType || !message) {
    return res.status(400).json({ error: "Please complete all required fields" });
  }

  if (!emailPattern.test(email)) {
    return res.status(400).json({ error: "Please enter a valid email address" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    return res.status(500).json({ error: "Contact form is not configured" });
  }

  const submitTime = new Date().toISOString();
  const resend = new Resend(apiKey);

  const html = [
    row("Name", name),
    row("Email", email),
    row("Company", company),
    row("Project Type", projectType),
    row("Budget", budget),
    row("Message", message),
    row("Submit Time", submitTime),
    row("User Agent", text(userAgent, 500)),
    row("Source Page URL", pageUrl),
  ].join("\n");

  const plainText = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Company: ${company || "-"}`,
    `Project Type: ${projectType}`,
    `Budget: ${budget || "-"}`,
    `Message:\n${message}`,
    `Submit Time: ${submitTime}`,
    `User Agent: ${text(userAgent, 500) || "-"}`,
    `Source Page URL: ${pageUrl || "-"}`,
  ].join("\n\n");

  try {
    await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `New PlanA inquiry from ${name}`,
      html,
      text: plainText,
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Resend contact form error", error);
    return res.status(502).json({ error: "Unable to send message" });
  }
}
