import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ToastMessage } from '../types';
import { LightbulbIcon } from './icons/LightbulbIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import { SparklesIcon } from './icons/SparklesIcon';

const questions = [
  {
    question: 'Which of our spices gives biryani its beautiful golden hue?',
    options: ['Himalayan Saffron', 'Organic Turmeric', 'Gourmet Garam Masala'],
    correct: 0,
    feedback: 'Correct! Our Himalayan Saffron provides a luxurious color and aroma.',
    points: 10,
  },
  {
    question:
      'The famous Tellicherry peppercorns in our Malabar Black Pepper come from which region of India?',
    options: ['Assam', 'Kashmir', 'Kerala'],
    correct: 2,
    feedback:
      "That's right! The Malabar Coast in Kerala is renowned for producing the world's finest pepper.",
    points: 10,
  },
  {
    question: 'Which tag applies to both our Kashmiri Almonds and Organic Turmeric Powder?',
    options: ['Premium', 'Gluten-Free', 'Aromatic'],
    correct: 1,
    feedback:
      'You got it! Both products are naturally Gluten-Free, making them great for various dietary needs.',
    points: 10,
  },
  {
    question: 'What is the ideal storage condition for our premium spices?',
    options: ['In sunlight', 'Cool, dry, and dark place', 'In the refrigerator'],
    correct: 1,
    feedback: 'Perfect! Cool, dark, and dry conditions preserve the flavor and aroma of spices.',
    points: 10,
  },
  {
    question: 'Which of these is NOT a health benefit of saffron?',
    options: ['Mood enhancement', 'Antioxidant properties', 'Increases cholesterol'],
    correct: 2,
    feedback: 'Correct! Saffron actually helps reduce cholesterol, not increase it.',
    points: 10,
  },
  {
    question: 'How long do our whole spices typically stay fresh when stored properly?',
    options: ['6 months', '1-2 years', '5 years'],
    correct: 1,
    feedback: 'Yes! Whole spices retain their potency for 1-2 years when stored correctly.',
    points: 10,
  },
  {
    question: 'Which ancient civilization first cultivated turmeric?',
    options: ['Romans', 'Indians', 'Egyptians'],
    correct: 1,
    feedback: 'Absolutely! India has been cultivating turmeric for over 4000 years.',
    points: 10,
  },
  {
    question: 'What makes our cashews "premium grade"?',
    options: ['Largest size', 'All of the above', 'Perfect color and shape'],
    correct: 1,
    feedback:
      "That's right! Our premium cashews meet the highest standards in size, color, and shape.",
    points: 10,
  },
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
      setResult((prev) => ({
        ...prev,
        score: prev.score + 1,
        correctAnswers: prev.correctAnswers + 1,
      }));
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
  };

  if (showResult) {
    const promo = getPromoCode();
    const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
    const earnedPoints = result.score * 10;
    const percentage = ((result.score / questions.length) * 100).toFixed(0);

    return (
      <motion.div
        {...({
          initial: { opacity: 0, scale: 0.9 },
          animate: { opacity: 1, scale: 1 },
          className: 'bg-white p-8 rounded-lg shadow-lg text-center',
        } as any)}
      >
        {/* Trophy or Star Icon */}
        <div
          className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
            result.score === questions.length
              ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 animate-pulse-glow'
              : 'bg-gradient-to-br from-brand-primary to-amber-500'
          }`}
        >
          <SparklesIcon className="w-10 h-10 text-white" />
        </div>

        <h3 className="text-3xl font-serif font-bold text-brand-dark mb-2">Quiz Completed!</h3>

        {/* Performance Rating */}
        <div className="mb-6">
          {result.score === questions.length && (
            <p className="text-xl text-green-600 font-bold mb-2">
              🎉 Perfect Score! You&apos;re a Spice Master!
            </p>
          )}
          {result.score >= questions.length - 2 && result.score < questions.length && (
            <p className="text-xl text-blue-600 font-bold mb-2">
              🌟 Excellent! You know your spices!
            </p>
          )}
          {result.score >= questions.length / 2 && result.score < questions.length - 2 && (
            <p className="text-xl text-orange-600 font-bold mb-2">👍 Good job! Keep learning!</p>
          )}
          {result.score < questions.length / 2 && (
            <p className="text-xl text-gray-600 font-bold mb-2">
              📚 Nice try! Practice makes perfect!
            </p>
          )}
        </div>

        {/* Score Display */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <p className="text-lg text-gray-700 mb-4">
            Your Score:{' '}
            <span className="text-3xl font-bold text-brand-primary">{result.score}</span>
            <span className="text-gray-500"> / {questions.length}</span>
          </p>

          {/* Progress Bar */}
          <div className="bg-gray-200 rounded-full h-4 overflow-hidden mb-4">
            <div
              className="bg-gradient-to-r from-brand-primary to-amber-500 h-full rounded-full transition-all duration-1000"
              style={{ width: `${percentage}%` }}
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-green-50 p-3 rounded-lg">
              <CheckCircleIcon className="w-5 h-5 text-green-600 mx-auto mb-1" />
              <p className="font-bold text-green-600">{result.correctAnswers} Correct</p>
            </div>
            <div className="bg-red-50 p-3 rounded-lg">
              <XCircleIcon className="w-5 h-5 text-red-600 mx-auto mb-1" />
              <p className="font-bold text-red-600">{result.wrongAnswers} Wrong</p>
            </div>
          </div>

          {/* Points Earned */}
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-gray-700 mb-1">Points Earned</p>
            <p className="text-2xl font-bold text-yellow-600">
              {earnedPoints} / {totalPoints}
            </p>
          </div>
        </div>

        {/* Promo Code */}
        {promo && (
          <motion.div
            {...({
              initial: { scale: 0 },
              animate: { scale: 1 },
              className:
                'mt-6 bg-gradient-to-br from-brand-primary to-amber-500 p-6 rounded-lg text-white',
            } as any)}
          >
            <SparklesIcon className="w-8 h-8 mx-auto mb-2" />
            <p className="font-bold text-lg mb-2">🎁 Congratulations! You earned a reward!</p>
            <p className="text-sm mb-3">Use this exclusive discount code at checkout:</p>
            <div className="bg-white text-brand-dark py-3 px-6 rounded-md font-mono text-2xl font-bold tracking-widest border-2 border-dashed border-white/30">
              {promo}
            </div>
            <p className="text-xs mt-3 text-white/80">
              {result.score === questions.length
                ? '15% off your next order!'
                : '10% off your next order!'}
            </p>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={resetQuiz}
            className="flex-1 bg-brand-dark text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-opacity-90 transform hover:scale-105 transition-all duration-300"
          >
            Play Again
          </button>
          {promo && (
            <button
              onClick={() => {
                navigator.clipboard.writeText(promo);
                addToast('Promo code copied to clipboard!', 'success');
              }}
              className="flex-1 bg-white border-2 border-brand-primary text-brand-primary font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-brand-accent transform hover:scale-105 transition-all duration-300"
            >
              Copy Code
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  const { question, options, correct, feedback } = questions[activeQuestion];

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <LightbulbIcon className="h-8 w-8 text-brand-primary" />
        <h3 className="text-2xl font-serif font-bold text-brand-dark">
          Test Your Spice Knowledge!
        </h3>
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
        <motion.div
          {...({
            initial: { opacity: 0, y: 10 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.2 },
            className: 'mt-6 p-4 bg-brand-accent rounded-lg',
          } as any)}
        >
          <p className="font-semibold text-brand-dark">{feedback}</p>
          <button
            onClick={onClickNext}
            className="mt-4 bg-brand-primary text-white font-bold py-2 px-6 rounded-full shadow-lg hover:bg-opacity-90 transform hover:scale-105 transition-all duration-300"
          >
            {activeQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default QuizModule;
