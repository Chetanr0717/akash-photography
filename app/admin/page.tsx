"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { supabase } from "../lib/supabase";

type Photo = {
  id: number;
  image_url: string;
  client_id: string | null;
};

type Client = {
  id: number;
  client_name: string;
  client_id: string;
  client_password: string;
};

export default function AdminPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const [clientName, setClientName] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState("");

  const [photos, setPhotos] = useState<Photo[]>([]);
  const [message, setMessage] = useState("");

  const [creatingClient, setCreatingClient] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");

  const [deletingId, setDeletingId] =
    useState<number | null>(null);

  const cloudName = "utdfz02n";
  const uploadPreset = "akash_photos";

  // IMPORTANT:
  // Agar Vercel website ka URL alag hai,
  // to yahan apna actual website URL likhna.
  const websiteUrl =
    "https://akash-photography.vercel.app";

  function getClientGalleryLink(
    clientId: string
  ) {
    return `${websiteUrl}/client?client=${encodeURIComponent(
      clientId
    )}`;
  }

  async function downloadClientQR(
    client: Client
  ) {
    try {
      const galleryLink =
        getClientGalleryLink(
          client.client_id
        );

      const qrDataUrl =
        await QRCode.toDataURL(
          galleryLink,
          {
            width: 900,
            margin: 2,
            errorCorrectionLevel: "H",
            color: {
              dark: "#000000",
              light: "#ffffff",
            },
          }
        );

      const link =
        document.createElement("a");

      link.href =
        qrDataUrl;

      const cleanName =
        client.client_name
          .replace(
            /[^a-z0-9]/gi,
            "-"
          )
          .toLowerCase();

      link.download =
        `${cleanName}-gallery-qr.png`;

      document.body.appendChild(
        link
      );

      link.click();

      link.remove();

      setMessage(
        `QR Code downloaded for ${client.client_name}!`
      );
    } catch (error) {
      console.log(error);

      setMessage(
        "QR Code generate nahi hua. Dobara try karo."
      );
    }
  }

  async function loadClients() {
    const { data, error } =
      await supabase
        .from("clients")
        .select("*")
        .order("id", {
          ascending: false,
        });

    if (error) {
      console.log(error);

      setMessage(
        "Clients load nahi hue."
      );

      return;
    }

    const loadedClients =
      data || [];

    setClients(
      loadedClients
    );

    if (
      !selectedClientId &&
      loadedClients.length > 0
    ) {
      setSelectedClientId(
        loadedClients[0]
          .client_id
      );
    }
  }

  async function loadPhotos() {
    const { data, error } =
      await supabase
        .from("photos")
        .select("*")
        .order("id", {
          ascending: false,
        });

    if (error) {
      console.log(error);

      setMessage(
        "Photos load nahi hui."
      );

      return;
    }

    setPhotos(
      data || []
    );
  }

  useEffect(() => {
    if (loggedIn) {
      loadClients();
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

  function createClientId(
    name: string
  ) {
    const cleanName =
      name
        .toLowerCase()
        .trim()
        .replace(
          /[^a-z0-9]+/g,
          "-"
        )
        .replace(
          /^-+|-+$/g,
          ""
        );

    const randomNumber =
      Math.floor(
        1000 +
          Math.random() *
            9000
      );

    return `${cleanName}-${randomNumber}`;
  }

  function createPassword() {
    return String(
      Math.floor(
        100000 +
          Math.random() *
            900000
      )
    );
  }

  async function createClient() {
    const cleanName =
      clientName.trim();

    if (!cleanName) {
      setMessage(
        "Please enter Client Name."
      );

      return;
    }

    setCreatingClient(true);
    setMessage("");

    try {
      const newClientId =
        createClientId(
          cleanName
        );

      const newPassword =
        createPassword();

      const {
        data,
        error,
      } =
        await supabase
          .from("clients")
          .insert({
            client_name:
              cleanName,
            client_id:
              newClientId,
            client_password:
              newPassword,
          })
          .select()
          .single();

      if (error) {
        throw error;
      }

      setClients(
        (
          oldClients
        ) => [
          data,
          ...oldClients,
        ]
      );

      // New client automatically select hoga
      setSelectedClientId(
        data.client_id
      );

      setClientName("");

      setMessage(
        `Client created successfully! Client ID: ${data.client_id} | Password: ${data.client_password}`
      );
    } catch (error) {
      console.log(error);

      setMessage(
        "Client create nahi hua. Dobara try karo."
      );
    } finally {
      setCreatingClient(
        false
      );
    }
  }

  async function compressImage(
    file: File
  ): Promise<File> {
    return new Promise(
      (
        resolve,
        reject
      ) => {
        const image =
          new Image();

        const imageUrl =
          URL.createObjectURL(
            file
          );

        image.onload =
          () => {
            const maxWidth =
              2500;

            const maxHeight =
              2500;

            let width =
              image.width;

            let height =
              image.height;

            if (
              width >
                maxWidth ||
              height >
                maxHeight
            ) {
              const ratio =
                Math.min(
                  maxWidth /
                    width,
                  maxHeight /
                    height
                );

              width =
                Math.round(
                  width *
                    ratio
                );

              height =
                Math.round(
                  height *
                    ratio
                );
            }

            const canvas =
              document.createElement(
                "canvas"
              );

            canvas.width =
              width;

            canvas.height =
              height;

            const context =
              canvas.getContext(
                "2d"
              );

            if (
              !context
            ) {
              URL.revokeObjectURL(
                imageUrl
              );

              reject(
                new Error(
                  "Image processing failed"
                )
              );

              return;
            }

            context.fillStyle =
              "white";

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
              (
                blob
              ) => {
                URL.revokeObjectURL(
                  imageUrl
                );

                if (
                  !blob
                ) {
                  reject(
                    new Error(
                      "Image compression failed"
                    )
                  );

                  return;
                }

                const compressedFile =
                  new File(
                    [
                      blob,
                    ],
                    file.name.replace(
                      /\.[^/.]+$/,
                      ".jpg"
                    ),
                    {
                      type:
                        "image/jpeg",
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

        image.onerror =
          () => {
            URL.revokeObjectURL(
              imageUrl
            );

            reject(
              new Error(
                "Image load failed"
              )
            );
          };

        image.src =
          imageUrl;
      }
    );
  }

  async function uploadPhotos(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const files =
      Array.from(
        event.target
          .files || []
      );

    if (
      files.length ===
      0
    ) {
      return;
    }

    if (
      !selectedClientId
    ) {
      setMessage(
        "Please select a client."
      );

      return;
    }

    setUploading(
      true
    );

    setMessage("");

    setUploadProgress(
      ""
    );

    try {
      for (
        let index = 0;
        index <
        files.length;
        index++
      ) {
        const originalFile =
          files[
            index
          ];

        setUploadProgress(
          `Photo ${
            index + 1
          } of ${
            files.length
          }: Preparing...`
        );

        const compressedFile =
          await compressImage(
            originalFile
          );

        setUploadProgress(
          `Photo ${
            index + 1
          } of ${
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
              method:
                "POST",
              body:
                formData,
            }
          );

        const cloudinaryData =
          await cloudinaryResponse.json();

        if (
          !cloudinaryResponse.ok
        ) {
          throw new Error(
            cloudinaryData
              .error
              ?.message ||
              "Cloudinary upload failed"
          );
        }

        const imageUrl =
          cloudinaryData
            .secure_url;

        const {
          error,
        } =
          await supabase
            .from(
              "photos"
            )
            .insert({
              image_url:
                imageUrl,
              client_id:
                selectedClientId,
            });

        if (
          error
        ) {
          throw error;
        }
      }

      await loadPhotos();

      const selectedClient =
        clients.find(
          (
            client
          ) =>
            client.client_id ===
            selectedClientId
        );

      setMessage(
        `${files.length} photo(s) uploaded for ${
          selectedClient
            ?.client_name ||
          selectedClientId
        } successfully!`
      );

      setUploadProgress(
        ""
      );
    } catch (error) {
      console.log(
        error
      );

      setUploadProgress(
        ""
      );

      setMessage(
        "Photo upload failed. Please try again."
      );
    } finally {
      setUploading(
        false
      );

      event.target.value =
        "";
    }
  }

  async function deletePhoto(
    id: number
  ) {
    const answer =
      window.confirm(
        "Kya aap ye photo delete karna chahte hain?"
      );

    if (
      !answer
    ) {
      return;
    }

    setDeletingId(
      id
    );

    setMessage(
      ""
    );

    const {
      error,
    } =
      await supabase
        .from(
          "photos"
        )
        .delete()
        .eq(
          "id",
          id
        );

    if (
      error
    ) {
      console.log(
        error
      );

      setMessage(
        "Photo delete nahi hui."
      );

      setDeletingId(
        null
      );

      return;
    }

    setPhotos(
      (
        oldPhotos
      ) =>
        oldPhotos.filter(
          (
            photo
          ) =>
            photo.id !==
            id
        )
    );

    setMessage(
      "Photo deleted successfully!"
    );

    setDeletingId(
      null
    );
  }

  if (
    loggedIn
  ) {
    return (
      <main className="min-h-screen bg-black px-6 py-12 text-white">

        <div className="mx-auto max-w-6xl">

          <p className="text-center text-sm tracking-[0.4em] text-yellow-400">
            AKASH PHOTOGRAPHY
          </p>

          <h1 className="mt-3 text-center text-4xl font-bold">
            Admin Panel
          </h1>

          <p className="mt-4 text-center text-gray-400">
            Create clients, generate QR and upload photos
          </p>

          <div className="mx-auto mt-8 grid max-w-4xl gap-6 md:grid-cols-2">

            <div className="rounded-2xl border border-zinc-700 bg-zinc-900 p-6">

              <h2 className="text-xl font-bold text-yellow-400">
                Create New Client
              </h2>

              <label className="mt-5 block text-sm text-gray-300">
                Client Name
              </label>

              <input
                type="text"
                value={
                  clientName
                }
                onChange={(
                  event
                ) =>
                  setClientName(
                    event
                      .target
                      .value
                  )
                }
                placeholder="Enter client name"
                className="mt-2 w-full rounded-xl border border-zinc-700 bg-black px-5 py-4 text-white outline-none"
              />

              <button
                onClick={
                  createClient
                }
                disabled={
                  creatingClient
                }
                className="mt-5 w-full rounded-xl bg-yellow-400 px-6 py-4 font-bold text-black disabled:opacity-50"
              >

                {
                  creatingClient
                    ? "Creating..."
                    : "Create Client Automatically"
                }

              </button>

              <p className="mt-3 text-center text-xs text-gray-500">
                Client ID and password will be generated automatically.
              </p>

            </div>

            <div className="rounded-2xl border border-zinc-700 bg-zinc-900 p-6">

              <h2 className="text-xl font-bold text-yellow-400">
                Upload Photos
              </h2>

              <label className="mt-5 block text-sm text-gray-300">
                Select Client
              </label>

              <select
                value={
                  selectedClientId
                }
                onChange={(
                  event
                ) =>
                  setSelectedClientId(
                    event
                      .target
                      .value
                  )
                }
                className="mt-2 w-full rounded-xl border border-zinc-700 bg-black px-5 py-4 text-white outline-none"
              >

                <option value="">
                  Select Client
                </option>

                {
                  clients.map(
                    (
                      client
                    ) => (

                      <option
                        key={
                          client.id
                        }
                        value={
                          client.client_id
                        }
                      >

                        {
                          client.client_name
                        }

                        {" — "}

                        {
                          client.client_id
                        }

                      </option>

                    )
                  )
                }

              </select>

              <div className="mt-5 text-center">

                <label className="inline-block cursor-pointer rounded-xl bg-yellow-400 px-6 py-4 font-bold text-black">

                  {
                    uploading
                      ? "Uploading..."
                      : "Upload Photos"
                  }

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

              {
                uploadProgress && (

                  <p className="mt-4 text-center text-sm text-gray-300">

                    {
                      uploadProgress
                    }

                  </p>

                )
              }

              <p className="mt-3 text-center text-xs text-gray-500">
                Large photos are automatically compressed before upload.
              </p>

            </div>

          </div>

          {
            message && (

              <p className="mx-auto mt-6 max-w-3xl rounded-xl border border-yellow-400 bg-zinc-900 p-4 text-center text-yellow-400">

                {
                  message
                }

              </p>

            )
          }

          <div className="mx-auto mt-10 max-w-4xl">

            <h2 className="text-center text-2xl font-bold">
              Client Login Details & QR
            </h2>

            <div className="mt-6 grid gap-4 md:grid-cols-2">

              {
                clients.map(
                  (
                    client
                  ) => (

                    <div
                      key={
                        client.id
                      }
                      className="rounded-2xl border border-zinc-700 bg-zinc-900 p-5"
                    >

                      <h3 className="text-lg font-bold text-yellow-400">

                        {
                          client.client_name
                        }

                      </h3>

                      <p className="mt-3 text-sm text-gray-300">

                        Client ID:{" "}

                        <span className="font-bold text-white">

                          {
                            client.client_id
                          }

                        </span>

                      </p>

                      <p className="mt-2 text-sm text-gray-300">

                        Password:{" "}

                        <span className="font-bold text-white">

                          {
                            client.client_password
                          }

                        </span>

                      </p>

                      <div className="mt-5 grid gap-3 sm:grid-cols-2">

                        <a
                          href={
                            getClientGalleryLink(
                              client.client_id
                            )
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-xl border border-yellow-400 px-4 py-3 text-center font-bold text-yellow-400"
                        >

                          Open Gallery

                        </a>

                        <button
                          onClick={() =>
                            downloadClientQR(
                              client
                            )
                          }
                          className="rounded-xl bg-yellow-400 px-4 py-3 font-bold text-black"
                        >

                          Download QR

                        </button>

                      </div>

                      <p className="mt-3 text-center text-xs text-gray-500">
                        QR scan karne par Client ID automatically fill ho jayegi.
                      </p>

                    </div>

                  )
                )
              }

              {
                clients.length ===
                  0 && (

                  <p className="text-center text-gray-500">

                    No clients created yet.

                  </p>

                )
              }

            </div>

          </div>

          <div className="mt-12">

            <h2 className="text-center text-2xl font-bold">
              All Uploaded Photos
            </h2>

            <div className="mt-6 grid gap-6 sm:grid-cols-2 md:grid-cols-3">

              {
                photos.map(
                  (
                    photo
                  ) => {

                    const client =
                      clients.find(
                        (
                          item
                        ) =>
                          item.client_id ===
                          photo.client_id
                      );

                    return (

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
                            client
                              ?.client_name ||
                            photo
                              .client_id ||
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

                          {
                            deletingId ===
                            photo.id
                              ? "Deleting..."
                              : "Delete Photo"
                          }

                        </button>

                      </div>

                    );
                  }
                )
              }

            </div>

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

        <p className="text-center text-sm tracking-[0.4em] text-yellow-400">
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
                event
                  .target
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
                event
                  .target
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

          {
            message && (

              <p className="mt-5 text-center text-red-400">

                {
                  message
                }

              </p>

            )
          }

        </div>

      </div>

    </main>
  );
}