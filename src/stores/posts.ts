import { PostModel } from "@/models/post-model";
import { Id } from "./workout";

type State = { posts: { [id: Id]: PostModel } };
