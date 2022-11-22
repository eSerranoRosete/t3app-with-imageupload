import { router } from "../trpc";
import { awsUploadRouter } from "./awsUpload";
import { userRouter } from "./user";

export const appRouter = router({
  awsUpload: awsUploadRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
