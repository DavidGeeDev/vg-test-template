import React from 'react';
import { Shield, Check, CheckCircle, AlertTriangle, Play, Smartphone } from './Icons';

export default function Landing({ onStart, deviceInfo }) {
	const BRAND_BLUE = "#2980b9";
	const isMobile = deviceInfo?.isMobile || false;
	const deviceType = deviceInfo?.deviceType || 'Desktop';
	const isWebView = deviceInfo?.isWebView || false;

	return (
		<div className="relative z-10 container mx-auto px-4 min-h-screen flex flex-col items-center justify-center py-10">
			<div className="max-w-4xl w-full">
				<div className="text-center mb-12">
					<div className="flex justify-center mb-6">
						<div className="bg-white p-5 rounded-full shadow-lg border-4 border-[#2980b9]">
							<Shield size={64} color={BRAND_BLUE} aria-label="Shield icon" />
						</div>
					</div>
					<h1 className="text-4xl md:text-5xl font-extrabold text-[#2980b9] mb-4">Compliance Certification</h1>
					<p className="text-xl text-gray-600">Official HCBS Settings Rule Provider Assessment</p>
				</div>

				{/* WARNINGS SECTION */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
					<div className="bg-green-50 rounded-2xl p-6 border border-green-200">
						<h3 className="text-green-800 font-bold text-lg mb-4 flex items-center gap-2">
							<Check size={22} className="text-green-600" /> Success Strategies
						</h3>
						<ul className="space-y-3 text-green-900 text-sm">
							<li className="flex gap-3">
								<CheckCircle size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
								<span>
									<strong>Select ALL correct answers.</strong> Missing one counts as 0 points for that question.
								</span>
							</li>
							<li className="flex gap-3">
								<CheckCircle size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
								<span>
									<strong>Complete in one sitting.</strong> The exam cannot be paused or resumed.
								</span>
							</li>
							<li className="flex gap-3">
								<CheckCircle size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
								<span>
									<strong>You need 80% to pass.</strong> Review your knowledge before starting.
								</span>
							</li>
						</ul>
					</div>
					<div className="bg-red-50 rounded-2xl p-6 border border-red-200">
						<h3 className="text-red-800 font-bold text-lg mb-4 flex items-center gap-2">
							<AlertTriangle size={22} className="text-red-600" /> Security Warnings
						</h3>
						<ul className="space-y-3 text-red-900 text-sm">
							<li className="flex gap-3">
								<AlertTriangle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
								<span>
									<strong>Do NOT switch tabs or windows.</strong> The exam will lock and fail immediately.
								</span>
							</li>
							<li className="flex gap-3">
								<AlertTriangle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
								<span>
									<strong>Do NOT minimize the browser.</strong> Keep the exam window active at all times.
								</span>
							</li>
							<li className="flex gap-3">
								<AlertTriangle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
								<span>
									<strong>All violations are recorded.</strong> Administrators can review attempt logs.
								</span>
							</li>
						</ul>
					</div>
				</div>

				{/* MOBILE-SPECIFIC WARNINGS */}
				{isMobile && (
					<div className="mb-12">
						<div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-300">
							<h3 className="text-blue-900 font-bold text-lg mb-4 flex items-center gap-2">
								<Smartphone size={22} className="text-blue-600" /> Mobile Device Detected: {deviceType}
							</h3>
							<div className="space-y-3 text-blue-900 text-sm">
								<p className="flex gap-3">
									<AlertTriangle size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
									<span>
										<strong>Screenshots are monitored.</strong> Taking screenshots during the exam may be logged for review.
									</span>
								</p>
								<p className="flex gap-3">
									<AlertTriangle size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
									<span>
										<strong>Stay in the app.</strong> Switching to other apps, notifications, or control center will fail the exam.
									</span>
								</p>
								<p className="flex gap-3">
									<AlertTriangle size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
									<span>
										<strong>Keep screen active.</strong> Do not use split-screen, picture-in-picture, or screen recording features.
									</span>
								</p>
								{isWebView && (
									<p className="flex gap-3">
										<AlertTriangle size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
										<span>
											<strong>In-app browser detected.</strong> Enhanced monitoring is active for WebView environments.
										</span>
									</p>
								)}
								<p className="flex gap-3 mt-4 pt-3 border-t border-blue-200">
									<CheckCircle size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
									<span>
										<strong>Your device type is supported.</strong> Mobile users can complete the exam successfully by following all guidelines.
									</span>
								</p>
							</div>
						</div>
					</div>
				)}

				<div className="flex flex-wrap justify-center gap-3">
					<button
						onClick={onStart}
						className="bg-[#2980b9] text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-blue-700 shadow-xl flex items-center gap-3 transition-colors"
						aria-label="Start registration"
					>
						Start Registration
						<Play size={20} />
					</button>
				</div>
			</div>
		</div>
	);
}
