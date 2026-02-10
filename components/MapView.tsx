
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Icons } from '../constants';

const MapView: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string>('');
  const [links, setLinks] = useState<{title: string, uri: string}[]>([]);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [embedUrl, setEmbedUrl] = useState<string>('');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setLocation({ lat, lng });
          setEmbedUrl(`https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`);
        },
        (err) => {
          console.warn("Geolocation failed", err);
          setEmbedUrl(`https://maps.google.com/maps?q=nature+parks&z=10&output=embed`);
        }
      );
    } else {
      setEmbedUrl(`https://maps.google.com/maps?q=nature+parks&z=10&output=embed`);
    }
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResponse('');
    setLinks([]);
    // Update map immediately to a general search view
    setEmbedUrl(`https://maps.google.com/maps?q=${encodeURIComponent(query)}&output=embed`);

    try {
      // Corrected initialization to use process.env.API_KEY directly
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const genAIResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: query,
        config: {
          tools: [{ googleMaps: {} }],
          toolConfig: {
            retrievalConfig: {
              latLng: location ? { latitude: location.lat, longitude: location.lng } : undefined
            }
          }
        },
      });

      // Use .text property directly
      setResponse(genAIResponse.text || "No insights found for this area.");
      
      const chunks = genAIResponse.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const extractedLinks: {title: string, uri: string}[] = [];
      
      chunks.forEach((chunk: any) => {
        if (chunk.maps) {
          extractedLinks.push({
            title: chunk.maps.title || "View on Maps",
            uri: chunk.maps.uri
          });
        }
      });
      setLinks(extractedLinks);
    } catch (error) {
      console.error("Maps search failed", error);
      setResponse("Sorry, I couldn't complete your request. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const selectPlace = (uri: string) => {
    // Extract query or CID from maps URI for embedding if possible, 
    // or just use the URI if it supports embedding. 
    // Most standard maps links can be converted to embed by adding output=embed
    const url = new URL(uri);
    url.searchParams.set('output', 'embed');
    setEmbedUrl(url.toString());
    
    // Scroll map into view for mobile users
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="p-6 space-y-6 animate-fadeIn bg-white min-h-full">
      <header>
        <h1 className="text-3xl font-bold font-outfit text-green-950">Find a Place</h1>
      </header>

      {/* Embedded Map Container */}
      <div className="w-full h-64 bg-slate-100 rounded-3xl overflow-hidden shadow-inner border border-green-50 relative">
        {embedUrl ? (
          <iframe
            title="Embedded Google Map"
            width="100%"
            height="100%"
            frameBorder="0"
            style={{ border: 0 }}
            src={embedUrl}
            allowFullScreen
          ></iframe>
        ) : (
          <div className="flex items-center justify-center h-full text-green-800/20">
            {/* Icons.Map now exists in constants.tsx */}
            <Icons.Map />
          </div>
        )}
      </div>

      <form onSubmit={handleSearch} className="relative">
        <input 
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Where should we go today?"
          className="w-full bg-slate-50 border border-green-100 rounded-3xl pl-5 pr-14 py-4 text-sm outline-none focus:ring-2 focus:ring-green-700/20 transition-all shadow-sm text-green-950"
        />
        <button 
          type="submit"
          className="absolute right-2 top-2 bg-green-800 text-white p-2.5 rounded-2xl shadow-md active:scale-90 transition-all disabled:opacity-50"
          disabled={loading}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <Icons.Map />
          )}
        </button>
      </form>

      <div className="space-y-6">
        {response && (
          <div className="bg-green-50/50 rounded-3xl p-6 border border-green-100 shadow-sm animate-slideUp">
            <div className="prose prose-sm text-green-950 leading-relaxed font-medium whitespace-pre-wrap">
              {response}
            </div>
          </div>
        )}

        {links.length > 0 && (
          <div className="space-y-3 pb-8">
            <h3 className="text-xs font-bold text-green-700/50 uppercase tracking-widest ml-1">Locations Found</h3>
            <div className="grid gap-3">
              {links.map((link, idx) => (
                <button 
                  key={idx}
                  onClick={() => selectPlace(link.uri)}
                  className="flex items-center justify-between bg-white p-4 rounded-2xl border border-green-50 shadow-sm hover:border-green-300 hover:shadow-md transition-all active:scale-98 text-left w-full"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center text-green-700">
                      <Icons.Map />
                    </div>
                    <span className="text-sm font-bold text-green-950 truncate max-w-[200px]">{link.title}</span>
                  </div>
                  <div className="text-green-800/40">
                    <Icons.ChevronRight />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {!response && !loading && links.length === 0 && (
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-4 opacity-30">
            <div className="space-y-1">
              <p className="text-sm font-bold font-outfit">Explore your surroundings</p>
              <p className="text-[10px] font-medium max-w-[200px]">Find the best cafes, parks, or meditation spots near you.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapView;
