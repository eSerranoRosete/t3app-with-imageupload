import { z } from "zod";
import { router, publicProcedure } from "../trpc";

import aws from "aws-sdk";

const s3 = new aws.S3({
  region: "us-east-2",
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_KEY,
  signatureVersion: "v4",
});

const generateUploadURL = async (imageName: string) => {
  const dateString = new Date().getTime();

  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: `${dateString}-${imageName}`,
    Expires: 60,
  };

  const uploadURL = await s3.getSignedUrlPromise("putObject", params);
  return uploadURL;
};

export const awsUploadRouter = router({
  getPresignedUrl: publicProcedure
    .input(z.object({ text: z.string() }))
    .mutation(async ({ input }) => {
      const url = await generateUploadURL(input.text);
      return url;
    }),
});
