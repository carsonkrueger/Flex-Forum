export const ROUTES = {
  login: "/",
  signup: "/signup",
  home: "/home",
  post: (id: number) => `/post/${id}`,
  newPost: "post/new",
  settings: "/settings",
  user: (username: string) => `/user/${username}`,
  templates: "/workout/templates",
  workout: (id: number) => `/workout/${id}`,
  exercises: "/workout/exercises",
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];
