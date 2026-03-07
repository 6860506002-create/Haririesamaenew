export interface DataEntry {
  id: number;
  value: string;
  created_at: string;
}

export interface DataStructureInfo {
  title: string;
  description: string;
  type: 'linear' | 'non-linear';
  icon: string;
  details: string[];
}
