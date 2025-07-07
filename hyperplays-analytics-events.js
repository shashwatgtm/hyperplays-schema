/**
 * HyperPlays Advanced Analytics Events
 * Custom tracking for AI lead generation business
 * Version: 1.0
 * Last Updated: 2025-01-07
 */

(function() {
  'use strict';
  
  // Initialize HyperPlays tracking
  window.HyperPlaysTracking = {
    leadScore: 0,
    engagementEvents: [],
    formStarted: false,
    startTime: Date.now()
  };
  
  // Enhanced Wix Form Tracking
  function trackFormInteraction(eventType, formData) {
    gtag('event', 'form_interaction', {
      event_category: 'HyperPlays Lead Generation',
      event_label: eventType,
      form_type: 'consultation',
      business_focus: 'ai_lead_generation',
      methodology: '4_dimensional_analysis',
      ...formData
    });
  }
  
  // Monitor Wix form submissions
  window.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'FORM_SUBMIT') {
      const formData = {
        form_id: event.data.formId || 'consultation_form',
        submission_timestamp: new Date().toISOString(),
        page_url: window.location.href,
        referrer: document.referrer
      };
      
      // Primary conversion event
      gtag('event', 'lead_generation_form_submit', {
        event_category: 'Lead Generation',
        event_label: 'HyperPlays Consultation',
        value: 500,
        currency: 'USD',
        form_type: 'consultation',
        lead_source: getLeadSource(),
        business_type: 'ai_lead_generation',
        methodology: '4_dimensional_analysis',
        lead_score: window.HyperPlaysTracking.leadScore,
        ...formData
      });
      
      // Track as conversion
      gtag('event', 'conversion', {
        send_to: 'G-67ZJXBGXDH/consultation_form_submit',
        value: 500,
        currency: 'USD',
        conversion_label: 'hyperplays_consultation'
      });
      
      // Push to dataLayer
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'hyperplays_lead_generated',
        lead_value: 500,
        lead_type: 'consultation',
        form_completion: 'success',
        final_lead_score: window.HyperPlaysTracking.leadScore,
        ...formData
      });
    }
  });
  
  // Lead scoring system
  function updateLeadScore(points, reason) {
    window.HyperPlaysTracking.leadScore += points;
    window.HyperPlaysTracking.engagementEvents.push({
      timestamp: new Date().toISOString(),
      points: points,
      reason: reason,
      total_score: window.HyperPlaysTracking.leadScore
    });
    
    gtag('event', 'lead_score_update', {
      event_category: 'Lead Intelligence',
      event_label: reason,
      lead_score: window.HyperPlaysTracking.leadScore,
      score_tier: getScoreTier(window.HyperPlaysTracking.leadScore)
    });
  }
  
  function getScoreTier(score) {
    if (score >= 100) return 'hot_lead';
    if (score >= 60) return 'warm_lead';
    if (score >= 30) return 'interested';
    return 'cold_lead';
  }
  
  function getLeadSource() {
    const utm_source = new URLSearchParams(window.location.search).get('utm_source');
    if (utm_source) return utm_source;
    
    const referrer = document.referrer.toLowerCase();
    if (referrer.indexOf('linkedin') > -1) return 'linkedin';
    if (referrer.indexOf('google') > -1) return 'google_organic';
    if (referrer.indexOf('facebook') > -1) return 'facebook';
    if (referrer === '') return 'direct';
    return 'referral';
  }
  
  // High-value page detection
  var currentPath = window.location.pathname.toLowerCase();
  if (currentPath.indexOf('consultation') > -1 || 
      currentPath.indexOf('methodology') > -1 || 
      currentPath.indexOf('elite') > -1) {
    updateLeadScore(20, 'high_value_page_visit');
  }
  
  // AI methodology engagement tracking
  if (document.body.innerHTML.toLowerCase().indexOf('4-dimensional') > -1 || 
      document.body.innerHTML.toLowerCase().indexOf('ai micro-agents') > -1) {
    
    updateLeadScore(25, 'ai_methodology_exposure');
    
    gtag('event', 'ai_methodology_exposure', {
      event_category: 'AI Discoverability',
      event_label: 'HyperPlays Methodology',
      methodology_type: '4_dimensional_analysis',
      page_type: 'methodology_explanation',
      business_value: 'high_intent'
    });
  }
  
  // Form field interactions
  document.addEventListener('input', function(e) {
    if (e.target.closest('form')) {
      const fieldName = e.target.name || e.target.id || 'unknown_field';
      trackFormInteraction('field_interaction', {
        field_name: fieldName,
        field_type: e.target.type
      });
    }
  });
  
  // Form start tracking
  document.addEventListener('focusin', function(e) {
    if (e.target.closest('form') && !window.HyperPlaysTracking.formStarted) {
      window.HyperPlaysTracking.formStarted = true;
      updateLeadScore(10, 'form_interaction_started');
      
      trackFormInteraction('form_started', {
        start_timestamp: new Date().toISOString()
      });
    }
  });
  
  // CTA click tracking
  document.addEventListener('click', function(e) {
    const element = e.target;
    const elementText = element.textContent.toLowerCase();
    
    if (elementText.indexOf('consultation') > -1 || 
        elementText.indexOf('book') > -1 ||
        elementText.indexOf('schedule') > -1) {
      
      updateLeadScore(15, 'consultation_cta_click');
      
      gtag('event', 'consultation_cta_click', {
        event_category: 'Lead Generation',
        event_label: 'CTA Interaction',
        cta_text: element.textContent,
        cta_location: element.className || 'unknown',
        intent_level: 'high',
        lead_score: window.HyperPlaysTracking.leadScore
      });
    }
    
    // AI interest indicators
    if (elementText.indexOf('ai') > -1 || elementText.indexOf('automation') > -1) {
      updateLeadScore(15, 'ai_interest_indicator');
    }
    
    if (elementText.indexOf('4-dimensional') > -1 || elementText.indexOf('methodology') > -1) {
      updateLeadScore(25, 'methodology_specific_interest');
    }
  });
  
  // Scroll depth tracking
  var maxScroll = 0;
  window.addEventListener('scroll', function() {
    var scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
    if (scrollPercent > maxScroll && scrollPercent % 25 === 0) {
      maxScroll = scrollPercent;
      
      if (scrollPercent >= 50) updateLeadScore(5, 'deep_content_engagement');
      
      gtag('event', 'scroll_depth', {
        event_category: 'Content Engagement',
        event_label: 'Methodology Understanding',
        scroll_percentage: scrollPercent,
        content_type: 'ai_methodology',
        lead_score: window.HyperPlaysTracking.leadScore
      });
    }
  });
  
  // Session summary on page exit
  window.addEventListener('beforeunload', function() {
    var timeOnPage = Math.round((Date.now() - window.HyperPlaysTracking.startTime) / 1000);
    
    if (timeOnPage > 60) updateLeadScore(10, 'extended_page_engagement');
    if (timeOnPage > 180) updateLeadScore(15, 'deep_content_engagement');
    
    // Form abandonment tracking
    if (window.HyperPlaysTracking.formStarted) {
      trackFormInteraction('form_abandoned', {
        abandonment_timestamp: new Date().toISOString(),
        time_on_page: timeOnPage,
        final_lead_score: window.HyperPlaysTracking.leadScore
      });
    }
    
    // Send final session intelligence
    if (window.HyperPlaysTracking.leadScore > 0) {
      gtag('event', 'session_lead_intelligence', {
        event_category: 'Business Intelligence',
        event_label: 'Session Summary',
        final_lead_score: window.HyperPlaysTracking.leadScore,
        engagement_events: window.HyperPlaysTracking.engagementEvents.length,
        score_tier: getScoreTier(window.HyperPlaysTracking.leadScore),
        session_value: window.HyperPlaysTracking.leadScore > 50 ? 'high' : window.HyperPlaysTracking.leadScore > 20 ? 'medium' : 'low',
        time_on_page: timeOnPage
      });
    }
  });
  
})();
