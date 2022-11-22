/* eslint-disable @next/next/no-img-element */
import type { FormEvent } from "react";
import { useState } from "react";
import { trpc } from "../utils/trpc";

const Home = () => {
  const users = trpc.user.getAll.useQuery();

  const [file, setFile] = useState<File>();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const fileMutation = trpc.awsUpload.getPresignedUrl.useMutation();
  const userMutation = trpc.user.create.useMutation();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    fileMutation.mutate(
      { text: file?.name as string },
      {
        onSuccess: async (data) => {
          try {
            await fetch(data, {
              method: "PUT",
              headers: {
                "Content-Type": "multipart/formdata",
              },
              body: file,
            });
            const avatarURL = data.split("?")[0] as string;

            userMutation.mutate(
              {
                name,
                email,
                avatar: avatarURL,
              },
              { onSuccess: () => users.refetch() }
            );
          } catch (error) {
            console.log(error);
          }
        },
      }
    );

    e.currentTarget.reset();
  };

  if (!users.data) return <div>Loading Users...</div>;

  return (
    <div>
      <form
        className="m-auto w-full max-w-md bg-neutral-800 p-10"
        onSubmit={(e) => handleSubmit(e)}
      >
        <label htmlFor="name">
          Name:
          <input
            type="text"
            name="name"
            id="name"
            className="mb-5 w-full rounded-md border border-neutral-600 bg-transparent p-2"
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label htmlFor="email">
          Email:
          <input
            type="email"
            name="email"
            id="email"
            className="mb-5 w-full rounded-md border border-neutral-600 bg-transparent p-2"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <input
          type="file"
          onChange={(e) => setFile(e.target?.files?.[0])}
          required
        />
        <button
          type="submit"
          className="my-5 block w-full rounded-md bg-emerald-500 py-2 text-center"
        >
          Upload File
        </button>
      </form>
      <div className="m-auto mt-5 w-full max-w-md bg-neutral-800 p-10">
        {users.data.map((user) => {
          return (
            <div key={user.id} className="my-2 flex items-center">
              <img
                src={user?.avatar}
                alt="Profile Picture"
                className="mr-3 h-10 w-10 overflow-hidden rounded-full object-cover object-center"
              />
              <div>
                <p className="text-lg font-medium">{user.name}</p>
                <p className="text-sm text-neutral-300">{user.email}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
