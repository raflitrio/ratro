import { Github, Linkedin, Instagram } from 'lucide-react';
import { useEffect } from 'react';

// Import gambar agar bundler (Vite/webpack) bisa resolve path-nya (opsional tapi disarankan)
import photo from './assets/profile2.jpg'; // sesuaikan path relatif ke lokasi file tsx ini

const App: React.FC = () => {
  // Protect images from being downloaded
  useEffect(() => {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      // Prevent right-click context menu
      img.addEventListener('contextmenu', (e) => e.preventDefault());
      // Prevent drag
      img.addEventListener('dragstart', (e) => e.preventDefault());
    });
  }, []);
  const PortoLink = 'https://raflitriofansyah.vercel.app';
  const whatsappNumber = "6285728961516";
  const whatsappLinkBuat = `https://wa.me/${whatsappNumber}?text=Halo%20Rafli%2C%20saya%20mau%20buat%20web%2Fapp`;
  const buyLink = "https://lynk.id/ratro";
  const penilaianLink = "https://docs.google.com/forms/d/e/1FAIpQLSeymgjupzRKxAlRWARgq4LY5MSg9YsCbtVtkZMfPVKQcUBJyg/viewform?usp=publish-editor";

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-5 relative"
      style={{
        fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, sans-serif",
        background: "linear-gradient(145deg, #f0f4f8 0%, #e2e8f0 100%)",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap"
        rel="stylesheet"
      />

      {/* Subtle Grid Background */}
      <div
        className="absolute inset-0 opacity-7"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          zIndex: 0,
        }}
      ></div>

      <div className="w-full max-w-xs text-center relative z-10">
        {/* Foto */}
        <div className="mx-auto mb-5 w-24 h-24 rounded-2xl overflow-hidden shadow-md border-2 border-white bg-white">
          <img
            src={photo}
            alt="Rafli Triofansyah"
            className="w-full h-full object-cover"
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
          />
        </div>

        {/* Nama & Profesi */}
        <h1 className="text-xl font-semibold text-gray-800">RAFLI TRIOFANSYAH</h1>
        <p className="text-gray-600 text-sm mb-7">Fullstack Developer</p>

        {/* 3 Tombol */}
        <div className="space-y-3 mb-8">
          <a
            href={PortoLink}
            className="block w-full bg-[#4CAF8E] hover:bg-[#3E9B7A] text-white py-4 px-5 rounded-xl font-medium text-base shadow-sm hover:shadow transition-all duration-200 flex items-center justify-center"
          >
            Portofolio
          </a>
          
          <a
            href={whatsappLinkBuat}
            className="block w-full bg-[#4a6fa5] hover:bg-[#3d5a80] text-white py-4 px-5 rounded-xl font-medium text-base shadow-sm hover:shadow transition-all duration-200 flex items-center justify-center"
          >
            Buat Web/App
          </a>

          <a
            href={buyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-[#8678a5] hover:bg-[#6d5f8c] text-white py-4 px-5 rounded-xl font-medium text-base shadow-sm hover:shadow transition-all duration-200 flex items-center justify-center"
          >
            Beli Web/App
          </a>

          <a
            href={penilaianLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-[#f4a261] hover:bg-[#e76f51] text-white py-4 px-5 rounded-xl font-medium text-base shadow-sm hover:shadow transition-all duration-200 flex items-center justify-center"
          >
            Berikan Penilaian
          </a>
        </div>

        {/* Sosial Media */}
        <div className="flex justify-center gap-4">
          <a
            href="https://github.com/raflitrio"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-[#313647] hover:text-white transition-colors"
            aria-label="GitHub"
          >
            <Github className="w-4 h-4" />
          </a>
          <a
            href="https://www.linkedin.com/in/rafli-triofansyah-359031322/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-[#0a66c2] hover:text-white transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-4 h-4" />
          </a>
          <a
            href="https://www.instagram.com/raflitriii_/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-[#e1306c] hover:text-white transition-colors"
            aria-label="Instagram"
          >
            <Instagram className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default App;
