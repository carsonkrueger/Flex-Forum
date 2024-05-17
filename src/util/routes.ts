export const routes = {
  login: "/",
  signup: "/signup",
  home: "/home",
  user: "/user/:username",
  templates: "/workout/templates",
  workout: (id: number) => `/workout/${id}`,
  // workout: "/workout/:id",
  exercises: "/workout/exercises",
} as const;

export type Route = (typeof routes)[keyof typeof routes];
