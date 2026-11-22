import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/resume/Yuvaraj_S_Yali_Resume.pdf`, changeFrequency: "monthly", priority: 0.6 },
  ];
}
