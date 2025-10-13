import React from 'react';
import { MailIcon } from './icons/MailIcon';
import { PhoneIcon } from './icons/PhoneIcon';

const ContactPage: React.FC = () => {
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Thank you for your message! We will get back to you shortly.');
        (e.target as HTMLFormElement).reset();
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark">Get in Touch</h2>
                <p className="mt-4 text-lg text-gray-600">We'd love to hear from you. Please fill out the form below or contact us directly.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="bg-white p-8 rounded-lg shadow-md">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input type="text" id="name" required className="mt-1 input-field" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                            <input type="email" id="email" required className="mt-1 input-field" />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                            <textarea id="message" rows={5} required className="mt-1 input-field" />
                        </div>
                        <button type="submit" className="w-full bg-brand-dark text-white font-bold py-3 rounded-full shadow-lg hover:bg-opacity-90 transform hover:scale-105 transition-all duration-300">
                            Send Message
                        </button>
                    </form>
                </div>
                <div className="space-y-8">
                    <div className="flex items-start gap-4">
                        <div className="bg-brand-secondary/50 p-3 rounded-full">
                            <MailIcon className="h-6 w-6 text-brand-primary" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-brand-dark">Email Us</h3>
                            <p className="text-gray-600">Our team is here to help.</p>
                            <a href="mailto:ssunilrathi88@gmail.com" className="text-brand-primary font-bold hover:underline">ssunilrathi88@gmail.com</a>
                        </div>
                    </div>
                     <div className="flex items-start gap-4">
                        <div className="bg-brand-secondary/50 p-3 rounded-full">
                            <PhoneIcon className="h-6 w-6 text-brand-primary" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-brand-dark">Call Us</h3>
                            <p className="text-gray-600">Mon-Fri from 9am to 5pm.</p>
                            <a href="tel:+918890006364" className="text-brand-primary font-bold hover:underline">+91 889 000 6364</a>
                        </div>
                    </div>
                </div>
            </div>
             <style>{`
              .input-field {
                display: block; width: 100%; padding: 0.5rem 0.75rem; border: 1px solid #D1D5DB; border-radius: 0.375rem;
              }
              .input-field:focus {
                outline: none; --tw-ring-color: #FFB7C1; box-shadow: 0 0 0 2px var(--tw-ring-color); border-color: #FFB7C1;
              }
            `}</style>
        </div>
    );
};

export default ContactPage;
