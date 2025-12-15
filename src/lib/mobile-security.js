/**
 * Mobile Security Utilities
 * Provides detection and security functions for mobile devices and WebView environments
 */

// ============================================================================
// DEVICE DETECTION
// ============================================================================

/**
 * Detects if the device is iOS (iPhone/iPad)
 */
export function isIOS() {
	const userAgent = navigator.userAgent || navigator.vendor || window.opera;
	// Check for iOS
	return /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
}

/**
 * Detects if the device is iPadOS (iOS 13+ reports as Mac)
 */
export function isIPadOS() {
	return navigator.maxTouchPoints > 1 && /MacIntel/.test(navigator.platform);
}

/**
 * Detects if the device is Android
 */
export function isAndroid() {
	const userAgent = navigator.userAgent || navigator.vendor || window.opera;
	return /android/i.test(userAgent);
}

/**
 * Detects if running in a mobile browser (iOS or Android)
 */
export function isMobile() {
	return isIOS() || isIPadOS() || isAndroid();
}

/**
 * Detects if running inside a WebView container
 */
export function isWebView() {
	const userAgent = navigator.userAgent || navigator.vendor || window.opera;
	
	// Check for common WebView indicators
	const isWebViewUA = /wv|WebView|Version\/[\d\.]+.*Safari/.test(userAgent);
	
	// Check for missing navigator properties that native browsers have
	const isMissingProps = !navigator.standalone && typeof navigator.standalone !== 'undefined';
	
	// Android WebView detection
	const isAndroidWebView = isAndroid() && /Version\/[\d\.]+/.test(userAgent) && /Chrome\/[\d\.]+/.test(userAgent);
	
	return isWebViewUA || isMissingProps || isAndroidWebView;
}

/**
 * Detects if running inside Connecteam app specifically
 */
export function isConnecteamApp() {
	const userAgent = navigator.userAgent || navigator.vendor || window.opera;
	return /Connecteam/i.test(userAgent) || isWebView();
}

/**
 * Gets a human-readable device type string
 */
export function getDeviceType() {
	if (isIOS()) return 'iOS';
	if (isIPadOS()) return 'iPadOS';
	if (isAndroid()) return 'Android';
	return 'Desktop';
}

/**
 * Gets a detailed device environment string
 */
export function getDeviceEnvironment() {
	const type = getDeviceType();
	const webview = isWebView() ? ' (WebView)' : '';
	const connecteam = isConnecteamApp() ? ' [Connecteam]' : '';
	return `${type}${webview}${connecteam}`;
}

// ============================================================================
// MOBILE EVENT HANDLERS
// ============================================================================

/**
 * Sets up mobile-specific page visibility handlers
 * Returns a cleanup function
 */
export function setupMobileVisibilityHandlers(onInfraction) {
	const handlers = [];
	
	// pagehide/pageshow - works better on mobile Safari
	const handlePageHide = () => {
		onInfraction('pagehide');
	};
	
	const handlePageShow = (event) => {
		// If page was cached (bfcache), user might have navigated away
		if (event.persisted) {
			onInfraction('pageshow_cached');
		}
	};
	
	window.addEventListener('pagehide', handlePageHide);
	window.addEventListener('pageshow', handlePageShow);
	handlers.push(() => window.removeEventListener('pagehide', handlePageHide));
	handlers.push(() => window.removeEventListener('pageshow', handlePageShow));
	
	// Page Lifecycle API - freeze/resume
	if ('onfreeze' in document) {
		const handleFreeze = () => {
			onInfraction('freeze');
		};
		
		const handleResume = () => {
			onInfraction('resume');
		};
		
		document.addEventListener('freeze', handleFreeze);
		document.addEventListener('resume', handleResume);
		handlers.push(() => document.removeEventListener('freeze', handleFreeze));
		handlers.push(() => document.removeEventListener('resume', handleResume));
	}
	
	// Return cleanup function
	return () => {
		handlers.forEach(cleanup => cleanup());
	};
}

/**
 * Sets up touch event monitoring to detect suspicious patterns
 * Returns a cleanup function
 */
