/**
 * Future AI Connect: Safe Haven & Protective Parent Guidance Service
 *
 * Core Concept:
 * When a child/teen is in trouble (e.g. failed an exam, broke something valuable,
 * made a big mistake, got in trouble at school) and is terrified of their parents'
 * angry reaction or potential emotional/physical harm:
 *
 * 1. The child safely types what happened and what reaction they are terrified of.
 * 2. The AI provides immediate emotional validation and de-escalation to the child.
 * 3. The AI prepares a comprehensive "Parent De-escalation & Harm-Prevention Dossier":
 *    - Pre-warning & nervous system breathing reset before reading.
 *    - Clear, honest representation of what happened (removing defensive panic).
 *    - Strict harm-prevention checklist (What NOT to do: no yelling, no sudden severe punishment, no degrading).
 *    - Step-by-step coaching on how to respond constructively within the first 60 seconds.
 *    - One-tap gentle reassuring replies to send back immediately to dismantle the child's terror.
 */

export interface TroubleScenario {
  id: string;
  title: string;
  category: 'academic' | 'accident' | 'school' | 'financial' | 'personal';
  kidInput: string;
  kidFear: string;
  childReliefMessage: string;
  calmSummaryForParent: string;
  harmPreventionRules: string[];
  first60SecondsScript: string;
  constructiveActionPlan: string;
  quickReassuringReplies: string[];
}

