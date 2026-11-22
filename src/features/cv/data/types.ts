export type Status = 'verified' | 'declared' | 'to-confirm';

export type Sourced = {
  status: Status;
  source?: string;
};

export type Pass = 'craft' | 'engineering' | 'leadership';

export type Achievement = Sourced & {
  pass: Pass;
  title: string;
  context: string;
  contribution: string;
  impact?: string;
};

export type Experience = Sourced & {
  employer: string;
  role: string;
  contract?: string;
  place: string;
  start: string;
  end?: string;
  summary: string;
  stack?: string;
};

export type Award = Sourced & {
  name: string;
  year: number;
  project: string;
  role: string;
  url: string;
};

export type SkillLevel = 'expertise' | 'pratique' | 'explore';

export type Skill = Sourced & {
  label: string;
  level: SkillLevel;
};

export type SkillGroup = {
  domain: string;
  skills: Skill[];
};

export type SelectedProject = Sourced & {
  slug: string;
  title: string;
  role: string;
  summary: string;
  url?: string;
};
