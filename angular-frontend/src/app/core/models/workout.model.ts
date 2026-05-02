export interface Workout {
  _id?: string;
  date: string;
  exerciseName: string;
  workoutType: string;
  sets: number;
  reps: number;
  weight: number;
  duration: number;
  caloriesBurned: number;
  notes?: string;
}

export interface WorkoutAnalytics {
  period: string;
  totalWorkouts: number;
  totalCaloriesBurned: number;
  currentStreak: number;
  longestStreak: number;
  workoutsByDate: Record<string, number>;
  caloriesByDate: Record<string, number>;
  workouts: Workout[];
}
