import React from 'react';
import { Clock, Check } from './Icons';
import { QUESTIONS } from '../data/questions';

const OptionRow = ({ questionId, opt, isSelected, onToggle }) => (
	<button
		type="button"
		onClick={() => onToggle(questionId, opt.id)}
		onKeyDown={(e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				onToggle(questionId, opt.id);
			}
		}}
		className={`w-full text-left flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2980b9] ${isSelected ? 'border-[#2980b9] bg-blue-50 shadow-sm' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
			}`}
		aria-pressed={isSelected}
		aria-label={`Option ${opt.id}: ${opt.text}`}
	>
		<span
			className={`w-6 h-6 rounded border-2 mr-4 flex items-center justify-center flex-shrink-0 transition-all duration-150 ${isSelected ? 'bg-[#2980b9] border-[#2980b9]' : 'bg-white border-gray-300'
				}`}
			aria-hidden="true"
		>
			{isSelected && <Check size={14} color="white" strokeWidth={3} />}
		</span>
		<span className="text-gray-700 font-medium leading-relaxed">{opt.text}</span>
	</button>
);

export default function Assessment({
	user,
	currentQuestionIndex,
	answers,
	onOptionToggle,
	onPrev,
	onNext,
	elapsedTime,
	formatTimeMMSS
}) {
	const answeredCount = Object.values(answers).filter(a => a && a.length > 0).length;
	const progressPercent = ((currentQuestionIndex + 1) / QUESTIONS.length) * 100;

	return (
		<div className="relative z-10 max-w-3xl mx-auto pt-8 pb-12 px-4">
			{/* Header */}
			<div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden">
				<div className="flex flex-wrap justify-between items-center p-4 gap-3">
					<div>
						<p className="text-xs text-gray-500 font-bold uppercase tracking-wide">Participant</p>
						<p className="font-bold text-gray-800">{user.name || '—'}</p>
						<p className="text-xs text-gray-500">{user.agency || '—'}</p>
					</div>
					<div className="flex items-center gap-4">
						<div className="text-right">
							<p className="text-xs text-gray-500 font-bold uppercase tracking-wide">Progress</p>
							<p className="text-sm font-semibold text-gray-700">{answeredCount} of {QUESTIONS.length} answered</p>
						</div>
						<div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full font-mono text-xl font-bold text-[#2980b9]">
							<Clock size={20} />
							{formatTimeMMSS(elapsedTime)}
						</div>
					</div>
				</div>
				{/* Progress bar */}
				<div className="h-1 bg-gray-200">
					<div
						className="h-full bg-[#2980b9] transition-all duration-300"
						style={{ width: `${progressPercent}%` }}
					/>
				</div>
			</div>

			{/* Question Card */}
			<div className="bg-white rounded-2xl shadow-xl overflow-hidden">
				<div className="bg-gradient-to-r from-[#2980b9] to-blue-600 px-6 py-4 flex justify-between items-center">
					<span className="font-bold text-white text-lg">
						Question {currentQuestionIndex + 1} of {QUESTIONS.length}
					</span>
					<span className="text-sm bg-white/20 text-white px-3 py-1 rounded-full font-medium">
						3 Points
					</span>
				</div>
				<div className="p-8">
					<h3 className="text-xl font-bold mb-6 text-gray-800 leading-relaxed">
						{QUESTIONS[currentQuestionIndex].text}
					</h3>
					<div className="space-y-3">
						{QUESTIONS[currentQuestionIndex].options.map((opt) => {
							const isSelected = (answers[QUESTIONS[currentQuestionIndex].id] || []).includes(opt.id);
							return (
								<OptionRow
									key={opt.id}
									questionId={QUESTIONS[currentQuestionIndex].id}
									opt={opt}
									isSelected={isSelected}
									onToggle={onOptionToggle}
								/>
							);
						})}
					</div>
				</div>
				<div className="bg-gray-50 px-8 py-5 flex justify-between border-t">
					<button
						onClick={onPrev}
						className="px-6 py-3 rounded-lg border-2 border-gray-300 font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
						disabled={currentQuestionIndex === 0}
						aria-label="Previous question"
					>
						Previous
					</button>
					<button
						onClick={onNext}
						className="bg-[#2980b9] text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center gap-2"
						aria-label={currentQuestionIndex === QUESTIONS.length - 1 ? "Finish and review" : "Next question"}
					>
						{currentQuestionIndex === QUESTIONS.length - 1 ? (
							<>Finish</>
						) : (
							<>Next</>
						)}
					</button>
				</div>
			</div>
		</div>
	);
}
