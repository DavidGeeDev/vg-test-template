import React from 'react';
import { Brain, Shield, X, Check, Sparkles, Printer } from './Icons';

export default function Results({
	score,
	maxScore,
	passed,
	user,
	completedAt,
	feedback,
	elapsedTime,
	formatTimeMMSS
}) {
	const percentScore = maxScore > 0 ? (score / maxScore) * 100 : 0;
	const completionDate = completedAt ? new Date(completedAt) : null;
	const handlePrint = () => {
		const printable = document.getElementById('results-printable');
		if (printable) {
			printable.scrollTo({ top: 0, behavior: 'auto' });
		}
		// Wait a frame for scroll to finish
		requestAnimationFrame(() => window.print());
	};

	return (
		<div id="print-wrapper" className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-4">
			<div
				id="results-printable"
				className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden max-h-[95vh] flex flex-col"
			>
				<div className="bg-gradient-to-r from-[#2980b9] to-blue-600 px-8 py-6 flex items-center justify-between flex-shrink-0">
					<div className="flex items-center gap-3">
						<Brain size={40} className="text-white" />
						<div>
							<h2 className="text-2xl font-extrabold text-white">Exam Summary</h2>
							<p className="text-blue-100 text-sm">HCBS Settings Rule Compliance</p>
						</div>
					</div>
					<div className="text-right">
						<p className="text-xs text-blue-100 uppercase font-semibold tracking-wide">Score</p>
						<p className="text-3xl font-extrabold text-white">
							{score} / {maxScore}
						</p>
						<p className={`text-sm mt-1 font-semibold ${passed ? 'text-green-300' : 'text-red-300'}`}>
							{Math.round(percentScore)}% {passed ? "• PASSED" : "• NOT PASSED"}
						</p>
					</div>
				</div>
				<div className="p-8 overflow-y-auto flex-1">
					<div className="flex items-center justify-between mb-6 pb-4 border-b">
						<div>
							<p className="text-sm text-gray-500">
								Participant: <span className="font-semibold text-gray-800">{user.name}</span>
							</p>
							<p className="text-sm text-gray-500">
								Provider/Agency: <span className="font-semibold text-gray-800">{user.agency}</span>
							</p>
						</div>
						<div className="text-right">
							<p className="text-xs text-gray-400 uppercase font-semibold">Time Elapsed</p>
							<p className="font-mono text-lg text-gray-800">{formatTimeMMSS(elapsedTime)}</p>
						</div>
					</div>

					{/* Certificate-style block (only when passed) */}
					{passed && (
						<div className="mb-6 border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 text-center">
							<div className="flex justify-center mb-3">
								<Shield size={40} className="text-[#2980b9]" />
							</div>
							<h3 className="text-xl font-extrabold text-[#2980b9] mb-2">Certificate of Completion</h3>
							<p className="text-gray-700">
								VG Compliance Partners certifies that{" "}
								<span className="font-semibold">{user.name}</span> has successfully
								completed the HCBS Settings Rule Provider Assessment.
							</p>
							<p className="mt-3 text-sm text-gray-600">
								Provider/Agency:{" "}
								<span className="font-semibold">{user.agency}</span>
							</p>
							{completionDate && (
								<p className="mt-2 text-xs text-gray-500">
									Date: {completionDate.toLocaleDateString()} • Score: {score} / {maxScore} (
									{Math.round(percentScore)}%)
								</p>
							)}
						</div>
					)}

					{/* Question feedback */}
					<div className="space-y-4">
						{feedback.map(item => (
							<div key={item.questionId} className="border rounded-xl p-5 bg-gray-50">
								<div className="flex items-start justify-between gap-4 mb-3">
									<h3 className="font-semibold text-gray-800 flex-1">
										<span className="text-xs text-gray-500 uppercase tracking-wide block mb-1">Question {item.questionId}</span>
										{item.text}
									</h3>
									<span
										className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold flex-shrink-0 ${item.correct
											? 'bg-green-100 text-green-800'
											: 'bg-red-100 text-red-800'
											}`}
									>
										{item.correct ? (
											<>
												<Check size={14} className="mr-1" /> Correct
											</>
										) : (
											<>
												<X size={14} className="mr-1" /> Incorrect
											</>
										)}
									</span>
								</div>
								{item.reasoning && (
									<p className="text-sm text-gray-600 bg-white border border-gray-200 rounded-lg p-4">
										<span className="font-semibold text-gray-700">Explanation: </span>
										{item.reasoning}
									</p>
								)}
							</div>
						))}
					</div>

					<div className="flex justify-between items-center mt-6 pt-4 border-t">
						<div className="flex items-center gap-2 text-sm text-gray-500">
							<Sparkles size={18} className="text-yellow-500" />
							<span>Your completion is tracked via SCORM.</span>
						</div>
						{passed && (
							<button
								onClick={handlePrint}
								className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
								aria-label="Print certificate"
							>
								<Printer size={18} />
								Print Certificate
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
