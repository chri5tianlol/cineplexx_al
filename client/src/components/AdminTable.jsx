import React from 'react';

const AdminTable = ({ columns, data, actions, emptyMessage = "No data found" }) => {
    if (!data || data.length === 0) {
        return <div className="p-8 text-center text-gray-500 bg-[#1a1a1a] rounded-2xl border border-white/5">{emptyMessage}</div>;
    }

    return (
        <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto rounded-2xl border border-white/5">
                <table className="w-full text-left text-sm text-gray-400">
                    <thead className="bg-[#252525] text-gray-200 uppercase font-bold text-xs tracking-wider">
                        <tr>
                            {columns.map((col, idx) => (
                                <th key={idx} className="px-6 py-4">{col.header}</th>
                            ))}
                            {actions && <th className="px-6 py-4 text-right">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 bg-[#1a1a1a]">
                        {data.map((row, rowIdx) => (
                            <tr key={rowIdx} className="hover:bg-white/5 transition-colors">
                                {columns.map((col, colIdx) => (
                                    <td key={colIdx} className="px-6 py-4 whitespace-nowrap">
                                        {col.render ? col.render(row) : row[col.accessor]}
                                    </td>
                                ))}
                                {actions && (
                                    <td className="px-6 py-4 text-right whitespace-nowrap">
                                        <div className="flex justify-end gap-2">
                                            {actions(row)}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {data.map((row, rowIdx) => (
                    <div key={rowIdx} className="bg-[#1a1a1a] p-4 rounded-xl border border-white/5 space-y-3">
                        {columns.map((col, colIdx) => (
                            <div key={colIdx} className="flex justify-between items-center border-b border-white/5 pb-2 last:border-0 last:pb-0">
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{col.header}</span>
                                <div className="text-sm text-gray-300 text-right">
                                    {col.render ? col.render(row) : row[col.accessor]}
                                </div>
                            </div>
                        ))}
                        {actions && (
                            <div className="pt-3 mt-2 border-t border-white/10 flex justify-end gap-3">
                                {actions(row)}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </>
    );
};

export default AdminTable;
