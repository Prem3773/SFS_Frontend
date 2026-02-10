import React, { useState } from 'react';
import { FaBuilding } from 'react-icons/fa';

const FeedbackCampus = () => {
  const [feedback, setFeedback] = useState({
    cleaning: '',
    waterPurity: '',
    infrastructure: '',
    safety: '',
    additionalComments: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFeedback({ ...feedback, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to submit campus feedback.');
        setSubmitting(false);
        return;
      }

      const response = await fetch('https://feedback-system-1-0sp1.onrender.com/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          category: 'campus',
          responses: {
            cleaning: feedback.cleaning,
            waterPurity: feedback.waterPurity,
            infrastructure: feedback.infrastructure,
            safety: feedback.safety,
            additionalComments: feedback.additionalComments
          }
        })
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit campus feedback.');
      }

      alert('Feedback submitted successfully.');
      setFeedback({
        cleaning: '',
        waterPurity: '',
        infrastructure: '',
        safety: '',
        additionalComments: ''
      });
    } catch (error) {
      console.error('Error submitting campus feedback:', error);
      alert(error.message || 'Error submitting feedback.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-100 dark:bg-gray-800 py-8 sm:py-10 px-4'>
      <div className='w-full max-w-4xl mx-auto bg-white dark:bg-gray-700 rounded-lg shadow-md p-4 sm:p-6'>
        <div className='flex items-center mb-6'>
          <FaBuilding className='text-3xl text-purple-500 mr-3' />
          <h1 className='text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white'>Campus Feedback</h1>
        </div>
        <p className='text-gray-600 dark:text-gray-300 mb-6'>
          Provide detailed feedback on campus facilities. Your input helps maintain a better environment and will be analyzed by AI.
        </p>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Cleaning
            </label>
            <textarea
              name='cleaning'
              value={feedback.cleaning}
              onChange={handleChange}
              placeholder='Describe the cleanliness of classrooms, corridors, gardens, and other areas.'
              className='w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-600 dark:text-white'
              rows='3'
              required
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Water Purity
            </label>
            <textarea
              name='waterPurity'
              value={feedback.waterPurity}
              onChange={handleChange}
              placeholder='Comment on the quality and purity of drinking water in taps, coolers, etc.'
              className='w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-600 dark:text-white'
              rows='3'
              required
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Infrastructure
            </label>
            <textarea
              name='infrastructure'
              value={feedback.infrastructure}
              onChange={handleChange}
              placeholder='Share feedback on buildings, roads, parking, labs, and other infrastructure.'
              className='w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-600 dark:text-white'
              rows='3'
              required
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Safety
            </label>
            <textarea
              name='safety'
              value={feedback.safety}
              onChange={handleChange}
              placeholder='Describe safety measures, lighting, security, and any concerns.'
              className='w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-600 dark:text-white'
              rows='3'
              required
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Additional Comments
            </label>
            <textarea
              name='additionalComments'
              value={feedback.additionalComments}
              onChange={handleChange}
              placeholder='Any other feedback or suggestions for campus improvements.'
              className='w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-600 dark:text-white'
              rows='3'
            />
          </div>
          <button
            type='submit'
            disabled={submitting}
            className={`w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-md transition-colors ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {submitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackCampus;
