const StatCard =  ({ title, value, colorClass }) => {
    return(
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex items-center justify-between transition duration-300 transform hover:scale-[1.02] hover:shadow-xl">
        {/* FLEX layout for content */}
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-bold mt-1" style={{ color: colorClass }}>{value}</p>
        </div>
        {/* Placeholder Icon */}
        <div className={`p-3 rounded-full ${colorClass.replace('text-', 'bg-').replace('-700', '-100')}`}>
            <svg className={`w-6 h-6 ${colorClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                {title.includes('Total') && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c1.657 0 3 .895 3 2s-1.343 2-3 2-3-.895-3-2 1.343-2 3-2zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />}
                {title.includes('Items') && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10m0 0h2m-2 0h-2m10-10h2m-2 0H8m2 0l-3 4-3-4" />}
                {title.includes('Low') && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />}
            </svg>
        </div>
    </div>
);
}
export default StatCard;
