import React, { useRef, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import { QRCodeCanvas } from 'qrcode.react';

const ConfirmationPage = () => {
    const location = useLocation();
    const ticketRef = useRef(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const ticket = location.state?.ticket;

    if (!ticket) {
        return (
            <div className="min-h-screen bg-[#121212] flex items-center justify-center flex-col gap-4">
                <h1 className="text-white text-2xl font-bold">No booking found</h1>
                <Link to="/" className="text-cinema-red hover:underline">Return to Home</Link>
            </div>
        );
    }

    const handleDownloadPDF = async () => {
        if (isDownloading) return;
        setIsDownloading(true);
        try {
            const element = ticketRef.current;
            // Wait a moment for rendering (rare race conditions)
            await new Promise(resolve => setTimeout(resolve, 500));

            const dataUrl = await toPng(element, { cacheBust: true });

            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgProperties = pdf.getImageProperties(dataUrl);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

            pdf.addImage(dataUrl, 'PNG', 0, 10, pdfWidth, pdfHeight);
            pdf.save(`Cineplexx_Ticket_${ticket.seat}.pdf`);
        } catch (error) {
            console.error("Download failed:", error);
            alert(`Failed to generate PDF: ${error.message}`);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#121212] pt-28 pb-12 px-6 flex flex-col items-center">

            <div className="text-center mb-12">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
                    <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Booking Confirmed!</h1>
                <p className="text-gray-400">See you at the movies, {ticket.customerName.split(' ')[0]}</p>
            </div>

            {/* TICKET CARD START */}
            <div className="relative group perspective-1000 mb-12">
                <div ref={ticketRef} className="w-[350px] md:w-[700px] h-auto md:h-[350px] rounded-3xl overflow-hidden flex flex-col md:flex-row relative z-10" style={{ backgroundColor: '#ffffff', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', fontFamily: 'sans-serif' }}>

                    {/* LEFT: Poster Area */}
                    <div className="w-full md:w-[250px] h-[300px] md:h-full relative overflow-hidden shrink-0" style={{ backgroundColor: '#000000' }}>
                        <img src={ticket.posterUrl} className="w-full h-full object-cover" style={{ opacity: 0.9 }} />
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }} />
                        <div className="absolute bottom-6 left-6 right-6">
                            <h3 style={{ color: '#ffffff', textShadow: '0 4px 6px rgba(0,0,0,0.5)', fontWeight: 'bold', fontSize: '1.5rem', lineHeight: '1', margin: 0 }}>{ticket.movieTitle}</h3>
                        </div>
                    </div>

                    {/* RIGHT: DETAILS */}
                    <div className="flex-1 p-6 flex flex-col relative justify-between" style={{ backgroundColor: '#ffffff' }}>

                        {/* Cut Line & Circles */}
                        <div className="absolute -top-3 left-[244px] w-6 h-6 rounded-full hidden md:block z-20" style={{ backgroundColor: '#121212' }}></div>
                        <div className="absolute -bottom-3 left-[244px] w-6 h-6 rounded-full hidden md:block z-20" style={{ backgroundColor: '#121212' }}></div>
                        <div className="absolute top-0 bottom-0 left-[255px] hidden md:block z-10" style={{ borderLeft: '2px dashed #d1d5db', width: '1px' }}></div>


                        {/* Header */}
                        <div style={{ borderBottom: '1px solid #f3f4f6', paddingBottom: '0.75rem', marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <h2 style={{ color: '#000000', fontWeight: '900', fontSize: '1.125rem', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Cineplexx TEG</h2>
                                <p style={{ color: '#9ca3af', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.125rem', margin: 0 }}>Admit One • Hall {ticket.hall}</p>
                            </div>
                            <img src="/logo.png" className="h-5" style={{ opacity: 0.2, filter: 'brightness(0)' }} />
                        </div>

                        {/* Info Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                            {/* Date & Time */}
                            <div style={{ display: 'flex', gap: '2rem' }}>
                                <div>
                                    <span style={{ display: 'block', color: '#9ca3af', fontSize: '0.625rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.125rem' }}>Date</span>
                                    <span style={{ display: 'block', color: '#111827', fontWeight: 'bold', fontSize: '0.875rem' }}>{new Date(ticket.date).toLocaleDateString()}</span>
                                </div>
                                <div>
                                    <span style={{ display: 'block', color: '#9ca3af', fontSize: '0.625rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.125rem' }}>Time</span>
                                    <span style={{ display: 'block', color: '#111827', fontWeight: 'bold', fontSize: '0.875rem' }}>{new Date(ticket.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                            </div>

                            {/* Seat & Price */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f9fafb', border: '1px solid #f3f4f6', borderRadius: '0.75rem', padding: '0.75rem' }}>
                                <div>
                                    <span style={{ display: 'block', color: '#9ca3af', fontSize: '0.625rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.125rem' }}>Seat</span>
                                    <span style={{ display: 'block', color: '#dc2626', fontWeight: '900', fontSize: '1.875rem', lineHeight: '1' }}>{ticket.seat}</span>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{ display: 'block', color: '#9ca3af', fontSize: '0.625rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.125rem' }}>Price</span>
                                    <span style={{ display: 'block', color: '#111827', fontWeight: '900', fontSize: '1.25rem' }}>{ticket.price} LEK</span>
                                </div>
                            </div>
                        </div>

                        {/* Footer / QR */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '0.5rem' }}>
                            <div>
                                <p style={{ fontSize: '0.625rem', color: '#9ca3af', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem', margin: 0 }}>Holder</p>
                                <p style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#1f2937', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '150px', margin: 0 }}>{ticket.customerName}</p>
                            </div>

                            <div style={{ backgroundColor: '#ffffff', padding: '0.25rem', borderRadius: '0.25rem', border: '1px solid #e5e7eb' }}>
                                <QRCodeCanvas
                                    value={`TICKET:${ticket.movieTitle}:${ticket.seat}:${ticket.date}`}
                                    size={64}
                                    bgColor={"#ffffff"}
                                    fgColor={"#000000"}
                                    level={"H"}
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            {/* TICKET CARD END */}

            <button
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className={`group relative flex items-center gap-3 px-8 py-4 ${isDownloading ? 'bg-gray-600 cursor-not-allowed' : 'bg-white/10 hover:bg-white'} text-white ${!isDownloading && 'hover:text-black'} font-bold rounded-full transition-all duration-300 border border-white/20 backdrop-blur-md overflow-hidden`}
            >
                <span className="relative z-10 flex items-center gap-2">
                    {isDownloading ? (
                        <>
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Generating PDF...
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            Download PDF Ticket
                        </>
                    )}
                </span>
                {!isDownloading && <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-0"></div>}
            </button>

            <Link to="/" className="mt-8 text-gray-500 hover:text-white text-sm transition-colors">Book Another Movie</Link>

        </div>
    );
};

export default ConfirmationPage;
