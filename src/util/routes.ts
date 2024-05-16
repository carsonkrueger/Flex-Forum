export const routes = {
  login: "/",
  signup: "/signup",
  home: "/home",
  user: "/user/:username",
  selectWorkout: "/workout",
  workout: "/workout/:id",
  exercizes: "/workout/exercizes",
} as const;

export type Route = (typeof routes)[keyof typeof routes];
