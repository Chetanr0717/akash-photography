"use client";

import { FormEvent, useState } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [eventType, setEventType] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");

  function handleBooking(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const whatsappMessage = `
New Photography Booking

Name: ${name}
Mobile: ${mobile}
Event Type: ${eventType}
Event Date: ${eventDate}
Location: ${location}
Message: ${message}
    `.trim();

    const whatsappUrl =
      "https://wa.me/917499894121?text=" +
      encodeURIComponent(whatsappMessage);

    window.open(whatsappUrl, "_blank");
  }

  return (
    <main className="min-h-screen bg-black text-white">

      {/* Navigation */}
      <nav className="flex flex-col gap-5 px-6 py-5 md:flex-row md:items-center md:justify-between md:px-16">

        <div>
          <h1 className="text-2xl font-bold tracking-widest text-yellow-400">
            AKASH
          </h1>

          <p className="text-xs tracking-[0.3em]">
            PHOTOGRAPHY
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">

          <a
            href="/client"
            className="rounded-full bg-yellow-400 px-5 py-2 text-sm font-semibold text-black"
          >
            Client Gallery
          </a>

          <a
            href="/admin"
            className="rounded-full border border-yellow-400 px-5 py-2 text-sm font-semibold text-yellow-400"
          >
            Admin Login
          </a>

          <a
            href="#contact"
            className="rounded-full border border-white px-5 py-2 text-sm text-white"
          >
            Contact Us
          </a>

        </div>
      </nav>

      {/* Hero */}
      <section className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">

        <p className="mb-4 tracking-[0.3em] text-yellow-400">
          CAPTURING MEMORIES
        </p>

        <h2 className="max-w-4xl text-5xl font-bold leading-tight md:text-7xl">
          Your Beautiful Moments,

          <span className="block text-yellow-400">
            Forever Remembered
          </span>
        </h2>

        <p className="mt-6 max-w-2xl text-lg text-gray-300">
          Professional Wedding, Pre-Wedding, Maternity,
          Baby and Portrait Photography.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">

          <a
            href="#booking"
            className="rounded-full bg-yellow-400 px-8 py-3 font-semibold text-black"
          >
            Book Your Shoot
          </a>

          <a
            href="#portfolio"
            className="rounded-full border border-white px-8 py-3 font-semibold"
          >
            View Portfolio
          </a>

        </div>

      </section>

      {/* Services */}
      <section className="bg-zinc-900 px-6 py-16 text-center">

        <p className="text-yellow-400">
          OUR SERVICES
        </p>

        <h3 className="mt-3 text-4xl font-bold">
          Every Moment Matters
        </h3>

        <div className="mx-auto mt-10 grid max-w-5xl gap-5 md:grid-cols-3">

          <div className="rounded-2xl border border-zinc-700 p-7">

            <h4 className="text-xl font-semibold text-yellow-400">
              Wedding Shoot
            </h4>

            <p className="mt-3 text-gray-400">
              Beautiful memories from your special day.
            </p>

          </div>

          <div className="rounded-2xl border border-zinc-700 p-7">

            <h4 className="text-xl font-semibold text-yellow-400">
              Pre-Wedding
            </h4>

            <p className="mt-3 text-gray-400">
              Creative and cinematic couple photography.
            </p>

          </div>

          <div className="rounded-2xl border border-zinc-700 p-7">

            <h4 className="text-xl font-semibold text-yellow-400">
              Maternity & Baby
            </h4>

            <p className="mt-3 text-gray-400">
              Precious family moments captured with care.
            </p>

          </div>

        </div>

      </section>

      {/* Portfolio */}
      <section
        id="portfolio"
        className="bg-black px-6 py-16 text-center"
      >

        <p className="text-yellow-400">
          OUR PORTFOLIO
        </p>

        <h3 className="mt-3 text-4xl font-bold">
          Captured With Love
        </h3>

        <p className="mx-auto mt-4 max-w-2xl text-gray-400">
          Wedding, Pre-Wedding, Maternity, Baby and
          special moments.
        </p>

        <div className="mx-auto mt-10 grid max-w-6xl gap-6 sm:grid-cols-2 md:grid-cols-3">

          <div className="group overflow-hidden rounded-2xl border border-zinc-700">

            <img
              src="/gallery/photo1.jpg.JPG"
              alt="Wedding Photography"
              className="h-80 w-full object-cover transition duration-500 group-hover:scale-110"
            />

            <div className="bg-zinc-900 p-5">

              <h4 className="text-xl font-semibold text-yellow-400">
                Wedding
              </h4>

              <p className="mt-2 text-gray-400">
                Your beautiful wedding memories.
              </p>

            </div>

          </div>

          <div className="group overflow-hidden rounded-2xl border border-zinc-700">

            <img
              src="/gallery/photo2.jpg.JPG"
              alt="Pre-Wedding Photography"
              className="h-80 w-full object-cover transition duration-500 group-hover:scale-110"
            />

            <div className="bg-zinc-900 p-5">

              <h4 className="text-xl font-semibold text-yellow-400">
                Pre-Wedding
              </h4>

              <p className="mt-2 text-gray-400">
                Creative couple photography.
              </p>

            </div>

          </div>

          <div className="group overflow-hidden rounded-2xl border border-zinc-700">

            <img
              src="/gallery/photo3.jpg.JPG"
              alt="Baby Photography"
              className="h-80 w-full object-cover transition duration-500 group-hover:scale-110"
            />

            <div className="bg-zinc-900 p-5">

              <h4 className="text-xl font-semibold text-yellow-400">
                Baby Shoot
              </h4>

              <p className="mt-2 text-gray-400">
                Precious little moments.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* Booking */}
      <section
        id="booking"
        className="bg-zinc-900 px-6 py-16"
      >

        <div className="mx-auto max-w-3xl">

          <p className="text-center text-yellow-400">
            BOOK YOUR SHOOT
          </p>

          <h3 className="mt-3 text-center text-4xl font-bold">
            Book Your Special Date
          </h3>

          <form
            onSubmit={handleBooking}
            className="mt-10 grid gap-5"
          >

            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="rounded-xl border border-zinc-700 bg-black px-5 py-4 text-white outline-none"
            />

            <input
              type="tel"
              placeholder="Mobile Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
              className="rounded-xl border border-zinc-700 bg-black px-5 py-4 text-white outline-none"
            />

            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              required
              className="rounded-xl border border-zinc-700 bg-black px-5 py-4 text-white outline-none"
            >

              <option value="">
                Select Event Type
              </option>

              <option>Wedding</option>
              <option>Pre-Wedding</option>
              <option>Baby Shoot</option>
              <option>Maternity Shoot</option>
              <option>Birthday</option>
              <option>Other</option>

            </select>

            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              required
              className="rounded-xl border border-zinc-700 bg-black px-5 py-4 text-white outline-none"
            />

            <input
              type="text"
              placeholder="Event Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="rounded-xl border border-zinc-700 bg-black px-5 py-4 text-white outline-none"
            />

            <textarea
              placeholder="Write your message..."
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="rounded-xl border border-zinc-700 bg-black px-5 py-4 text-white outline-none"
            />

            <button
              type="submit"
              className="rounded-xl bg-yellow-400 px-6 py-4 font-bold text-black"
            >
              Book Now on WhatsApp
            </button>

          </form>

        </div>

      </section>

      {/* Contact */}
      <footer
        id="contact"
        className="px-6 py-10 text-center"
      >

        <h3 className="text-2xl font-bold text-yellow-400">
          AKASH PHOTOGRAPHY
        </h3>

        <p className="mt-3 text-gray-400">
          Chalisgaon, Maharashtra
        </p>

        <p className="mt-2 text-gray-400">
          Contact: 7498941121
        </p>

      </footer>

      {/* WhatsApp Button */}
      <a
        href="https://wa.me/917499894121"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-50 rounded-full bg-green-600 px-6 py-4 font-bold text-white shadow-xl"
      >
        WhatsApp
      </a>

    </main>
  );
}