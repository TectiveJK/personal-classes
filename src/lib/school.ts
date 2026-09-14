import type { Discipline, Instructor } from "@/lib/types";

export const school = {
  name: "Shaolin Personal Classes",
  chinese: "少林私教",
  schoolName: "Shaolin Temple Disciple’s Union",
  schoolChinese: "希腊少林寺弟子武术会",
  city: "Sepolia, Athens",
  address: "84–86 Prevezis Street, 104 43 Athens",
  email: "sepolia@shaolin.com.gr",
  phones: ["+30 211 400 4494", "+30 693 745 4358"],
  timezone: "Europe/Athens",
  founded: 2008,
  tagline: "One student. One master. The whole art.",
  hoursNote:
    "Private sessions run weekday mornings and evenings, and Saturday morning through late afternoon. The hall is closed on Sundays.",
} as const;

export const instructors: Instructor[] = [
  {
    id: "shi-ti-lin",
    dharmaName: "Shi Ti Lin",
    chinese: "释体林",
    civicName: "Ioannis Kokotinis",
    generation: "37th generation Shaolin master",
    title: "Shifu",
    bio: "Founder of the Sepolia school in 2008, Shi Ti Lin teaches traditional Shaolin Wu Gong, Qi Gong, and Tai Ji under the guidance of Shi Miao Jie. Personal classes follow the temple method: basics until they are honest, then forms, applications, and internal work at the student’s pace.",
    disciplines: [
      "shaolin-wugong",
      "qigong",
      "taiji",
      "weapons",
      "trial",
      "kids",
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
      "A first private hour to meet the school, assess your body, and choose a training path. You leave with a clear next step, not a sales pitch.",
    focus: ["Stance and breath", "School method", "Personal plan"],
    who: "Anyone curious about Shaolin training, including complete beginners.",
  },
  {
    slug: "shaolin-wugong",
    name: "Shaolin Wu Gong",
    chinese: "少林武功",
    durationMin: 60,
    priceEur: 50,
    level: "Beginner to advanced",
    summary:
      "Traditional Shaolin boxing: stances, combinations, forms, and applications. Personal work corrects what group class cannot — structure, timing, and power that actually lands.",
    focus: ["Ji ben gong", "Forms and applications", "Conditioning"],
    who: "Students who want martial skill, not a fitness class with Chinese names.",
  },
  {
    slug: "qigong",
    name: "Qi Gong & Neigong",
    chinese: "气功 · 内功",
    durationMin: 60,
    priceEur: 45,
    level: "All levels",
    summary:
      "Breath, posture, and internal work from the Shaolin tradition. Sessions are paced for health, recovery, and the foundation that later martial practice needs.",
    focus: ["Breath and posture", "Standing practice", "Internal method"],
    who: "Adults seeking health, calm, or a stronger base for kung fu.",
  },
  {
    slug: "taiji",
    name: "Tai Ji Quan",
    chinese: "太极拳",
    durationMin: 60,
    priceEur: 45,
    level: "All levels",
    summary:
      "Slow form work with martial intent: balance, yielding, and structure. Personal teaching keeps the form honest instead of decorative.",
    focus: ["Silk-reeling", "Form correction", "Push-hands basics"],
    who: "Beginners and experienced practitioners who want precise private correction.",
  },
  {
    slug: "weapons",
    name: "Traditional weapons",
    chinese: "器械",
    durationMin: 60,
    priceEur: 55,
    level: "Some training required",
    summary:
      "Staff, spear, and broadsword from the Shaolin curriculum. Private lessons build safe mechanics first, then speed, distance, and form.",
    focus: ["Staff and spear", "Broadsword", "Body-weapon unity"],
    who: "Students with basic empty-hand work who are ready for weapons.",
  },
  {
    slug: "kids",
    name: "Kids personal coaching",
    chinese: "少儿私教",
    durationMin: 45,
    priceEur: 35,
    level: "Ages 7+",
    summary:
      "Focused one-to-one training for children: respect, coordination, and Shaolin basics without the noise of a packed kids group.",
    focus: ["Coordination", "Discipline", "Age-appropriate forms"],
    who: "Children 7 and older, with a parent present in the hall for the first session.",
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