export function setupTouchEventMonitoring(onSuspiciousActivity) {
	if (!isMobile()) return () => {};
	
	const handlers = [];
	let touchStartTime = 0;
	let touchCount = 0;
	
	// Detect touchcancel - can fire during system interruptions like screenshots
	const handleTouchCancel = (event) => {
		if (touchCount > 0) {
			onSuspiciousActivity('touchcancel', {
				touches: touchCount,
				duration: Date.now() - touchStartTime
			});
		}
	};
	
	// Track multi-touch gestures
	const handleTouchStart = (event) => {
		touchStartTime = Date.now();
		touchCount = event.touches.length;
		
		// Multi-finger gestures might indicate control center access
		if (touchCount >= 3) {
			onSuspiciousActivity('multitouch', { touchCount });
		}
	};
	
	const handleTouchEnd = (event) => {
		const duration = Date.now() - touchStartTime;
		
		// Sudden release of all fingers (potential screenshot gesture)
		if (touchCount > 0 && event.touches.length === 0 && duration < 300) {
			onSuspiciousActivity('rapid_release', { 
				previousTouches: touchCount,
				duration 
			});
		}
		
		touchCount = event.touches.length;
	};
	
	document.addEventListener('touchcancel', handleTouchCancel, { passive: true });
	document.addEventListener('touchstart', handleTouchStart, { passive: true });
	document.addEventListener('touchend', handleTouchEnd, { passive: true });
	
	handlers.push(() => document.removeEventListener('touchcancel', handleTouchCancel));
	handlers.push(() => document.removeEventListener('touchstart', handleTouchStart));
	handlers.push(() => document.removeEventListener('touchend', handleTouchEnd));
	
	return () => {
		handlers.forEach(cleanup => cleanup());
	};
}

/**
 * Sets up orientation change monitoring
 * Returns a cleanup function
 */
export function setupOrientationMonitoring(onOrientationChange) {
	if (!isMobile()) return () => {};
	
	const handleOrientationChange = () => {
		const orientation = window.screen?.orientation?.type || 
			(window.innerWidth > window.innerHeight ? 'landscape' : 'portrait');
		onOrientationChange(orientation);
	};
	
	window.addEventListener('orientationchange', handleOrientationChange);
	
	// Also listen to resize as a backup
	let resizeTimer;
	const handleResize = () => {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(handleOrientationChange, 200);
	};
	
	window.addEventListener('resize', handleResize);
	
	return () => {
		window.removeEventListener('orientationchange', handleOrientationChange);
		window.removeEventListener('resize', handleResize);
		clearTimeout(resizeTimer);
	};
}

/**
 * Sets up Android-specific event monitoring (split-screen, PiP)
 * Returns a cleanup function
 */
export function setupAndroidMonitoring(onSuspiciousActivity) {
	if (!isAndroid()) return () => {};
	
	let lastWidth = window.innerWidth;
	let lastHeight = window.innerHeight;
	
	const handleResize = () => {
		const newWidth = window.innerWidth;
		const newHeight = window.innerHeight;
		
		// Detect significant size changes (split-screen, PiP)
		const widthChange = Math.abs(newWidth - lastWidth);
		const heightChange = Math.abs(newHeight - lastHeight);
		
		if (widthChange > 100 || heightChange > 100) {
			onSuspiciousActivity('resize', {
				from: { width: lastWidth, height: lastHeight },
				to: { width: newWidth, height: newHeight }
			});
		}
		
		lastWidth = newWidth;
		lastHeight = newHeight;
	};
	
	window.addEventListener('resize', handleResize);
	
	return () => {
		window.removeEventListener('resize', handleResize);
	};
}

// ============================================================================
// SCREEN RECORDING DETECTION
// ============================================================================

/**
 * Attempts to detect active screen capture/recording
 * Returns a promise that resolves to detection result
 */
export async function detectScreenCapture() {
	try {
		// Check if media devices API is available
		if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
			return { supported: false, active: false };
		}
		
		// Try to detect if screen capture is already active
		// Note: This is limited by browser APIs and may not work in all cases
		if (navigator.mediaDevices.enumerateDevices) {
			const devices = await navigator.mediaDevices.enumerateDevices();
			const hasScreenCapture = devices.some(device => 
				device.kind === 'videoinput' && device.label.includes('screen')
			);
			
			return { supported: true, active: hasScreenCapture };
		}
		
		return { supported: true, active: false };
	} catch (error) {
		return { supported: false, active: false, error: error.message };
	}
}

