/*
  ============================
  GAUGE METER
  ============================
  Handles needle rotation animation for gauge meter
*/

(function() {
  'use strict';

  // Needle configuration
  var ORIGINAL_POINTS = "103.67 161.74 99.97 170.75 96.44 161.74 96.44 77.75 103.67 77.75 103.67 161.74";
  var CENTER_X = 100;
  var CENTER_Y = 100;
  var ANIMATION_DURATION = 1200;
  
  // Guard against multiple initializations
  var isInitialized = false;
  var currentAnimationId = null;

  // Rotate polygon points around center
  function rotatePolygon(pointsString, centerX, centerY, angleDegrees) {
    var points = pointsString.trim().split(/\s+/).map(Number);
    var angleRad = (angleDegrees * Math.PI) / 180;
    var cosA = Math.cos(angleRad);
    var sinA = Math.sin(angleRad);
    var rotatedPoints = [];
    
    for (var i = 0; i < points.length; i += 2) {
      var x = points[i];
      var y = points[i + 1];
      var dx = x - centerX;
      var dy = y - centerY;
      var newX = dx * cosA - dy * sinA + centerX;
      var newY = dx * sinA + dy * cosA + centerY;
      rotatedPoints.push(newX.toFixed(2), newY.toFixed(2));
    }
    
    return rotatedPoints.join(' ');
  }

  // Calculate angle based on deploy value (0-90 maps to 0-341 degrees)
  function calculateAngle(value) {
    var keyPoints = [
      { value: 0, angle: 0 },
      { value: 10, angle: 54 },
      { value: 20, angle: 90 },
      { value: 30, angle: 126.6 },
      { value: 40, angle: 162.9 },
      { value: 50, angle: 198 },
      { value: 60, angle: 234.8 },
      { value: 70, angle: 270 },
      { value: 80, angle: 307 },
      { value: 90, angle: 341 }
    ];
    
    var cappedValue = Math.min(value, 90);
    
    for (var i = 0; i < keyPoints.length - 1; i++) {
      if (cappedValue >= keyPoints[i].value && cappedValue <= keyPoints[i + 1].value) {
        var lower = keyPoints[i];
        var upper = keyPoints[i + 1];
        return lower.angle + ((cappedValue - lower.value) * (upper.angle - lower.angle) / (upper.value - lower.value));
      }
    }
    
    return 341;
  }

  // Easing function (ease-in-out quad)
  function easeInOutQuad(progress) {
    return progress < 0.5 
      ? 2 * progress * progress 
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;
  }

  // Animate needle from current angle to target angle
  function animateNeedle(needle, startAngle, targetAngle, duration) {
    // Cancel any existing animation
    if (currentAnimationId) {
      cancelAnimationFrame(currentAnimationId);
    }
    
    var startTime = performance.now();
    
    function animate(currentTime) {
      var elapsed = currentTime - startTime;
      var progress = Math.min(elapsed / duration, 1);
      var eased = easeInOutQuad(progress);
      var currentAngle = startAngle + (targetAngle - startAngle) * eased;
      
      needle.setAttribute('points', rotatePolygon(ORIGINAL_POINTS, CENTER_X, CENTER_Y, currentAngle));
      
      if (progress < 1) {
        currentAnimationId = requestAnimationFrame(animate);
      } else {
        currentAnimationId = null;
      }
    }
    
    currentAnimationId = requestAnimationFrame(animate);
  }

  // Initialize gauge
  function initGaugeMeter() {
    var container = document.getElementById('gauge-meter-container');
    var needle = document.getElementById('needlePolygon');
    
    if (!container || !needle) {
      return;
    }
    
    // Skip if already initialized for this container (prevents flickering)
    if (container.dataset.gaugeInitialized === 'true') {
      return;
    }
    
    // Mark as initialized
    container.dataset.gaugeInitialized = 'true';
    isInitialized = true;
    
    var gaugeValue = parseInt(container.dataset.gaugeValue) || 0;
    var targetAngle = calculateAngle(gaugeValue);
    
    // Animate needle from 0 to target angle
    animateNeedle(needle, 0, targetAngle, ANIMATION_DURATION);
  }
  
  // Reset initialization state (for page transitions)
  function resetGaugeMeter() {
    var container = document.getElementById('gauge-meter-container');
    if (container) {
      container.dataset.gaugeInitialized = 'false';
    }
    isInitialized = false;
    if (currentAnimationId) {
      cancelAnimationFrame(currentAnimationId);
      currentAnimationId = null;
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGaugeMeter);
  } else {
    // DOM already loaded, run immediately
    initGaugeMeter();
  }

  // Support Turbolinks/Turbo if used - reset before loading new page
  document.addEventListener('turbolinks:before-visit', resetGaugeMeter);
  document.addEventListener('turbo:before-visit', resetGaugeMeter);
  document.addEventListener('turbolinks:load', initGaugeMeter);
  document.addEventListener('turbo:load', initGaugeMeter);
})();
