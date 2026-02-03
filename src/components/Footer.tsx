
"use client";

import Image from "next/image";
import Link from "next/link";
import { FaGithub, FaFacebookF, FaInstagram, FaMapMarkerAlt, FaEnvelope, FaPhoneAlt } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full bg-gray-50 pt-12 border-t border-gray-100 text-gray-700 font-sans">
      
      
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 pb-12 text-left">
        
        
        <div className="flex flex-col space-y-4">
          <div className="w-32">
             <Image src="/logoMambee2.png" alt="Mambee Logo" width={150} height={50} />
          </div>
          
          <div className="flex space-x-4 mt-2">
            <a href="https://github.com/mambee-ifpi-picos/mambee-space#" target="_blank" className="text-gray-600 hover:text-black text-2xl transition-colors"><FaGithub /></a>
            <a href="https://facebook.com" target="_blank" className="text-gray-600 hover:text-blue-600 text-2xl transition-colors"><FaFacebookF /></a>
            <a href="https://www.instagram.com/mambeeifpi/" target="_blank" className="text-gray-600 hover:text-pink-600 text-2xl transition-colors"><FaInstagram /></a>
          </div>
        </div>

       
        <div>
          <h3 className="text-lg font-bold text-black mb-6">Termos</h3>
          <ul className="space-y-4 text-sm md:text-base">
            <li><Link href="/privacidade" className="hover:text-pink-500 transition-colors">Privacidade</Link></li>
            <li><Link href="/" className="hover:text-pink-500 transition-colors">Home</Link></li>
            <li><Link href="/#sobre" className="hover:text-pink-500 transition-colors">About</Link></li>
          </ul>
        </div>

        
        <div>
          <h3 className="text-lg font-bold text-black mb-6">Contatos</h3>
          <ul className="space-y-4 text-sm md:text-base">
            
            
            <li className="flex items-start gap-3">
              <FaMapMarkerAlt className="mt-1 text-gray-600 shrink-0" />
              <span>
                Parque Industrial, Picos - PI,<br />
                64600-000
              </span>
            </li>

            
            <li className="flex items-center gap-3">
              <FaEnvelope className="text-gray-600 shrink-0" />
              <a href="mailto:mambee@gmail.com" className="hover:text-pink-500 break-all">
                mambee@gmail.com
              </a>
            </li>

            
            <li className="flex items-center gap-3">
              <FaPhoneAlt className="text-gray-600 shrink-0" />
              <span>(89) 9999-9999</span>
            </li>

          </ul>
        </div>

      </div>

      
      <div className="w-full bg-pink-200 py-4 text-center border-t border-pink-300">
        <p className="text-gray-700 text-xs md:text-sm font-medium">
          © 2025 Mambee Space
        </p>
      </div>
    </footer>
  );
}