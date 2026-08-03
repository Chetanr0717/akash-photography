"use client";

import { useEffect, useState } from "react";
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

  const [clientName, setClientName] =
    useState("");

  const [photos, setPhotos] =
    useState<Photo[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  // QR link se Client ID automatically fill hoga
  useEffect(() => {
    const params =
      new URLSearchParams(
        window.location.search
      );

    const qrClientId =
      params.get("client");

    if (qrClientId) {
      setClientId(qrClientId);
      setMessage(
        "Client ID QR code se automatically fill ho gaya. Ab password enter karein."
      );
    }
  }, []);

  async function clientLogin() {
    const cleanClientId =
      clientId.trim();

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

    setLoading(true);
    setMessage("");

    try {
      // Client ID aur password database me check karega
      const {
        data: client,
        error: clientError,
      } = await supabase
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

        setLoading(false);

        return;
      }

      setClientName(
        client.client_name
      );

      // Sirf login wale client ki photos load hongi
      const {
        data: clientPhotos,
        error: photoError,
      } = await supabase
        .from("photos")
        .select("*")
        .eq(
          "client_id",
          client.client_id
        )
        .order("id", {
          ascending: false,
        });

      if (photoError) {
        throw photoError;
      }

      setPhotos(
        clientPhotos || []
      );

      setLoggedIn(true);

      setMessage("");
    } catch (error) {
      console.log(error);

      setMessage(
        "Login nahi hua. Please dobara try karein."
      );
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setLoggedIn(false);

    setClientId("");

    setPassword("");

    setClientName("");

    setPhotos([]);

    setMessage("");

    // URL se QR wala client parameter remove karega
    window.history.replaceState(
      {},
      "",
      "/client"
    );
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
        "Download nahi hua. Please dobara try karein."
      );
    }
  }

  // LOGIN PAGE
  if (
    !loggedIn
  ) {
    return (
      <main className="min-h-screen bg-black px-4 py-10 text-white sm:px-6 sm:py-12">

        <div className="mx-auto max-w-md">

          <p className="text-center text-sm font-semibold tracking-[0.25em] text-yellow-400">
            AKASH PHOTOGRAPHY
          </p>

          <h1 className="mt-3 text-center text-3xl font-bold sm:text-4xl">
            Client Gallery
          </h1>

          <p className="mt-4 text-center text-sm text-gray-400 sm:text-base">
            Enter your Client ID and Password
          </p>

          <div className="mt-8 rounded-2xl border border-zinc-700 bg-zinc-900 p-5 shadow-2xl sm:mt-10 sm:p-7">

            <label className="text-sm text-gray-300">
              Client ID
            </label>

            <input
              type="text"
              value={clientId}
              onChange={(
                event
              ) => {
                setClientId(
                  event.target.value
                );

                setMessage("");
              }}
              placeholder="Enter Client ID"
              autoComplete="username"
              className="mt-2 w-full rounded-xl border border-zinc-700 bg-black px-4 py-4 text-white outline-none transition focus:border-yellow-400"
            />

            <label className="mt-5 block text-sm text-gray-300">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(
                event
              ) => {
                setPassword(
                  event.target.value
                );

                setMessage("");
              }}
              onKeyDown={(
                event
              ) => {
                if (
                  event.key ===
                  "Enter"
                ) {
                  clientLogin();
                }
              }}
              placeholder="Enter Password"
              autoComplete="current-password"
              className="mt-2 w-full rounded-xl border border-zinc-700 bg-black px-4 py-4 text-white outline-none transition focus:border-yellow-400"
            />

            <button
              onClick={
                clientLogin
              }
              disabled={
                loading
              }
              className="mt-6 w-full rounded-xl bg-yellow-400 px-6 py-4 font-bold text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {
                loading
                  ? "Checking..."
                  : "Open My Gallery"
              }
            </button>

            {
              message && (

                <p
                  className={`mt-5 rounded-xl border p-3 text-center text-sm ${
                    message.includes(
                      "automatically"
                    )
                      ? "border-yellow-400/40 bg-yellow-400/10 text-yellow-300"
                      : "border-red-500/40 bg-red-500/10 text-red-400"
                  }`}
                >

                  {
                    message
                  }

                </p>

              )
            }

          </div>

          <p className="mt-5 text-center text-xs text-gray-600">
            Scan the QR code to automatically fill the Client ID.
          </p>

        </div>

      </main>
    );
  }

  // GALLERY PAGE
  return (
    <main className="min-h-screen bg-black px-4 py-10 text-white sm:px-6 sm:py-12">

      <div className="mx-auto max-w-6xl">

        <p className="text-center text-sm font-semibold tracking-[0.25em] text-yellow-400">
          AKASH PHOTOGRAPHY
        </p>

        <h1 className="mt-3 text-center text-3xl font-bold sm:text-4xl">
          {clientName
            ? `${clientName}'s Gallery`
            : "My Photo Gallery"}
        </h1>

        <p className="mt-4 text-center text-sm text-gray-400 sm:text-base">
          Your beautiful memories
        </p>

        <div className="mt-7 flex justify-center">

          <button
            onClick={
              logout
            }
            className="rounded-xl border border-yellow-400 px-6 py-3 font-bold text-yellow-400 transition hover:bg-yellow-400 hover:text-black"
          >
            Logout
          </button>

        </div>

        {
          photos.length ===
            0 && (

            <div className="mx-auto mt-12 max-w-md rounded-2xl border border-zinc-700 bg-zinc-900 p-8 text-center">

              <h2 className="text-xl font-bold text-yellow-400">
                No Photos Yet
              </h2>

              <p className="mt-3 text-sm text-gray-400">
                Your photos will appear here after the photographer uploads them.
              </p>

            </div>

          )
        }

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

          {
            photos.map(
              (
                photo
              ) => (

                <div
                  key={
                    photo.id
                  }
                  className="overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-900 shadow-xl"
                >

                  <img
                    src={
                      photo.image_url
                    }
                    alt="Client photo"
                    loading="lazy"
                    className="h-72 w-full object-cover sm:h-80"
                  />

                  <div className="p-4">

                    <button
                      onClick={() =>
                        downloadPhoto(
                          photo
                        )
                      }
                      className="w-full rounded-xl bg-yellow-400 px-5 py-3 font-bold text-black transition hover:bg-yellow-300"
                    >
                      ⬇ Download Photo
                    </button>

                  </div>

                </div>

              )
            )
          }

        </div>

      </div>

    </main>
  );
}