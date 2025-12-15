import React from 'react';

export default function Registration({ user, setUser, onBack, onBegin }) {
	return (
		<div className="relative z-10 container mx-auto px-4 min-h-screen flex flex-col items-center justify-center py-10">
			<div className="bg-white p-8 md:p-12 rounded-2xl shadow-2xl max-w-2xl w-full border-t-8 border-[#2980b9]">
				<button
					onClick={onBack}
					className="text-gray-400 hover:text-gray-600 mb-4 text-sm font-semibold transition-colors"
					aria-label="Back to landing"
				>
					← Back
				</button>
				<h1 className="text-3xl font-bold text-center mb-2 text-[#2980b9]">
					HCBS Compliance Exam
				</h1>
				<p className="text-center text-gray-600 mb-8">
					Enter your information to begin. This will appear on your completion record.
				</p>
				<div className="space-y-5">
					<div>
						<label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
						<input
							type="text"
							value={user.name}
							onChange={(e) => setUser({ ...user, name: e.target.value })}
							className="w-full p-4 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2980b9] focus:border-transparent transition-all"
							placeholder="Jane Doe"
							aria-label="Full Name"
						/>
					</div>
					<div>
						<label className="block text-sm font-bold text-gray-700 mb-2">Provider or Agency</label>
						<input
							type="text"
							value={user.agency}
							onChange={(e) => setUser({ ...user, agency: e.target.value })}
							className="w-full p-4 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2980b9] focus:border-transparent transition-all"
							placeholder="Agency Inc."
							aria-label="Provider or Agency"
						/>
					</div>
				</div>
				<div className="flex flex-col gap-3 mt-8">
					<button
						onClick={onBegin}
						disabled={!user.name || !user.agency}
						className="w-full py-4 bg-[#2980b9] text-white rounded-lg font-bold disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
						aria-label="Begin exam"
					>
						Begin Exam
					</button>
				</div>
			</div>
		</div>
	);
}
