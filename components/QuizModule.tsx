
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ToastMessage } from '../types';
import { LightbulbIcon } from './icons/LightbulbIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { XCircleIcon } from './icons/XCircleIcon';

const questions = [
  { 
    question: 'Which of our spices gives biryani its beautiful golden hue?', 
    options: ['Himalayan Saffron', 'Organic Turmeric', 'Gourmet Garam Masala'], 
    correct: 0,
    feedback: 'Correct! Our Himalayan Saffron provides a luxurious color and aroma.'
  },
  { 
    question: 'The famous Tellicherry peppercorns in our Malabar Black Pepper come from which region of India?', 
    options: ['Assam', 'Kashmir', 'Kerala'], 
    correct: 2,
    feedback: 'That\'s right! The Malabar Coast in Kerala is renowned for producing the world\'s finest pepper.'
  },
  {
    question: 'Which tag applies to both our Kashmiri Almonds and Organic Turmeric Powder?',
    options: ['Premium', 'Gluten-Free', 'Aromatic'],
    correct: 1,
    feedback: 'You got it! Both products are naturally Gluten-Free, making them great for various dietary needs.'
  }
];

interface QuizModuleProps {
    addToast: (message: string, type: ToastMessage['type']) => void;
}

const QuizModule: React.FC<QuizModuleProps> = ({ addToast }) => {
    const [activeQuestion, setActiveQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [result, setResult] = useState({ score: 0, correctAnswers: 0, wrongAnswers: 0 });
    const [isAnswered, setIsAnswered] = useState(false);

    const onClickNext = () => {
        setSelectedAnswer(null);
        setIsAnswered(false);
        if (activeQuestion !== questions.length - 1) {
            setActiveQuestion((prev) => prev + 1);
        } else {
            setActiveQuestion(0);
            setShowResult(true);
        }
    };

    const handleAnswer = (answerIndex: number) => {
        if (isAnswered) return;
        
        setIsAnswered(true);
        setSelectedAnswer(answerIndex);
        if (answerIndex === questions[activeQuestion].correct) {
            setResult((prev) => ({ ...prev, score: prev.score + 1, correctAnswers: prev.correctAnswers + 1 }));
        } else {
            setResult((prev) => ({ ...prev, wrongAnswers: prev.wrongAnswers + 1 }));
        }
    };

    const resetQuiz = () => {
        setShowResult(false);
        setResult({ score: 0, correctAnswers: 0, wrongAnswers: 0 });
        setActiveQuestion(0);
        setSelectedAnswer(null);
        setIsAnswered(false);
    };

    const getPromoCode = () => {
        if (result.score === questions.length) {
            return 'QUIZMASTER15';
        } else if (result.score >= questions.length - 1) {
            return 'SPICEFAN10';
        }
        return null;
    }

    if (showResult) {
        const promo = getPromoCode();
        return (
            <div className="bg-white p-8 rounded-lg shadow-lg text-center transform hover:-translate-y-2 transition-transform duration-300">
                <h3 className="text-2xl font-serif font-bold text-brand-dark mb-4">Quiz Completed!</h3>
                <p className="text-lg text-gray-700">Your Score: <span className="font-bold text-brand-primary">{result.score}</span> out of {questions.length}</p>
                {promo && (
                    <div className="mt-6 bg-brand-accent p-4 rounded-lg">
                        <p className="text-gray-800">Congratulations! As a thank you for playing, here is a discount code:</p>
                        <p className="text-2xl font-bold font-mono tracking-widest bg-white py-2 px-4 rounded-md my-2 inline-block border-2 border-dashed border-brand-primary">{promo}</p>
                        <p className="text-sm text-gray-600">Use it at checkout for a special discount!</p>
                    </div>
                )}
                <button 
                    onClick={resetQuiz}
                    className="mt-6 bg-brand-dark text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-opacity-90 transform hover:scale-105 transition-all duration-300"
                >
                    Play Again
                </button>
            </div>
        );
    }
    
    const { question, options, correct, feedback } = questions[activeQuestion];

    return (
        <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="flex items-center gap-3 mb-6">
                <LightbulbIcon className="h-8 w-8 text-brand-primary"/>
                <h3 className="text-2xl font-serif font-bold text-brand-dark">Test Your Spice Knowledge!</h3>
            </div>
            <p className="text-lg font-semibold text-gray-800 mb-6">{question}</p>
            <ul className="space-y-4">
                {options.map((option, index) => {
                    const isCorrect = isAnswered && index === correct;
                    const isWrong = isAnswered && selectedAnswer === index && index !== correct;
                    let buttonClass = 'bg-white hover:bg-brand-secondary/50 border-gray-300';
                    if (isCorrect) buttonClass = 'bg-green-100 border-green-500 text-green-800';
                    if (isWrong) buttonClass = 'bg-red-100 border-red-500 text-red-800';

                    return (
                        <li key={option}>
                            <button
                                onClick={() => handleAnswer(index)}
                                disabled={isAnswered}
                                className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-300 flex items-center justify-between ${buttonClass} ${isAnswered ? 'cursor-default' : 'cursor-pointer'}`}
                            >
                                <span className="font-medium">{option}</span>
                                {isCorrect && <CheckCircleIcon className="h-6 w-6 text-green-600" />}
                                {isWrong && <XCircleIcon className="h-6 w-6 text-red-600" />}
                            </button>
                        </li>
                    );
                })}
            </ul>
            {isAnswered && (
                <motion.div {...{ initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.2 } }} className="mt-6 p-4 bg-brand-accent rounded-lg">
                    <p className="font-semibold text-brand-dark">{feedback}</p>
                    <button onClick={onClickNext} className="mt-4 bg-brand-primary text-white font-bold py-2 px-6 rounded-full shadow-lg hover:bg-opacity-90 transform hover:scale-105 transition-all duration-300">
                        {activeQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                    </button>
                </motion.div>
            )}
        </div>
    );
};

export default QuizModule;