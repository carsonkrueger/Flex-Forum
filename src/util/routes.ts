export const routes = {
  login: "/",
  signup: "/signup",
  home: "/home",
  user: "/user/:username",
  workout: "/workout/:id",
  exercizes: "/workout/exercizes",
} as const;

export type Route = (typeof routes)[keyof typeof routes];
