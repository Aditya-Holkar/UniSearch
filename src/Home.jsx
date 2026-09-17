import { Link } from "react-router-dom";
import { useFavorites } from "./FavoritesContext";

function FeatureCard({ icon, title, description }) {
  return (
    <div className="rounded-2xl bg-base-100 border border-medium-slate-blue/15 p-6 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all">
      <div className="text-4xl">{icon}</div>
      <h2 className="text-xl font-bold text-indigo-velvet dark:text-white mt-4">{title}</h2>
      <p className="text-medium-slate-blue mt-2 leading-relaxed">{description}</p>
    </div>
  );
}

export default function Home() {
  const { favorites } = useFavorites();

  return (
    <div className="animate-[fadeIn_0.5s_ease-out]">
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-velvet via-indigo-velvet to-medium-slate-blue px-6 py-20 md:py-28">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.2fr_0.8fr] gap-12 items-center">
          <div>
            <p className="text-amber-flame font-bold uppercase tracking-[0.2em] text-sm">University discovery, simplified</p>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white mt-4">Find universities. Build your shortlist. <span className="text-amber-flame">Choose with confidence.</span></h1>
            <p className="text-white/75 text-lg max-w-2xl mt-6 leading-relaxed">Search universities worldwide, save the ones that matter, compare your shortlist, and keep simple application notes in one place.</p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link to="/search" className="btn btn-lg bg-amber-flame text-indigo-velvet border-amber-flame hover:bg-white hover:border-white">Explore universities</Link>
              <Link to="/favorites" className="btn btn-lg btn-outline border-white/40 text-white hover:bg-white hover:text-indigo-velvet">My shortlist {favorites.length > 0 && `(${favorites.length})`}</Link>
            </div>
          </div>
          <div className="hidden lg:block rounded-3xl bg-white/10 border border-white/15 p-6 backdrop-blur-sm">
            <div className="text-white/60 text-sm">A simple workflow</div>
            <div className="space-y-5 mt-5">
              {[["01", "Search", "Start with a country and discover universities."], ["02", "Shortlist", "Save promising options and track their status."], ["03", "Compare", "Put up to four saved universities side by side."]].map(([n, title, text]) => (
                <div key={n} className="flex gap-4 items-start">
                  <span className="w-9 h-9 shrink-0 rounded-full bg-amber-flame text-indigo-velvet grid place-items-center font-bold">{n}</span>
                  <div><h3 className="text-white font-bold">{title}</h3><p className="text-white/60 text-sm mt-1">{text}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-sm font-semibold uppercase tracking-wider text-tiger-orange">Built around decisions</p>
          <h2 className="text-3xl font-bold text-indigo-velvet dark:text-white mt-2">More than a search box</h2>
          <p className="text-medium-slate-blue mt-3">The experience now follows the way students actually research universities: discover → shortlist → compare.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard icon="🌍" title="Global discovery" description="Search the university dataset by country, then filter and sort the results to narrow the list quickly." />
          <FeatureCard icon="📌" title="Shortlist tracker" description="Save universities, add a private note, and move each option from Researching to Shortlisted, Applying or Applied." />
          <FeatureCard icon="⚖️" title="Side-by-side compare" description="Select up to four saved universities and compare the information available from the current data source." />
        </div>
      </section>

      <section className="bg-base-200/60 border-y border-medium-slate-blue/10 px-4 py-14">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-medium-slate-blue">Ready to start?</p>
          <h2 className="text-3xl font-bold text-indigo-velvet dark:text-white mt-2">Build your shortlist in a few minutes.</h2>
          <Link to="/search" className="btn mt-6 bg-medium-slate-blue text-white border-medium-slate-blue hover:bg-amber-flame">Start searching</Link>
        </div>
      </section>

      <footer className="p-10 bg-indigo-velvet text-center text-white/60">
        <p className="font-bold text-lg text-amber-flame">UniSearch</p>
        <p className="text-sm mt-2">A focused university discovery and shortlist workspace.</p>
        <p className="text-xs text-white/40 mt-4">Data provided by the Hipolabs Universities API.</p>
      </footer>
    </div>
  );
}
