import React, { useRef, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import { QRCodeCanvas } from 'qrcode.react';
import axios from 'axios';

const TicketPage = () => {
    const { id } = useParams();
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const ticketRef = useRef(null);
    const [isDownloading, setIsDownloading] = useState(false);

    useEffect(() => {
        const fetchTicket = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/bookings/${id}`);
                setTicket(res.data);
            } catch (error) {
                console.error("Failed to fetch ticket", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTicket();
    }, [id]);

    const handleDownloadPDF = async () => {
        if (isDownloading) return;
        setIsDownloading(true);
        try {
            const element = ticketRef.current;
            await new Promise(resolve => setTimeout(resolve, 500)); // Wait for render

            const dataUrl = await toPng(element, { cacheBust: true });

            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgProperties = pdf.getImageProperties(dataUrl);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

            pdf.addImage(dataUrl, 'PNG', 0, 10, pdfWidth, pdfHeight);
            pdf.save(`Cineplexx_Ticket_${ticket.seatLabel}.pdf`);
        } catch (error) {
            console.error("Download failed:", error);
            alert(`Failed to generate PDF: ${error.message}`);
        } finally {
            setIsDownloading(false);
        }
    };

    if (loading) return <div className="min-h-screen bg-[#121212] flex items-center justify-center text-white">Loading Ticket...</div>;
    if (!ticket) return <div className="min-h-screen bg-[#121212] flex items-center justify-center text-white">Ticket not found</div>;

    const event = ticket.Event || ticket.Showtime?.Event;
    const movieTitle = event ? event.title : (ticket.Showtime?.Movie?.title || 'Unknown Mvoie');
    const posterUrl = event ? event.imageUrl : (ticket.Showtime?.Movie?.posterUrl || '');
    const hallName = ticket.Showtime?.Hall?.name;
    const date = ticket.Showtime?.startTime;
    const cinemaName = ticket.Showtime?.Hall?.Cinema?.name || 'Cineplexx';

    return (
        <div className="min-h-screen bg-[#121212] pt-32 pb-12 px-6 flex flex-col items-center">

            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-2 uppercase tracking-widest">Digital Ticket</h1>
                <p className="text-gray-400">Order #{ticket.id}</p>
            </div>

            {/* TICKET CARD */}
            <div className="relative group perspective-1000 mb-12">
                <div ref={ticketRef} className="w-[350px] md:w-[700px] h-auto md:h-[350px] rounded-3xl overflow-hidden flex flex-col md:flex-row relative z-10" style={{ backgroundColor: '#ffffff', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', fontFamily: 'sans-serif' }}>

                    {/* Poster */}
                    <div className="w-full md:w-[250px] h-[300px] md:h-full relative overflow-hidden shrink-0" style={{ backgroundColor: '#000000' }}>
                        {posterUrl && (
                            <>
                                <img src={posterUrl} className="w-full h-full object-cover" style={{ opacity: 0.9 }} />
                                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }} />
                            </>
                        )}
                        <div className="absolute bottom-6 left-6 right-6">
                            <h3 style={{ color: '#ffffff', textShadow: '0 4px 6px rgba(0,0,0,0.5)', fontWeight: 'bold', fontSize: '1.5rem', lineHeight: '1', margin: 0 }}>{movieTitle}</h3>
                        </div>
                    </div>

                    {/* DETAILS */}
                    <div className="flex-1 p-6 flex flex-col relative justify-between" style={{ backgroundColor: '#ffffff' }}>
                        {/* Cut Lines */}
                        <div className="absolute -top-3 left-[244px] w-6 h-6 rounded-full hidden md:block z-20" style={{ backgroundColor: '#121212' }}></div>
                        <div className="absolute -bottom-3 left-[244px] w-6 h-6 rounded-full hidden md:block z-20" style={{ backgroundColor: '#121212' }}></div>
                        <div className="absolute top-0 bottom-0 left-[255px] hidden md:block z-10" style={{ borderLeft: '2px dashed #d1d5db', width: '1px' }}></div>

                        {/* Header */}
                        <div style={{ borderBottom: '1px solid #f3f4f6', paddingBottom: '0.75rem', marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <h2 style={{ color: '#000000', fontWeight: '900', fontSize: '1.125rem', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>{cinemaName}</h2>
                                <p style={{ color: '#9ca3af', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.125rem', margin: 0 }}>Admit One • Hall {hallName}</p>
                            </div>
                        </div>

                        {/* Info Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                            <div style={{ display: 'flex', gap: '2rem' }}>
                                <div>
                                    <span style={{ display: 'block', color: '#9ca3af', fontSize: '0.625rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.125rem' }}>Date</span>
                                    <span style={{ display: 'block', color: '#111827', fontWeight: 'bold', fontSize: '0.875rem' }}>{new Date(date).toLocaleDateString()}</span>
                                </div>
                                <div>
                                    <span style={{ display: 'block', color: '#9ca3af', fontSize: '0.625rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.125rem' }}>Time</span>
                                    <span style={{ display: 'block', color: '#111827', fontWeight: 'bold', fontSize: '0.875rem' }}>{new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f9fafb', border: '1px solid #f3f4f6', borderRadius: '0.75rem', padding: '0.75rem' }}>
                                <div>
                                    <span style={{ display: 'block', color: '#9ca3af', fontSize: '0.625rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.125rem' }}>Seat</span>
                                    <span style={{ display: 'block', color: '#dc2626', fontWeight: '900', fontSize: '1.875rem', lineHeight: '1' }}>{ticket.seatLabel}</span>
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
                                    value={`TICKET:${movieTitle}:${ticket.seatLabel}:${date}`}
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

            <button
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className={`group relative flex items-center gap-3 px-8 py-4 ${isDownloading ? 'bg-gray-600 cursor-not-allowed' : 'bg-white/10 hover:bg-white'} text-white ${!isDownloading && 'hover:text-black'} font-bold rounded-full transition-all duration-300 border border-white/20 backdrop-blur-md overflow-hidden`}
            >
                {isDownloading ? 'Generating PDF...' : 'Download PDF Ticket'}
            </button>

            <Link to="/dashboard" className="mt-8 text-gray-500 hover:text-white text-sm transition-colors">Back to Dashboard</Link>
        </div>
    );
};

export default TicketPage;
