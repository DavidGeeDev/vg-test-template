var ScormAPI = (function() {
    var api = null;
    var initialized = false;
    var findAttempts = 0;

    function findAPI(win) {
        while ((!win.API) && (win.parent) && (win.parent != win) && (findAttempts < 500)) {
            findAttempts++;
            win = win.parent;
        }
        return win.API || (window.opener ? window.opener.API : null);
    }

    function initialize() {
        if (initialized) return true;
        api = findAPI(window);
        if (!api) return false;

        var result = api.LMSInitialize("");
        if (result === "true" || result === true) {
            initialized = true;
            var status = api.LMSGetValue("cmi.core.lesson_status");
            if (status === "" || status === "not attempted") {
                api.LMSSetValue("cmi.core.lesson_status", "incomplete");
                api.LMSCommit("");
            }
            return true;
        }
        return false;
    }

    function getValue(element) {
        if (!initialized && !initialize()) return "";
        return api ? api.LMSGetValue(element) : "";
    }

    function setValue(element, value) {
        if (!initialized && !initialize()) return false;
        return api ? (api.LMSSetValue(element, value) === "true") : false;
    }

    function commit() {
        if (!initialized) return false;
        return api ? (api.LMSCommit("") === "true") : false;
    }

    function finish() {
        if (!initialized || !api) return true;
        return (api.LMSFinish("") === "true");
    }

    // Time helpers (SCORM 1.2 HH:MM:SS)
    function formatTime(seconds) {
        var h = Math.floor(seconds / 3600).toString().padStart(2, '0');
        var m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        var s = Math.floor(seconds % 60).toString().padStart(2, '0');
        return h + ":" + m + ":" + s;
    }
    function parseTime(hms) {
        if (!hms) return 0;
        var parts = hms.split(':');
        if (parts.length !== 3) return 0;
        var h = parseInt(parts[0], 10) || 0;
        var m = parseInt(parts[1], 10) || 0;
        var s = parseInt(parts[2], 10) || 0;
        return h * 3600 + m * 60 + s;
    }

    // Interaction log for lock events (audit)
    function setInteractionLock() {
        if (!initialized && !initialize()) return false;
        var idx = getValue("cmi.interactions._count");
        var n = parseInt(idx, 10);
        if (isNaN(n)) n = 0;
        setValue("cmi.interactions." + n + ".id", "lockout");
        setValue("cmi.interactions." + n + ".type", "other");
        setValue("cmi.interactions." + n + ".description", "Window blur/visibility lock");
        commit();
        return true;
    }

    // Retain legacy complete helper
    function complete(score) {
        if (!initialized) initialize();
        setValue("cmi.core.score.min", "0");
        setValue("cmi.core.score.max", "30");
        setValue("cmi.core.score.raw", score.toString());
        if (score >= 27) {
            setValue("cmi.core.lesson_status", "passed");
        } else {
            setValue("cmi.core.lesson_status", "failed");
        }
        commit();
        return true;
    }

    return {
        initialize,
        getValue,
        setValue,
        commit,
        finish,
        complete,
        formatTime,
        parseTime,
        setInteractionLock
    };
})();