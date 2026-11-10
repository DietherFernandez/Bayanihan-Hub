import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { queryUniversalSearch } from "@/lib/constants/philippine-data";
import { checkRateLimit } from "@/lib/security/rate-limit";

const assistantQuerySchema = z.object({
  question: z.string().trim().min(3).max(400),
  language: z.enum(["en", "fil"]).optional().default("en"),
});

/**
 * Source-Grounded Civic Assistant Boundary (Section 13 Specification)
 * - Understands Filipino & English
 * - Recommends only verified resources from the official index
 * - Never fabricates government fees, eligibility, or claims to approve applications
 * - Clearly discloses uncertainty and provides official `.gov.ph` links
 */
export async function POST(request: NextRequest) {
  const clientIp =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "anonymous";
  const rate = checkRateLimit(`assistant:${clientIp}`, 20, 60_000);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Rate limit reached. Please use Universal Search directly." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = assistantQuerySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please enter a valid question (3 to 400 characters)." },
      { status: 400 }
    );
  }

  const { question, language } = parsed.data;
  const matches = queryUniversalSearch({ q: question }).slice(0, 4);

  const disclaimer =
    language === "fil"
      ? "Paunawa: Ang gabay na ito ay batay lamang sa mga na-verify na opisyal na sanggunian sa GabayPH. Hindi nagpoproseso o nag-aapruba ng aplikasyon ang GabayPH. Laging kumpirmahin sa opisyal na .gov.ph website."
      : "Disclosure: This response is strictly grounded in verified GabayPH public records. GabayPH cannot process or approve applications. Always verify final requirements on the official agency link provided.";

  if (matches.length === 0) {
    return NextResponse.json({
      answer:
        language === "fil"
          ? "Walang eksaktong na-verify na tala sa aming direktoryo para sa tanong na ito. Upang maiwasan ang maling impormasyon, hindi kami gumagawa ng hula. Maaari ninyong gamitin ang Universal Search o tumawag sa Citizen Hotline 8888."
          : "No exact verified record matched your specific query in our directory. To prevent misinformation, GabayPH does not guess or fabricate requirements. Please browse our module directories or call Citizen Hotline 8888.",
      disclaimer,
      sources: [],
    });
  }

  const summaryLines = matches.map(
    (m, idx) =>
      `${idx + 1}. ${m.title} (${m.sourceName}) — ${m.summary} [Official Source: ${m.sourceUrl}]`
  );

  return NextResponse.json({
    answer: summaryLines.join("\n\n"),
    disclaimer,
    sources: matches.map((m) => ({
      title: m.title,
      sourceName: m.sourceName,
      sourceUrl: m.sourceUrl,
      href: m.href,
      lastVerifiedAt: m.lastVerifiedAt,
    })),
  });
}
