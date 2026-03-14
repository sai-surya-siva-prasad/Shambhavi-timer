
export interface MeditationStep {
  name: string;
  description: string;
  duration: number; // in seconds
  enabled?: boolean; // whether this step is included in the sequence
}
