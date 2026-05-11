import { Link } from "react-router-dom";
import VisitorCounter from "./VisitorCounter";

function Stat({ value, label }) {
  return (
    <div className="text-center">
      <div className="text-4xl font-bold text-amber-flame">{value}</div>
      <div className="text-lg mt-1 text-indigo-velvet/70 dark:text-white/70">{label}</div>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="card bg-base-100 shadow-xl hover:scale-105 transition-transform duration-300 hover:shadow-2xl border border-slate/20">
      <div className="card-body items-center text-center gap-3">
        <div className="text-5xl">{icon}</div>
        <h2 className="card-title text-xl">{title}</h2>
        <p className="text-medium-slate-blue">{description}</p>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="animate-[fadeIn_0.5s_ease-out]">
      <section className="hero min-h-[60vh] bg-gradient-to-br from-indigo-velvet/10 to-medium-slate-blue/10">
        <div className="hero-content text-center py-20">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-indigo-velvet dark:text-white">
              Discover Universities <span className="text-amber-flame">Worldwide</span>
            </h1>
            <p className="py-6 text-lg text-medium-slate-blue max-w-xl mx-auto">
              Explore thousands of universities across the globe. Find detailed information, compare institutions, and build your academic future.
            </p>
            <Link to="/search" className="btn bg-medium-slate-blue text-white hover:bg-amber-flame hover:text-white border-medium-slate-blue btn-lg shadow-lg shadow-medium-slate-blue/20">
              Start Searching
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-indigo-velvet dark:text-white">Why Use UniSearch?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={"\uD83C\uDF10"}
            title="Global Database"
            description="Access information on 15,000+ universities from over 200 countries worldwide. Always growing."
          />
          <FeatureCard
            icon={"\uD83D\uDD0D"}
            title="Smart Search"
            description="Filter universities by country, name, and more. Find exactly what you're looking for in seconds."
          />
          <FeatureCard
            icon={"\u2764\uFE0F"}
            title="Save Favorites"
            description="Bookmark your favorite universities and compare them side by side across different countries."
          />
        </div>
      </section>

      <section className="py-12 px-4 max-w-4xl mx-auto flex justify-center">
        <VisitorCounter />
      </section>

      <section className="py-20 px-4 bg-indigo-velvet">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <Stat value="15,000+" label="Universities" />
          <Stat value="200+" label="Countries" />
          <Stat value="10,000+" label="Daily Users" />
        </div>
      </section>

      <footer className="footer footer-center p-10 bg-indigo-velvet/95 text-white/70">
        <div>
          <p className="font-bold text-lg text-amber-flame">UniSearch</p>
          <p className="text-sm">Built with React, daisyUI & Tailwind CSS</p>
          <p className="text-sm">Data provided by Hipolabs Universities API</p>
          <p className="text-xs text-white/40 mt-4">
            &copy; {new Date().getFullYear()} UniSearch. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
