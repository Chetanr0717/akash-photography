"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Photo = {
  id: number;
  image_url: string;
  client_id: string | null;
};

export default function AdminPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const [selectedClientId, setSelectedClientId] =
    useState("akash123");

  const [photos, setPhotos] = useState<Photo[]>([]);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  const [uploadProgress, setUploadProgress] =
    useState("");

  const [deletingId, setDeletingId] =
    useState<number | null>(null);

  const cloudName = "utdfz02n";
  const uploadPreset = "akash_photos";

  async function loadPhotos() {
    const { data, error } = await supabase
      .from("photos")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.log(error);
      setMessage("Photos load nahi hui.");
      return;
    }

    setPhotos(data || []);
  }

  useEffect(() => {
    if (loggedIn) {
      loadPhotos();
    }
  }, [loggedIn]);

  function adminLogin() {
    if (
      username === "admin" &&
      password === "admin123"
    ) {
      setLoggedIn(true);
      setMessage("");
    } else {
      setMessage(
        "Wrong admin username or password."
      );
    }
  }

  // Large photo ko automatically resize aur compress karega
  async function compressImage(
    file: File
  ): Promise<File> {
    return new Promise((resolve, reject) => {
      const image = new Image();

      const imageUrl =
        URL.createObjectURL(file);

      image.onload = () => {
        const maxWidth = 2500;
        const maxHeight = 2500;

        let width = image.width;
        let height = image.height;

        // Photo ka aspect ratio same rahega
        if (
          width > maxWidth ||
          height > maxHeight
        ) {
          const ratio = Math.min(
            maxWidth / width,
            maxHeight / height
          );

          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas =
          document.createElement("canvas");

        canvas.width = width;
        canvas.height = height;

        const context =
          canvas.getContext("2d");

        if (!context) {
          URL.revokeObjectURL(imageUrl);

          reject(
            new Error(
              "Image processing failed"
            )
          );

          return;
        }

        // White background, useful for PNG/JPG photos
        context.fillStyle = "white";

        context.fillRect(
          0,
          0,
          width,
          height
        );

        context.drawImage(
          image,
          0,
          0,
          width,
          height
        );

        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(
              imageUrl
            );

            if (!blob) {
              reject(
                new Error(
                  "Image compression failed"
                )
              );

              return;
            }

            const compressedFile =
              new File(
                [blob],
                file.name.replace(
                  /\.[^/.]+$/,
                  ".jpg"
                ),
                {
                  type: "image/jpeg",
                }
              );

            resolve(
              compressedFile
            );
          },
          "image/jpeg",
          0.88
        );
      };

      image.onerror = () => {
        URL.revokeObjectURL(imageUrl);

        reject(
          new Error(
            "Image load failed"
          )
        );
      };

      image.src = imageUrl;
    });
  }

  async function uploadPhotos(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const files = Array.from(
      event.target.files || []
    );

    if (files.length === 0) return;

    if (!selectedClientId.trim()) {
      setMessage(
        "Please enter Client ID."
      );

      return;
    }

    setUploading(true);
    setMessage("");
    setUploadProgress("");

    try {
      for (
        let index = 0;
        index < files.length;
        index++
      ) {
        const originalFile =
          files[index];

        setUploadProgress(
          `Photo ${index + 1} of ${
            files.length
          }: Preparing...`
        );

        // Photo pehle automatically compress hogi
        const compressedFile =
          await compressImage(
            originalFile
          );

        setUploadProgress(
          `Photo ${index + 1} of ${
            files.length
          }: Uploading...`
        );

        const formData =
          new FormData();

        formData.append(
          "file",
          compressedFile
        );

        formData.append(
          "upload_preset",
          uploadPreset
        );

        const cloudinaryResponse =
          await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            {
              method: "POST",
              body: formData,
            }
          );

        const cloudinaryData =
          await cloudinaryResponse.json();

        if (
          !cloudinaryResponse.ok
        ) {
          throw new Error(
            cloudinaryData.error
              ?.message ||
              "Cloudinary upload failed"
          );
        }

        const imageUrl =
          cloudinaryData.secure_url;

        const { error } =
          await supabase
            .from("photos")
            .insert({
              image_url: imageUrl,
              client_id:
                selectedClientId.trim(),
            });

        if (error) {
          throw error;
        }
      }

      await loadPhotos();

      setMessage(
        `${files.length} photo(s) uploaded for ${selectedClientId} successfully!`
      );

      setUploadProgress("");
    } catch (error) {
      console.log(error);

      setUploadProgress("");

      setMessage(
        "Photo upload failed. Please try again."
      );
    } finally {
      setUploading(false);

      event.target.value = "";
    }
  }

  async function deletePhoto(
    id: number
  ) {
    const answer =
      window.confirm(
        "Kya aap ye photo delete karna chahte hain?"
      );

    if (!answer) return;

    setDeletingId(id);
    setMessage("");

    const { error } =
      await supabase
        .from("photos")
        .delete()
        .eq("id", id);

    if (error) {
      console.log(error);

      setMessage(
        "Photo delete nahi hui."
      );

      setDeletingId(null);

      return;
    }

    setPhotos(
      (oldPhotos) =>
        oldPhotos.filter(
          (photo) =>
            photo.id !== id
        )
    );

    setMessage(
      "Photo deleted successfully!"
    );

    setDeletingId(null);
  }

  if (loggedIn) {
    return (
      <main className="min-h-screen bg-black px-6 py-12 text-white">
        <div className="mx-auto max-w-6xl">

          <p className="text-center text-yellow-400">
            AKASH PHOTOGRAPHY
          </p>

          <h1 className="mt-3 text-center text-4xl font-bold">
            Admin Panel
          </h1>

          <p className="mt-4 text-center text-gray-400">
            Upload photos for each client
          </p>

          <div className="mx-auto mt-8 max-w-md">

            <label className="text-sm text-gray-300">
              Client ID
            </label>

            <input
              type="text"
              value={
                selectedClientId
              }
              onChange={(
                event
              ) =>
                setSelectedClientId(
                  event.target
                    .value
                )
              }
              placeholder="Enter Client ID"
              className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-4 text-white outline-none"
            />

            <div className="mt-5 text-center">

              <label className="inline-block cursor-pointer rounded-xl bg-yellow-400 px-6 py-4 font-bold text-black disabled:opacity-50">

                {uploading
                  ? "Uploading..."
                  : "Upload Photos"}

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={
                    uploadPhotos
                  }
                  disabled={
                    uploading
                  }
                  className="hidden"
                />

              </label>

            </div>

            {uploadProgress && (
              <p className="mt-4 text-center text-sm text-gray-300">
                {
                  uploadProgress
                }
              </p>
            )}

            <p className="mt-3 text-center text-xs text-gray-500">
              Large photos are automatically compressed before upload.
            </p>

          </div>

          {message && (
            <p className="mt-5 text-center text-yellow-400">
              {message}
            </p>
          )}

          <div className="mt-10 grid gap-6 sm:grid-cols-2 md:grid-cols-3">

            {photos.map(
              (photo) => (

                <div
                  key={
                    photo.id
                  }
                >

                  <img
                    src={
                      photo.image_url
                    }
                    alt="Client photo"
                    className="h-80 w-full rounded-2xl object-cover"
                  />

                  <p className="mt-2 text-center text-sm text-gray-400">
                    Client:{" "}
                    {
                      photo.client_id ||
                      "Old photo"
                    }
                  </p>

                  <button
                    onClick={() =>
                      deletePhoto(
                        photo.id
                      )
                    }
                    disabled={
                      deletingId ===
                      photo.id
                    }
                    className="mt-3 w-full rounded-xl bg-red-600 px-5 py-3 font-bold text-white disabled:opacity-50"
                  >

                    {deletingId ===
                    photo.id
                      ? "Deleting..."
                      : "Delete Photo"}

                  </button>

                </div>

              )
            )}

          </div>

          <button
            onClick={() => {
              setLoggedIn(
                false
              );

              setMessage(
                ""
              );
            }}
            className="mx-auto mt-10 block rounded-xl border border-yellow-400 px-6 py-3 font-bold text-yellow-400"
          >
            Logout Admin
          </button>

        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">

      <div className="mx-auto max-w-md">

        <p className="text-center text-yellow-400">
          AKASH PHOTOGRAPHY
        </p>

        <h1 className="mt-3 text-center text-4xl font-bold">
          Admin Login
        </h1>

        <div className="mt-10 rounded-2xl border border-zinc-700 bg-zinc-900 p-7">

          <label className="text-sm text-gray-300">
            Admin Username
          </label>

          <input
            type="text"
            value={
              username
            }
            onChange={(
              event
            ) =>
              setUsername(
                event.target
                  .value
              )
            }
            placeholder="Enter username"
            className="mt-2 w-full rounded-xl border border-zinc-700 bg-black px-5 py-4 text-white outline-none"
          />

          <label className="mt-5 block text-sm text-gray-300">
            Admin Password
          </label>

          <input
            type="password"
            value={
              password
            }
            onChange={(
              event
            ) =>
              setPassword(
                event.target
                  .value
              )
            }
            placeholder="Enter password"
            className="mt-2 w-full rounded-xl border border-zinc-700 bg-black px-5 py-4 text-white outline-none"
          />

          <button
            onClick={
              adminLogin
            }
            className="mt-6 w-full rounded-xl bg-yellow-400 px-6 py-4 font-bold text-black"
          >
            Open Admin Panel
          </button>

          {message && (
            <p className="mt-5 text-center text-red-400">
              {
                message
              }
            </p>
          )}

        </div>

      </div>

    </main>
  );
}