export const PRESET_TROUBLE_SCENARIOS: TroubleScenario[] = [
  {
    id: 'failed-exam',
    title: 'Difficult Exam / Academic Struggle',
    category: 'academic',
    kidInput: "I got an exam back today and I did poorly despite studying hard for days. I completely panicked during the test. I've been feeling anxious in my room because I'm terrified my parents will be furious, call me a failure, and impose severe punishments.",
    kidFear: "Parents shouting, losing their temper, expressing harsh disappointment, and severe grounding.",
    childReliefMessage: "One difficult test does not define your intelligence or your worth. You did the bravest thing by being transparent. Silah's AI will prime your parents to take a breath and approach this as supportive guides rather than reacting in anger.",
    calmSummaryForParent: "Your child wants you to know that they received an unsatisfactory grade on a major exam despite preparing. They were deeply anxious about coming to you because their biggest fear is your anger and disappointment. They care about doing well and need your calm guidance.",
    harmPreventionRules: [
      "DO NOT raise your voice, shout, or show aggressive body language. It activates panic and shuts down rational learning.",
      "DO NOT compare them to siblings, relatives, or peers.",
      "DO NOT issue immediate, irreversible punishments in the heat of anger.",
      "DO NOT attack their identity ('You are lazy / a disappointment'). Focus on study methods and support, not personal worth."
    ],
    first60SecondsScript: "Take a breath. Say: 'Thank you for telling me the truth. It takes real courage to be honest when you're scared. I love you, and an exam score doesn't change that. Let's sit together and figure out where we can improve together.'",
    constructiveActionPlan: "1. Review the test together calmly to spot challenging concepts without blame. 2. Reach out to the teacher for extra help or tutoring resources. 3. Adjust the weekday study routine with positive encouragement.",
    quickReassuringReplies: [
      "Thank you for being brave and telling me. I will not yell. Come sit with me, we will work this out together. ❤️",
      "I love you more than any exam grade. Take a deep breath. We will figure this out together.",
      "Honesty matters so much more to me than a single score. Come talk whenever you are ready."
    ]
  },
  {
    id: 'broken-property',
    title: 'Accidentally Damaged Property',
    category: 'accident',
    kidInput: "I was rushing to finish my schoolwork and accidentally knocked over an expensive piece of equipment at home. The screen cracked and won't turn on. I am shaking and terrified that my parents will lose their temper and yell at me, or that I ruined important work.",
    kidFear: "Explosive anger, screaming, being told I ruin everything, fear of harsh punishment.",
    childReliefMessage: "Physical objects can always be repaired or replaced, but your emotional safety and honesty can never be replaced. It was an accident, not intentional wrongdoing. Silah's AI will de-escalate your parents before you discuss the item.",
    calmSummaryForParent: "Your child accidentally knocked over a device while doing homework, causing damage to the screen. They are deeply distressed and worried that you would explode in anger. They are taking full responsibility and want to help make it right.",
    harmPreventionRules: [
      "DO NOT yell, slam doors, or use intimidating postures. Remember: they are already distressed.",
      "DO NOT say 'You always break things' or make them feel worthless over a material item.",
      "DO NOT punish an accident the same way you would punish intentional harm. Accidents happen to adults too.",
      "DO NOT demand an immediate resolution while adrenaline is surging."
    ],
    first60SecondsScript: "Pause for 5 seconds. Remind yourself: It is a replaceable item. Say: 'Take a breath. Are you okay? The device is just material, but your safety and honesty matter most. Accidents happen. Thank you for telling me immediately. We will look into repairs together.'",
    constructiveActionPlan: "1. Back up data and check repair or replacement options. 2. Let them contribute in an age-appropriate way (such as helpful household chores) so they feel empowered to restore things. 3. Organize the workspace to prevent similar accidents.",
    quickReassuringReplies: [
      "It is just a material item. You are much more important. Don't be afraid, come give me a hug.",
      "Thank you for telling me immediately instead of hiding it. I'm not angry. We'll get it checked tomorrow.",
      "Accidents happen to everyone. Take a deep breath. I appreciate that you trusted me enough to tell me."
    ]
  },
  {
    id: 'school-trouble',
    title: 'Trouble or Conflict at School',
    category: 'school',
    kidInput: "A classmate has been causing conflict and spreading rumors for weeks. Today I felt completely overwhelmed and shouted back in frustration. The school issued a disciplinary notice. I'm terrified my parents will judge me or humiliate me before hearing what happened.",
    kidFear: "Harsh punishment, feeling unheard, being judged before having a chance to explain.",
    childReliefMessage: "Being pushed to your limit is painful and overwhelming. While shouting in frustration wasn't ideal, you deserve to have your perspective heard. Silah's AI will guide your parents to listen with understanding.",
    calmSummaryForParent: "Your child received a disciplinary note from school following an argument with a classmate. They have been feeling distressed by ongoing peer conflict and are terrified of harsh judgment. They want to explain what occurred and need your calm support.",
    harmPreventionRules: [
      "DO NOT take third-party reports as the complete story without hearing your child's perspective first.",
      "DO NOT shame or humiliate them in front of others.",
      "DO NOT dismiss their emotional challenges or interpersonal distress.",
      "DO NOT react with immediate anger at the school notice."
    ],
    first60SecondsScript: "Say: 'I received the note, but more importantly, I want to hear what you have been experiencing. I am on your side, and I want to understand what happened. Come sit with me.'",
    constructiveActionPlan: "1. Listen to the entire story attentively without interrupting. 2. Coordinate constructively with school counselors or teachers regarding the situation. 3. Discuss healthy strategies for managing conflict and seeking help early.",
    quickReassuringReplies: [
      "I saw the note. I'm not angry with you—I want to hear your side. Let's talk peacefully.",
      "You are safe with me. I love you and want to support you. We will speak with the school together.",
      "Take a breath. We will discuss this calmly and handle it together as a family."
    ]
  },
  {
    id: 'lost-money',
    title: 'Lost Money or Material Resource',
    category: 'financial',
    kidInput: "I was given money to cover an important school activity fee. I think it fell out of my bag on the bus ride home. I searched everywhere and cannot find it. I'm scared my parents will say I am irresponsible and lose trust in me.",
    kidFear: "Being labeled irresponsible, loss of parental trust, being shouted at over lost money.",
    childReliefMessage: "Misplacing money is a distressing feeling that even adults experience. You are not careless; you experienced an honest accident. Silah's AI will coach your parents to focus on mutual trust rather than blame.",
    calmSummaryForParent: "Your child misplaced money meant for a school activity while in transit. They are deeply distressed and worried that you will lose trust in them. They wanted to come forward honestly rather than conceal what happened.",
    harmPreventionRules: [
      "DO NOT use an accusatory or guilt-inducing tone when discussing household finances.",
      "DO NOT attack their character ('You are careless', 'You don't appreciate anything').",
      "DO NOT withhold meals, basic necessities, or emotional affection as punishment."
    ],
    first60SecondsScript: "Say: 'Losing something important hurts, and I know how distressed you feel. But your honesty is worth far more than the lost funds. Thank you for telling me right away.'",
    constructiveActionPlan: "1. Inquire with lost-and-found services. 2. Implement a secure zippered wallet routine for outings. 3. Allow them to earn or contribute through helpful tasks so they feel restored.",
    quickReassuringReplies: [
      "I know you feel awful right now, but please don't be afraid. Resources can be replaced; your honesty is what matters.",
      "Thank you for telling me immediately. We'll check lost-and-found. Come have a hug.",
      "Mistakes happen to everyone. I love you and I trust you."
    ]
  }
];

