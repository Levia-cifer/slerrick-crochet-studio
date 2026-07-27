/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Slerrick Crochet Studio palette — elegant rose-gold on warm ivory
        cream: '#FDF8F4',       // page background
        plum: '#2E2119',        // primary text (warm espresso, not pure black)
        berry: '#B4714F',       // primary accent — rose-gold/copper
        'berry-dark': '#8F5738',
        sage: '#C98A93',        // secondary accent — dusty rose
        butter: '#CBA35C',      // pop accent — soft gold, used sparingly
        blush: '#F5E9DE',       // soft card / section backgrounds
        espresso: '#1C1512',    // near-black for the dramatic hero section
      },
      fontFamily: {
        display: ['var(--font-fraunces)', 'serif'],
        body: ['var(--font-jakarta)', 'sans-serif'],
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      boxShadow: {
        soft: '0 8px 30px -10px rgba(61, 43, 46, 0.15)',
      },
    },
  },
  plugins: [],
};
