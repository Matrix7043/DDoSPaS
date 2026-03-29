/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            colors: {
                primary: {
                    50: '#f0f0ff',
                    100: '#e0e0ff',
                    400: '#818cf8',
                    500: '#6366f1',
                    600: '#4f46e5',
                    700: '#4338ca',
                },
                surface: {
                    900: '#0d0d1a',
                    800: '#13132b',
                    700: '#1a1a38',
                    600: '#2a2a50',
                },
                accent: '#22d3ee',
            },
        },
    },
    plugins: [],
}
