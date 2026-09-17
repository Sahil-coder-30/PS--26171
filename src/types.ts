export interface Section {
  id: string;
  origId: string;
  title: string;
  icon: string;
  summary: string;
}

export interface DocModule {
  id: string;
  num: string;
  route: string;
  title: string;
  icon: string;
  badge: string;
  desc: string;
  sections: Section[];
}

export interface Microservice {
  id: string;
  name: string;
  runtime: string;
  badge: string;
  desc: string;
  spec: string;
}
