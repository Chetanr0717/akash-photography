"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

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

export default function ClientGallery() {
  const [clientId, setClientId] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const [clientName, setClientName] = useState("");

  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const [message, setMessage] = useState("");

  async function clientLogin() {
    const cleanClientId = clientId
      .trim()
      .toLowerCase();

    const cleanPassword =
      password.trim();

    if (
      !cleanClientId ||
      !cleanPassword
    ) {
      setMessage(
        "Please enter Client ID and Password."
      );

      return;
    }

    setLoggingIn(true);
    setMessage("");

    try {
      const { data: client, error: clientError } =
        await supabase
          .from("clients")
          .select("*")
          .eq(
            "client_id",
            cleanClientId
          )
          .eq(
            "client_password",
            cleanPassword
          )
          .maybeSingle();

      if (clientError) {
        throw clientError;
      }

      if (!client) {
        setMessage(
          "Wrong Client ID or Password."
        );

        return;
      }

      setClientName(
        client.client_name
      );

      setLoggedIn(true);

      await loadPhotos(
        client.client_id
      );
    } catch (error) {
      console.log(error);

      setMessage(
        "Login failed. Please try again."
      );
    } finally {
      setLoggingIn(false);
    }
  }

  async function loadPhotos(
    selectedClientId: string
  ) {
    setLoading(true);

    const { data, error } =
      await supabase
        .from("photos")
        .select("*")
        .eq(
          "client_id",
          selectedClientId
        )
        .order(
          "id",
          {
            ascending: false,
          }
        );

    if (error) {
      console.log(error);

      setMessage(
        "Photos load nahi hui. Please try again."
      );

      setLoading(false);

      return;
    }

    setPhotos(
      data || []
    );

    setLoading(false);
  }

  function logout() {
    setLoggedIn(false);

    setClientId("");

    setPassword("");

    setClientName("");

    setPhotos([]);

    setMessage("");
  }

  async function downloadPhoto(
    photo: Photo
  ) {
    try {
      const response =
        await fetch(
          photo.image_url
        );

      if (
        !response.ok
      ) {
        throw new Error(
          "Photo download failed"
        );
      }

      const blob =
        await response.blob();

      const downloadUrl =
        window.URL.createObjectURL(
          blob
        );

      const link =
        document.createElement(
          "a"
        );

      link.href =
        downloadUrl;

      link.download =
        `akash-photo-${photo.id}.jpg`;

      document.body.appendChild(
        link
      );

      link.click();

      link.remove();

      window.URL.revokeObjectURL(
        downloadUrl
      );
    } catch (error) {
      console.log(error);

      alert(
        "Download nahi hua. Please try again."
      );
    }
  }

  if (!loggedIn) {
    return (
      <main className="min-h-screen bg-black px-6 py-12 text-white">

        <div className="mx-auto max-w-md">

          <p className="text-center text-yellow-400">
            AKASH PHOTOGRAPHY
          </p>

          <h1 className="mt-3 text-center text-4xl font-bold">
            Client Gallery Login
          </h1>

          <p className="mt-4 text-center text-gray-400">
            Enter your Client ID and Password
          </p>

          <div className="mt-10 rounded-2xl border border-zinc-700 bg-zinc-900 p-7">

            <label className="text-sm text-gray-300">
              Client ID
            </label>

            <input
              type="text"
              value={clientId}
              onChange={(event) =>
                setClientId(
                  event.target.value
                )
              }
              placeholder="Enter Client ID"
              className="mt-2 w-full rounded-xl border border-zinc-700 bg-black px-5 py-4 text-white outline-none"
            />

            <label className="mt-5 block text-sm text-gray-300">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
              placeholder="Enter Password"
              onKeyDown={(event) => {
                if (
                  event.key ===
                  "Enter"
                ) {
                  clientLogin();
                }
              }}
              className="mt-2 w-full rounded-xl border border-zinc-700 bg-black px-5 py-4 text-white outline-none"
            />

            <button
              onClick={
                clientLogin
              }
              disabled={
                loggingIn
              }
              className="mt-6 w-full rounded-xl bg-yellow-400 px-6 py-4 font-bold text-black disabled:opacity-50"
            >

              {loggingIn
                ? "Checking..."
                : "Open My Gallery"}

            </button>

            {message && (
              <p className="mt-5 text-center text-red-400">
                {message}
              </p>
            )}

          </div>

        </div>

      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">

      <div className="mx-auto max-w-6xl">

        <p className="text-center text-yellow-400">
          AKASH PHOTOGRAPHY
        </p>

        <h1 className="mt-3 text-center text-4xl font-bold">
          {clientName}'s Photo Gallery
        </h1>

        <p className="mt-4 text-center text-gray-400">
          Your beautiful memories
        </p>

        <div className="mt-8 flex justify-center">

          <button
            onClick={logout}
            className="rounded-xl border border-yellow-400 px-6 py-3 font-bold text-yellow-400"
          >
            Logout
          </button>

        </div>

        {loading && (
          <p className="mt-10 text-center text-yellow-400">
            Loading your photos...
          </p>
        )}

        {!loading &&
          photos.length === 0 && (
            <p className="mt-10 text-center text-gray-400">
              No photos available yet.
            </p>
          )}

        <div className="mt-10 grid gap-6 sm:grid-cols-2 md:grid-cols-3">

          {photos.map(
            (photo) => (

              <div
                key={photo.id}
                className="overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-900"
              >

                <img
                  src={
                    photo.image_url
                  }
                  alt="Client Photo"
                  loading="lazy"
                  className="h-80 w-full object-cover"
                />

                <div className="p-4">

                  <button
                    onClick={() =>
                      downloadPhoto(
                        photo
                      )
                    }
                    className="w-full rounded-xl bg-yellow-400 px-5 py-3 text-center font-bold text-black"
                  >
                    ⬇ Download Photo
                  </button>

                </div>

              </div>

            )
          )}

        </div>

      </div>

    </main>
  );
}