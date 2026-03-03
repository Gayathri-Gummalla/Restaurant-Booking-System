'use client';
import { useState } from 'react';
import { X, Calendar, MapPin, Award, Heart } from 'lucide-react';

export default function AboutSection() {
    const [showFullStory, setShowFullStory] = useState(false);

    const storyChapters = [
        {
            year: "1999",
            title: "The Seeds of Passion",
            content: "Our journey began in a small corner of Hyderabad, where our founder, inspired by his grandmother's secret spice blends, decided to share the authentic 'Pachadi' and 'Vindhu' experience with the world.",
            image: "https://images.unsplash.com/photo-1615485500704-8e990f3900f7?q=80&w=800"
        },
        {
            year: "2010",
            title: "Mastering the Craft",
            content: "After a decade of refining recipes and sourcing the finest chillies from Guntur and rice from the Godavari belt, Spice Garden became a local landmark for anyone seeking 'Brahmin-style' purity and royal 'Nawabi' richness.",
            image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800"
        },
        {
            year: "2024",
            title: "An Imperial Legacy",
            content: "Today, we stand as a testament to the fact that tradition never goes out of style. With our flagship Jubilee Hills location, we continue to serve royalty in every plate, ensuring every guest feels like a Nizam.",
            image: "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?auto=format&fit=crop&q=80&w=800"
        }
    ];

    return (
        <section id="about" className="py-24 px-6 md:px-16 bg-[#fafafa] relative">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                {/* Text Content */}
                <div className="space-y-8 animate-in slide-in-from-left duration-1000">
                    <div className="space-y-4">
                        <span className="text-gold font-bold tracking-[0.4em] uppercase text-xs">Our Heritage</span>
                        <h2 className="font-serif text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                            Preserving the Art <br />of Andhra Dining
                        </h2>
                        <div className="w-20 h-1.5 bg-gold rounded-full" />
                    </div>

                    <p className="text-gray-600 text-lg leading-relaxed font-light italic border-l-4 border-gold/20 pl-6">
                        "Flavor is not just an ingredient; it is a memory passed down through generations."
                    </p>

                    <p className="text-gray-600 text-lg leading-relaxed font-light">
                        Founded on the silver shores of heritage, Spice Garden is more than a restaurant; it's a culinary sanctuary. We bring you the authentic flavors of Andhra, preserved through generations and served with royal hospitality.
                    </p>

                    <div className="pt-6">
                        <button
                            onClick={() => setShowFullStory(true)}
                            className="group relative px-10 py-4 bg-black text-white rounded-full font-bold text-xs uppercase tracking-widest hover:bg-gold hover:text-black transition-all duration-500 overflow-hidden shadow-xl"
                        >
                            <span className="relative z-10 transition-colors duration-500">Read Full Story</span>
                            <div className="absolute inset-0 bg-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                        </button>
                    </div>
                </div>

                {/* Image Composition */}
                <div className="relative group animate-in slide-in-from-right duration-1000">
                    <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl relative">
                        <img
                            src="https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1000"
                            alt="Our Signature Ambiance"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>

                    {/* Badge */}
                    <div className="absolute -bottom-8 -left-8 bg-white p-8 rounded-[2.5rem] shadow-2xl border border-gray-50 flex flex-col items-center">
                        <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mb-3">
                            <Award className="text-gold" size={24} />
                        </div>
                        <span className="block text-4xl font-serif font-bold text-gray-900 leading-none">25+</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gold mt-2">Years Legacy</span>
                    </div>

                    {/* Floating Accent */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-gold/5 rounded-full blur-3xl -z-10" />
                </div>
            </div>

            {/* FULL STORY MODAL */}
            {showFullStory && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setShowFullStory(false)} />

                    <div className="relative bg-white w-full max-w-6xl max-h-[90vh] rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in zoom-in duration-500">
                        {/* Close Button */}
                        <button
                            onClick={() => setShowFullStory(false)}
                            className="absolute top-6 right-6 z-50 p-3 bg-gray-100 hover:bg-gold text-gray-900 rounded-full transition-colors"
                        >
                            <X size={24} />
                        </button>

                        {/* Modal Content - Left (Scrollable Story) */}
                        <div className="flex-1 overflow-y-auto p-10 md:p-20 scrollbar-hide">
                            <div className="space-y-16">
                                <div className="space-y-4">
                                    <span className="text-gold font-bold tracking-[0.6em] uppercase text-[10px]">The Deep Story</span>
                                    <h2 className="font-serif text-5xl md:text-7xl font-bold text-gray-900 leading-tight">
                                        Roots of the <br />Spice Garden
                                    </h2>
                                </div>

                                <div className="space-y-24">
                                    {storyChapters.map((chapter, idx) => (
                                        <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
                                            <div className="md:col-span-4 aspect-square rounded-[2rem] overflow-hidden shadow-lg">
                                                <img src={chapter.image} alt={chapter.title} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="md:col-span-8 space-y-4">
                                                <div className="flex items-center gap-4">
                                                    <span className="text-3xl font-serif italic text-gold">{chapter.year}</span>
                                                    <div className="h-px w-10 bg-gold/30" />
                                                    <h4 className="text-xl font-bold text-gray-900">{chapter.title}</h4>
                                                </div>
                                                <p className="text-gray-600 text-lg leading-relaxed font-light">
                                                    {chapter.content}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-10 border-t border-gray-100 flex flex-col items-center text-center space-y-6">
                                    <Heart className="text-gold" fill="currentColor" size={40} />
                                    <p className="text-gray-500 italic max-w-xl">
                                        Today, we continue to hand-grind our masalas every morning, ensuring that the aroma you smell is exactly the same as it was in 1999.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Modal Content - Right (Static Image) */}
                        <div className="hidden lg:block w-1/3 relative">
                            <img
                                src="https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&q=80&w=1000"
                                className="w-full h-full object-cover"
                                alt="Signature Andhra Cuisine"
                            />
                            <div className="absolute inset-0 bg-black/20" />
                            <div className="absolute bottom-10 left-10 right-10 text-white space-y-2">
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-70">Signature Quality</p>
                                <p className="font-serif text-2xl font-bold leading-tight">Every Plate is a <br />Work of Art</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