export interface ParentCoachingDossier {
  childName: string;
  parentName: string;
  originalKidInput: string;
  kidFear: string;
  calmSummary: string;
  nervousSystemResetPrompt: string;
  harmPreventionChecklist: string[];
  first60SecondsScript: string;
  constructivePlan: string;
  suggestedReplies: string[];
}

export function generateParentCoachingDossier(
  kidInput: string,
  kidFear: string,
  childName: string = 'Child',
  parentName: string = 'Parent'
): ParentCoachingDossier {
  // Find matching preset or synthesize customized dossier
  const lower = kidInput.toLowerCase();
  let matched = PRESET_TROUBLE_SCENARIOS.find((p) => {
    if (p.category === 'academic' && (lower.includes('fail') || lower.includes('exam') || lower.includes('grade') || lower.includes('test'))) return true;
    if (p.category === 'accident' && (lower.includes('broke') || lower.includes('damage') || lower.includes('screen') || lower.includes('device'))) return true;
    if (p.category === 'school' && (lower.includes('school') || lower.includes('class') || lower.includes('notice') || lower.includes('argument'))) return true;
    if (p.category === 'financial' && (lower.includes('money') || lower.includes('lost') || lower.includes('fee') || lower.includes('wallet'))) return true;
    return false;
  }) || PRESET_TROUBLE_SCENARIOS[0];

  const fearText = kidFear.trim().length > 0 ? kidFear : "anger, shouting, and severe punishment";

  return {
    childName,
    parentName,
    originalKidInput: kidInput,
    kidFear: fearText,
    calmSummary: `${childName} reached out because something went wrong, and they were anxious about coming forward. Their biggest concern was: "${fearText}". They chose to be honest because they value your guidance and trust.`,
    nervousSystemResetPrompt: `Take a slow, deep breath in for 4 seconds... and release for 6 seconds. Remember: ${childName}'s courage to come forward right now is an opportunity to build lifelong trust. A calm response ensures open communication in the future.`,
    harmPreventionChecklist: [
      `DO NOT yell, raise your voice, or use aggressive body language. It induces panic and terminates constructive communication.`,
      `DO NOT attack their character or compare them to others. Address the specific event, not their personal worth.`,
      `DO NOT issue immediate, emotionally reactive punishments while your emotions are heightened.`,
      `DO NOT react with threats or emotional withdrawal. Prioritize emotional and physical safety.`
    ],
    first60SecondsScript: `Look at them calmly. Say: "${childName}, thank you for coming to me and telling me honestly. I know you were worried about how I would react. But you are my family, and I care about you. We are a team, and we will work through this together."`,
    constructivePlan: `1. Reassure safety and validate their courage in telling the truth.\n2. Separate the mistake from their personal identity.\n3. Collaborate on a practical solution when everyone is calm and centered.`,
    suggestedReplies: [
      `${childName}, thank you for being brave enough to tell me. I care about you and will not react in anger. Let's talk whenever you are ready. ❤️`,
      `I appreciate your honesty. Take a deep breath. We will figure this out together as a family.`,
      `Nothing that happens changes my care for you. Let's talk peacefully and solve the issue together.`
    ]
  };
}
