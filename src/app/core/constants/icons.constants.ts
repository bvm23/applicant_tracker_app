import { Search, Group, Table, ArrowUpDown, ListFilter } from 'lucide-angular';

export type LucideIcon = any;

export const icons: Record<string, LucideIcon> = {
  SEARCH: Search,
  GROUP: Group,
  TABLE: Table,
  SORT: ArrowUpDown,
  FILTER: ListFilter,
};
