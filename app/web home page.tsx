export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-5 md:px-16">
        <div>
          <h1 className="text-2xl font-bold tracking-widest text-yellow-400">
            AKASH
          </h1>
          <p className="text-xs tracking-[0.3em] text-white">
            PHOTOGRAPHY
          </p>
        </div>

        <button className="rounded-full border border-yellow-400 px-5 py-2 text-sm text-yellow-400">
          Contact Us
        </button>
      </nav>

      {/* Hero Section */}
      <section className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
        <p className="mb-4 tracking-[0.4em] text-yellow-400">
          CAPTURING MEMORIES
        </p>

        <h2 className="max-w-4xl text-5xl font-bold leading-tight md:text-7xl">
          Your Beautiful Moments,
          <span className="block text-yellow-400">Forever Remembered</span>
        </h2>

        <p className="mt-6 max-w-2xl text-lg text-gray-300">
          Professional Wedding, Pre-Wedding, Maternity, Baby and
          Portrait Photography.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <button className="rounded-full bg-yellow-400 px-8 py-3 font-semibold text-black">
            Book Your Shoot
          </button>

          <button className="rounded-full border border-white px-8 py-3 font-semibold">
            View Portfolio
          </button>
        </div>
      </section>

      {/* Services */}
      <section className="bg-zinc-900 px-6 py-16 text-center">
        <p className="text-yellow-400">OUR SERVICES</p>

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
<section className="bg-black px-6 py-16 text-center">
  <p className="text-yellow-400">OUR PORTFOLIO</p>

  <h3 className="mt-3 text-4xl font-bold">
    Captured With Love
  </h3>

  <p className="mx-auto mt-4 max-w-2xl text-gray-400">
    Wedding, Pre-Wedding, Maternity, Baby and special moments.
  </p>

  <div className="mx-auto mt-10 grid max-w-6xl gap-5 sm:grid-cols-2 md:grid-cols-3">
    <div className="h-64 rounded-2xl border border-zinc-700 bg-zinc-900 p-6">
      <h4 className="text-xl font-semibold text-yellow-400">
        Wedding
      </h4>
      <p className="mt-3 text-gray-400">
        Your beautiful wedding memories.
      </p>
    </div>

    <div className="h-64 rounded-2xl border border-zinc-700 bg-zinc-900 p-6">
      <h4 className="text-xl font-semibold text-yellow-400">
        Pre-Wedding
      </h4>
      <p className="mt-3 text-gray-400">
        Creative couple photography.
      </p>
    </div>

    <div className="h-64 rounded-2xl border border-zinc-700 bg-zinc-900 p-6">
      <h4 className="text-xl font-semibold text-yellow-400">
        Baby Shoot
      </h4>
      <p className="mt-3 text-gray-400">
        Precious little moments.
      </p>
    </div>
  </div>
</section>
      {/* Contact */}
      <footer className="px-6 py-10 text-center">
        <h3 className="text-2xl font-bold text-yellow-400">
          AKASH PHOTOGRAPHY
        </h3>

        <p className="mt-3 text-gray-400">
          Chalisgaon, Maharashtra
        </p>

        <p className="mt-2 text-gray-400">
          Contact: 7498941121
        </p>
      </footer><footer>
  ...
</footer>

{/* WhatsApp Button */}
<a>
  WhatsApp
</a>

</main>
    
  );
}