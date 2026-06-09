export interface ProjectTask {
  id: string;
  title: string;
  description: string;
  category: 'documentation' | 'backend' | 'devops' | 'testing' | 'decisions';
  effort: 'کوچک' | 'متوسط' | 'بزرگ';
  owner: 'فرانت‌اند' | 'بک‌اند' | 'هر دو';
  status: 'pending' | 'completed';
}

export interface Technology {
  name: string;
  role: string;
  iconName: string;
  color: string;
}

export interface DecisionGate {
  subject: string;
  choice: string;
  reason: string;
}
