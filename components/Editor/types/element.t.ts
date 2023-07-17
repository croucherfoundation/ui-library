export interface Element {
  id: string;
  type: string;
  content: {
    heading?: string;
    body?: string;
    image?: string;
  };
  option: unknown;
  style: unknown;
}
