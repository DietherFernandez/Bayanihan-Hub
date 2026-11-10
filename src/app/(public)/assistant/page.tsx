import React from "react";
import { GabayAiAssistantView } from "@/components/assistant/gabay-ai-assistant";

export const metadata = {
  title: "GabayAI Assistant — GabayPH Source-Grounded Public Guide",
  description:
    "Ask questions in Filipino, English, or Taglish to find verified government services, scholarships, jobs, financial assistance, free training, and emergency preparedness guides.",
};

export default function AssistantPage() {
  return <GabayAiAssistantView />;
}