/**
 * Sets up Picture-in-Picture monitoring
 * Returns a cleanup function
 */
export function setupPictureInPictureMonitoring(onPipChange) {
	if (!document.pictureInPictureEnabled) {
		return () => {};
	}
	
	const handleEnterPip = () => {
		onPipChange(true);
	};
	
	const handleLeavePip = () => {
		onPipChange(false);
	};
	
	document.addEventListener('enterpictureinpicture', handleEnterPip);
	document.addEventListener('leavepictureinpicture', handleLeavePip);
	
	return () => {
		document.removeEventListener('enterpictureinpicture', handleEnterPip);
		document.removeEventListener('leavepictureinpicture', handleLeavePip);
	};
}

// ============================================================================
// MOBILE HARDENING HELPERS
// ============================================================================

/**
 * Prevents zoom/pinch gestures on mobile
 */
export function preventZoom() {
	// Add viewport meta tag if not exists
	let viewport = document.querySelector('meta[name="viewport"]');
	if (!viewport) {
		viewport = document.createElement('meta');
		viewport.name = 'viewport';
		document.head.appendChild(viewport);
	}
	
	const currentContent = viewport.content || '';
	if (!currentContent.includes('user-scalable=no')) {
		viewport.content = currentContent + 
			(currentContent ? ', ' : '') + 
			'user-scalable=no, maximum-scale=1.0';
	}
	
	// Also prevent touch-based zoom
	document.addEventListener('gesturestart', (e) => e.preventDefault(), { passive: false });
	document.addEventListener('gesturechange', (e) => e.preventDefault(), { passive: false });
	document.addEventListener('gestureend', (e) => e.preventDefault(), { passive: false });
}

/**
 * Prevents pull-to-refresh on mobile
 */
export function preventPullToRefresh() {
	let startY = 0;
	
	document.addEventListener('touchstart', (e) => {
		startY = e.touches[0].pageY;
	}, { passive: true });
	
	document.addEventListener('touchmove', (e) => {
		const y = e.touches[0].pageY;
		// Prevent pull-to-refresh if at top of page and pulling down
		if (document.documentElement.scrollTop === 0 && y > startY) {
			e.preventDefault();
		}
	}, { passive: false });
}

/**
 * Creates a visible watermark element with user info
 * Returns the watermark element
 */
export function createWatermark(userName, userInfo = '') {
	const watermark = document.createElement('div');
	watermark.id = 'security-watermark';
	watermark.style.cssText = `
		position: fixed;
		top: 10px;
		right: 10px;
		background: rgba(0, 0, 0, 0.05);
		padding: 4px 8px;
		border-radius: 4px;
		font-size: 10px;
		color: rgba(0, 0, 0, 0.3);
		pointer-events: none;
		z-index: 9999;
		font-family: monospace;
	`;
	watermark.textContent = `${userName}${userInfo ? ' | ' + userInfo : ''} | ${new Date().toLocaleDateString()}`;
	
	document.body.appendChild(watermark);
	return watermark;
}

/**
 * Removes the watermark if it exists
 */
export function removeWatermark() {
	const watermark = document.getElementById('security-watermark');
	if (watermark) {
		watermark.remove();
	}
}

// ============================================================================
// iOS SPECIFIC DETECTION
// ============================================================================

/**
 * Monitors for iOS screenshot characteristic pause
 * Returns a cleanup function
 */
export function setupIOSScreenshotDetection(onPotentialScreenshot) {
	if (!isIOS() && !isIPadOS()) return () => {};
	
	let lastActivity = Date.now();
	let pauseTimer = null;
	
	const resetActivity = () => {
		const now = Date.now();
		const pauseDuration = now - lastActivity;
		
		// iOS screenshots can cause a brief pause in activity (100-500ms)
		if (pauseDuration > 100 && pauseDuration < 800) {
			onPotentialScreenshot({ pauseDuration });
		}
		
		lastActivity = now;
	};
	
	// Monitor various user interactions
	const events = ['touchstart', 'touchmove', 'touchend', 'scroll'];
	events.forEach(eventType => {
		document.addEventListener(eventType, resetActivity, { passive: true });
	});
	
	return () => {
		events.forEach(eventType => {
			document.removeEventListener(eventType, resetActivity);
		});
		clearTimeout(pauseTimer);
	};
}
