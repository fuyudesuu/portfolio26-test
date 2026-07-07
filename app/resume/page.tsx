import { getResume } from "@/lib/content";
import ResumePageClient from "./ResumePageClient";

export default function ResumePage() {
  const resume = getResume();
  return <ResumePageClient resume={resume} />;
}
