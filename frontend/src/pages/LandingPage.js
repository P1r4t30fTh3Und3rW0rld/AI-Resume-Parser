import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// --- Hero Section ---
function HeroSection({ onTryNow }) {
  return (
    <section className="w-full flex flex-col items-center justify-center gap-8 py-16">
      <div className="flex flex-col items-center justify-center w-full mt-12">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white text-center mb-4 drop-shadow-lg">
          <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Effortless AI Resume Parsing
          </span>
        </h1>
        <p className="text-lg text-gray-300 mb-6 text-center max-w-xl">
          Instantly extract key information, links, and insights from your resume using advanced AI. Perfect for job seekers and recruiters to save time and discover more opportunities.
        </p>
        <button
          className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold text-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition mb-4 hover:brightness-110"
          onClick={onTryNow}
        >
          Try It Now
        </button>
        <div className="mt-2 text-sm text-gray-400">No signup required for demo</div>
      </div>
    </section>
  );
}

// --- Trusted Logos Section ---
function TrustedLogosSection() {
  // Use reliable SVG/CDN links for logos
  const logos = [
    { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg', alt: 'Google' },
    { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/microsoft/microsoft-original.svg', alt: 'Microsoft' },
    { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', alt: 'GitHub' },
    { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg', alt: 'LinkedIn' },
    { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg', alt: 'AWS' },
    { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/facebook/facebook-original.svg', alt: 'Facebook' },
    { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/twitter/twitter-original.svg', alt: 'Twitter' },
    { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/leetcode/leetcode-original.svg', alt: 'LeetCode' },
    { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/stackoverflow/stackoverflow-original.svg', alt: 'Stack Overflow' },
    { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/slack/slack-original.svg', alt: 'Slack' },
    { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/netflix/netflix-original.svg', alt: 'Netflix' },
    { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg', alt: 'Apple' },
    { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spotify/spotify-original.svg', alt: 'Spotify' },
    { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/youtube/youtube-original.svg', alt: 'YouTube' },
  ];
  return (
    <section className="w-full py-8 flex flex-col items-center">
      <div className="text-gray-400 mb-4 text-sm tracking-wide">Trusted by learners from</div>
      <motion.div
        className="flex gap-10 overflow-x-auto w-full max-w-2xl px-4 py-2"
        initial={{ x: 0 }}
        animate={{ x: [0, -120, 0] }}
        transition={{ repeat: Infinity, duration: 12, ease: 'linear' }}
        style={{ scrollbarWidth: 'none' }}
      >
        {logos.concat(logos).map((logo, i) => (
          <img
            key={i}
            src={logo.src}
            alt={logo.alt}
            className="h-10 w-auto opacity-80 hover:opacity-100 transition"
            draggable={false}
            style={{ minWidth: 60 }}
            onError={e => { e.target.onerror = null; e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg'; }}
          />
        ))}
      </motion.div>
    </section>
  );
}

// --- How It Works Section ---
function HowItWorksSection() {
  const steps = [
    { icon: '📄', title: 'Upload Resume', desc: 'Upload your .pdf or .docx file.' },
    { icon: '🤖', title: 'AI Analyzes', desc: 'AI extracts key data and links.' },
    { icon: '💡', title: 'Get Insights', desc: 'See suggestions, score, and advice.' },
    { icon: '⬇️', title: 'Download', desc: 'Export your improved resume.' },
  ];
  return (
    <section className="w-full py-12 flex flex-col items-center">
      <h2 className="text-2xl font-bold text-white mb-8">How It Works</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 w-full max-w-5xl">
        {steps.map((step, i) => (
          <div key={i} className="glass bg-black/40 border border-white/10 rounded-xl p-6 flex flex-col items-center text-center">
            <div className="text-4xl mb-3">{step.icon}</div>
            <div className="font-semibold text-white mb-1">{step.title}</div>
            <div className="text-gray-300 text-sm">{step.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// --- Features Section ---
function FeaturesSection() {
  const features = [
    { icon: '🔍', title: 'Resume Parser', desc: 'Extracts key data from your resume.' },
    { icon: '💡', title: 'Smart Suggestions', desc: 'AI suggests edits for improvement.' },
    { icon: '🎯', title: 'Resume Score', desc: 'Get an ATS-friendly score.' },
    { icon: '📝', title: 'Cover Letter Generator', desc: 'Auto-generate cover letters.' },
  ];
  return (
    <section className="w-full py-12 flex flex-col items-center">
      <h2 className="text-2xl font-bold text-white mb-8">Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 w-full max-w-5xl">
        {features.map((feature, i) => (
          <div key={i} className="glass bg-black/40 border border-white/10 rounded-xl p-6 flex flex-col items-center text-center">
            <div className="text-4xl mb-3">{feature.icon}</div>
            <div className="font-semibold text-white mb-1">{feature.title}</div>
            <div className="text-gray-300 text-sm">{feature.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// --- Testimonials Section ---
function TestimonialsSection() {
  const testimonials = [
    { quote: 'Helped me tailor my resume in 3 minutes!', name: 'Jane Doe' },
    { quote: 'The best AI resume tool I’ve tried.', name: 'John Smith' },
    { quote: 'Got 3x more interview calls after using the suggestions!', name: 'A. Candidate' },
  ];
  return (
    <section className="w-full py-12 flex flex-col items-center">
      <h2 className="text-2xl font-bold text-white mb-8">What Users Say</h2>
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl justify-center">
        {testimonials.map((t, i) => (
          <div key={i} className="glass bg-black/40 border border-white/10 rounded-xl p-6 flex flex-col items-center text-center max-w-xs">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center mb-3">
              <span className="text-white text-xl font-bold">{t.name[0]}</span>
            </div>
            <div className="text-gray-200 italic mb-2">“{t.quote}”</div>
            <div className="text-gray-400 text-xs">{t.name}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// --- FAQ Section ---
function FAQSection() {
  const faqs = [
    { q: 'Is my data secure?', a: 'Yes, your data is encrypted and never shared.' },
    { q: 'Can I use it without signing up?', a: 'Yes, you can try the demo without an account.' },
    { q: 'What formats are supported?', a: 'PDF and DOCX resumes are supported.' },
    { q: 'Can I download the result?', a: 'Yes, you can download your parsed data as JSON.' },
  ];
  const [open, setOpen] = React.useState(null);
  return (
    <section className="w-full py-12 flex flex-col items-center">
      <h2 className="text-2xl font-bold text-white mb-8">FAQ</h2>
      <div className="w-full max-w-2xl">
        {faqs.map((faq, i) => (
          <div key={i} className="mb-4">
            <button
              className="w-full text-left px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white font-semibold focus:outline-none"
              onClick={() => setOpen(open === i ? null : i)}
            >
              {faq.q}
            </button>
            {open === i && (
              <div className="px-4 py-2 bg-black/60 border-l-4 border-blue-600 text-gray-200 rounded-b-lg">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// --- Footer Section ---
function FooterSection() {
  return (
    <footer className="w-full py-8 mt-12 bg-black/60 glass border-t border-white/10 flex flex-col items-center">
      <div className="flex gap-6 mb-2">
        <a href="https://github.com/P1r4t30fTh3Und3rW0rld/AI-Resume-Parser" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">GitHub</a>
        <a href="https://x.com/priyanshuch_" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">X.com</a>
        <a href="mailto:anotheravguser@gmail.com" className="text-gray-300 hover:text-white">Contact Me</a>
        <a href="#privacy" className="text-gray-300 hover:text-white">Privacy Policy</a>
      </div>
      <div className="flex gap-4 mt-2">
        <a href="https://github.com/P1r4t30fTh3Und3rW0rld/AI-Resume-Parser" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.338 4.695-4.566 4.944.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.744 0 .267.18.577.688.48C19.138 20.2 22 16.448 22 12.021 22 6.484 17.523 2 12 2z" /></svg>
        </a>
        <a href="https://x.com/priyanshuch_" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.53 6.477L9.06 21.5h2.13l8.47-15.023h-2.13zm-2.47 0L6.06 21.5h2.13l8.47-15.023h-2.13z"/></svg>
        </a>
        <a href="mailto:anotheravguser@gmail.com" className="text-gray-400 hover:text-white">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 2v.01L12 13 4 6.01V6h16zM4 20V8.99l8 6.99 8-6.99V20H4z"/></svg>
        </a>
      </div>
      <div className="text-gray-500 text-xs mt-4">&copy; {new Date().getFullYear()} AI Resume Parser. All rights reserved.</div>
    </footer>
  );
}

// --- Main Landing Page ---
function LandingPage() {
  const navigate = useNavigate();

  // Handler for Try It Now button (always go to login page)
  const handleTryNow = () => {
    navigate('/login');
  };

  return (
    <div className="cribble-bg min-h-screen flex flex-col items-center justify-center px-4 relative">
      <HeroSection onTryNow={handleTryNow} />
      <TrustedLogosSection />
      <HowItWorksSection />
      <FeaturesSection />
      <TestimonialsSection />
      <FAQSection />
      <FooterSection />
    </div>
  );
}

export default LandingPage; 