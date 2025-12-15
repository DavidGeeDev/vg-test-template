import React, { useState, useEffect } from 'react';
import ScormAPI from './lib/scorm-api';
import { QUESTIONS, generateHash, decodeReasoning } from './data/questions';
import Landing from './components/Landing';
import Registration from './components/Registration';
import Assessment from './components/Assessment';
import Confirmation from './components/Confirmation';
import Results from './components/Results';
import { AlertOctagon } from './components/Icons';

function App() {
	const [phase, setPhase] = useState('landing'); // landing | registration | assessment | confirm | results
	const [user, setUser] = useState({ name: '', agency: '' });
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [answers, setAnswers] = useState({});

	// Security / focus tracking
	const [windowLocked, setWindowLocked] = useState(false);
	const [elapsedTime, setElapsedTime] = useState(0);
	const [timerActive, setTimerActive] = useState(false);
	const [showResults, setShowResults] = useState(false);
	const [score, setScore] = useState(0);
	const [maxScore] = useState(QUESTIONS.length * 3);
	const [feedback, setFeedback] = useState([]);
	const [passed, setPassed] = useState(false);
	const [completedAt, setCompletedAt] = useState(null);

	// Mirror phase to body for print CSS
	useEffect(() => {
		document.body.dataset.phase = phase;
		return () => {
			delete document.body.dataset.phase;
		};
	}, [phase]);

	// --- SCORM HELPERS ---
	const safeSetAndCommit = (element, value) => {
		ScormAPI.setValue(element, String(value));
		ScormAPI.commit();
	};

	// Initialize SCORM on load
	useEffect(() => {
		const ok = ScormAPI.initialize();
		if (!ok) {
			console.warn("SCORM could not initialize");
		}
		const handleBeforeUnload = () => {
			ScormAPI.finish();
		};
		window.addEventListener('beforeunload', handleBeforeUnload);
		return () => {
			ScormAPI.finish();
			window.removeEventListener('beforeunload', handleBeforeUnload);
		};
	}, []);

	// Disable right-click during assessment phases
	useEffect(() => {
		const handleContextMenu = (e) => {
			if (phase === 'assessment' || phase === 'confirm') {
				e.preventDefault();
			}
		};
		document.addEventListener('contextmenu', handleContextMenu);
		return () => document.removeEventListener('contextmenu', handleContextMenu);
	}, [phase]);

	// Timer effect
	useEffect(() => {
		if (!timerActive) return;
		const interval = setInterval(() => {
			setElapsedTime((t) => t + 1);
		}, 1000);
		return () => clearInterval(interval);
	}, [timerActive]);

	// Security: tab switching and window focus -> immediate lock + fail
	useEffect(() => {
		const handleInfraction = () => {
			if ((phase === 'assessment' || phase === 'confirm') && !windowLocked && !showResults) {
				setWindowLocked(true);
				setTimerActive(false);
				ScormAPI.setInteractionLock();
				safeSetAndCommit("cmi.core.score.raw", 0);
				safeSetAndCommit("cmi.core.lesson_status", "failed");
			}
		};
		const handleVisibility = () => {
			if (document.hidden) handleInfraction();
		};
		window.addEventListener('blur', handleInfraction);
		document.addEventListener('visibilitychange', handleVisibility);
		return () => {
			window.removeEventListener('blur', handleInfraction);
			document.removeEventListener('visibilitychange', handleVisibility);
		};
	}, [phase, windowLocked, showResults]);

	const handleStartAssessment = () => {
		if (!user.name || !user.agency) return;
		setPhase('assessment');
		setTimerActive(true);
		setElapsedTime(0);
		setWindowLocked(false);

		safeSetAndCommit("cmi.core.student_name", user.name);
		safeSetAndCommit("cmi.core.lesson_status", "incomplete");
	};

	const handleOptionToggle = (questionId, optionId) => {
		if (windowLocked || showResults) return;
		setAnswers(prev => {
			const qAnswers = prev[questionId] || [];
			if (qAnswers.includes(optionId)) {
				return { ...prev, [questionId]: qAnswers.filter(id => id !== optionId) };
			} else {
				return { ...prev, [questionId]: [...qAnswers, optionId] };
			}
		});
	};

	const calculateScore = () => {
		let total = 0;
		const detailedFeedback = [];

		QUESTIONS.forEach(q => {
			const userSelected = (answers[q.id] || []);
			const hash = generateHash(userSelected);
			const correct = hash === q.answerHash;
			if (correct) {
				total += 3;
			}
			detailedFeedback.push({
				questionId: q.id,
				text: q.text,
				correct,
				userSelected,
				reasoning: decodeReasoning(q.encodedReasoning)
			});
		});

		setScore(total);
		setFeedback(detailedFeedback);
		return total;
	};

	const goNext = () => {
		if (windowLocked) return;
		if (currentQuestionIndex < QUESTIONS.length - 1) {
			setCurrentQuestionIndex(currentQuestionIndex + 1);
		} else {
			// Show confirmation modal
			setPhase('confirm');
		}
	};

	const goPrev = () => {
		if (windowLocked) return;
		if (currentQuestionIndex > 0) {
			setCurrentQuestionIndex(currentQuestionIndex - 1);
		}
	};

	const handleBackToQuestions = () => {
		if (windowLocked) return;
		setPhase('assessment');
	};

	const handleSubmit = () => {
		if (windowLocked) return;

		const finalScore = calculateScore();
		setTimerActive(false);
		setShowResults(true);

		const percent = (finalScore / maxScore) * 100;
		const didPass = percent >= 80;
		setPassed(didPass);
		const nowIso = new Date().toISOString();
		setCompletedAt(nowIso);

		safeSetAndCommit("cmi.core.score.raw", finalScore);
		safeSetAndCommit("cmi.core.score.max", maxScore);
		safeSetAndCommit("cmi.core.score.min", 0);
		safeSetAndCommit("cmi.core.lesson_status", didPass ? "passed" : "failed");
		safeSetAndCommit("cmi.core.session_time", ScormAPI.formatTime(elapsedTime));

		const prior = ScormAPI.parseTime(ScormAPI.getValue("cmi.core.total_time") || "00:00:00");
		const cumulative = prior + elapsedTime;
		safeSetAndCommit("cmi.core.total_time", ScormAPI.formatTime(cumulative));

		setPhase('results');
	};

	const resetExam = () => {
		setCurrentQuestionIndex(0);
		setAnswers({});
		setWindowLocked(false);
		setElapsedTime(0);
		setTimerActive(false);
		setShowResults(false);
		setScore(0);
		setFeedback([]);
		setPassed(false);
		setCompletedAt(null);
	};

	const handleRestartFromLock = () => {
		resetExam();
		setPhase('registration');
		safeSetAndCommit("cmi.core.lesson_status", "incomplete");
		safeSetAndCommit("cmi.core.score.raw", 0);
	};

	const formatTimeMMSS = (seconds) => {
		const m = Math.floor(seconds / 60).toString().padStart(2, '0');
		const s = (seconds % 60).toString().padStart(2, '0');
		return `${m}:${s}`;
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 font-sans text-gray-900">
			{/* Lock overlay */}
			{windowLocked && (
				<div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
					<div className="bg-white rounded-2xl shadow-2xl p-10 max-w-lg text-center border-t-8 border-red-500 fade-in mx-4">
						<div className="flex justify-center mb-6">
							<div className="bg-red-50 p-4 rounded-full shadow-inner border border-red-200">
								<AlertOctagon size={48} className="text-red-600" />
							</div>
						</div>
						<h2 className="text-2xl font-extrabold mb-4 text-red-700">Exam Locked & Failed</h2>
						<p className="text-gray-700 mb-4">
							The exam window lost focus or tabs were switched. This attempt has been marked as failed and recorded.
						</p>
						<p className="text-sm text-gray-500 mb-2">
							Please contact your supervisor or training administrator if this occurred by mistake.
						</p>
						<p className="text-xs text-gray-400 mb-6">
							You must start a new attempt to try again.
						</p>
						<div className="flex justify-center">
							<button
								onClick={handleRestartFromLock}
								className="px-6 py-3 rounded-full bg-[#2980b9] text-white font-semibold hover:bg-blue-700 transition-colors"
								aria-label="Start a new attempt"
							>
								Start New Attempt
							</button>
						</div>
					</div>
				</div>
			)}

			{phase === 'landing' && (
				<Landing onStart={() => setPhase('registration')} />
			)}

			{phase === 'registration' && (
				<Registration
					user={user}
					setUser={setUser}
					onBack={() => setPhase('landing')}
					onBegin={handleStartAssessment}
				/>
			)}

			{phase === 'assessment' && (
				<Assessment
					user={user}
					currentQuestionIndex={currentQuestionIndex}
					answers={answers}
					onOptionToggle={handleOptionToggle}
					onPrev={goPrev}
					onNext={goNext}
					elapsedTime={elapsedTime}
					formatTimeMMSS={formatTimeMMSS}
				/>
			)}

			{phase === 'confirm' && (
				<Confirmation
					answeredCount={Object.values(answers).filter(a => a && a.length > 0).length}
					totalQuestions={QUESTIONS.length}
					elapsedTime={elapsedTime}
					formatTimeMMSS={formatTimeMMSS}
					onCancel={handleBackToQuestions}
					onSubmit={handleSubmit}
				/>
			)}

			{phase === 'results' && (
				<Results
					score={score}
					maxScore={maxScore}
					passed={passed}
					user={user}
					completedAt={completedAt}
					feedback={feedback}
					elapsedTime={elapsedTime}
					formatTimeMMSS={formatTimeMMSS}
				/>
			)}
		</div>
	);
}

export default App;
