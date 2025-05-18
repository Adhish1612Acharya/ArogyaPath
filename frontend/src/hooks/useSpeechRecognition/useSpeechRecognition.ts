import { useState, useEffect } from "react";

const useSpeechRecognition = () => {


  const startListening = () => {
    setTranscript("");
    setError(null);
    
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.start();
  };

  const stopListening = () => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.stop();
    setIsListening(false);
  };

  const resetTranscript = () => {
    setTranscript("");
  };

  return {
    isListening,
    transcript,
    error,
    isBrowserSupported,
    startListening,
    stopListening,
    resetTranscript,
  };
};

export default useSpeechRecognition;