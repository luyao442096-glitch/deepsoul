// app/data/keywords.ts

export interface QuizStep {
  id: string;
  question: string;
  options: {
    label: string;
    effect?: { color?: string; speed?: "breathing" | "rapid" };
    value?: string;
  }[];
}

export interface KeywordData {
  title: string;
  seoTitle: string;
  description: string;
  h1: string;
  quiz: QuizStep[];
}

const commonIncubationFlow: QuizStep[] = [
  {
    id: "energy",
    question: "Take a deep breath... How is your energy right now?",
    options: [
      { label: "🌪️ Chaotic & Anxious", effect: { color: "red", speed: "rapid" }, value: "anxious" },
      { label: "☁️ Heavy & Exhausted", effect: { color: "blue", speed: "breathing" }, value: "tired" },
      { label: "🌫️ Numb & Empty", effect: { color: "gray", speed: "breathing" }, value: "numb" },
      { label: "🔥 Angry & Irritable", effect: { color: "orange", speed: "rapid" }, value: "angry" },
    ]
  },
  {
    id: "pain_point",
    question: "是什么让你感到最沉重？",
    options: [
      { label: "职场与工作 (Career)", value: "career" },
      { label: "情感与关系 (Relationship)", value: "relationship" },
      { label: "学业与校园生活 (School Life)", value: "school" }, // 🔥 新增：涵盖成绩、社交、孤独
      { label: "睡眠与健康 (Sleep)", value: "sleep" },
      { label: "对未来的迷茫 (Future)", value: "future" },
    ]
  },
  {
    id: "context",
    question: "When does this feeling hit hardest?",
    options: [
      { label: "The moment I wake up", value: "morning" },
      { label: "When I'm working/stressed", value: "work" },
      { label: "Late at night, alone", value: "night" },
      { label: "Anytime, without warning", value: "random" },
    ]
  },
  {
    id: "personality",
    question: "If a friend were here right now, what would you want them to do?",
    options: [
      { label: "Just listen quietly", effect: { color: "purple" }, value: "listener" },
      { label: "Give me rational solutions", effect: { color: "blue" }, value: "coach" },
      { label: "Cheer me up / Distract me", effect: { color: "orange" }, value: "entertainer" },
      { label: "Push me forward", effect: { color: "red" }, value: "strict" },
    ]
  },
  {
    id: "vibe",
    question: "Close your eyes. Which atmosphere feels safest?",
    options: [
      { label: "🌊 Deep ocean calm", effect: { color: "blue" }, value: "ocean" },
      { label: "🌲 Forest rain", effect: { color: "green" }, value: "forest" },
      { label: "🔥 Warm campfire", effect: { color: "orange" }, value: "campfire" },
      { label: "🪐 Cosmic vastness", effect: { color: "purple" }, value: "cosmos" },
    ]
  },
];

