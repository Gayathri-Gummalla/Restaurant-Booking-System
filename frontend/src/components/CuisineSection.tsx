'use client';
import { Utensils } from 'lucide-react';

const cuisines = [
    {
        id: "andhra-traditional-meals",
        name: "Andhra Traditional Meals",
        description: "Authentic spices, slow-cooked curries, and rich heritage flavors served on banana leaves.",
        image: "/images/andhra-meals.png"
    },
    {
        id: "south-indian-delicacies",
        name: "South Indian Delicacies",
        description: "Crispy dosas, fluffy idlis, and aromatic sambar crafted with traditional recipes.",
        image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=1000"
    },
    {
        id: "tandoori-grilled-specials",
        name: "Tandoori & Grilled Specials",
        description: "Succulent meats and vegetables marinated in secret spices and charred to perfection.",
        image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=1000"
    },
    {
        id: "mughlai-classics",
        name: "Mughlai Classics",
        description: "Fragrant biryanis and rich gravies inspired by the royal kitchens of the Nawabs.",
        image: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?q=80&w=1000"
    },
    {
        id: "indo-chinese-fusion",
        name: "Indo-Chinese Fusion",
        description: "A bold blend of traditional Indian spices with vibrant Chinese cooking techniques.",
        image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: "desserts-beverages",
        name: "Desserts & Beverages",
        description: "Experience pure bliss with our artisanal ice creams and refreshing traditional drinks.",
        image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&q=80&w=800"
    }
];

import Link from 'next/link';

export default function CuisineSection() {
    return (
        <section id="cuisines" className="py-24 px-6 md:px-16 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col items-center mb-16 space-y-4">
                    <div className="flex items-center gap-2 text-gold">
                        <Utensils size={24} />
                        <span className="text-[11px] font-black uppercase tracking-[0.4em]">Our Menu</span>
                    </div>
                    <h2 className="font-serif text-4xl md:text-6xl font-bold text-gray-900 text-center">
                        🍴 Our Signature Cuisines
                    </h2>
                    <div className="w-24 h-1 bg-gold/30 rounded-full" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {cuisines.map((cuisine, index) => (
                        <Link
                            key={index}
                            id={cuisine.id}
                            href={`/menu/${cuisine.id}`}
                            className="group relative bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 block"
                        >
                            <div className="aspect-[4/3] overflow-hidden">
                                <img
                                    src={cuisine.image}
                                    alt={cuisine.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                            </div>
                            <div className="p-8 space-y-4">
                                <h3 className="font-serif text-2xl font-bold text-gray-900 group-hover:text-gold transition-colors">
                                    {cuisine.name}
                                </h3>
                                <p className="text-gray-600 leading-relaxed font-light">
                                    {cuisine.description}
                                </p>
                                <div className="pt-2 flex items-center gap-2 text-gold font-bold text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span>Explore Menu</span>
                                    <div className="w-8 h-px bg-gold" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
