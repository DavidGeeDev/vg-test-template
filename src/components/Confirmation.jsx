import React from 'react';
import { Send, AlertTriangle } from './Icons';

export default function Confirmation({
	answeredCount,
	totalQuestions,
	elapsedTime,
	formatTimeMMSS,
	onCancel,
	onSubmit
}) {
	return (
		<div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-40">
			<div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden fade-in">
				<div className="bg-gradient-to-r from-[#2980b9] to-blue-600 px-8 py-6">
					<div className="flex items-center gap-3">
						<Send size={32} className="text-white" />
						<div>
							<h2 className="text-xl font-extrabold text-white">Submit Exam?</h2>
							<p className="text-blue-100 text-sm">This action cannot be undone</p>
						</div>
					</div>
				</div>
				<div className="p-8">
					<div className="bg-gray-50 rounded-xl p-4 mb-6">
						<div className="flex justify-between items-center mb-2">
							<span className="text-sm text-gray-600">Questions Answered</span>
							<span className="font-bold text-gray-800">{answeredCount} of {totalQuestions}</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-sm text-gray-600">Time Elapsed</span>
							<span className="font-bold text-gray-800 font-mono">{formatTimeMMSS(elapsedTime)}</span>
						</div>
					</div>

					{answeredCount < totalQuestions && (
						<div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
							<p className="text-amber-800 text-sm font-medium flex items-start gap-2">
								<AlertTriangle size={18} className="flex-shrink-0 mt-0.5" />
								You have {totalQuestions - answeredCount} unanswered question{totalQuestions - answeredCount > 1 ? 's' : ''}. Unanswered questions will be marked incorrect.
							</p>
						</div>
					)}

					<div className="flex gap-4">
						<button
							onClick={onCancel}
							className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-200 font-bold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors"
						>
							Back
						</button>
						<button
							onClick={onSubmit}
							className="flex-1 px-4 py-3 rounded-lg bg-[#2980b9] text-white font-bold hover:bg-blue-700 transition-colors shadow-lg"
						>
							Submit Now
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
