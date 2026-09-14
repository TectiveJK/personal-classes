import type { Discipline, Instructor } from "@/lib/types";

export const school = {
  name: "Shaolin Temple Greece",
  chinese: "希腊少林寺",
  schoolName: "Shaolin Temple Cultural Center in Greece",
  schoolChinese: "希腊少林寺文化中心",
  city: "Athens",
  address: "84–86 Prevezis Street, 104 43 Athens (ground floor)",
  email: "info@shaolintemplegreece.com",
  phones: ["+30 211 267 2597", "+30 6994 681 781"],
  website: "https://www.shaolintemplegreece.com",
  websiteLabel: "www.shaolintemplegreece.com",
  timezone: "Europe/Athens",
  founded: 2008,
  tagline: "Fast progress, focused personal teaching.",
  hoursNote:
    "Private sessions run weekday mornings from 06:00 to 12:00, and Saturday 06:00–12:00 and 16:00–20:00. The centre is closed on Sundays.",
} as const;

export const instructors: Instructor[] = [
  {
    id: "shi-yan-xiang",
    dharmaName: "Shi Yan Xiang",
    chinese: "释延向",
    civicName: "Master Xi Yang Xiang",
    generation: "34th generation Shaolin monk",
    title: "Fashi",
    bio: "Shi Yan Xiang 释延向法师 is a 34th generation Shaolin monk of the Shaolin Monastery in China, authorized by Abbot Shi Yong Xin 释永信 to operate the Shaolin Temple Cultural Center in Greece and to use the name and seals of the temple. Private teaching is his method: each student, each goal, corrected in person.",
    disciplines: [
      "trial",
      "shaolin-kungfu",
      "chen-taiji",
      "qigong",
      "guluin",
      "chan",
    ],
  },
];

export const disciplines: Discipline[] = [
  {
    slug: "trial",
    name: "Introductory private session",
    chinese: "体验课",
    durationMin: 45,
    priceEur: 30,
    level: "All levels",
    summary:
      "A first private hour with the master: stance, breath, and a clear path. You leave knowing whether Shaolin Kung Fu, Chen Taiji, or internal work is the right door.",
    focus: ["Stance and breath", "Centre method", "Personal plan"],
    who: "Anyone curious about authentic Shaolin training, including complete beginners.",
  },
  {
    slug: "shaolin-kungfu",
    name: "Shaolin Kung Fu",
    chinese: "少林功夫",
    durationMin: 60,
    priceEur: 50,
    level: "Beginner to advanced",
    summary:
      "Traditional Shaolin Gong Fu as taught at the authorised cultural centre: basics, forms, applications, and conditioning. Personal work corrects what a crowded line cannot.",
    focus: ["Ji ben gong", "Forms and applications", "Conditioning"],
    who: "Students who want martial skill from the Shaolin curriculum, not a fitness class with Chinese names.",
  },
  {
    slug: "chen-taiji",
    name: "Chen Taiji",
    chinese: "陈氏太极",
    durationMin: 60,
    priceEur: 45,
    level: "All levels",
    summary:
      "Chen-style Tai Chi with martial intent: silk-reeling, form correction, and structure. Private teaching keeps the form honest instead of decorative.",
    focus: ["Silk-reeling", "Form correction", "Push-hands basics"],
    who: "Beginners and experienced practitioners who want precise private correction.",
  },
  {
    slug: "qigong",
    name: "Qigong & Neigong",
    chinese: "气功 · 内功",
    durationMin: 60,
    priceEur: 45,
    level: "All levels",
    summary:
      "Breath, posture, and internal work from the Shaolin tradition. Sessions are paced for health, recovery, and the foundation later martial practice needs.",
    focus: ["Breath and posture", "Standing practice", "Internal method"],
    who: "Adults seeking health, calm, or a stronger base for kung fu.",
  },
  {
    slug: "guluin",
    name: "Gu Luin Kung Fu",
    chinese: "古练功夫",
    durationMin: 60,
    priceEur: 50,
    level: "Some training required",
    summary:
      "Gu Luin method taught at the centre: compact power, close-range skill, and personal correction of mechanics that group class cannot isolate.",
    focus: ["Close-range skill", "Structure", "Applications"],
    who: "Students with some martial background, or those already training at the centre.",
  },
  {
    slug: "chan",
    name: "Chan & self-defense",
    chinese: "禅 · 自卫",
    durationMin: 60,
    priceEur: 45,
    level: "All levels",
    summary:
      "Meditation, awareness, and practical self-defense from the Shaolin Chan Wu Yi path. Private time for the work that does not survive a noisy hall.",
    focus: ["Chan sitting", "Awareness", "Practical defense"],
    who: "Adults who want stillness, clarity, and usable self-protection.",
  },
];

export const experienceLabels: Record<string, string> = {
  beginner: "Complete beginner",
  "some-training": "Some martial arts or movement training",
  intermediate: "Regular Shaolin or kung fu practice",
  advanced: "Advanced / instructor level",
};

export const packs = [
  {
    name: "4 private sessions",
    priceEur: 180,
    note: "Use within 8 weeks. Mix disciplines as needed.",
  },
  {
    name: "8 private sessions",
    priceEur: 320,
    note: "Use within 16 weeks. Best for a first training cycle.",
  },
];

export function getDiscipline(slug: string) {
  return disciplines.find((item) => item.slug === slug);
}

export function getInstructor(id: string) {
  return instructors.find((item) => item.id === id);
}

export const primaryInstructor = instructors[0];