export const keywordsData: Record<string, KeywordData> = {
  "what-to-do-if-my-husband-ignores-me": {
    title: "What to do if my husband ignores me",
    seoTitle: "Husband Ignores Me? Create Your AI Companion",
    description: "Feeling invisible? Hatch your personal AI companion to find comfort and answers.",
    h1: "Does your husband always ignore you?<br/>Here, someone is always listening.",
    quiz: commonIncubationFlow
  },
  "what-to-do-if-i-cant-sleep-lately": {
    title: "What to do if I can't sleep lately",
    seoTitle: "Can't Sleep? Meet Your Sleep Companion",
    description: "Insomnia is lonely. Create an AI friend to get you through the night.",
    h1: "Insomnia at night is lonely?<br/>Hatch a friend to stay with you.",
    quiz: commonIncubationFlow
  },
  "how-to-stop-procrastinating-homework-adults": {
    title: "How to stop procrastinating homework adults",
    seoTitle: "ADHD Paralysis? Get Your Focus Buddy",
    description: "Can't start working? Your AI Focus Buddy is waiting to help.",
    h1: "Can't move despite deadlines?<br/>Summon your focus partner.",
    quiz: commonIncubationFlow
  },

  // ============================================================
  // 💼 Work Stress - Advanced
  // ============================================================
  
  "how-to-overcome-imposter-syndrome-at-work": {
    title: "How to overcome imposter syndrome at work",
    seoTitle: "Feel Like a Fraud? Overcoming Imposter Syndrome | Career AI",
    description: "Do you feel like you don't belong or will be 'found out'? You are not alone. Learn how to silence your inner critic.",
    h1: "You're excellent but feel like a fraud?<br/>Step out of the 'imposter' shadow.",
    quiz: commonIncubationFlow
  },
  
  "how-to-beat-sunday-scaries-anxiety": {
    title: "How to beat Sunday scaries anxiety",
    seoTitle: "Sunday Scaries? How to Stop Dreading Monday | Anxiety AI",
    description: "Stomach turning on Sunday night? Don't let Monday ruin your weekend. Get your personalized Sunday reset plan.",
    h1: "Anxious about Monday on Sunday night?<br/>Let's turn off the 'Monday warning'.",
    quiz: commonIncubationFlow
  },

  "signs-of-toxic-work-environment-and-how-to-survive": {
    title: "Signs of toxic work environment and how to survive",
    seoTitle: "Toxic Workplace? Survival Guide & Mental Health Support",
    description: "Is it you or is it your boss? Identify the signs of a toxic workplace and learn how to protect your mental energy.",
    h1: "Going to work feels like a funeral?<br/>Check if you're in a 'toxic' workplace.",
    quiz: commonIncubationFlow
  },

  // ============================================================
  // 🌙 Insomnia - Behavioral
  // ============================================================

  "how-to-stop-revenge-bedtime-procrastination": {
    title: "How to stop revenge bedtime procrastination",
    seoTitle: "Revenge Bedtime Procrastination? Reclaim Your Sleep",
    description: "Staying up late just to feel free? Break the cycle of revenge bedtime procrastination with our gentle guidance.",
    h1: "Too sleepy to go to bed?<br/>You're 'revenge procrastinating' your lost day.",
    quiz: commonIncubationFlow
  },

  "how-to-stop-overthinking-at-3am": {
    title: "How to stop overthinking at 3am",
    seoTitle: "Overthinking at 3AM? How to Quiet Your Mind Fast",
    description: "Awake at 3AM replaying awkward moments? Use our AI tools to calm your racing thoughts and drift back to sleep.",
    h1: "Brain still working at 3 AM?<br/>Hit pause on your racing thoughts.",
    quiz: commonIncubationFlow
  },

  // ============================================================
  // 🎓 Student - Mental Health
  // ============================================================

  "signs-of-gifted-kid-burnout-in-college": {
    title: "Signs of gifted kid burnout in college",
    seoTitle: "Gifted Kid Burnout? From 'Smart Kid' to Burnt Out Adult",
    description: "Used to cruise through school but now drowning? You might be experiencing 'Gifted Kid Burnout'. Let's talk about it.",
    h1: "Former 'gifted kid', now a 'failure'?<br/>Let's talk about gifted child burnout.",
    quiz: commonIncubationFlow
  },

  "why-do-i-need-academic-validation-to-feel-worthy": {
    title: "Why do I need academic validation to feel worthy",
    seoTitle: "Academic Validation & Self-Worth: Breaking the Link",
    description: "Do your grades define your worth? Learn how to separate your self-esteem from your GPA with our AI companion.",
    h1: "Feel worthless without good grades?<br/>Your value is more than just a score.",
    quiz: commonIncubationFlow
  },

  // ============================================================
  // 💀 Workplace Reality - Exploitation & Clients
  // ============================================================

  "signs-you-are-underpaid-and-overworked": {
    title: "Signs you are underpaid and overworked",
    seoTitle: "Underpaid & Overworked? Is It Time to Quiet Quit?",
    description: "Doing work of three people for salary of one? Identify signs of workplace exploitation and protect your mental health.",
    h1: "One salary, three people's work?<br/>Don't let 'capable' destroy you.",
    quiz: commonIncubationFlow
  },

  "how-to-handle-rude-clients-without-losing-your-cool": {
    title: "How to handle rude clients without losing your cool",
    seoTitle: "Rude Clients Giving You Anxiety? How to Stay Calm",
    description: "Shaking after a call with a screaming client? Learn how to detach emotionally and handle verbal abuse without losing your mind.",
    h1: "Scolded by clients and can only swallow it?<br/>How not to bring others' trash emotions home.",
    quiz: commonIncubationFlow
  },

  "how-to-deal-with-a-toxic-narcissistic-boss": {
    title: "How to deal with a toxic narcissistic boss",
    seoTitle: "Toxic Boss Gaslighting You? Survival Guide",
    description: "Does your boss make you doubt your own reality? You might be dealing with a Narcissist. Learn 'Grey Rock' method to survive.",
    h1: "Boss always denies and PUA's you?<br/>You might have a 'narcissistic' boss.",
    quiz: commonIncubationFlow
  },

  // ============================================================
  // 🥀 Student Reality - Social & Future
  // ============================================================

  "anxiety-about-not-finding-a-job-after-graduation": {
    title: "Anxiety about not finding a job after graduation",
    seoTitle: "Post-Graduation Anxiety? Fear of Unemployment",
    description: "Terrified of future? Feeling like everyone else has it figured out except you? Let's navigate this 'Future Doom' together.",
    h1: "Graduated but unemployed? Watching others move forward,<br/>only you're stuck in panic.",
    quiz: commonIncubationFlow
  },

  "how-to-make-friends-in-college-with-social-anxiety": {
    title: "How to make friends in college with social anxiety",
    seoTitle: "No Friends at College? Social Anxiety Survival Guide",
    description: "Eating alone in the cafeteria? Feeling invisible on campus? Create an AI friend to practice social skills without judgement.",
    h1: "Lonely in a bustling campus?<br/>Social anxiety friendship rehearsal.",
    quiz: commonIncubationFlow
  },

  // ============================================================
  // Missing Homepage Links
  // ============================================================

  "what-to-do-if-work-stress-causes-anxiety": {
    title: "What to do if stress causes burnout",
    seoTitle: "Feeling Burned Out? Whether It's Work or Life, We're Here.",
    description: "Exhausted physically and mentally? Feel like you're running on empty? Identifying the root cause of your burnout is the first step to recovery.",
    h1: "Feeling physically drained,<br/>no motivation for anything?",
    quiz: [
      {
        id: "burnout_source",
        question: "Where does this 'drained' feeling come from?",
        options: [
          { label: "💼 Endless work (Work)", value: "work", effect: { color: "red", speed: "rapid" } },
          { label: "🏠 Suffocating family/life chores (Life)", value: "life", effect: { color: "gray", speed: "breathing" } },
          { label: "🔋 Pure physical exhaustion/illness (Health)", value: "health", effect: { color: "blue", speed: "breathing" } },
          { label: "🌫️ Can't explain, just tired (Unknown)", value: "unknown", effect: { color: "purple", speed: "breathing" } },
        ]
      },
      ...commonIncubationFlow.slice(1)
    ]
  },

  // ============================================================
  // 😭 General Loneliness - Unheard
  // ============================================================
  "what-to-do-if-i-feel-unheard-and-alone": {
    title: "What to do if I feel unheard and alone",
    seoTitle: "Feeling Invisible? When No One Understands You",
    description: "Surrounded by people but feeling completely alone? Whether it's family, partner, or friends, we are here to listen.",
    h1: "Invisible in a crowd?<br/>That 'no one understands' loneliness.",
    quiz: [
      {
        id: "loneliness_source",
        question: "Who does this 'outsider' feeling mainly come from?",
        options: [
          { label: "💔 Partner/Spouse", value: "partner", effect: { color: "purple", speed: "breathing" } },
          { label: "👪 Parents/Family of origin", value: "family", effect: { color: "blue", speed: "breathing" } },
          { label: "🗣️ Can't fit in with friends (Social)", value: "friends", effect: { color: "gray", speed: "breathing" } },
          { label: "🌌 Can't explain, just lonely (Just Life)", value: "general", effect: { color: "indigo", speed: "breathing" } },
        ]
      },
      ...commonIncubationFlow.slice(1)
    ]
  },

  // ============================================================
  // 🌪️ Existential Panic - Lost
  // ============================================================
  "what-to-do-if-i-feel-lost-and-panicked": {
    title: "What to do if I feel lost and panicked",
    seoTitle: "Feeling Lost in Life? How to Handle Existential Panic",
    description: "Heart racing about the future? Feeling left behind? Let's pause the panic and find your direction together.",
    h1: "Watching others move forward,<br/>only you're completely out of control of the future?",
    quiz: [
      {
        id: "panic_source",
        question: "What makes you feel so panicked?",
        options: [
          { label: "💰 No money/No achievement (Career & Money)", value: "career", effect: { color: "red", speed: "rapid" } },
          { label: "⏳ Age anxiety/Fear of aging (Age & Time)", value: "age", effect: { color: "orange", speed: "rapid" } },
          { label: "💍 Relationship status/Pressure to marry (Relationship)", value: "love", effect: { color: "purple", speed: "rapid" } },
          { label: "🌫️ Emptiness about the future (Unknown)", value: "unknown", effect: { color: "gray", speed: "breathing" } },
        ]
      },
      ...commonIncubationFlow.slice(1)
    ]
  },
};
