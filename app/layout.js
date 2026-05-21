export const metadata = {
  title: 'Tomato Disease Scanner',
  description: 'AI-powered tomato plant disease detection for Indian farmers',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: '#0a0f0a' }}>{children}</body>
    </html>
  );
}
